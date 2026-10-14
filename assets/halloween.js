/* Activity Vault, Halloween hub page (wave 13).
   Renders the curated Halloween sections from data/v1/activities.json using
   explicit, build-validated id lists (scripts/test-halloween.js asserts every
   id resolves). Picks show the visitor's own rating badges (localStorage only
   never invented), matching the collections page pattern.
   The spookiness filter is client-side: every pick carries a spook level
   (none / fun / mild) and the buttons show or hide picks without reloading. */
(function () {
  'use strict';

  var sectionsHost = document.getElementById('halloween-sections');
  var statusEl = document.getElementById('halloween-status');

  var SPOOK_LABELS = {
    all: 'all spookiness levels',
    none: '🍎 Not spooky',
    fun: '👻 Spooky-fun',
    mild: '🕷️ Mildly spooky'
  };

  /* Curated sections: id lists are the source of truth, validated by tests.
     Each pick: [activity id, curator note, spook level]. */
  var SECTIONS = [
    {
      id: 'wave20', glyph: '⚡', title: 'Wave 20 · The Halloween 2026 Pack',
      blurb: 'Forty brand-new Halloween activities, costumes, STEM, crafts, movement, quiet-focus, treats, and more. Everything below is new this wave.',
      browse: 'index.html?tag=holiday:halloween',
      picks: [
        ['roll-a-monster-dice-draw', 'Roll for each monster part, draw the result, no two monsters match.', 'fun'],
        ['marigold-cempasuchil-flowers', 'Tissue-paper cempasúchil: a respectful Día de los Muertos craft about remembrance.', 'none'],
        ['pumpkin-seed-mosaic', 'Roasted seeds become jack-o\u2019-lantern mosaics, zero-waste art from pumpkin guts.', 'none'],
        ['witch-hat-decorate', 'Plain hats in, runway-ready witch hats out, the costume-station classic.', 'fun'],
        ['ghost-rocket-fizz', 'Film-canister rockets in ghost costumes. Chemistry does the launching.', 'fun'],
        ['glow-stick-temperature-lab', 'Same glow sticks, three water temperatures. Real data, real light.', 'none'],
        ['spiderweb-weight-bridge', 'Weave a yarn web, load it with pennies. How strong is your silk?', 'none'],
        ['vampire-teeth-acid-test', 'Eggshell \u2018fangs\u2019 soak overnight. Which liquid is toughest on teeth?', 'none'],
        ['witch-broomstick-relay', 'Pool-noodle broomsticks, full-speed relay, cackling encouraged.', 'fun'],
        ['ghost-freeze-tag', 'Tagged? Freeze like a ghost. A teammate\u2019s \u2018BOO!\u2019 sets you free.', 'fun'],
        ['monster-movement-dice', 'Roll the die, move like the monster: zombie shuffle to ghost glide.', 'fun'],
        ['zombie-walk-relay', 'Each leg is a different monster walk, the team votes the winner.', 'fun'],
        ['halloween-inference-riddles', 'Read the riddle, cite your clue: inference practice in a witch hat.', 'none'],
        ['thumbprint-monsters', 'One ink thumbprint becomes a monster: add eyes, horns, and attitude.', 'fun'],
        ['halloween-dots-and-boxes', 'The pencil-and-paper classic, Halloween edition: claim boxes, draw the face.', 'none'],
        ['spiderweb-sketch-study', 'Find a real web, sketch it slow, label the spokes: quiet science.', 'none'],
        ['ghost-banana-pops', 'Frozen banana ghosts on sticks, the two-ingredient Halloween treat.', 'none'],
        ['monster-mix-bags', 'Scoop, mix, bag: every kid builds their own Halloween trail mix.', 'none'],
        ['candy-apple-slices', 'All the caramel-apple joy, none of the whole-apple wrestling: slice bar.', 'none'],
        ['witches-brew-punch', 'No-cook punch mixing: the class brews a cauldron of something delicious.', 'fun'],
        ['halloween-countdown-calendar', 'Thirteen doors, thirteen mini-activities: the class counts down to the 31st.', 'none'],
        ['monster-name-alliteration-circle', '\u2018Marvelous Mummy Maya\u2019. Alliterative monster names around the circle.', 'fun'],
        ['costume-guess-who', 'Twenty questions, one costume: can the class guess what you are?', 'fun'],
        ['halloween-this-or-that', 'Candy corn: love it or leave it? Stand on your side. Then defend it.', 'fun'],
        ['monster-stomp-rhythms', 'Stomp-clap patterns for every monster: learn it, layer it, perform it.', 'fun'],
        ['trick-or-treat-chant-parade', 'A marching chant for the big night: rhythm, rhyme, and doorbell timing.', 'fun'],
        ['haunted-house-soundtrack', 'Compose the soundscape for a haunted tour: creaks, whispers, one big scare.', 'mild'],
        ['haunted-hallway-build', 'Teams transform one hallway into a silly-spooky walkthrough, designed by kids.', 'mild'],
        ['costume-swap-shop', 'Outgrown costumes find new kids: the community swap, run like a real shop.', 'none'],
        ['kindness-pumpkins', 'Paint them kind, deliver them in pairs, trick-or-treating in reverse.', 'none'],
        ['pumpkin-bowling', 'Mini pumpkins vs. bottle pins: the indoor bowling alley builds itself.', 'fun'],
        ['spiderweb-yarn-maze', 'Crawl the yarn maze without touching a strand: the quietest challenge indoors.', 'mild'],
        ['haunted-lantern-tour', 'Lights low, lanterns up: a guided tour of the room\u2019s \u2018haunted\u2019 corners.', 'mild'],
        ['pumpkin-patch-scavenger-hunt', 'Something orange, something round like the moon, one real spider web: go.', 'none'],
        ['leaf-pile-monster-dig', 'Bury treasure in the leaf pile, dig like a monster: the fall sensory classic.', 'fun'],
        ['ghost-balloon-stomp', 'Ghost faces on ankles: stomp others\u2019 ghosts while guarding your own.', 'fun'],
        ['graveyard-number-dash', 'Paper tombstones, called-out math: dash to the right answer.', 'fun'],
        ['harvest-moon-journal', 'Watch the October moon change night by night: a real sky journal.', 'none'],
        ['pumpkin-life-cycle-wheel', 'Spin the paper-plate wheel: seed, sprout, vine, flower, pumpkin.', 'none'],
        ['acorn-cap-witches', 'Acorn caps, paint, and pipe cleaners: the tiniest witches in the Vault.', 'fun']
      ]
    },
    {
      id: 'crafts', glyph: '🎨', title: 'Halloween crafts',
      blurb: 'Ghosts, monsters, and lollipop ghosts, plus the no-carve pumpkin classics for little hands.',
      browse: 'index.html?tag=holiday:halloween',
      picks: [
        ['ghost-garland-string', 'Tissue ghosts on a string, the fastest room transformation in the Vault.', 'fun'],
        ['monster-mask-making', 'Cardstock monsters with real 3D horns and fangs, costume-station ready.', 'fun'],
        ['lollipop-ghost-treats', 'The classic Halloween handout, made by the kids, with an allergy-aware twist.', 'fun'],
        ['pressed-leaf-mandala', 'Fall leaves into perfect symmetrical circles. Harvest math you can hang up.', 'none'],
        ['no-carve-pumpkin-decorating', 'All the pumpkin fun, zero knives, the young-kid classic.', 'none'],
        ['halloween-shadow-puppets', 'Cardboard puppets and a flashlight. The shadow show, Halloween edition.', 'mild'],
        ['paper-bag-ghost-puppets', 'Paper-bag ghosts with speaking parts, puppet theatre in 20 minutes.', 'mild']
      ]
    },
    {
      id: 'games', glyph: '🏃', title: 'Costume & party games',
      blurb: 'Runways, relays, freeze dances, and feel-boxes, the party half of the pack.',
      browse: 'index.html?tag=holiday:halloween',
      picks: [
        ['costume-runway-walk', 'Every costume gets its strut and its narrator moment.', 'fun'],
        ['costume-piece-relay', 'Each runner adds one costume piece, by the anchor leg, everyone is a monster.', 'fun'],
        ['monster-mash-dance', 'Freeze when the music stops, in your spookiest pose.', 'fun'],
        ['mystery-feel-boxes', 'Peeled grapes, cold spaghetti: mild thrills, lights on, zero scares.', 'mild'],
        ['costume-parade-pose-freeze', 'The parade classic: pose like your character when the music stops.', 'fun'],
        ['pin-the-hat-on-witch', 'The party-game evergreen, Halloween edition.', 'fun'],
        ['glow-stick-ring-toss', 'Ring toss that glows, built for dim October afternoons.', 'fun'],
        ['halloween-bingo', 'Bingo with bats and black cats instead of numbers.', 'fun']
      ]
    },
    {
      id: 'science', glyph: '🔬', title: 'Not-too-spooky science',
      blurb: 'Erupting pumpkins, rainbow candy dyes, monster slime, real experiments in costume.',
      browse: 'index.html?tag=holiday:halloween',
      picks: [
        ['pumpkin-volcano-fizz', 'The jack-o\u2019-lantern erupts, baking soda, vinegar, dish soap.', 'fun'],
        ['candy-chromatography', 'Candy dyes split into rainbows on coffee filters, real separation science.', 'none'],
        ['monster-slime-lab', 'Classic slime, monster-fied: googly eyes and glitter fur.', 'fun'],
        ['haunted-house-blueprint', 'Design a not-scary haunted house: silly scares, secret passages, marked exit.', 'mild'],
        ['pumpkin-seed-sprout-baggies', 'The Vault\u2019s pumpkin science classic, seeds sprouting in a baggie.', 'none'],
        ['measure-the-pumpkin', 'Weigh it, measure it, estimate the seeds, pumpkin math.', 'none']
      ]
    },
    {
      id: 'harvest', glyph: '🍎', title: 'Harvest',
      blurb: 'Apples, leaves, and gratitude, the calm, tasty side of October.',
      browse: 'index.html?tag=season:fall',
      browseLabel: 'Browse the full fall set',
      picks: [
        ['apple-tasting-party', 'The harvest anchor: blind taste-test, vote, graph the results.', 'none'],
        ['harvest-gratitude-circle', 'One thankful thought each, added to the paper harvest wreath.', 'none'],
        ['pumpkin-guts-sensory', 'Scoop, squish, sort, gloriously messy pumpkin science for little hands.', 'none'],
        ['apple-string-bite', 'Bite the hanging apple, no hands, bobbing without the shared water.', 'none'],
        ['apple-browning-lab', 'Which apple slice browns first? The kitchen-chemistry classic.', 'none'],
        ['leaf-animal-collage', 'Fall leaves become foxes, owls, and hedgehogs.', 'none']
      ]
    },
    {
      id: 'alternatives', glyph: '🏠', title: 'Beyond trick-or-treating',
      blurb: 'For programs that skip the door-to-door route. Planned alternatives and the allergy-aware must-dos.',
      groups: [
        {
          label: '🏠 Trick-or-treat alternatives', tag: 'holiday:halloween',
          picks: [
            ['trunk-or-treat-planning', 'The parking-lot alternative, planned by the kids themselves.', 'none'],
            ['reverse-trick-or-treat', 'Deliver treats instead of collecting them, the kindness flip.', 'none'],
            ['trick-or-treat-route-map', 'Map the safe route before the big night: lit streets, buddy pairs.', 'none']
          ]
        },
        {
          label: '💜 Allergy-aware', tag: 'holiday:halloween',
          picks: [
            ['teal-pumpkin-project', 'Teal pumpkin, non-food treat box, Halloween for every kid.', 'none']
          ]
        },
        {
          label: '💀 Respectful pick', tag: 'holiday:dia-de-muertos',
          picks: [
            ['ofrenda-memory-circle', 'A respectful D\u00eda de los Muertos craft about remembrance, learning, not dressing up.', 'none']
          ]
        }
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
    var s = el('span', 'rate-badge', '⭐ ' + entry.stars + '★, your rating');
    s.setAttribute('aria-label', 'You rated this activity ' + entry.stars + ' of 5 stars');
    return s;
  }

  function facts(a) {
    return 'Ages ' + a.age_min + '–' + a.age_max + ' · ' +
      a.time_min + '–' + a.time_max + ' min · ' +
      (a.no_prep ? 'no prep' : 'some prep') + ' · ' +
      a.location.map(function (l) { return l === 'indoor' ? 'indoors' : 'outdoors'; }).join(' & ');
  }

  function pickItem(actmap, id, note, spook) {
    var a = actmap[id];
    if (!a) return null; /* ids are build-validated; never happens */
    var li = el('li', 'pick');
    li.setAttribute('data-spook', spook || 'none');
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
      var li = pickItem(actmap, p[0], p[1], p[2]);
      if (li) { list.appendChild(li); n++; }
    });
    if (!n) list.appendChild(el('p', null, 'No activities found. The library may have failed to load.'));
    return list;
  }

  function renderSection(sec, actmap) {
    var s = el('section', 'collection-section');
    s.id = 'halloween-' + sec.id;
    s.setAttribute('aria-labelledby', 'halloween-h-' + sec.id);
    var head = el('div', 'collection-head');
    var glyph = el('span', 'collection-glyph-lg', sec.glyph);
    glyph.setAttribute('aria-hidden', 'true');
    var h2 = el('h2', 'collection-h2', sec.title);
    h2.id = 'halloween-h-' + sec.id;
    head.appendChild(glyph);
    head.appendChild(h2);
    s.appendChild(head);
    s.appendChild(el('p', 'collection-when', sec.blurb));

    if (sec.groups) {
      sec.groups.forEach(function (g) {
        var block = el('div', 'hw-group');
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
      var b = el('a', 'chip chip-link', (sec.browseLabel || 'Browse the full Halloween set') + ' →');
      b.href = sec.browse;
      brow.appendChild(b);
      s.appendChild(brow);
    }
    return s;
  }

  /* ---- spookiness filter ---- */
  var currentSpook = 'all';

  function applySpookFilter() {
    var visible = 0;
    var picks = sectionsHost.querySelectorAll('li.pick');
    for (var i = 0; i < picks.length; i++) {
      var show = currentSpook === 'all' || picks[i].getAttribute('data-spook') === currentSpook;
      picks[i].hidden = !show;
      if (show) visible++;
    }
    /* Hide group blocks and sections left with no visible picks. */
    var groups = sectionsHost.querySelectorAll('.hw-group');
    for (var g = 0; g < groups.length; g++) {
      var gv = groups[g].querySelectorAll('li.pick:not([hidden])').length;
      groups[g].hidden = gv === 0;
    }
    var sections = sectionsHost.querySelectorAll('.collection-section');
    for (var s = 0; s < sections.length; s++) {
      var sv = sections[s].querySelectorAll('li.pick:not([hidden])').length;
      sections[s].hidden = sv === 0;
    }
    statusEl.textContent = 'Showing ' + visible + ' of ' + totalPicks +
      ' Halloween activities (' + SPOOK_LABELS[currentSpook] + ').';
  }

  function wireFilter() {
    var btns = document.querySelectorAll('.spook-filter [data-spook]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        currentSpook = this.getAttribute('data-spook');
        for (var j = 0; j < btns.length; j++) {
          btns[j].setAttribute('aria-pressed',
            btns[j].getAttribute('data-spook') === currentSpook ? 'true' : 'false');
        }
        applySpookFilter();
      });
    }
  }

  function init() {
    if (!sectionsHost) return;
    wireFilter();
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
        statusEl.textContent = 'Halloween hub error: unknown activity ids: ' + missing.join(', ');
        return;
      }
      sectionsHost.textContent = '';
      SECTIONS.forEach(function (sec) {
        sectionsHost.appendChild(renderSection(sec, actmap));
      });
      statusEl.textContent = totalPicks + ' Halloween activities across ' + SECTIONS.length + ' sections.';
    }).catch(function () {
      statusEl.textContent = 'Could not load the activity library. Check your connection and reload.';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
