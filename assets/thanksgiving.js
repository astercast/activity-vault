/* Activity Vault — Thanksgiving hub page (wave 14).
   Renders the curated Thanksgiving sections from api/v1/activities.json using
   explicit, build-validated id lists (scripts/test-thanksgiving.js asserts every
   id resolves). Picks show the visitor's own rating badges (localStorage only —
   never invented), matching the collections page pattern.
   No filters on this hub: gratitude, harvest games, and giving back read fine
   straight through. Semantic HTML + ARIA + keyboard-native; mobile-first. */
(function () {
  'use strict';

  var sectionsHost = document.getElementById('thanksgiving-sections');
  var statusEl = document.getElementById('thanksgiving-status');

  /* Curated sections: id lists are the source of truth, validated by tests.
     Each pick: [activity id, curator note]. */
  var SECTIONS = [
    {
      id: 'crafts', glyph: '🎨', title: 'Gratitude crafts',
      blurb: 'Handprint turkeys, paper cornucopias, and friendsgiving place cards — take-homes that say thanks.',
      browse: 'index.html?tag=holiday:thanksgiving',
      browseLabel: 'Browse the full Thanksgiving set',
      picks: [
        ['thankful-turkey-handprints', 'The handprint turkey with a feather for every thankful thought — the pack\u2019s signature craft.'],
        ['paper-cornucopia-build', 'A paper horn of plenty for the middle of the friendsgiving table.'],
        ['friendsgiving-place-cards', 'One reason each guest is loved, written on a tent card.'],
        ['harvest-weave-placemats', 'Paper-strip weaving in harvest colors — the table sets itself.'],
        ['gratitude-tree', 'The Vault\u2019s gratitude classic — every thankful thought becomes a leaf.'],
        ['gratitude-door-decor', 'Cover the classroom door in what the group is thankful for.']
      ]
    },
    {
      id: 'games', glyph: '🏃', title: 'Harvest games',
      blurb: 'Turkey tag, pumpkin tosses, and harvest relays — burn off the pre-feast wiggles.',
      browse: 'index.html?tag=season:fall',
      browseLabel: 'Browse the full fall set',
      picks: [
        ['turkey-tag-chase', 'Gobble, dodge, don\u2019t get caught — the farmers are coming.'],
        ['pumpkin-bucket-toss', 'Toss mini pumpkins into harvest buckets from the line.'],
        ['harvest-basket-relay', 'Teams fill their harvest basket one armload at a time.'],
        ['scarecrow-dress-up-relay', 'The fall relay classic — dress the scarecrow, race back.']
      ]
    },
    {
      id: 'stem', glyph: '🔬', title: 'Thanksgiving STEM',
      blurb: 'Cranberry engineering, turkey-baster physics, and jar-shaken butter — real science, harvest flavored.',
      browse: 'index.html?tag=holiday:thanksgiving',
      browseLabel: 'Browse the full Thanksgiving set',
      picks: [
        ['cranberry-toothpick-towers', 'Toothpicks and cranberries — who builds the tallest harvest tower?'],
        ['turkey-baster-relay', 'Move the \u201ccranberries\u201d with nothing but a turkey baster and air pressure.'],
        ['shake-jar-butter', 'Cream, a jar, ten minutes of shaking: that\u2019s butter.'],
        ['turkey-code-feathers', 'Invent a symbol code and encode a turkey fact — from 2026 teaching research.'],
        ['cornucopia-catch-game', 'Build paper cornucopias, then invent your own catch game, rules and all.'],
        ['thanksgiving-table-build', 'Toothpicks and glue: a table with at most 4 legs that holds the feast.']
      ]
    },
    {
      id: 'gratitude', glyph: '🙏', title: 'Gratitude & friendsgiving',
      blurb: 'Practices that work for everyone — not every family celebrates Thanksgiving, and gratitude doesn\u2019t need a holiday.',
      groups: [
        {
          label: '🙏 Gratitude practices', tag: 'holiday:thanksgiving',
          picks: [
            ['gratitude-alphabet-circle', 'Zero prep, whole group: one thankful word per letter, A to Z.'],
            ['thankful-jar-shares', 'Slips of gratitude in a jar, drawn and read aloud.'],
            ['gratitude-all-year', 'The inclusive anchor — a gratitude log for everyone, all year.'],
            ['gratitude-journals', 'Three good things a day — the fastest perspective shift there is.'],
            ['harvest-gratitude-circle', 'One thankful thought each, added to the paper harvest wreath.']
          ]
        },
        {
          label: '🍽️ Friendsgiving', tag: 'holiday:thanksgiving',
          picks: [
            ['friendsgiving-potluck-plan', 'The class plans its own feast — sign-up sheet, ingredient cards, jobs.'],
            ['friendsgiving-story-circle', 'Pair up, trade a favorite memory, introduce your partner\u2019s story.']
          ]
        }
      ]
    },
    {
      id: 'giving', glyph: '🤝', title: 'Giving back',
      blurb: 'Gratitude with a job to do — food drives, thank-you cards for the staff, and bags for neighbors.',
      browse: 'index.html?tag=holiday:thanksgiving',
      browseLabel: 'Browse the full Thanksgiving set',
      picks: [
        ['food-drive-planning', 'Kids plan the whole canned-food drive: goal, posters, collection crew.'],
        ['staff-thank-you-cards', 'Cards for the custodians, cafeteria crew, and bus drivers — the holiday heroes.'],
        ['blessing-bag-pack', 'Pack snack-and-supply bags for neighbors who need them.'],
        ['harvest-thanksgiving-skits', 'The Vault\u2019s harvest-skits classic — perform the season for the room.']
      ]
    }
  ];

  var totalPicks = SECTIONS.reduce(function (acc, sec) {
    return acc + (sec.picks ? sec.picks.length
                            : sec.groups.reduce(function (a2, g) { return a2 + g.picks.length; }, 0));
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
    s.id = 'thanksgiving-' + sec.id;
    s.setAttribute('aria-labelledby', 'thanksgiving-h-' + sec.id);
    var head = el('div', 'collection-head');
    var glyph = el('span', 'collection-glyph-lg', sec.glyph);
    glyph.setAttribute('aria-hidden', 'true');
    var h2 = el('h2', 'collection-h2', sec.title);
    h2.id = 'thanksgiving-h-' + sec.id;
    head.appendChild(glyph);
    head.appendChild(h2);
    s.appendChild(head);
    s.appendChild(el('p', 'collection-when', sec.blurb));

    if (sec.groups) {
      sec.groups.forEach(function (g) {
        var block = el('div', 'tg-group');
        block.appendChild(el('h3', 'summer-group-h', g.label));
        block.appendChild(renderList(actmap, g.picks));
        var chipRow = el('p', 'no-print');
        var chip = el('a', 'chip chip-link', 'Browse all ' + g.label + ' activities →');
        chip.href = 'index.html?tag=' + encodeURIComponent(g.tag);
        chipRow.appendChild(chip);
        block.appendChild(chipRow);
        s.appendChild(block);
      });
    } else {
      s.appendChild(renderList(actmap, sec.picks));
    }

    if (sec.browse) {
      var brow = el('p', 'no-print');
      var b = el('a', 'chip chip-link', (sec.browseLabel || 'Browse the full Thanksgiving set') + ' →');
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
        statusEl.textContent = 'Thanksgiving hub error: unknown activity ids: ' + missing.join(', ');
        return;
      }
      sectionsHost.textContent = '';
      SECTIONS.forEach(function (sec) {
        sectionsHost.appendChild(renderSection(sec, actmap));
      });
      statusEl.textContent = totalPicks + ' Thanksgiving activities across ' + SECTIONS.length + ' sections.';
    }).catch(function () {
      statusEl.textContent = 'Could not load the activity library. Check your connection and reload.';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
