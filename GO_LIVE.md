# GO_LIVE — Activity Vault

Deployment target: **GitHub Pages from this repo (private → must be public or internal to serve Pages)**. No Vercel — standing rule, all six sites are GitHub-only.

## Pre-launch checklist

- [ ] Decide visibility: GitHub Pages requires a public repo (or GitHub Enterprise). Options: (a) keep repo private and serve the site some other static way, (b) flip repo to public. **Get the user's call before flipping.**
- [ ] Run `python3 scripts/build.py` — must print `BUILD OK` with 0 validation errors.
- [ ] `node --check assets/app.js assets/planner.js` — both pass.
- [ ] Link check: every `activity/<id>.html` exists and is linked; 0 broken local links.
- [ ] Open `index.html` via `python3 -m http.server` — filters render, cards render, counts match.
- [ ] Open `planner.html` — generate a week, print-preview the plan (should be clean, no nav).
- [ ] Print-preview 3 activity pages — each fits cleanly, safety box visible, no nav/footer.
- [ ] Mobile check (DevTools 390px): filter panel stacks above cards, cards are single-column.
- [ ] Keyboard check: tab through filters, chips toggle with `aria-pressed`, skip links work.
- [ ] `prefers-reduced-motion`: no transitions (CSS handles it; verify nothing animates).
- [ ] Confirm no secrets, no personal data, no real names anywhere in the repo.

## Launch steps (GitHub Pages)

1. Repo Settings → Pages → Deploy from branch → `main` → `/ (root)`.
2. Wait for the Pages build; visit the `*.github.io/activity-vault/` URL.
3. Verify: `index.html` loads data via `fetch('data/activities.json')` — same-origin, works on Pages.
4. Record the live URL in `WAVELOG.md`.

## Rollback

Static site, single branch — rollback is `git revert` + push. No database, no migrations, nothing to unwind.

## Post-launch

- Add the live URL to `README.md` and `llms.txt` header.
- Announce in the wave report; the wave engine picks up content waves from `PIPELINE.md`.
