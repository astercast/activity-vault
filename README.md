# Activity Vault 🗂️

The all-in-one activity archive for teachers & after-school program teachers.

**589 activities** across 11 color-coded categories — seasons, holidays, crafts, STEM, PE & movement, team & community, icebreakers, outdoor, rainy-day, quiet & focus, and music & rhythm. Every activity is a real, classic, public-domain concept described in our own words: name, age range, group size, time, materials (with no-prep flags), setup, step-by-step instructions, easier/harder variations, and common-sense safety notes. Research-backed extras: 🖨️ copy-free flags (209 verified zero-printing), ♾️ no-elimination flags (63 — nobody sits out), 🔬 "why it works" research notes, 🤝 inclusion adaptations, and source attributions.

## What it does

- **Filter browser** (`index.html`) — filter by age, time available, group size, category, season/occasion tags (🎃 Fall, ❄️ Winter, 🌷 Spring, ☀️ Summer, 👻 Halloween, 🦃 Thanksgiving, 💀 Día de los Muertos, 🐣 Easter, 🌎 Earth Day, 🇺🇸 July 4th, ✊🏾 MLK Day, 💌 Valentine's Day, 🧧 Lunar New Year, ☘️ St. Patrick's Day, 🪔 Diwali, 🌎 Indigenous Peoples' Day, 🕸️ Spooky), materials on hand ("only no-prep", "only indoor", "copy-free only", "no-elimination only"), plus full-text search across names, materials, and steps (press `/` to focus). Deep links: `?tag=`, `?cats=`, `?view=top-rated`. Card grid links to a detail page per activity. March–May shows a 🌷 Spring promo banner; June–August shows a ☀️ Summer promo banner; October shows a 🎃 Halloween promo banner; November shows a 🦃 Thanksgiving promo banner.
- **The Teacher's Desk** (`index.html#desk`, plus the dedicated `desk.html`) — the archive landing is a desk you can open: 11 wooden category drawers with brass label holders and cup pulls; every drawer opens onto six index cards on top of the pile (curator picks first, then no-prep) plus a hand-written pencil note with honest per-drawer counts. Each drawer deep-links to its filtered browse view (`index.html?cats=<id>#browse`); the kneehole blotter links the week planner. Keyboard-friendly, reduced-motion and no-JS safe.
- **Plan-my-week planner** (`planner.html`) — pick days, weeks (1–4), slots per day, and constraints → generates no-repeat multi-week plans (never repeats across weeks) with a "why it fits" note per slot, a ⚡ brain-break idea per day, 🌦️ weather backups for outdoor slots, a 🛒 aggregated supply list, and a 🆘 substitute kit (no-prep, zero-material backups with plain-language steps). Printable (week cards + supply list + sub kit). Month-driven "This season in the Vault" strip (Mar–May → spring tags, Jun–Aug → summer tags, Oct → Halloween tags, Nov → Thanksgiving tags), with one-tap "🗓️ Plan from the collection" seed links in the holiday months (Oct → Halloween Week, Nov → Grateful Gathering).
- **Sub Tub** (`sub.html`) — the substitute-teacher rescue kit: grade band + minutes to fill + materials on hand → sequenced print-ready emergency plan plus a "Dear sub" note template. The screenshot-friendly one-pager.
- **Party Planner** (`party.html`) — class-party planner with Halloween, Thanksgiving, winter, spring, and summer themes: class size + party minutes + stations + budget → timed station-rotation plan from seasonal activities, with a merged setup checklist and a print-ready run sheet.
- **Spring hub** (`spring.html`) — the spring 2027 pack's home: curated spring crafts, outdoor games, spring science, rainy-day backups, and spring-holiday sections, plus the Spring Burst collection and spring party-theme shortcuts.
- **Summer hub** (`summer.html`) — the summer 2027 pack's home: curated water play, outdoor & camp games, summer crafts, beat-the-heat indoor backups, and July 4th/camp sections, plus the Summer Splash collection and summer party-theme shortcuts.
- **Thanksgiving hub** (`thanksgiving.html`) — the Thanksgiving 2026 pack's home: gratitude crafts, harvest games, Thanksgiving STEM, gratitude & friendsgiving practices, and giving-back projects, plus the Grateful Gathering collection and Thanksgiving party-theme shortcuts. Inclusive by design: not every family celebrates Thanksgiving, and the hub says so plainly.
- **Halloween hub** (`halloween.html`) — the Halloween 2026 pack's home: a Wave-20 section with all 40 new activities, plus curated Halloween crafts, costume & party games, not-too-spooky science, harvest activities, and trick-or-treat alternatives, the Haunted Halls and Halloween Week collections, a spookiness-level filter, Halloween party-theme shortcuts, and a "HALLOWEEN 2026" rubber-stamp treatment on the October homepage promo.
- **Field Trip Planner** (`fieldtrip.html`) — destination + group size + chaperone ratio + trip length → timed itinerary with destination-matched on-site activities, chaperone math, buddy-pair assignments, budget estimate, bus-ride activities, and printable checklists (permission slips, pack list, headcount routine).
- **The After-School Kit** (`kit.html`) — the flagship low-materials week builder: group size + age band + days/week + session minutes + what you have on hand (16-staple pantry, low-materials ≤3, or no-prep mode) → a week of sessions from the real library, each day with a run-of-show timeline (opener/main/closer with clock times), per-slot swap, one aggregated material checklist (✅ have vs. 🛒 gather), printable session plan sheets (one page per day), copy-as-text, and shareable `?kit=` links that restore the exact kit on any device.
- **Print cards** — every activity page prints as a clean one-page card (`@media print` stylesheet); the week plan prints too.
- **Calm mode** — a 🍃 toggle in every page header kills animations, transitions, and transparency site-wide (a sensory-envelope control beyond the OS reduced-motion setting; your choice persists).

## Quick start

```bash
# edit the source of truth
vim data/activities.json

# rebuild everything (validates schema, renders pages + API + llms files)
python3 scripts/build.py
```

No build tools, no dependencies beyond Python 3. Open `index.html` in a browser (serve over HTTP for `fetch()` to work, e.g. `python3 -m http.server`).

## Repo layout

```
data/activities.json      ← source of truth (589 activities)
data/categories.json      ← 11 categories (color, glyph, blurb)
scripts/build.py          ← validator + static generator
assets/                   ← style.css, app.js (browser), planner.js, sub.js, party.js, halloween.js, thanksgiving.js
activity/<id>.html        ← generated detail pages (print-ready)
data/v1/                   ← activities.json, categories.json, filters.json, schema/
skills/                   ← 11 agent skills (activity-finder, balanced-week-builder, halloween-party-planner, icebreaker-chooser, no-prep-rescue, outdoor-play-picker, quiet-focus-picker, rainy-day-rescue, stem-demo-picker, sub-tub-rescue, week-planner)
index.html / planner.html / sub.html / party.html ← hand-maintained app shells
llms.txt / llms-full.txt  ← generated agent briefs
```

## Docs

- `API.md` — full API reference
- `PIPELINE.md` — how the library grows (contribution format + refresh process)
- `GO_LIVE.md` — deploy checklist (GitHub-only, no Vercel)

## Standing rules

- Private repo. GitHub-only. **No Vercel.**
- Activity text is always original — classic public-domain concepts described in our own words, never copied.
- Safety notes are common-sense only — no invented safety or medical claims.
