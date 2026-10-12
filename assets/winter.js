/* Activity Vault — Winter Holidays hub page (wave 22).
   Renders the curated winter sections from data/v1/activities.json using
   explicit, build-validated id lists (scripts/test-winter.js asserts every
   id resolves). Picks show the visitor's own rating badges (localStorage only —
   never invented), matching the collections page pattern.
   Hanukkah and Kwanzaa picks use respectful learning framing: real traditions,
   no invented rituals. Semantic HTML + ARIA + keyboard-native; mobile-first. */
(function () {
  'use strict';

  var sectionsHost = document.getElementById('winter-sections');
  var statusEl = document.getElementById('winter-status');

  /* Curated sections: id lists are the source of truth, validated by tests.
     Each pick: [activity id, curator note]. */
  var SECTIONS = [
    {
      id: 'christmas', glyph: '🎄', title: 'Christmas',
      blurb: 'Paper-star geometry, working light-up cards, candy-cane relays — crafts that teach and games that tire.',
      browse: 'index.html?tag=holiday:christmas',
      browseLabel: 'Browse the full Christmas set',
      picks: [
        ['ornament-geometry-stars', 'Fold a perfect five-point star from one paper strip — geometry you can hang.'],
        ['christmas-light-circuit-cards', 'A greeting card with a working bulb. The debugging IS the lesson.'],
        ['holiday-card-print-shop', 'Carve a foam plate once, print the whole class set.'],
        ['jingle-bell-rhythm-band', 'Wristfuls of bells + call-and-response — the loudest quiet-focus breaker there is.'],
        ['candy-cane-olympics', 'Four ridiculous relay events; the canes are the medals.'],
        ['gumdrop-bridge-build', 'Toothpicks, gumdrops, one span to cross — strongest per gram wins.'],
        ['reindeer-relay-race', 'Antler headbands, a red nose, and a relay that rewards silliness over speed.'],
        ['advent-kindness-envelopes', 'Twenty-five sealed envelopes, each hiding one small kindness for that day.']
      ]
    },
    {
      id: 'hanukkah', glyph: '🕎', title: 'Hanukkah',
      blurb: 'Spin physics, mosaic menorahs, and the story behind the holiday — real traditions, learned with respect.',
      browse: 'index.html?tag=holiday:hanukkah',
      browseLabel: 'Browse the full Hanukkah set',
      picks: [
        ['dreidel-spin-physics', 'Whose top spins longest? Friction, weight, and surface — a physics lab in a spinning top.'],
        ['menorah-mosaic-tiles', 'Nine branches, hundreds of paper tiles — the shamash raised in the middle, as it should be.'],
        ['hanukkah-story-circle', 'The story behind the holiday, told round-robin — curiosity, not costume.'],
        ['gelt-math-market', 'Chocolate coins, real prices, making change — the sweetest math lesson of the year.'],
        ['blue-white-weaving', 'Over-under, over-under — a woven mat in Hanukkah blues, no loom required.'],
        ['hanukkah-counting-chain', 'The Vault\u2019s Hanukkah counting classic, freshly tagged for the hub.']
      ]
    },
    {
      id: 'kwanzaa', glyph: '🖤', title: 'Kwanzaa',
      blurb: 'The seven principles as living practice — kente patterns with meanings, a mural built collectively, discussion tokens.',
      browse: 'index.html?tag=holiday:kwanzaa',
      browseLabel: 'Browse the full Kwanzaa set',
      picks: [
        ['kinara-candle-counting', 'Seven candles, three colors, one counting system — the math inside the kinara. Paper flames only.'],
        ['kente-pattern-strips', 'Bold blocks in the kente tradition — each block carrying a meaning, joined into one class cloth.'],
        ['ujima-unity-mural', 'One huge mural, every kid holding one section — collective work, made visible.'],
        ['seven-principles-talk-tokens', 'The Nguzo Saba as a discussion game. The winning principle becomes the week\u2019s motto.'],
        ['harvest-bowl-centerpiece', 'The mazao: a harvest bowl arranged like it matters, because it does.'],
        ['kwanzaa-unity-garland', 'The Vault\u2019s Kwanzaa garland classic — link the principles into a chain.']
      ]
    },
    {
      id: 'newyear', glyph: '🎆', title: 'New Year',
      blurb: 'Countdowns with actual math, resolutions you can water, and one glorious noise parade.',
      browse: 'index.html?tag=holiday:new-year',
      browseLabel: 'Browse the full New Year set',
      picks: [
        ['countdown-clock-craft', 'Build the countdown, then run it — a paper clock that sweeps a real 60 seconds.'],
        ['ball-drop-physics', 'Time the drop to land exactly at zero. Miss it? That\u2019s called iteration.'],
        ['new-year-noise-parade', 'Shakers, a new-year sign, one glorious hallway lap. The year deserves an entrance.'],
        ['resolution-seed-packets', 'Write a resolution, seal it with seeds, plant it in spring — goals you can water.'],
        ['year-in-review-comic', 'Four panels, one year — the personal highlights reel, drawn not written.'],
        ['countdown-number-line-hop', 'A giant floor number line, ten hops to zero — subtraction you feel in your legs.'],
        ['midnight-countdown-rehearsal', 'The Vault\u2019s countdown rehearsal — practice the big moment before it counts.'],
        ['new-year-time-capsule', 'Seal the year in a box. Future you will thank present you.']
      ]
    },
    {
      id: 'winterbreak', glyph: '❄️', title: 'Winter break science & outdoors',
      blurb: 'Works whether or not it snows: snowflake symmetry, ice excavations, bird feeders, and the longest shadows of the year.',
      browse: 'index.html?tag=season:winter',
      browseLabel: 'Browse the full winter set',
      picks: [
        ['snowflake-symmetry-lab', 'No cutting, just looking — six-fold symmetry in real snowflake photos.'],
        ['ice-melt-rescue-race', 'Toys frozen in ice, warm hands and salt strategy. The rescue parade is mandatory.'],
        ['winter-bird-feeder', 'Pinecones and peanut butter, then a week of watching who shows up.'],
        ['winter-solstice-shadow-track', 'The shortest day casts the longest shadows — stake one and watch it move.'],
        ['snowy-day-story-walk', 'A story in stations: walk the pages, act the weather, end warm inside.'],
        ['arctic-animal-charades', 'Be the polar bear. No talking — the tundra is silent.'],
        ['solstice-lantern-stroll', 'The Vault\u2019s solstice lantern walk — carry the light through the longest night.'],
        ['reindeer-shelter-storm', 'Build a reindeer shelter that survives the (fan-powered) storm.']
      ]
    }
  ];

  var totalPicks = SECTIONS.reduce(function (acc, sec) {
    return acc + sec.picks.length;
  }, 0);

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }

  function ratingBadge(activityId) {
    var R = window.VaultRatings;
    if (!R) return null;
    var entry = R.getRating(activityId);
    if (!entry) return null;
    var s = el('span', 'rate-badge', '⭐ ' + entry.stars + '★ — your rating');
    s.setAttribute('aria-label', 'You rated this activity ' + entry.stars + ' of 5 stars');
    return s;
  }

  function facts(a) {
    return 'Ages ' + a.age_min + '–' + a.age_max + ' · ' +
      a.time_min + '–' + a.time_max + ' min · ' +
      (a.no_prep ? 'no prep' : 'some prep') + ' · ' +
      a.location.map(function (l) { return l === 'indoor' ? 'indoors' : 'outdoors'; }).join(' & ');
  }

  function pickItem(actmap, id, note) {
    var a = actmap[id];
    if (!a) return null; /* ids are build-validated; never happens */
    var li = el('li', 'pick');
    var row = el('div', 'pick-row');
    var link = el('a', 'pick-name', a.name);
    link.href = 'activity/' + a.id + '.html';
    row.appendChild(link);
    var badge = ratingBadge(a.id);
    if (badge) row.appendChild(badge);
    li.appendChild(row);
    li.appendChild(el('p', 'pick-facts', facts(a)));
    li.appendChild(el('p', 'pick-note', '💡 ' + note));
    return li;
  }

  function renderList(actmap, picks) {
    var list = el('ol', 'pick-list');
    var n = 0;
    picks.forEach(function (p) {
      var li = pickItem(actmap, p[0], p[1]);
      if (li) { list.appendChild(li); n++; }
    });
    if (!n) list.appendChild(el('p', null, 'No activities found — the library may have failed to load.'));
    return list;
  }

  function renderSection(sec, actmap) {
    var s = el('section', 'collection-section');
    s.id = 'winter-' + sec.id;
    s.setAttribute('aria-labelledby', 'winter-h-' + sec.id);
    var head = el('div', 'collection-head');
    var glyph = el('span', 'collection-glyph-lg', sec.glyph);
    glyph.setAttribute('aria-hidden', 'true');
    var h2 = el('h2', 'collection-h2', sec.title);
    h2.id = 'winter-h-' + sec.id;
    head.appendChild(glyph);
    head.appendChild(h2);
    s.appendChild(head);
    s.appendChild(el('p', 'collection-when', sec.blurb));
    s.appendChild(renderList(actmap, sec.picks));
    if (sec.browse) {
      var brow = el('p', 'no-print');
      var b = el('a', 'chip chip-link', (sec.browseLabel || 'Browse the full winter set') + ' →');
      b.href = sec.browse;
      brow.appendChild(b);
      s.appendChild(brow);
    }
    return s;
  }

  function init() {
    if (!sectionsHost) return;
    fetch('data/v1/activities.json').then(function (r) { return r.json(); }).then(function (d) {
      var acts = d.activities || d;
      var actmap = {};
      acts.forEach(function (a) { actmap[a.id] = a; });
      var missing = [];
      SECTIONS.forEach(function (sec) {
        sec.picks.forEach(function (p) { if (!actmap[p[0]]) missing.push(p[0]); });
      });
      if (missing.length) {
        statusEl.textContent = 'Winter hub error: unknown activity ids: ' + missing.join(', ');
        return;
      }
      sectionsHost.textContent = '';
      SECTIONS.forEach(function (sec) {
        sectionsHost.appendChild(renderSection(sec, actmap));
      });
      statusEl.textContent = totalPicks + ' winter-holiday activities across ' + SECTIONS.length + ' sections.';
    }).catch(function () {
      statusEl.textContent = 'Could not load the activity library. Check your connection and reload.';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
