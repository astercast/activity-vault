/* Activity Vault — spring hub page (wave 11).
   Renders the curated spring sections from data/v1/activities.json using
   explicit, build-validated id lists (scripts/test-spring.js asserts every id
   resolves). Picks show the visitor's own rating badges (localStorage only —
   never invented), matching the collections page pattern. */
(function () {
  'use strict';

  var sectionsHost = document.getElementById('spring-sections');
  var statusEl = document.getElementById('spring-status');

  /* Curated sections: id lists are the source of truth, validated by tests. */
  var SECTIONS = [
    {
      id: 'crafts', glyph: '🌱', title: 'Spring crafts',
      blurb: 'Blossoms, butterflies, and ladybugs — table crafts that bring spring indoors.',
      browse: 'index.html?tag=season:spring',
      picks: [
        ['tissue-paper-cherry-blossoms', 'Twisted paper branches, pinch-and-glue blossoms — a whole orchard by cleanup time.'],
        ['coffee-filter-butterflies', 'Markers plus one spritz: the color-bleed moment never fails to get gasps.'],
        ['painted-rock-ladybugs', 'Yard rocks become garden art — hide the extras for other classes to find.'],
        ['pressed-flower-bookmarks', 'Start the pressing book now; harvest the bookmarks in a week.'],
        ['egg-carton-tulip-garden', 'A full tray of tulips from trash-bound cartons — zero watering required.'],
        ['paper-plate-sunflower', 'The fastest bloom in the pack: fifteen minutes, plate to sunflower.']
      ]
    },
    {
      id: 'outdoor', glyph: '🏃', title: 'Outdoor games',
      blurb: 'For the wiggly weeks — relays, chases, and puddle games that burn the spring fidgets off.',
      browse: 'index.html?tag=season:spring',
      picks: [
        ['sponge-bucket-relay', 'The rare relay where getting soaked is the strategy.'],
        ['puddle-stomp-parade', 'Zero materials, pure joy — rain boots required, dignity optional.'],
        ['puddle-hopscotch', 'Hopscotch with blue puddle squares you must jump clean over.'],
        ['egg-roll-race', 'The egg-and-spoon classic, spring edition — drops cost you seconds.'],
        ['bubble-snake-blower', 'A sock and a bottle blow a bubble snake a foot long.'],
        ['kite-flying-basics', 'The spring classic, already in the Vault and now properly tagged.']
      ]
    },
    {
      id: 'science', glyph: '🔬', title: 'Spring science',
      blurb: 'The season does the demo work — worms, puddles, sprouts, and nests, all observable this week.',
      browse: 'index.html?tag=season:spring',
      picks: [
        ['worm-weather-watch', 'After-rain worm counts vs. the weather log — real data, real arguments.'],
        ['puddle-depth-gauge', 'Measure the puddle now, measure it in an hour: where did the water go?'],
        ['flower-part-dissect', 'Take a tulip apart and find the machinery — pollen included.'],
        ['nest-material-challenge', 'Build a nest, then the marble-egg drop test decides the winner.'],
        ['seed-dispersal-design', 'Maple seeds spin — beat nature with a paper helicopter.'],
        ['sprout-growth-race', 'Sun vs. dark cup: place your bets, then watch for a week.'],
        ['evaporation-chalk-lines', 'Trace the puddle edge in chalk and watch the water lose.'],
        ['spring-seed-cups', 'The Vault classic: soil, seeds, and a windowsill race.']
      ]
    },
    {
      id: 'rainy', glyph: '🌧️', title: 'Rainy spring days',
      blurb: 'When the sky cancels recess — become the storm, or make something while you wait it out.',
      browse: 'collections.html#rainy-day-rescue',
      browseLabel: '🌧️ Open the Rainy-day rescue collection',
      picks: [
        ['thunderstorm-clap-along', 'The whole class becomes the weather: wind, rain, thunder, then calm.'],
        ['recycled-paper-making', "Yesterday's scrap becomes tomorrow's paper — a perfect two-day rain project."],
        ['jellybean-sort-graph', 'Sort, count, graph: quiet math that eats a rainy afternoon happily.']
      ]
    },
    {
      id: 'holidays', glyph: '🐣', title: 'Spring holidays',
      blurb: 'Easter stations and Earth Day projects — the season\'s two big classroom moments.',
      groups: [
        {
          label: '🐣 Easter', tag: 'holiday:easter',
          picks: [
            ['egg-roll-race', 'The relay every spring party needs.'],
            ['easter-egg-catapult', 'Popsicle-stick engineering with a plastic-egg payload.'],
            ['jellybean-sort-graph', 'Candy math: sort it, graph it, then decide the eating rule.'],
            ['egg-hunt-design', 'Kids design the hunt — hiding beats finding.']
          ]
        },
        {
          label: '🌎 Earth Day', tag: 'holiday:earth-day',
          picks: [
            ['earth-day-trash-audit', 'One day of classroom trash, sorted and weighed — the chart changes behavior.'],
            ['seed-ball-wildflowers', 'Roll them, dry them, toss them: flowers that outlast the lesson.'],
            ['recycled-paper-making', 'Blend the scrap bin into brand-new paper.']
          ]
        }
      ]
    }
  ];

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

  function renderSection(sec, actmap) {
    var s = el('section', 'collection-section');
    s.id = 'spring-' + sec.id;
    s.setAttribute('aria-labelledby', 'spring-h-' + sec.id);
    var head = el('div', 'collection-head');
    var glyph = el('span', 'collection-glyph-lg', sec.glyph);
    glyph.setAttribute('aria-hidden', 'true');
    var h2 = el('h2', 'collection-h2', sec.title);
    h2.id = 'spring-h-' + sec.id;
    head.appendChild(glyph);
    head.appendChild(h2);
    s.appendChild(head);
    s.appendChild(el('p', 'collection-when', sec.blurb));

    if (sec.groups) {
      sec.groups.forEach(function (g) {
        var h3 = el('h3', 'spring-group-h', g.label);
        s.appendChild(h3);
        var list = el('ol', 'pick-list');
        var n = 0;
        g.picks.forEach(function (p) {
          var li = pickItem(actmap, p[0], p[1]);
          if (li) { list.appendChild(li); n++; }
        });
        s.appendChild(list);
        var chipRow = el('p', 'no-print');
        var chip = el('a', 'chip chip-link', 'Browse all ' + g.label + ' activities →');
        chip.href = 'index.html?tag=' + encodeURIComponent(g.tag);
        chipRow.appendChild(chip);
        s.appendChild(chipRow);
        if (!n) s.appendChild(el('p', null, 'No activities found — the library may have failed to load.'));
      });
    } else {
      var list = el('ol', 'pick-list');
      var n = 0;
      sec.picks.forEach(function (p) {
        var li = pickItem(actmap, p[0], p[1]);
        if (li) { list.appendChild(li); n++; }
      });
      s.appendChild(list);
      if (!n) s.appendChild(el('p', null, 'No activities found — the library may have failed to load.'));
    }

    if (sec.browse) {
      var brow = el('p', 'no-print');
      var b = el('a', 'chip chip-link', (sec.browseLabel || 'Browse the full spring set') + ' →');
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
        var ids = sec.picks ? sec.picks.map(function (p) { return p[0]; })
                            : sec.groups.reduce(function (acc, g) {
                                return acc.concat(g.picks.map(function (p) { return p[0]; }));
                              }, []);
        ids.forEach(function (id) { if (!actmap[id]) missing.push(id); });
      });
      if (missing.length) {
        statusEl.textContent = 'Spring hub error: unknown activity ids: ' + missing.join(', ');
        return;
      }
      sectionsHost.textContent = '';
      SECTIONS.forEach(function (sec) {
        sectionsHost.appendChild(renderSection(sec, actmap));
      });
      var total = SECTIONS.reduce(function (acc, sec) {
        return acc + (sec.picks ? sec.picks.length
                                : sec.groups.reduce(function (a2, g) { return a2 + g.picks.length; }, 0));
      }, 0);
      statusEl.textContent = total + ' spring activities across ' + SECTIONS.length + ' sections.';
    }).catch(function () {
      statusEl.textContent = 'Could not load the activity library. Check your connection and reload.';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
