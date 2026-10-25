"""Activity Vault heartbeat (Claude bundle 2026-10-24, item 6).

Daily job (workflow cron "19 11 * * *", matching the brief). Two
scans, both QUEUE-ONLY — nothing auto-publishes, ever:

1. Teacher-blog scan over pipeline/feeds.json. New posts are
   appended to the review queue as LINKS ONLY (title + URL +
   feed + published date; never copied text — the summary field
   is written empty on purpose) for owner approval in /review.
   Deduped against the seen state and the queue. In this fleet
   form the queue and the seen state live with the site's live
   data (HB_OUT), seeded from pipeline/ on the first run.

2. Photo scout: photo-less activities (up to 40/day, rotating by
   day-of-year so the whole backlog cycles) are matched against
   Wikimedia Commons candidates restricted to public domain /
   CC0 / CC BY / CC BY-SA, with the author + licence copied
   exactly from the Commons metadata, into data/v1/photo-queue.json
   for owner approval. No photo is downloaded into the built site
   by this job. Commons etiquette: clear user agent, 1 request
   per second. AV_PHOTO_SCOUT_LIMIT overrides the daily cap
   (used for smoke runs).

Writes data/v1/pulse.json via the kit Pulse (health reads it from
the bundle). A dead source keeps its last good data and increments
fails_in_a_row; the run never raises.
"""
import hashlib
import json
import os
import re
import sys
import time
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import OUT, Pulse, get, read, write_if_changed, now  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
FEEDS_FILE = os.path.join(ROOT, "pipeline", "feeds.json")
# Fleet form: the scan state and the review queue live with this
# site's live data (HB_OUT, the fleet-data repo), seeded on the
# first run from the copies in pipeline/. The site repo itself is
# read-only input now; nothing here writes into it.
SEEN_FILE = os.path.join(OUT, "seen.json")
QUEUE_FILE = os.path.join(OUT, "review-queue.json")
_SEED_SEEN = os.path.join(ROOT, "pipeline", "seen.json")
_SEED_QUEUE = os.path.join(ROOT, "pipeline", "review-queue.json")


def _load_state(path, seed, default):
    for p in (path, seed):
        if os.path.exists(p):
            try:
                return json.load(open(p))
            except Exception:
                pass
    return default
ACTIVITIES_FILE = os.path.join(ROOT, "data", "activities.json")
PHOTO_QUEUE = "photo-queue.json"
UA = "ActivityVaultHeartbeat/1.0 (https://github.com/astercast/activity-vault; owner-approved queues only)"
ALLOWED_LICENCES = ("public domain", "pd-", "cc0", "cc by", "cc by-sa")


def uid(feed_id, link, title):
    return hashlib.sha256(f"{feed_id}|{link}|{title}".encode()).hexdigest()[:16]


# Same relevance gate as pipeline/scan.py (KEEP/DROP vocabularies
# mirrored on purpose), applied to the TITLE ONLY: the heartbeat
# queue is links-only, so it never reads post body text to decide.
KEEP = re.compile(r"\b(activit|craf|game|project|experiment|challenge|printable|"
                  r"worksheet|lesson|stem|steam|art\b|recipe|scavenger|bingo|relay|"
                  r"obstacle|song|rhythm|dance|puppet|slime|volcano|sensory|"
                  r"holiday|halloween|thanksgiving|christmas|valentine|easter|"
                  r"spring|summer|fall|autumn|winter|snow|outdoor|indoor|rainy|"
                  r"icebreaker|team.build|mindful|breath|yoga|sport|ball|tag\b|"
                  r"parachute|playground|recess|after.school|preschool|"
                  r"kindergarten)\w*", re.I)
DROP = re.compile(r"\b(sale|deal|coupon|discount|giveaway|sweepstakes|contest|job|hiring|"
                  r"webinar|podcast|opinion|editorial|policy|funding|grant|"
                  r"salary|union|election|obituary)\b", re.I)


def relevant_title(title):
    return bool(KEEP.search(title)) and not bool(DROP.search(title))


def rss_items(xml_bytes):
    root = ET.fromstring(xml_bytes)
    items = []
    for item in root.iter("item"):
        def txt(tag):
            el = item.find(tag)
            return (el.text or "").strip() if el is not None and el.text else ""
        items.append({"title": txt("title"), "link": txt("link"),
                      "published": txt("pubDate")})
    if not items:  # Atom fallback
        ns = {"a": "http://www.w3.org/2005/Atom"}
        for entry in root.iter("{http://www.w3.org/2005/Atom}entry"):
            title_el = entry.find("a:title", ns)
            link = ""
            for lel in entry.findall("a:link", ns):
                if lel.get("rel") in (None, "alternate"):
                    link = lel.get("href") or ""
                    break
            pub_el = entry.find("a:published", ns)
            items.append({
                "title": (title_el.text or "").strip() if title_el is not None else "",
                "link": link,
                "published": (pub_el.text or "").strip() if pub_el is not None else "",
            })
    return items


def teacher_blog_scan(pulse):
    feeds = json.load(open(FEEDS_FILE))
    seen = _load_state(SEEN_FILE, _SEED_SEEN, {})
    queue = _load_state(QUEUE_FILE, _SEED_QUEUE, [])
    queued_ids = {q["id"] for q in queue}
    fetched = 0
    new_count = 0
    for feed in feeds:
        raw, err = get(feed["url"], headers={"User-Agent": UA})
        if raw is None:
            pulse.source("feed-" + feed["id"], feed["name"], False, 0, err, feed["url"])
            continue
        try:
            items = rss_items(raw)
        except Exception:
            pulse.source("feed-" + feed["id"], feed["name"], False, 0, "bad xml", feed["url"])
            continue
        fetched += 1
        pulse.source("feed-" + feed["id"], feed["name"], True, len(items), None, feed["url"])
        for it in items:
            if not it["title"] or not it["link"]:
                continue
            i = uid(feed["id"], it["link"], it["title"])
            if i in seen or i in queued_ids:
                continue
            seen[i] = it["published"]
            if not relevant_title(it["title"]):
                continue
            # LINKS ONLY: title + URL, never copied text.
            queue.append({
                "id": i, "status": "pending", "feed": feed["name"],
                "title": it["title"], "link": it["link"],
                "published": it["published"], "summary": "",
                "note": "Links-only heartbeat candidate. Owner approval "
                        "in /review before anything is adapted.",
            })
            queued_ids.add(i)
            new_count += 1
            pulse.change("post", it["title"], it["link"])
    os.makedirs(OUT, exist_ok=True)
    json.dump(seen, open(SEEN_FILE, "w"), indent=1)
    json.dump(queue, open(QUEUE_FILE, "w"), indent=2, ensure_ascii=False)
    return fetched, new_count


def commons_candidates(query):
    """One Commons search. Returns (candidates, error). 1 req/s is
    enforced by the caller sleeping between activities."""
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": "filetype:bitmap " + query, "gsrnamespace": "6",
        "gsrlimit": "5", "prop": "imageinfo",
        "iiprop": "url|extmetadata", "iiurlwidth": "480",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    raw, err = get(url, headers={"User-Agent": UA}, tries=2)
    if raw is None:
        return [], err
    try:
        data = json.loads(raw)
    except Exception:
        return [], "bad json"
    out = []
    pages = ((data.get("query") or {}).get("pages") or {})
    for page in pages.values():
        info = (page.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata") or {}
        def mv(key):
            v = meta.get(key) or {}
            return (v.get("value") or "").strip()
        licence_name = mv("LicenseShortName")
        low = licence_name.lower()
        if not any(low.startswith(a) or a in low for a in ALLOWED_LICENCES):
            continue
        if not (low.startswith("public domain") or low.startswith("pd")
                or low.startswith("cc0") or low.startswith("cc by")):
            continue
        out.append({
            "commons_title": page.get("title") or "",
            "page_url": info.get("descriptionurl") or "",
            "thumb_url": info.get("thumburl") or info.get("url") or "",
            "author": mv("Artist"),          # copied exactly, markup and all
            "licence": licence_name,          # copied exactly
            "status": "pending",
        })
    return out, None


def photo_scout(pulse):
    limit = int(os.environ.get("AV_PHOTO_SCOUT_LIMIT", "40"))
    acts = json.load(open(ACTIVITIES_FILE))
    photo_less = [a for a in acts if not a.get("photo")]
    existing = read(PHOTO_QUEUE, {"candidates": []})
    done_ids = {c["activity_id"] for c in existing.get("candidates", [])}
    todo = [a for a in photo_less if a["id"] not in done_ids]
    if todo:
        # Rotate the starting point daily so the backlog cycles.
        start = datetime.now(timezone.utc).timetuple().tm_yday % len(todo)
        todo = (todo[start:] + todo[:start])[:limit]
    candidates = list(existing.get("candidates", []))
    errors = 0
    for a in todo:
        found, err = commons_candidates(a["name"])
        if err:
            errors += 1
        for c in found[:2]:
            c = dict(c)
            c["activity_id"] = a["id"]
            c["activity_name"] = a["name"]
            c["queued_at"] = now()
            candidates.append(c)
            pulse.change("photo-candidate", a["name"], c["page_url"])
        time.sleep(1)  # Commons etiquette: 1 request/second
    ok = bool(todo) and errors < len(todo) or not todo
    write_if_changed(PHOTO_QUEUE, {
        "format": "photo-queue/1", "generated_at": now(),
        "note": "Owner approval only. Nothing here is published or "
                "downloaded into the site by this job.",
        "candidates": candidates,
    }, volatile=("generated_at",))
    pulse.source("commons-photo-scout", "Wikimedia Commons photo scout",
                 ok, len(candidates),
                 None if ok else "commons unreachable",
                 "https://commons.wikimedia.org/w/api.php")
    return len(todo), len(candidates)


def main():
    pulse = Pulse()
    fetched, new_posts = teacher_blog_scan(pulse)
    print(f"teacher blogs: {fetched} feeds answered, {new_posts} new links queued")
    scouted, queued = photo_scout(pulse)
    print(f"photo scout: {scouted} activities checked, {queued} candidates queued total")
    pulse.write()
    print("pulse written")


if __name__ == "__main__":
    main()
