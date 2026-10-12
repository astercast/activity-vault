#!/usr/bin/env python3
"""Wave 25: Thin Holidays Deepened + one fresh Scout cycle.

Part 1 — Scout cycle (run live 2026-10-12, before this script):
`python3 pipeline/scan.py` fetched all 6 feeds (WeAreTeachers 16 items,
Hands On As We Grow 7, Teach Beside Me 10, Little Bins 10, Kids Activities
Blog 10, Buggy and Buddy 12 = 65 items) and queued 0 new candidates:
every relevant item was already in pipeline/seen.json from the wave-24
scan, and the rest failed the KEEP/DROP relevance filter. The queue
therefore stays at 0 pending / 59 decided (21 accepted, 38 rejected),
byte-identical. No rubber-stamping was needed because nothing landed —
and nothing was manufactured to make the cycle look busy. The cycle is
recorded here and in WAVELOG.md; pipeline/review-queue.json is untouched
by this wave.

Part 2 — Deepen the four thin holidays (wave-24 completeness audit left
them at 1-2 activities each; target 4-6 quality activities each):
- holiday:mlk-day                  1 -> 5  (+4)
- holiday:indigenous-peoples-day   1 -> 5  (+4)
- holiday:diwali                    2 -> 5  (+3)
- holiday:st-patricks-day           2 -> 5  (+3)
14 new activities, 536 -> 550. All original words per PIPELINE.md.

Editorial rules held, same as waves 20/22/24:
- MLK activities use Dr. King's real words, real dates, and the real
  people around him (Rosa Parks, the Selma marchers) — the holiday is
  about a specific person and movement, not generic kindness. The one
  service activity is MLK-specific because MLK Day has been a national
  day of service since 1994 and quotes King saying so.
- Indigenous Peoples' Day activities teach present-day, specific,
  named peoples and knowledge (Three Sisters agriculture, Indigenous
  authors with their nations, tribal-nations maps from tribal sources,
  seasonal-rounds method) — no costumes, no invented ceremonies, no
  borrowing a nation's stories or symbols.
- Diwali activities name the real festival and its real practices:
  clay diyas (LED flames only — air-dry clay is not fireproof), mehndi
  pattern practice on PAPER only (nobody draws on skin), and a straight
  published retelling of the Ramayana sequenced, not costumed.
- St. Patrick's Day activities are Ireland, not leprechaun clip-art:
  limericks (named for Limerick), reel steps taught as a real dance
  tradition in your own clothes and voice, and one rainbow STEM lab
  (the holiday's rainbow, built honestly as capillary action).

Near-duplicate screen: token Jaccard >= 0.55 against every existing
name+tagline is asserted in this script and fails the run. Closest
deliberate neighbours, kept on purpose:
- mlk-freedom-quilt-squares vs year-in-review-quilt: paper squares
  assembled as a group quilt in both, but that one is retrospective
  review panels; this one is one fairness word + drawing per square
  for MLK Day, with King's vocabulary as the content.
- clay-diya-pinch-pots vs paper-diya-lanterns: same festival object,
  different craft entirely (pinched and painted clay vs folded paper)
  and a two-session arc; a teacher needs both price points.
- walking-rainbow-lab vs density-rainbow-jars / rainbow-milk:
  capillary "walking" water vs layered-density jars vs surface-tension
  milk — three different mechanisms.
- tribal-nations-map-study vs continents-map-puzzle: present-day
  tribal nations of the school's own region vs world-continent jigsaw.
- seasonal-rounds-phenology-wheel vs weather-journal: a year wheel of
  local land signs vs daily weather logging.

Safety notes are practical only — no medical claims anywhere.

Run once: dedupes by id, writes data/activities.json.
Run scripts/build.py afterwards.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from add_winter import A, DATA, ROOT

MLK = ["season:winter", "holiday:mlk-day"]
IND = ["season:fall", "holiday:indigenous-peoples-day"]
DIW = ["season:fall", "holiday:diwali"]
STP = ["season:spring", "holiday:st-patricks-day"]

PACK = [
    # ---------------- MLK Day (+4 -> 5) ----------------
    A("mlk-freedom-quilt-squares", "Freedom Quilt Squares",
      "One paper square each — a word, a drawing, a fairer world — taped together into one class quilt for MLK Day.",
      ["crafts", "team-community"], (6, 12), (4, 30), (25, 40), ["indoor"],
      ["square paper (one per kid, all the same size)", "crayons or markers",
       "tape or glue", "one large backing sheet of paper"],
      False, "Cut the squares to one size ahead of time and tape the backing sheet to the wall or lay it on a table. Write six starter words on the board — fairness, courage, kindness, freedom, peace, respect — words Dr. King used and lived.",
      ["Start with the man, briefly: in January we mark Dr. Martin Luther King Jr.'s birthday. He believed ordinary people working together could make the country fairer. A quilt is that idea you can touch — small pieces, one warm thing.",
       "Each kid picks one starter word (or a word of their own in the same spirit) and draws what that word looks like in real life: sharing the swings is fairness, standing up for a new kid is courage.",
       "Add a border pattern around the square's edge — checks, zigzags, dots — so every square reads as sewn, not just placed.",
       "Assemble the grid on the backing sheet together, taping edge to edge. Gaps and crooked squares get fixed as a group; that is quilting too.",
       "Stand back for the reveal. Each kid points to their square and says the word plus one line about their drawing. The quilt stays up through January."],
      "Give the word and a partly-started drawing; the kid finishes and colors it.",
      "Add a line from King's speeches or writings under the square, copied carefully and credited to him.",
      safety=None,
      tags=MLK, copy_free=True, no_elimination=True,
      inclusion="The quilt is a building metaphor, not a claim about history — keep the history in King's real words and deeds, which the intro names. Every square joins the quilt; there is no voting and no best square."),

    A("civil-rights-timeline-walk", "Civil Rights Timeline Walk",
      "Six true events, six stations around the room — walk the movement in order, then rebuild the story from memory.",
      ["holidays", "team-community"], (8, 14), (6, 32), (30, 45), ["indoor"],
      ["six teacher-made event cards", "tape", "paper timeline strips (one per pair)", "pencils"],
      False, "Write the six cards yourself, one event each, big and plain: 1955 — the Montgomery bus boycott, Rosa Parks arrested, Dr. King leads the boycott; 1963 — marches in Birmingham, children marching for fairness; August 1963 — the March on Washington and 'I Have a Dream'; 1964 — King wins the Nobel Peace Prize, the Civil Rights Act passes; 1965 — Selma, the Voting Rights Act; 1968 — King is killed in Memphis while supporting striking workers. Hang them around the room out of order.",
      ["Walk in pairs, cards in any order. At each station, read it together and write the year and one line about what happened on your strip notes.",
       "Finish the circuit, then sit: shuffle your notes and lay out a timeline strip in the order you think the events happened, from memory and reasoning.",
       "Reveal the real order card by card. Pairs fix their strips — being wrong and fixing it is the learning, not a failure.",
       "Mark the gaps out loud: what do the jumps between cards leave out? (Plenty — six cards are a doorway, not the whole story.)",
       "Close with one question around the room: which event surprised you most, and why? Keep answers to one sentence each so everyone fits."],
      "Walk with an adult or strong reader; the strip needs only years in order, the lines are optional.",
      "Add a seventh card the pair researches themselves — another person from the movement, with their name spelled right and one sourced fact.",
      safety=None,
      tags=MLK, copy_free=True,
      inclusion="Use real names, dates, and people — Rosa Parks, the Birmingham children, the Selma marchers. King did not act alone and the cards should not pretend he did. Keep the 1968 card plain and brief; questions about it get honest, short answers."),

    A("mlk-day-service-sprint", "MLK Day Service Sprint",
      "The holiday is a day on, not a day off — pick one real job this building needs and finish it in one session.",
      ["team-community", "holidays"], (7, 14), (4, 30), (30, 50), ["indoor", "outdoor"],
      ["work gloves (for litter jobs)", "trash bags", "card-making supplies (paper, markers)"],
      False, "Scout three jobs in advance that are real, visible, and finishable inside the session: straightening the library shelves, a playground litter sweep, thank-you cards for the custodians and kitchen staff. Ask the custodian what would actually help before you promise anything.",
      ["Say why this holiday, plainly: since 1994, Martin Luther King Jr. Day has also been a national day of service. King's own line is the brief: 'Everybody can be great, because everybody can serve.'",
       "Put the three jobs on the board. The group picks one by show of hands; ties go to the job the building's staff asked for.",
       "Split into crews with one captain each, hand out gloves and bags or card supplies, and set the boundary and the finish line out loud.",
       "Do the work — most of the session is this step. Adults work alongside, same gloves, same bags.",
       "Inspect the finished job together, then close in a circle: whose day got a little easier because of this hour? That answer is the whole point of the holiday."],
      "Take the seated job — sorting, card-making, shelf-facing — it is full service, not the soft option.",
      "Plan the next one: crews draft a one-page proposal for a bigger service job, with the staff member's name on it whose work it supports.",
      safety="Gloves on for litter, and anything sharp or suspicious is adult-only — point at it, never pick it up. Crews stay inside the agreed boundary where one adult can see them.",
      tags=MLK, copy_free=True, no_elimination=True,
      inclusion="Service means work the building actually needs, chosen with the people who do that work every day. Ask first; never perform helping at someone. Every crew's job counts the same when the circle closes."),

    A("dream-speech-choral-reading", "Echoes of a Dream: Choral Reading",
      "King's cadence, your voices — echo-read the famous lines together until the room sounds like one speaker.",
      ["music-rhythm", "holidays"], (8, 14), (6, 35), (20, 30), ["indoor"],
      ["a board or chart paper with 4-6 short lines from the speech"],
      False, "Write four to six short lines from 'I Have a Dream' on the board — keep them short ('I have a dream today', 'Let freedom ring') so young readers can hold a whole line at once. If you have a recording of King delivering it, queue thirty seconds of it.",
      ["Listen first, if you can: thirty seconds of King's own voice. Notice how he repeats a line and lets the crowd answer. That call-and-response is the engine of this activity.",
       "Echo round: you read a line the way he builds it — starting low, ending strong — and the whole group echoes it back, same rhythm, same emphasis.",
       "Layer the dynamics: the first line quiet, each next line a notch louder and surer. Choral reading is volume with control, not shouting.",
       "Split the lines between sections of the room, then run the whole piece: sections trade lines and everyone lands the final line together.",
       "Perform it once, standing, start to finish. Then sit and talk for one minute: why does saying the same words together feel different from reading them alone?"],
      "Two lines only, echoed right after the adult, with the group carrying anyone who loses the words.",
      "A small group arranges its own one-minute choral version, ending with one original line of their own in the same spirit — clearly announced as theirs, not King's.",
      safety=None,
      tags=MLK, no_elimination=True,
      inclusion="Use short excerpts of the real speech, credited to King, and his real voice when you can get it. The point is hearing his actual language and rhythm — nobody performs an accent or an impression of him."),

    # ---------------- Indigenous Peoples' Day (+4 -> 5) ----------------
    A("three-sisters-garden-plan", "Three Sisters Garden Plan",
      "Corn holds the beans, beans feed the soil, squash shades the ground — plan the companion garden Indigenous farmers designed.",
      ["stem", "seasons"], (7, 12), (4, 28), (30, 45), ["indoor"],
      ["large paper (one sheet per group)", "rulers", "pencils and markers",
       "pictures or packets of corn, bean, and squash seed"],
      False, "Draw one demo mound on the board: a low hill with corn in the middle. If your program can plant for real, cups and soil turn the harder variation into a spring start — the plan is the activity either way.",
      ["Tell the origin plainly: the Three Sisters is a planting system worked out over centuries by Indigenous peoples of North America, including the Haudenosaunee. It is engineering, not folklore.",
       "Give each sister her job: corn grows tall and becomes the bean's pole; beans pull nitrogen from the air into the soil and feed the others; squash spreads low, shades out weeds, and keeps the soil moist.",
       "Groups draw a top-down bed plan: mounds in a row, corn at each mound's center, beans circled around the corn, squash at the edges where it can sprawl.",
       "Label every plant on the plan with an arrow naming its job. A plan where a sister has no job is a plan that fails in July — fix it now, on paper, where fixing is cheap.",
       "Share plans around the room. Check each one the same way: could a real gardener plant from this drawing without asking you a question?"],
      "Plan one mound only, with the three jobs given as picture cards to place.",
      "Scale it: work out how many mounds fit a real bed your program has, seeds per mound, and a planting order across two weeks (corn first — it has to be up before the beans climb).",
      safety="Seeds and soil are for planting, not eating — wash hands after handling either. Check seed packets first for any treatment warnings.",
      tags=IND, copy_free=True,
      inclusion="This is real agricultural science developed by Indigenous farmers over centuries — teach it as engineering with named peoples, not as a cute legend. If you plant, say whose knowledge made the plan before the first seed goes in."),

    A("indigenous-authors-read-aloud", "Indigenous Authors Read-Aloud",
      "Picture books written by Indigenous authors, read aloud properly — then one page of response from every listener.",
      ["quiet-focus", "team-community"], (5, 10), (4, 30), (25, 35), ["indoor"],
      ["one or two picture books by Indigenous authors (from the library)",
       "paper (one sheet per kid)", "crayons or markers"],
      False, "Borrow ahead, and check the cover before you commit: the author should be Indigenous and their nation named. Solid picks: 'Fry Bread' by Kevin Noble Maillard (Seminole Nation), 'We Are Water Protectors' by Carole Lindstrom (Turtle Mountain Ojibwe), illustrated by Michaela Goade (Tlingit), and Goade's 'Berry Song'.",
      ["Show the cover and read the author's name and nation aloud before page one. Who tells the story is part of the lesson, and it takes ten seconds.",
       "Read the book slowly, showing every picture. These books were built to be looked at — rushing the art is skipping half the text.",
       "Read one favorite page a second time — let the group vote on which page. Hearing a loved passage twice is a real reading habit, not a delay.",
       "Response page: each kid draws the moment that stayed with them and writes one sentence under it — what happened, or a question they still have.",
       "Share in pairs, then put the books where kids can reach them all week. A read-aloud that ends in re-reading did its job."],
      "One short book, drawing only — the sentence can be dictated to an adult or partner.",
      "Add one sourced fact about the author's nation (where it is, its own name for itself) to the response page, from the book's back pages or the publisher's page.",
      safety=None,
      tags=IND,
      inclusion="The rule is authorship: stories about Indigenous people written by Indigenous authors, with their nations named — not legends retold from outside. Present-day settings sit alongside traditional ones in these books, because Indigenous life is not only in the past tense."),

    A("tribal-nations-map-study", "Tribal Nations Map Study",
      "Whose land is the school on? Find the tribal nations of your region on a real map and learn their names right.",
      ["team-community", "stem"], (9, 14), (4, 32), (30, 45), ["indoor"],
      ["a tribal-nations map of your state or region (printed or projected)",
       "index cards or cardstock (one per pair)", "markers"],
      False, "Get the map from a source made with tribal input — your state tribal-relations office, a tribal nation's own site, or a university Indigenous-studies program all publish them. Find the nations nearest your school yourself before the session, so you can pronounce every name on the map.",
      ["Start with the honest question: this town sits on land Indigenous peoples have lived on for thousands of years. Which nations call this region home — and are still here?",
       "Find your school's area on the map together. Read the nearest nations' names aloud, carefully, twice. Getting a name right is a form of respect you can practice.",
       "Each pair claims one nation and builds its card: the name the nation uses for itself, where its government sits today, and one fact taken from the nation's own website or book.",
       "Post the cards around the map in roughly the right places. The wall should now show neighbors, not a history exhibit.",
       "Close by naming what changed: these are present-day governments and communities with websites, schools, and courts — not peoples who vanished."],
      "Work from the map only: name, location, and one fact read aloud from the card you are given.",
      "Add a second card per nation: one question the pair still has, and where they would go to find the answer from the nation's own sources.",
      safety=None,
      tags=IND,
      inclusion="Use maps and facts produced by tribal nations themselves wherever you can, and the names nations use for themselves. This is a study activity, not a ceremony — nobody performs an acknowledgment script unless your school has its own, developed with tribal partners."),

    A("seasonal-rounds-phenology-wheel", "Seasonal Rounds Phenology Wheel",
      "Seasons by what the land is doing, not the calendar — build a wheel of local plant and animal signs and start watching.",
      ["outdoor", "seasons"], (7, 12), (4, 28), (30, 40), ["indoor", "outdoor"],
      ["paper plates or large paper circles (one per kid or pair)", "pencils and markers",
       "clipboards for the walk"],
      False, "Draw one demo wheel on the board: a circle in four quarters, one per season, empty. Think through three signs you know are real for your town in each season before the kids start — your local knowledge is the fact-check.",
      ["Explain the idea honestly: many Indigenous communities organized the year as seasonal rounds — planting, gathering, and moving by what the land was doing, like the first frog calls or the berries ripening, rather than by calendar dates.",
       "Brainstorm local signs the group already knows, season by season: first dandelions, leaves turning, the week the geese go over. Everything suggested goes up; doubtful ones get a question mark, not a deletion.",
       "Take a short observation walk with clipboards. Find two signs of the current season actually happening and sketch them — the wheel records your place, not a textbook's.",
       "Build the wheels: three signs per season, drawn and labeled, with the two observed signs marked as 'seen by us' with today's date.",
       "Hang the wheels where the group passes daily. The job from here is one check a week: which sign on the wheel is the land doing now?"],
      "Four seasons, two signs each, drawings only — labels dictated or copied from the board.",
      "Add a month ring around the outside and compare all year: when the calendar and the land disagree about a season's start, which one was right?",
      safety="Set the walk boundary out loud before anyone moves. Observe plants without picking them — the wheel records the land, it does not collect it.",
      tags=IND,
      inclusion="Name the source of the method honestly: seasonal rounds are how many Indigenous nations organized the year, tuned to their own places. Our wheel uses the method for our place — it does not borrow any nation's ceremonies, moon names, or stories."),

    # ---------------- Diwali (+3 -> 5) ----------------
    A("clay-diya-pinch-pots", "Clay Diya Pinch Pots",
      "Pinch a real clay bowl, paint it bright, set an LED flame inside — a diya made the slow way.",
      ["crafts", "holidays"], (5, 12), (2, 28), (30, 45), ["indoor"],
      ["air-dry clay (one ball per kid)", "a small cup of water per table",
       "paint and brushes", "battery tealights (one per pot)"],
      False, "Cover the tables and portion the clay into balls a small fist can close around. Plan for two sessions if you can — pinch pots today, paint when they have dried overnight; a single session still works if painting is dropped to the variation.",
      ["Start with the real object, as with the paper version: a diya is a small clay oil lamp, and rows of them light homes, steps, and windowsills through Diwali, the festival of lights. Today the lamps are clay for real — only the flame is battery-powered.",
       "Pinch the pot: thumb into the center of the ball, then pinch and turn, pinch and turn, until a shallow bowl with walls about as thick as your thumb.",
       "Smooth the rim with a wet fingertip and flatten the base so it sits steady. A diya that wobbles gets fixed now, not after it dries.",
       "Press a pattern around the rim with a fingertip or pencil end — dots and diamonds are traditional shapes and forgiving ones.",
       "When the pots are dry, paint them in warm colors and let them dry again. Set a battery tealight in each, line the whole row along a shelf, and take the room lights low for one minute."],
      "Start from a teacher-pinched bowl; the kid's jobs are smoothing, pattern, and paint.",
      "Make a matched pair with a planned pattern that continues across both pots, or pinch the smallest bowl that still holds a tealight.",
      safety="Battery tealights only — never a real flame; air-dry clay is not fireproof and these pots were not made for oil or fire. Wash hands after clay and paint.",
      tags=DIW,
      inclusion="A diya is a working lamp in a living festival, not a generic candle holder — kids make the real form and learn why rows of them appear at Diwali. Patterns on the pots, yes; pictures of deities as decoration, no."),

    A("mehndi-paper-patterns", "Mehndi Paper Patterns",
      "Fine lines, paisleys, and patience — practice the pattern language of mehndi on paper hands. No skin, no staining.",
      ["crafts", "quiet-focus"], (6, 14), (2, 30), (25, 40), ["indoor"],
      ["paper (one sheet per kid)", "fine markers or pencils"],
      False, "Each kid traces their own hand on the paper — their own hand shape is the template. Draw the building blocks on the board: dots, teardrops (the paisley shape), vines, a checker band, and one round mandala for the palm.",
      ["Say what mehndi is, straight: artists draw patterns with henna paste on skin for celebrations — Diwali among them, and weddings — and the stain fades over a week or two. Ours is paper practice of the patterns only.",
       "Trace the hand, then place one round motif in the center of the palm. Everything else grows out of that center.",
       "Work outward: each finger gets a vine, a dot trail, or a banded pattern. Repetition is the style — the same small shape, done carefully, twenty times.",
       "Fill the gaps with dots. In mehndi, empty space gets dotted, not left — it is the easiest rule and it makes every page look finished.",
       "Lay all the paper hands flat in one long row for a gallery look. Flat, they read as what they are: pattern practice, done with care."],
      "Pencil first, three big motifs only — palm circle, one finger vine, dots.",
      "Design a matched pair, both hands, with the palm motifs mirroring each other — then teach your border pattern to a neighbor.",
      safety="Markers are for paper only today — nobody draws on skin, their own or anyone else's.",
      tags=DIW, copy_free=True,
      inclusion="Mehndi is skilled body art with real artists behind it — paper practice honors the patterns without pretending to the ceremony or the skill. Paisleys, vines, and dots, yes; copying religious symbols as decoration, no."),

    A("ramayana-story-sequence", "The Story of the Lights: Ramayana Sequencing",
      "A prince exiled, a long road home, and lamps lit to guide him — hear the Diwali story and put its pictures in order.",
      ["holidays", "quiet-focus"], (6, 11), (4, 28), (25, 35), ["indoor"],
      ["teacher-made picture cards (6-8 scenes)", "paper (one sheet per kid)", "crayons or markers"],
      False, "Find a good published children's retelling of the Ramayana at the library if you can. Make the cards yourself, one beat per card: Prince Rama and Sita; the exile to the forest; Ravana carries Sita away; Hanuman and the allies search; the battle, and good wins; the long journey home; the people of Ayodhya light rows of diyas to guide them; the celebration.",
      ["Tell the story once, slowly, holding each card up at its beat, then laying it face down. Eight beats, no rushing — this is one of the oldest stories in the world and it can hold a room.",
       "Pairs get the full shuffled set face up. Put the story back in order, arguing from what you remember — the argument is the comprehension check.",
       "Retell it to your partner using the cards as your script, one sentence per card. Partners may correct the order, kindly, by pointing at the card.",
       "Check the sequence as a class against the telling. Then say the ending out loud together: the people lit lamps to guide Rama home — that is why rows of diyas line doorways and windowsills at Diwali.",
       "Close by drawing your favorite scene on the back of one card. The set goes in an envelope for the next class to sequence cold."],
      "Five cards only, and the adult retells while kids hold each card up as its beat arrives.",
      "Write a one-sentence caption per card in your own words and bind the set into a class book, with the storyteller credited on the cover page.",
      safety=None,
      tags=DIW,
      inclusion="The Ramayana is a sacred Hindu epic, thousands of years old — tell a published retelling straight, name it as Hindu, and never act it out in costume or turn its figures into cartoons. Different families and regions mark Diwali with different stories; if a kid offers theirs, that is a contribution, not a correction."),

    # ---------------- St. Patrick's Day (+3 -> 5) ----------------
    A("limerick-writing-circle", "Limerick Writing Circle",
      "Five lines, two rhymes, one ridiculous ending — write limericks, the verse form named for a city in Ireland.",
      ["quiet-focus", "holidays"], (8, 14), (4, 30), (25, 35), ["indoor"],
      ["paper (one sheet per kid)", "pencils"],
      False, "Write this example on the board before they arrive — it scans, it rhymes, and it is clean: 'There once was a goalie named Bright, / who practiced by day and by night. / When the ball came in fast, / he dove — and at last / he saved it, then hugged it tight.'",
      ["Name the form's home first: limericks take their name from Limerick, a city in Ireland, which is why they belong to St. Patrick's week. The shape: five lines, lines 1, 2, and 5 long and rhyming, lines 3 and 4 short and rhyming — AABBA.",
       "Clap the board example's rhythm together until the group can feel where the short lines land. The clap is the meter; counting syllables comes second.",
       "Build one as a class: pick a character and a place, find three rhymes for the place first, then write backwards from the last line — the punchline is easier to hit when you aim at it.",
       "Draft your own. Stuck rhymes go to the rhyme bank on the board, which anyone may borrow from and add to.",
       "Reading circle to finish: read it in your own voice, straight-faced as you can manage. The group's job is to laugh with the poem and groan kindly at the puns."],
      "Write as a pair, or finish a started limerick — the first two lines are on the board, you supply the short lines and the ending.",
      "Write a linked pair: the second limerick's character is a bystander from the first one's last line.",
      safety="Limericks tease situations and invented characters — never a classmate's name, body, family, or accent. A poem that needs a real target gets rewritten, not read.",
      tags=STP, copy_free=True,
      inclusion="Name the form's home honestly — Limerick, Ireland — and read the poems in your own voice. The tradition is the verse form and the wit; mocking Irish accents is not part of it and never has been."),

    A("walking-rainbow-lab", "Walking Rainbow Lab",
      "Six cups, three colors, paper-towel bridges — the water climbs on its own and mixes a rainbow between the cups.",
      ["stem"], (5, 11), (2, 28), (20, 35), ["indoor"],
      ["six clear cups or jars", "water", "food coloring (red, yellow, blue)",
       "paper towels", "a tray to work on"],
      False, "Set the six cups in a row on the tray. Fill cups 1, 3, and 5 about two-thirds with water and color them red, yellow, and blue; leave 2, 4, and 6 empty. Fold the paper towels into strips — these are the bridges, and St. Patrick's week deserves a rainbow you built yourself.",
      ["Predict first, out loud: will the empty cups stay empty? Most groups say yes. Write the prediction down — being wrong on paper is data.",
       "Lay a towel bridge from each full cup down into the empty cup beside it, ends well into the water. Five bridges, every cup connected.",
       "Watch for five minutes: the towels darken as water climbs them. Name what is happening — paper is full of tiny tubes, and water pulls itself up them. That climb is capillary action.",
       "Leave it and check back at fifteen minutes, then near the end of the session. The levels even out, and the empty cups now hold orange, green, and purple — colors nobody poured.",
       "Draw the before and after in two boxes and label them. Compare with the prediction. The rainbow arrived by walking, one towel at a time."],
      "Three cups only — color, empty, color — with one bridge each way into the middle.",
      "Race the bridges: paper towel against tissue against a strip of cloth. Same heights, same colors, chart which material walks water fastest.",
      safety="Food coloring stains skin and clothes for a day — sleeves up, cups stay on the tray, and colored water is never for drinking.",
      tags=STP, copy_free=True),

    A("irish-reel-steps", "Irish Reel Steps",
      "Point, hop, travel — learn the first steps of an Irish reel and dance an eight-bar phrase as one group.",
      ["music-rhythm", "pe-movement"], (6, 12), (6, 30), (20, 30), ["indoor", "outdoor"],
      ["a way to play music (any reel at a steady, moderate tempo)"],
      False, "Clear the floor completely and pick a reel track at a tempo a beginner's feet can keep. Teach the stance first: feet turned out a little, arms resting at your sides — in Irish dance the upper body stays quiet and the feet do the talking.",
      ["Set the scene in one breath: the reel is Ireland's dance music, played fast and bright at gatherings for centuries. Today we learn its real first steps, slowly, in our own shoes.",
       "Step one, in place: point the right foot forward, hop, point the left, hop — four counts each side, to the music, until nobody has to look down.",
       "Step two, travel: step, close, step, hop sideways along an imaginary line, then back the other way. Four bars out, four bars home.",
       "Join hands in one big circle and run the whole eight-bar phrase together — points in place, travel around the circle. The circle forgives mistakes; keep moving and rejoin on the next bar.",
       "Cool down at half tempo, then sit: whose feet are tired? That tired is hundreds of years of dancers agreeing with you."],
      "In-place steps only, holding the circle's hands the whole time — balance and timing both come from the group.",
      "Add a promenade step in pairs, or let a confident group arrange its own eight bars from the steps it knows and teach them to the rest.",
      safety="Shoes that stay on, a clear floor, and a body's width between dancers — hopping traffic jams are the only real risk here. Anyone may mark the steps seated, feet tapping, and it counts in full.",
      tags=STP, copy_free=True, no_elimination=True,
      inclusion="Teach it as Ireland's real dance tradition — the actual steps and music, learned properly, in your own clothes. No costumes, no put-on accents, and no leprechaun jokes standing in for the culture."),
]


def tokens(s):
    return set(re.findall(r"[a-z0-9]+", s.lower()))


def main():
    path = os.path.join(DATA, "activities.json")
    acts = json.load(open(path))
    existing = {a["id"] for a in acts}
    # Near-duplicate screen: token Jaccard on name+tagline vs everything.
    corpus = [(a["id"], tokens(a["name"] + " " + a["tagline"])) for a in acts]
    for rec in PACK:
        t = tokens(rec["name"] + " " + rec["tagline"])
        worst, wid = 0.0, None
        for oid, ot in corpus:
            j = len(t & ot) / max(1, len(t | ot))
            if j > worst:
                worst, wid = j, oid
        print(f"jaccard {rec['id']}: worst {worst:.2f} vs {wid}")
        assert worst < 0.55, f"near-duplicate: {rec['id']} vs {wid} ({worst:.2f})"
    added = 0
    for rec in PACK:
        if rec["id"] in existing:
            print("skip (exists):", rec["id"])
            continue
        acts.append(rec)
        existing.add(rec["id"])
        added += 1
    json.dump(acts, open(path, "w"), indent=1, ensure_ascii=False)
    print(f"added {added} activities; total now {len(acts)}")


if __name__ == "__main__":
    main()
