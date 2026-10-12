/* Activity Vault — summer hub page (wave 12).
   Renders the curated summer sections from api/v1/activities.json using
   explicit, build-validated id lists (scripts/test-summer.js asserts every id
   resolves). Picks show the visitor's own rating badges (localStorage only —
   never invented), matching the collections page pattern. */
(function () {
  'use strict';

  var sectionsHost = document.getElementById('summer-sections');
  var statusEl = document.getElementById('summer-status');

  /* Curated sections: id lists are the source of truth, validated by tests. */
  var SECTIONS = [
    {
      id: 'water', glyph: '💧', title: 'Water play',
      blurb: 'The whole point of summer: sponges, balloons, buckets, and one very brave limbo bar.',
      browse: 'index.html?tag=season:summer',
      picks: [
        ['water-balloon-toss', 'The classic, done right: step back after every catch, cleanup before the next game.'],
        ['drip-drip-drop', 'Duck-duck-goose with a wet sponge — the goose gets a squeeze overhead.'],
        ['bucket-brigade-race', 'Pass it over heads, cup to cup — first team to the tape line wins.'],
        ['sponge-launch-bullseye', 'Wet sponges, chalk targets, argued line calls like pros.'],
        ['sprinkler-limbo', 'How low can you go before you are soaked? Grass only.'],
        ['water-relay', 'The Vault classic sponge relay — already in the library, now properly tagged.']
      ]
    },
    {
      id: 'outdoor', glyph: '🏃', title: 'Outdoor & camp games',
      blurb: 'Field games for the long-light weeks — capture the flag, flashlight tag, and chalk everything.',
      browse: 'index.html?tag=season:summer',
      picks: [
        ['capture-the-flag-basics', 'Two teams, two flags, one field — simplified so it actually finishes in 40 minutes.'],
        ['flashlight-tag', 'Tag by flashlight beam at dusk: frozen when the light finds you.'],
        ['chalk-obstacle-course', 'Draw the course, run the course, then let the kids redesign it.'],
        ['frisbee-golf-nine', 'Nine cone-and-chalk holes around the field — fewest throws wins.'],
        ['nature-color-scavenger', 'A rainbow hunt with a hard rule: fallen and found only, nothing picked.'],
        ['chalk-art', 'Sidewalk squares for masterpieces — the sun dries them into the pavement gallery.']
      ]
    },
    {
      id: 'crafts', glyph: '🎨', title: 'Summer crafts',
      blurb: 'Bracelets, sun prints, pinwheels, and sand art — table crafts that survive a heat wave.',
      browse: 'index.html?tag=season:summer',
      picks: [
        ['friendship-bracelet-basics', 'The camp classic: one knot learned in a sitting, bracelets made for giving.'],
        ['sun-print-cards', 'The sun does the printing — arrange, expose, rinse, done.'],
        ['pinwheel-garden', 'Paper pinwheels on sticks, planted along the walkway for the wind.'],
        ['sand-art-bottles', 'Layered desert landscapes in a bottle — fill to the brim so they keep.'],
        ['ice-cube-painting', 'Frozen paint cubes that melt into watercolor art — built for hot days.']
      ]
    },
    {
      id: 'heat', glyph: '🧊', title: 'Beat-the-heat indoor',
      blurb: 'Scorcher days and storm days: ice digs, fan boats, a paper campfire, and shadow theatre.',
      browse: 'collections.html#rainy-day-rescue',
      browseLabel: '🌧️ Open the Rainy-day rescue collection (storm-day backup)',
      picks: [
        ['ice-excavation-dig', 'Toys frozen in ice, freed with salt and droppers — the salt-spot race is real science.'],
        ['fan-boat-races', 'Paper boats, fanned air only — no touching the boat, no mouth-blowing.'],
        ['indoor-campfire-circle', 'A paper campfire, lights down, one sentence each around the circle.'],
        ['shadow-puppet-matinee', 'Cardboard puppets and a flashlight: the hottest-hour show.']
      ]
    },
    {
      id: 'holidays', glyph: '🎆', title: 'Summer holidays & camp',
      blurb: 'July 4th stations, the solstice, and the camp-week program pieces.',
      groups: [
        {
          label: '🎆 July 4th', tag: 'holiday:july-4th',
          picks: [
            ['star-spangled-shoebox-parade', 'Shoebox floats in red, white, and blue — parade the whole route.'],
            ['liberty-quiz-bowl', 'Team trivia on the real basics: 1776, the 13 colonies, the 50 stars.']
          ]
        },
        {
          label: '🏕️ Camp week', tag: 'season:summer',
          picks: [
            ['camp-week-kickoff', 'The opening assembly that turns 30 strangers into one camp.'],
            ['talent-showcase-night', 'Ninety seconds per act, every act gets cheers — that is the whole contract.'],
            ['longest-day-shadow-track', 'Trace one shadow all solstice day: the sun draws the graph.']
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
    s.id = 'summer-' + sec.id;
    s.setAttribute('aria-labelledby', 'summer-h-' + sec.id);
    var head = el('div', 'collection-head');
    var glyph = el('span', 'collection-glyph-lg', sec.glyph);
    glyph.setAttribute('aria-hidden', 'true');
    var h2 = el('h2', 'collection-h2', sec.title);
    h2.id = 'summer-h-' + sec.id;
    head.appendChild(glyph);
    head.appendChild(h2);
    s.appendChild(head);
    s.appendChild(el('p', 'collection-when', sec.blurb));

    if (sec.groups) {
      sec.groups.forEach(function (g) {
        var h3 = el('h3', 'summer-group-h', g.label);
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
      var b = el('a', 'chip chip-link', (sec.browseLabel || 'Browse the full summer set') + ' →');
      b.href = sec.browse;
      brow.appendChild(b);
      s.appendChild(brow);
    }
    return s;
  }

  function init() {
    if (!sectionsHost) return;
    fetch('api/v1/activities.json').then(function (r) { return r.json(); }).then(function (d) {
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
        statusEl.textContent = 'Summer hub error: unknown activity ids: ' + missing.join(', ');
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
      statusEl.textContent = total + ' summer activities across ' + SECTIONS.length + ' sections.';
    }).catch(function () {
      statusEl.textContent = 'Could not load the activity library. Check your connection and reload.';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
