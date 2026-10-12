#!/usr/bin/env python3
"""Activity Vault RSS watch — scan teaching/activity blogs for new activity ideas.

Queues candidates into pipeline/review-queue.json for HUMAN review.
NEVER auto-publishes: nothing here touches data/activities.json.
A reviewer reads each candidate, adapts the idea into original words
(see PIPELINE.md contribution format), and adds it by hand in a wave.

Usage:  python3 pipeline/scan.py
Cron:   0 7 * * 1  cd ~/workspace/activity-vault && ./pipeline/refresh.sh >> pipeline/scan.log 2>&1
"""
import json, os, re, html, hashlib
import urllib.request
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
FEEDS_FILE = os.path.join(HERE, "feeds.json")
SEEN_FILE = os.path.join(HERE, "seen.json")
QUEUE_FILE = os.path.join(HERE, "review-queue.json")
UA = "activity-vault/1.0 (+https://github.com/astercast/activity-vault)"

# Relevance: keep posts that look like runnable activities.
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


def fetch(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def clean(s):
    return html.unescape(re.sub(r"<[^>]+>", " ", s or "")).strip()


def items_from_rss(xml_text):
    """Parse RSS 2.0 (and basic Atom) into item dicts."""
    out = []
    root = ET.fromstring(xml_text)
    # RSS 2.0
    for it in root.iter("item"):
        def g(tag):
            el = it.find(tag)
            return clean(el.text) if el is not None and el.text else ""
        link = g("link")
        if not link:  # guid fallback
            el = it.find("guid")
            link = clean(el.text) if el is not None and el.text else ""
        out.append({
            "title": g("title"),
            "link": link,
            "published": g("pubDate"),
            "summary": clean((it.findtext("{http://purl.org/rss/1.0/modules/content/}encoded") or ""))[:500]
                       or g("description")[:500],
        })
    # Atom
    ns = {"a": "http://www.w3.org/2005/Atom"}
    for e in root.findall("a:entry", ns):
        link = ""
        for l in e.findall("a:link", ns):
            if l.get("rel", "alternate") == "alternate":
                link = l.get("href", "")
                break
        out.append({
            "title": clean(e.findtext("a:title", default="", namespaces=ns)),
            "link": link,
            "published": clean(e.findtext("a:published", default="", namespaces=ns))
                         or clean(e.findtext("a:updated", default="", namespaces=ns)),
            "summary": clean(e.findtext("a:summary", default="", namespaces=ns))[:500],
        })
    return out


def uid(feed_id, link, title):
    return hashlib.sha256(f"{feed_id}|{link}|{title}".encode()).hexdigest()[:16]


def relevant(item):
    text = f"{item['title']} {item['summary']}"
    return bool(KEEP.search(text)) and not bool(DROP.search(text))


def main():
    feeds = json.load(open(FEEDS_FILE))
    seen = json.load(open(SEEN_FILE)) if os.path.exists(SEEN_FILE) else {}
    queue = json.load(open(QUEUE_FILE)) if os.path.exists(QUEUE_FILE) else []
    queued_ids = {q["id"] for q in queue}
    new_count = 0

    for feed in feeds:
        fid = feed["id"]
        try:
            xml_text = fetch(feed["url"])
        except Exception as e:
            print(f"[{fid}] fetch failed: {e}")
            continue
        try:
            items = items_from_rss(xml_text)
        except Exception as e:
            print(f"[{fid}] parse failed: {e}")
            continue
        print(f"[{fid}] {len(items)} items")
        for it in items:
            if not it["title"] or not it["link"]:
                continue
            i = uid(fid, it["link"], it["title"])
            if i in seen or i in queued_ids:
                continue
            seen[i] = it["published"]
            if not relevant(it):
                continue
            queue.append({
                "id": i,
                "status": "pending",
                "feed": feed["name"],
                "title": it["title"],
                "link": it["link"],
                "published": it["published"],
                "summary": it["summary"][:300],
                "note": "Adapt into original words per PIPELINE.md. Link as source if adapted.",
            })
            queued_ids.add(i)
            new_count += 1
            print(f"  queued: {it['title'][:70]}")

    json.dump(seen, open(SEEN_FILE, "w"), indent=1)
    json.dump(queue, open(QUEUE_FILE, "w"), indent=2, ensure_ascii=False)
    pending = sum(1 for q in queue if q["status"] == "pending")
    print(f"done: {new_count} new candidates, {pending} pending review total")


if __name__ == "__main__":
    main()
