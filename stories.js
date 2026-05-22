export const stories = [
  {
    id: "dragon-bridge",
    shortTitle: "Dragon Bridge",
    title: "The Dragon on the Old Bridge",
    kicker: "A tale of listening",
    illustration: "dragon",
    pages: [
      {
        title: "An Unexpected Meeting",
        body: [
          "Toward evening, Sir Gustaw and little Oliwia stood before an old bridge, the kind packhorses with panniers, millers with sacks, and children carrying milk to the village had crossed since anyone could remember.",
          "Moss grew between the stones, soft as a green blanket; a brook whispered beneath the arches; and there, in the very middle, sat a small copper dragon. To their surprise, it looked deeply worried.",
          "It did not roar. It did not frighten anyone. It only held its paws beneath its chin and wrapped its tail around one loose stone, as if guarding something very fragile."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-intro-raster.png",
        artAnimation: "cover-bridge",
        cue: "lantern",
        visual: "bridge",
        choices: [],
        parentPrompt: "How can you tell that the dragon may be worried about something?",
        curiosityNote: {
          title: "Did you know...?",
          body: "Old stone bridges were often built from many wedge-shaped stones. The middle stone helped the arch hold its shape, almost like a quiet keeper of the road."
        },
        virtue: "wonder"
      },
      {
        title: "A Voice Below the Bridge",
        body: [
          "The dragon breathed out a puff small enough to fit inside a milk cup. It was golden at the edges and drifted under the bridge slowly, very slowly.",
          "Then from beneath the stones came a tiny sound: peep, peep, peep. The brook almost covered it, and the wind stirred the reeds as if they, too, wanted to hear more.",
          "Gustaw did not take a step. He rested his shield against his knee and took a calm breath, and Oliwia did the same, showing that sometimes courage begins with quiet."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-smoke-thread-closeup.png",
        artAnimation: "smoke-thread",
        cue: "breath",
        visual: "smoke",
        choices: [
          {
            id: "ask",
            label: "Ask what happened",
            response: "A gentle question gives the dragon courage to show what it is guarding."
          },
          {
            id: "listen",
            label: "Wait and listen",
            response: "The quiet helps Oliwia hear the smallest peep beneath the bridge."
          }
        ],
        parentPrompt: "Why is it sometimes good to listen first?",
        virtue: "patience"
      },
      {
        title: "The Stone's Secret",
        body: [
          "Oliwia knelt by the edge of the bridge and found a nest of river mice tucked between moss, lime, and tiny grass roots.",
          "The smallest mouse had hidden behind a stone warmed by the dragon's breath. The dragon was afraid that heavy boots would shake the bridge and scare the little family.",
          "The road had not been closed in anger. The bridge simply held a secret, and the dragon was guarding those too small to call for help on their own."
        ],
        echoes: {
          1: {
            ask: "After the gentle question, the dragon tapped the stone twice with one claw and carefully pointed to the place where everyone should look.",
            listen: "Thanks to patient listening, Oliwia found the quietest peep before anyone touched the loose stone."
          }
        },
        visualByChoice: {
          1: {
            ask: "question",
            listen: "sound"
          }
        },
        artByChoice: {
          1: {
            ask: "/assets/illustrations/dragon-bridge/dragon-tale-loose-stone-ask-low.png",
            listen: "/assets/illustrations/dragon-bridge/dragon-tale-loose-stone-listen-low.png"
          }
        },
        artAnimationByChoice: {
          1: {
            ask: "loose-stone-ask",
            listen: "loose-stone-listen"
          }
        },
        cue: "lantern",
        visual: "mice",
        choices: [],
        parentPrompt: "Does the dragon seem different once we know what it is guarding?",
        virtue: "kindness"
      },
      {
        title: "A Plan for the Little Mice",
        body: [
          "The evening grew colder, and mist rose from the brook like a white ribbon. In the mossy crack, the mice trembled their whiskers.",
          "Gustaw held a lantern, Oliwia had half a rye loaf wrapped in linen, and the dragon breathed warmth more gently than one would use a candle flame.",
          "They needed to begin with a small, calm gesture: one that would not frighten the mice and would show the dragon it was not alone on the bridge."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-warm-little-plan-still-life-revised-2.png",
        artAnimation: "warm-plan",
        cue: "lantern",
        visual: "mist",
        choices: [
          {
            id: "lantern",
            label: "Hold up the lantern",
            response: "The lantern light will show where a helping hand can safely reach."
          },
          {
            id: "bread",
            label: "Share warm bread",
            response: "The scent of bread will give the mice courage to come closer."
          }
        ],
        parentPrompt: "What can each helper offer?",
        virtue: "care"
      },
      {
        title: "Help Comes From the Mill",
        body: [
          "Gustaw planted a red pennant by the path to the mill. The cloth stirred in the wind, and the waterwheel splashed as if whispering: they are coming, they are coming.",
          "The miller arrived with sheep's wool, the village baker with a clean kerchief, and the basket maker with an armful of reeds smelling of rain. Each one carried something different.",
          "No one laughed because the matter was small or unimportant. A village that can care for tiny creatures learns how to care for great matters too."
        ],
        echoes: {
          3: {
            lantern: "After the lantern was lifted, everyone saw where the stones were loose and where a hand could safely rest.",
            bread: "After the bread was shared, the mice poked out their noses toward the crumbs while Oliwia hummed to them very, very softly."
          }
        },
        cueByChoice: {
          3: {
            lantern: "lantern",
            bread: "banner"
          }
        },
        visualByChoice: {
          3: {
            lantern: "lantern",
            bread: "bread"
          }
        },
        artByChoice: {
          3: {
            lantern: "/assets/illustrations/dragon-bridge/dragon-tale-friends-mill-lantern-path.png",
            bread: "/assets/illustrations/dragon-bridge/dragon-tale-friends-mill-bread-close.png"
          }
        },
        artAnimationByChoice: {
          3: {
            lantern: "friends-lantern",
            bread: "friends-bread"
          }
        },
        cue: "banner",
        visual: "mill",
        choices: [],
        parentPrompt: "What help did each person offer?",
        curiosityNote: {
          title: "Did you know...?",
          body: "Many medieval mills stood beside streams because moving water could turn a great wheel. That wheel helped grind grain into flour for the whole village."
        },
        virtue: "friendship"
      },
      {
        title: "A Cradle of Reeds and Moss",
        body: [
          "The basket maker wove a cradle from reeds, wool, and dry moss. It was round as a nutshell and light as a spring leaf.",
          "The dragon lowered its snout and warmed it with one tiny breath. The mice blinked, their whiskers trembling, but not one of them ran.",
          "Now the nest had to move from stone to basket. For such a task, hands had to be careful, and hearts calmer still."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-basket-bridge-craft.png",
        artAnimation: "basket-craft",
        cue: "breath",
        visual: "wool",
        choices: [
          {
            id: "basket-maker",
            label: "Ask the basket maker to come closer",
            response: "The basket maker will show how to place the cradle most gently."
          },
          {
            id: "carry-together",
            label: "Carry the nest together",
            response: "Several steady hands will help the mice make their short journey."
          }
        ],
        parentPrompt: "How can you tell someone is helping carefully?",
        curiosityNote: {
          title: "Did you know...?",
          body: "Reeds are light, bendy plants that grow near water. People have used them for baskets, mats, roofs, and tiny woven things for a very long time."
        },
        virtue: "patience"
      },
      {
        title: "The Little Paws Move Home",
        body: [
          "The first mouse stepped onto the wool. Then the second. Last came the smallest one, round as a hazelnut, following the dragon's warm nose.",
          "Oliwia kept her hands open and still. 'All is well,' she whispered. Gustaw slid his shield beneath the basket so no one could fall.",
          "When the cradle reached the dry grass, the dragon blinked slowly. That is how bridge dragons say thank you when they do not want to wake or startle anyone."
        ],
        echoes: {
          5: {
            "basket-maker": "The basket maker stepped closer and showed Oliwia how to tilt the cradle without letting a single reed slip.",
            "carry-together": "With everyone carrying together, all the helpers slowed down to the pace of the smallest mouse."
          }
        },
        virtueByChoice: {
          5: {
            "basket-maker": "careful kindness",
            "carry-together": "shared courage"
          }
        },
        visualByChoice: {
          5: {
            "basket-maker": "basket",
            "carry-together": "footsteps"
          }
        },
        artByChoice: {
          5: {
            "basket-maker": "/assets/illustrations/dragon-bridge/dragon-tale-tiny-footsteps-basket-maker.png",
            "carry-together": "/assets/illustrations/dragon-bridge/dragon-tale-tiny-footsteps-carry-together.png"
          }
        },
        artAnimationByChoice: {
          5: {
            "basket-maker": "tiny-footsteps-maker",
            "carry-together": "tiny-footsteps-carry"
          }
        },
        cue: "glint",
        visual: "mice",
        choices: [],
        parentPrompt: "Who is quietly brave in this scene?",
        virtue: "courage"
      },
      {
        title: "A Promise on the Old Bridge",
        body: [
          "When the mice were safe, the dragon moved aside. The bridge opened again, but nobody hurried across it.",
          "Gustaw's sword shone in its scabbard. Not because anyone had won, but because a promise had been kept for someone smaller.",
          "The book rustled one page. It wanted to know how to remember this moment before the path led onward toward an inn full of candles."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-promise-path.png",
        artAnimation: "promise-path",
        cue: "glint",
        visual: "oath",
        choices: [
          {
            id: "name-promise",
            label: "Name the promise",
            response: "The book will write the promise in a thin golden line."
          },
          {
            id: "wave-goodnight",
            label: "Wave goodnight",
            response: "The dragon answers with one warm, sleepy blink."
          }
        ],
        parentPrompt: "What promise can be made to small creatures?",
        virtue: "loyalty"
      },
      {
        title: "The Bridge Opens Again",
        body: [
          "The villagers crossed the bridge one by one. Each looked down to where the new mouse cradle rested among the reeds.",
          "The dragon curled on the warm stone. It looked smaller now than when everyone had feared it, but not less important.",
          "Oliwia understood that a closed road is sometimes a question. And the best answer is not to push forward, but first to listen and understand."
        ],
        echoes: {
          7: {
            "name-promise": "After the promise was named, golden words appeared on the ground beside the bridge: every small life on the road matters.",
            "wave-goodnight": "After the goodnight wave, the dragon blinked once more and warmed three sleepy flowers beside the path."
          }
        },
        visualByChoice: {
          7: {
            "name-promise": "question",
            "wave-goodnight": "sound"
          }
        },
        artByChoice: {
          7: {
            "name-promise": "/assets/illustrations/dragon-bridge/dragon-tale-lanterns-water-name-promise-revised.png",
            "wave-goodnight": "/assets/illustrations/dragon-bridge/dragon-tale-lanterns-water-wave-goodnight.png"
          }
        },
        artAnimationByChoice: {
          7: {
            "name-promise": "promise-name",
            "wave-goodnight": "promise-wave"
          }
        },
        cue: "lantern",
        visual: "flowers",
        choices: [],
        parentPrompt: "What changed when everyone understood what the dragon meant?",
        virtue: "wisdom"
      },
      {
        title: "What the Book Remembered",
        body: [
          "Long after the candles burned low, the bridge still stood for what had happened there: a dragon, a reed cradle, and river mice sleeping safely by the bank.",
          "On the final page, the book wrote quietly: strength can shelter, courage can listen, and kindness can open even the oldest road.",
          "The end."
        ],
        echoes: {
          7: {
            "name-promise": "After the promise was named, the last page kept those golden words beside the sleeping brook.",
            "wave-goodnight": "After the goodnight wave, the last page remembered the dragon's blink like a little star."
          }
        },
        visualByChoice: {
          7: {
            "name-promise": "basket",
            "wave-goodnight": "lantern"
          }
        },
        artByChoice: {
          7: {
            "name-promise": "/assets/illustrations/dragon-bridge/dragon-tale-ending-name-promise-revised-2.png",
            "wave-goodnight": "/assets/illustrations/dragon-bridge/dragon-tale-ending-wave-goodnight-revised.png"
          }
        },
        artAnimationByChoice: {
          7: {
            "name-promise": "ending-name",
            "wave-goodnight": "ending-wave"
          }
        },
        cue: "glint",
        visual: "stars",
        choices: [],
        parentPrompt: "Which choice from this tale is worth remembering?",
        virtue: "gentleness",
        ending: true
      }
    ]
  },
  {
    id: "moonhill-bell",
    shortTitle: "Moonhill Bell",
    title: "The Bell of Moonhill",
    kicker: "A tale of mending",
    illustration: "bell",
    pages: [
      {
        title: "When the Bell Did Not Call",
        body: [
          "In Moonhill, the evening bell always called people home when blue supper smoke rose from chimneys and hens found their roosts in the yards.",
          "But that evening the bell tower stayed silent. Families gathered in wool shawls with horn lanterns and turned their eyes and ears toward the place where sound should have come from.",
          "Gustaw laid a hand on his shield, while Oliwia noticed Koniczynka, his patient mare, pointing her nose toward the path to the old orchard, where moths shone like silver leaves."
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-quiet-tower.png",
        artAnimation: "moonhill-quiet-tower",
        cue: "lantern",
        visual: "tower",
        choices: [],
        parentPrompt: "What helps you feel calm when something expected does not happen?",
        curiosityNote: {
          title: "Did you know...?",
          body: "Before clocks were common, village bells helped people know when to gather, work, rest, or come home. A bell could be the voice of the whole village."
        },
        virtue: "wonder"
      },
      {
        title: "Two Ways Into the Mystery",
        body: [
          "The reeve thought of the tower key he had. The baker looked toward the bell rope. The children watched the orchards, because Koniczynka kept gazing between the pear trees.",
          "Oliwia felt a small worry in her belly, but she listened to everyone. A mystery grows smaller when every idea can be talked through together.",
          "They could follow the horse's nose toward the silver moths. Or they could ask the village elders whether the mountain wind had played such tricks before."
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-two-ways-to-begin.png",
        artAnimation: "moonhill-two-ways",
        cue: "banner",
        visual: "orchard",
        choices: [
          {
            id: "follow-clover",
            label: "Follow Koniczynka",
            response: "Koniczynka leads everyone to the place where silver moths are flickering."
          },
          {
            id: "ask-elders",
            label: "Ask the elders",
            response: "The elders remember an old mischief of the hill wind."
          }
        ],
        parentPrompt: "Which idea is worth listening to first?",
        virtue: "respect"
      },
      {
        title: "The Rope in the Pear Tree",
        body: [
          "Behind the tower, the bell rope had slipped through an open shutter and tangled high among the branches of the old pear tree after a windy afternoon.",
          "A nest of finches slept nearby, tucked into leaves that smelled of rain and fruit. If anyone pulled too hard, the branch would shake like a frightened finger.",
          "The bell was not lost, and it had not turned cross with the village. It was waiting for helpers who would look carefully before doing anything at all."
        ],
        echoes: {
          1: {
            "follow-clover": "On the path after Koniczynka, everyone saw pear leaves caught on the rope before the light began to fade.",
            "ask-elders": "After speaking with the elders, Grandmother Janina remembered the branch that bends toward the tower whenever the mountain wind blows."
          }
        },
        visualByChoice: {
          1: {
            "follow-clover": "hoofprints",
            "ask-elders": "elder-scroll"
          }
        },
        artByChoice: {
          1: {
            "follow-clover": "/assets/illustrations/moonhill-bell/moonhill-pear-rope-follow-clover.png",
            "ask-elders": "/assets/illustrations/moonhill-bell/moonhill-pear-rope-ask-elders.png"
          }
        },
        artAnimationByChoice: {
          1: {
            "follow-clover": "moonhill-rope-clover",
            "ask-elders": "moonhill-rope-elders"
          }
        },
        cue: "lantern",
        visual: "rope",
        choices: [],
        parentPrompt: "How did the problem feel different once everyone could see it clearly?",
        curiosityNote: {
          title: "Did you know...?",
          body: "Pear trees can live for many years, and their spring blossoms are loved by bees. In old villages, an orchard was both a pantry and a little shelter for birds."
        },
        virtue: "patience"
      },
      {
        title: "Quiet by the Nest",
        body: [
          "The carpenter brought an ash ladder and set it down so quietly that even the stones by the wall seemed not to hear it.",
          "The village baker wrapped the lowest rung in cloth, Oliwia watched the fluffy nest, and Koniczynka stood still as if even her tail knew how to keep silence.",
          "The rope had to be freed. But how could the village be strong and gentle at the same time beside sleeping birds?"
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-sleeping-finches.png",
        artAnimation: "moonhill-sleeping-finches",
        cue: "notes",
        visual: "finches",
        choices: [
          {
            id: "move-slowly",
            label: "Move slowly",
            response: "Slow movements will let the finches keep sleeping."
          },
          {
            id: "steady-ladder",
            label: "Hold the ladder steady",
            response: "A steady ladder will help everyone work calmly."
          }
        ],
        parentPrompt: "When can patience be a virtue?",
        virtue: "care"
      },
      {
        title: "The Freed Rope",
        body: [
          "Loop by loop, the rope loosened. One pear leaf fell onto Oliwia's sleeve, and she tucked it between the pages of the book like an important sign.",
          "When the last knot slipped free, everyone smiled without shouting. The finches kept sleeping, warm beneath their mother's wing.",
          "The rope hung from the tower again, but when the carpenter pulled it gently, they heard only a dry knock, as if the bell had cleared its throat and gone quiet."
        ],
        echoes: {
          3: {
            "move-slowly": "Thanks to the slow movements, the finches did not wake while Oliwia untangled the final loop.",
            "steady-ladder": "Thanks to the steady ladder, the carpenter reached the knot and lowered the rope with both hands."
          }
        },
        cueByChoice: {
          3: {
            "move-slowly": "notes",
            "steady-ladder": "bell"
          }
        },
        visualByChoice: {
          3: {
            "move-slowly": "finches",
            "steady-ladder": "ladder"
          }
        },
        artByChoice: {
          3: {
            "move-slowly": "/assets/illustrations/moonhill-bell/moonhill-untangled-rope-move-slowly.png",
            "steady-ladder": "/assets/illustrations/moonhill-bell/moonhill-untangled-rope-steady-ladder.png"
          }
        },
        artAnimationByChoice: {
          3: {
            "move-slowly": "moonhill-untangle-slow",
            "steady-ladder": "moonhill-untangle-ladder"
          }
        },
        cue: "bell",
        visual: "pear-leaf",
        choices: [],
        parentPrompt: "How did the helpers protect the birds while solving the mystery?",
        virtue: "gentleness"
      },
      {
        title: "The Crack in the Bell",
        body: [
          "Inside the tower, along the rim of the bronze bell, lay a crack as thin as a strand of hair. The lantern had to be brought very close before anyone could see it.",
          "The carpenter touched the bell with two fingers and nodded. 'Tonight we will not be angry about this. Tonight we will help it find its voice again.'",
          "Someone knew metal, someone knew songs, someone knew how to hold a ladder, and someone simply knew how to give courage when things became difficult."
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-small-crack.png",
        artAnimation: "moonhill-small-crack",
        cue: "bell",
        visual: "crack",
        choices: [
          {
            id: "invite-smith",
            label: "Invite the blacksmith",
            response: "The blacksmith will bring a small hammer and shining rivets."
          },
          {
            id: "thank-bell",
            label: "Thank the quiet bell",
            response: "The bell will be treated like an old friend, not a problem."
          }
        ],
        parentPrompt: "How is searching for the problem different from searching for the solution?",
        curiosityNote: {
          title: "Did you know...?",
          body: "Many old bells were cast from bronze, a metal made by mixing copper with tin. Bronze can ring with a warm voice that travels far through the air."
        },
        virtue: "honesty"
      },
      {
        title: "The Village Mends the Bell",
        body: [
          "By candlelight and moonlight, the villagers worked in a circle. The blacksmith tapped softly, the carpenter steadied the beam, and the village baker passed oat rolls from hand to hand.",
          "Oliwia polished the bell with linen until the lantern light gleamed inside it. Below, Koniczynka listened for any tone that might finally come from above.",
          "The silent tower became a workshop, and the workshop looked like a family gathered around something no one wanted to leave alone."
        ],
        echoes: {
          5: {
            "invite-smith": "After the blacksmith was invited, her small hammer tapped a calm rhythm beneath the wooden beams.",
            "thank-bell": "After the bell was thanked, everyone worked as if helping an old friend recover its voice."
          }
        },
        virtueByChoice: {
          5: {
            "invite-smith": "cooperation",
            "thank-bell": "gratitude"
          }
        },
        visualByChoice: {
          5: {
            "invite-smith": "smith-tools",
            "thank-bell": "heart"
          }
        },
        artByChoice: {
          5: {
            "invite-smith": "/assets/illustrations/moonhill-bell/moonhill-mending-invite-smith.png",
            "thank-bell": "/assets/illustrations/moonhill-bell/moonhill-mending-thank-bell.png"
          }
        },
        artAnimationByChoice: {
          5: {
            "invite-smith": "moonhill-mending-smith",
            "thank-bell": "moonhill-mending-thanks"
          }
        },
        cue: "notes",
        visual: "workshop",
        choices: [],
        parentPrompt: "How many different ways of helping can you see here?",
        virtue: "community"
      },
      {
        title: "Welcoming the New Voice",
        body: [
          "At last the bell was ready. It would not sound as loudly as before, but the blacksmith smiled: 'A quiet voice can still call people home.'",
          "The moon shone above the tower. The finches stirred in the orchard, and the children in the square held their breath as if the whole village were listening and patiently waiting.",
          "The book waited for one last gesture. How should everyone welcome the new voice of the bell they all needed?"
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-first-new-sound.png",
        artAnimation: "moonhill-first-sound",
        cue: "bell",
        visual: "moon",
        choices: [
          {
            id: "ring-gently",
            label: "Ring gently",
            response: "The village will hear a sound that is quiet, yet just as it should be."
          },
          {
            id: "share-song",
            label: "Hum with the bell",
            response: "The neighbors' voices will join the sound of the bell."
          }
        ],
        parentPrompt: "How can something changed still be beautiful?",
        virtue: "courage"
      },
      {
        title: "The Bell Sounds Different",
        body: [
          "The bell sounded more softly than before, yet its voice was bright and pleasant. It did not travel across the whole valley, but it filled the village from window to window.",
          "Parents, children, elders, the baker, the blacksmith, the carpenter, and very proud Koniczynka listened together; she had a white mark of flour on her nose.",
          "Moonhill remembered that community is not only those who sit together at the table. It is also those who stay to mend the table."
        ],
        echoes: {
          7: {
            "ring-gently": "After the gentle ringing, the first note crossed the rooftops like a candle passed from window to window.",
            "share-song": "After the shared humming, the first note filled with many voices, soft enough not to startle the finches."
          }
        },
        virtueByChoice: {
          7: {
            "ring-gently": "tender courage",
            "share-song": "belonging"
          }
        },
        visualByChoice: {
          7: {
            "ring-gently": "heart",
            "share-song": "finches"
          }
        },
        artByChoice: {
          7: {
            "ring-gently": "/assets/illustrations/moonhill-bell/moonhill-softer-ring-ring-gently.png",
            "share-song": "/assets/illustrations/moonhill-bell/moonhill-softer-ring-share-song.png"
          }
        },
        artAnimationByChoice: {
          7: {
            "ring-gently": "moonhill-ring-gently",
            "share-song": "moonhill-share-song"
          }
        },
        cue: "notes",
        visual: "square",
        choices: [],
        parentPrompt: "What can we learn when everyone listens together?",
        virtue: "peace"
      },
      {
        title: "A Goodnight Song",
        body: [
          "Long after supper, the bell rested high above the village. Its mended rim shone faintly in the moonlight.",
          "Moonhill remembered that what is quiet is not without meaning. Sometimes it is only waiting for careful hands, patient friends, and a gentle song toward a new beginning.",
          "The end."
        ],
        echoes: {
          7: {
            "ring-gently": "After the gentle ringing, the last page kept one silver note above the rooftops, like a magical symbol of listening.",
            "share-song": "After the shared song, the last page remembered the village as a choir of good neighbors."
          }
        },
        virtueByChoice: {
          7: {
            "ring-gently": "gentleness",
            "share-song": "gratitude"
          }
        },
        visualByChoice: {
          7: {
            "ring-gently": "heart",
            "share-song": "elder-scroll"
          }
        },
        artByChoice: {
          7: {
            "ring-gently": "/assets/illustrations/moonhill-bell/moonhill-last-ring-ring-gently.png",
            "share-song": "/assets/illustrations/moonhill-bell/moonhill-last-ring-share-song.png"
          }
        },
        artAnimationByChoice: {
          7: {
            "ring-gently": "moonhill-ending-ring",
            "share-song": "moonhill-ending-song"
          }
        },
        cue: "notes",
        visual: "moon",
        choices: [],
        parentPrompt: "Which helper would you thank first, and what would you say?",
        virtue: "gratitude",
        ending: true
      }
    ]
  }
];
