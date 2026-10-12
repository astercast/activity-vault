# Activity Vault 🗂️

The all-in-one activity archive for teachers & after-school program teachers.

**263 activities** across 11 color-coded categories — seasons, holidays, crafts, STEM, PE & movement, team & community, icebreakers, outdoor, rainy-day, quiet & focus, and music & rhythm. Every activity is a real, classic, public-domain concept described in our own words: name, age range, group size, time, materials (with no-prep flags), setup, step-by-step instructions, easier/harder variations, and common-sense safety notes.

## What it does

- **Filter browser** (`index.html`) — filter by age, time available, group size, category, season/occasion tags (🎃 Fall, ❄️ Winter, 🌷 Spring, 👻 Halloween, 💀 Día de los Muertos, 🐣 Easter, 🌎 Earth Day, 🕸️ Spooky), materials on hand ("only no-prep", "only indoor"), plus full-text search across names, materials, and steps. Card grid links to a detail page per activity. March–May shows a 🌷 Spring promo banner.
- **Plan-my-week planner** (`planner.html`) — pick days, slots per day, and constraints → generates a no-repeat week plan with a "why it fits" note per slot. Printable. Month-driven "This season in the Vault" strip (Mar–May → spring tags).
- **Sub Tub** (`sub.html`) — the substitute-teacher rescue kit: grade band + minutes to fill + materials on hand → sequenced print-ready emergency plan plus a "Dear sub" note template. The screenshot-friendly one-pager.
- **Party Planner** (`party.html`) — class-party planner with Halloween, winter, and spring themes: class size + party minutes + stations + budget → timed station-rotation plan from seasonal activities, with a merged setup checklist and a print-ready run sheet.
- **Spring hub** (`spring.html`) — the spring 2027 pack's home: curated spring crafts, outdoor games, spring science, rainy-day backups, and spring-holiday sections, plus the Spring Burst collection and spring party-theme shortcuts.
- **Print cards** — every activity page prints as a clean one-page card (`@media print` stylesheet); the week plan prints too.

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
data/activities.json      ← source of truth (263 activities)
data/categories.json      ← 11 categories (color, glyph, blurb)
scripts/build.py          ← validator + static generator
assets/                   ← style.css, app.js (browser), planner.js, sub.js, party.js
activity/<id>.html        ← generated detail pages (print-ready)
api/v1/                   ← activities.json, categories.json, filters.json, schema/
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
