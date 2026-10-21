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
          "Toward evening, Sir Gustaw and little Oliwia came to an old stone bridge. For as long as anyone could remember, packhorses with saddlebags, millers with sacks of flour and children carrying milk to the village had crossed it.",
          "Moss grew between the stones, soft as a green blanket, and a brook murmured under its single arch. In the very middle of the bridge sat a small copper dragon. It did not look fierce at all. It looked worried.",
          "It did not roar, and it frightened no one. It sat up straight with its front paws resting on the wall and its tail curled around one loose stone, as if it were guarding something very fragile."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-intro-raster.webp",
        artAnimation: "cover-bridge",
        cue: "lantern",
        visual: "bridge",
        choices: [],
      },
      {
        title: "A Voice Below the Bridge",
        body: [
          "The dragon sighed and let out a puff so small it could have fitted in a milk cup. The puff was golden at the edges, and it drifted down under the bridge slowly, ever so slowly.",
          "Then, from beneath the stones, came a tiny sound: peep, peep, peep. The brook nearly drowned it out, and the reeds leaned in the wind as if they wanted to listen too.",
          "Gustaw did not take a single step. He rested his shield against his knee and breathed slowly. Oliwia breathed with him, and she never took her eyes off the dragon."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-smoke-thread-closeup.webp",
        artAnimation: "smoke-thread",
        cue: "breath",
        visual: "smoke",
        choices: [
          {
            id: "ask",
            label: "Ask what happened",
            response: "A gentle question will give the dragon courage to show what it is guarding."
          },
          {
            id: "listen",
            label: "Wait and listen",
            response: "In the quiet, Oliwia will hear the faintest peep beneath the bridge."
          }
        ],
      },
      {
        title: "The Stone's Secret",
        body: [
          "Oliwia knelt at the edge of the bridge and found a nest of river mice, tucked in among moss, lime and tiny grass roots.",
          "The smallest mouse was hiding behind a pebble warmed by the dragon's breath. The dragon was afraid that heavy boots would shake the bridge and frighten the little family out of their home.",
          "The dragon had not closed the road on a whim. The bridge had a secret, and the dragon was guarding those too small to call for help themselves."
        ],
        echoes: {
          1: {
            ask: "Oliwia asked gently, so the dragon answered.",
            listen: "Oliwia listened so quietly that the book heard the smallest voice."
          }
        },
        paragraphByChoice: {
          1: {
            ask: {
              0: "When Oliwia gently asked what was wrong, the dragon tapped one claw on the loose stone and carefully lifted its edge.",
              1: "Underneath, Oliwia saw a nest of river mice, tucked in among moss, lime and tiny grass roots. The smallest mouse was hiding behind a pebble warmed by the dragon's breath."
            },
            listen: {
              0: "Oliwia waited in silence until the peep came again. It came from the edge of the bridge, where moss covered a narrow crack between the stones.",
              1: "Inside was a nest of river mice, tucked in among lime and tiny grass roots. The smallest mouse was shivering behind a pebble warmed by the dragon's breath."
            }
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
            ask: "/assets/illustrations/dragon-bridge/dragon-tale-loose-stone-ask-low.webp",
            listen: "/assets/illustrations/dragon-bridge/dragon-tale-loose-stone-listen-low.webp"
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
      },
      {
        title: "A Plan for the Little Mice",
        body: [
          "The evening grew chilly, and mist rose from the brook like a white ribbon. In the mossy crack, the mice trembled and twitched their whiskers.",
          "Gustaw held a lantern, Oliwia held half a loaf of rye bread wrapped in linen, and the dragon breathed out warmth so gently it would not have blown out a candle.",
          "They had to begin with something small and calm: a gesture that would not frighten the mice and would show the dragon it could trust them."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-warm-little-plan-still-life-revised-2.webp",
        artAnimation: "warm-plan",
        cue: "lantern",
        visual: "mist",
        choices: [
          {
            id: "lantern",
            label: "Hold up the lantern",
            response: "The lantern light will show where a hand can safely reach."
          },
          {
            id: "bread",
            label: "Share the warm bread",
            response: "The smell of bread will give the mice courage."
          }
        ],
      },
      {
        title: "Help Comes From the Mill",
        body: [
          "Gustaw planted a red pennant by the path to the mill. It fluttered in the wind, and the people in the village saw that something important was happening on the bridge.",
          "Soon the miller came with an armful of sheep's wool, the baker with a clean kerchief, and the basket maker with a bundle of reeds that smelled of rain. Each of them brought something different.",
          "Nobody laughed because the matter was so small. A village that can look after tiny creatures can manage great things too."
        ],
        echoes: {
          3: {
            lantern: "The lantern was held high, so the helpers could see where to stand.",
            bread: "The bread was shared, so the mice dared to peek out."
          }
        },
        paragraphByChoice: {
          3: {
            lantern: {
              0: "Gustaw planted a red pennant by the path to the mill and held his lantern high. Its light showed the safest stones under the moss, and the pennant gave the village a sign.",
              1: "Soon the miller came with an armful of sheep's wool, the baker with a clean kerchief, and the basket maker with a bundle of reeds that smelled of rain. In the bright light, each of them knew where to step."
            },
            bread: {
              0: "Gustaw planted a red pennant by the path to the mill, while crumbs of warm bread waited beside the mossy crack. The pennant fluttered and gave the village a sign.",
              1: "The mice smelled the bread and poked out their noses just as the miller arrived with sheep's wool, the baker with a clean kerchief, and the basket maker with reeds that smelled of rain."
            }
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
            lantern: "/assets/illustrations/dragon-bridge/dragon-tale-friends-mill-lantern-path.webp",
            bread: "/assets/illustrations/dragon-bridge/dragon-tale-friends-mill-bread-close.webp"
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
        curiosityNoteByChoice: {
          3: {
            lantern: {
              title: "Did you know...?",
              body: "Old lanterns had no glass panes, because glass cost a great deal. Instead they had thin sheets of cow horn, scraped so fine that a warm golden light shone through."
            },
            bread: {
              title: "Did you know...?",
              body: "In the Middle Ages, a thick slice of stale bread often served as a plate. Meat and porridge were heaped on top, and after the feast the bread plate went to the poor or to the dogs."
            }
          }
        },
      },
      {
        title: "A Cradle of Reeds and Moss",
        body: [
          "The basket maker wove a cradle from reeds, wool and dry moss. It came out as round as a nutshell and as light as a spring leaf.",
          "The dragon lowered its snout and warmed the cradle with one tiny breath. The mice blinked and their whiskers quivered, but not one of them ran away.",
          "Now the nest had to move from the stone into the cradle. A move like that needs careful hands and even calmer hearts."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-basket-bridge-craft.webp",
        artAnimation: "basket-craft",
        cue: "breath",
        visual: "wool",
        choices: [
          {
            id: "crumbs",
            label: "Lay a trail of crumbs",
            response: "Crumbs of bread will lead the mice straight onto the soft wool."
          },
          {
            id: "warm-path",
            label: "Ask the dragon for a warm path",
            response: "The dragon will warm the stones, and the mice will walk across them as if on a rug."
          }
        ],
      },
      {
        title: "The Little Paws Move Home",
        body: [
          "The first mouse stepped onto the wool. Then the second. Last of all came the smallest, round as a hazelnut, following the dragon's warm nose.",
          "Oliwia kept her hands open and still. “There now,” she whispered. Gustaw slid his shield under the cradle so that no one could fall.",
          "When the cradle was resting in the dry grass by the bank, the dragon blinked slowly. That is how bridge dragons say thank you when they do not want to wake or startle anyone."
        ],
        echoes: {
          5: {
            crumbs: "Oliwia laid a trail of crumbs, so the mice found the cradle all by themselves.",
            "warm-path": "The dragon warmed the stones, so the mice walked on warmth."
          }
        },
        paragraphByChoice: {
          5: {
            crumbs: {
              0: "Oliwia crumbled the crust of her bread and laid a trail of crumbs from the crack all the way to the cradle. The first mouse followed it, crumb by crumb, until it stepped onto the wool. Then the second. The smallest stopped at every single crumb and ate it up.",
              1: "“There now,” Oliwia whispered. When all three were snug inside, the basket maker lifted the cradle ever so gently, and Gustaw slid his shield underneath so that no one could fall."
            },
            "warm-path": {
              0: "The dragon leaned over the bridge and breathed on the stones, one after another, from the crack all the way to the cradle. The stones grew warm and shone a soft gold. The first mouse crossed them as if on a rug and stepped onto the wool. Then the second.",
              1: "The smallest came last, following the dragon's warm nose. When all three were snug inside, the basket maker lifted the cradle ever so gently, and Gustaw slid his shield underneath so that no one could fall."
            }
          }
        },
        visualByChoice: {
          5: {
            crumbs: "basket",
            "warm-path": "footsteps"
          }
        },
        artByChoice: {
          5: {
            crumbs: "/assets/illustrations/dragon-bridge/dragon-tale-tiny-footsteps-basket-maker.webp",
            "warm-path": "/assets/illustrations/dragon-bridge/dragon-tale-tiny-footsteps-carry-together.webp"
          }
        },
        artAnimationByChoice: {
          5: {
            crumbs: "tiny-footsteps-maker",
            "warm-path": "tiny-footsteps-carry"
          }
        },
        cue: "glint",
        visual: "mice",
        choices: [],
        curiosityNote: {
          title: "Did you know...?",
          body: "Reeds are not only for baskets. Long ago, people thatched their roofs with them, and a well-laid reed roof could keep the rain out for several decades."
        },
      },
      {
        title: "A Promise on the Old Bridge",
        body: [
          "When the mice were safe, the dragon stepped off the road. The bridge was open again, but nobody rushed across it.",
          "Gustaw's sword gleamed in its scabbard. Not because anyone had won a battle, but because someone smaller had been helped.",
          "The book rustled a page. It wanted to see how they would say goodbye before the path led the travellers on to an inn full of candles."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-promise-path.webp",
        artAnimation: "promise-path",
        cue: "glint",
        visual: "oath",
        choices: [
          {
            id: "name-promise",
            label: "Thank the dragon",
            response: "The dragon will give a gift that stays with the bridge."
          },
          {
            id: "wave-goodnight",
            label: "Wave goodnight",
            response: "The dragon will blink sleepily and fall asleep for the first time in ages."
          }
        ],
      },
      {
        title: "The Bridge Opens Again",
        body: [
          "The villagers crossed the bridge one by one. Each of them glanced down to where the new mouse cradle sat among the reeds.",
          "The dragon curled up on a warm stone. It seemed smaller now than when everyone had been afraid of it, but it was still keeping watch nearby.",
          "Oliwia understood that a closed road is sometimes waiting for a question. And that before you push on, it is best to listen first."
        ],
        echoes: {
          7: {
            "name-promise": "The dragon was thanked, so it left the bridge one of its scales.",
            "wave-goodnight": "Oliwia waved goodnight, so the dragon could sleep at last."
          }
        },
        paragraphByChoice: {
          7: {
            "name-promise": {
              0: "The dragon gave the bridge one of its own copper scales and, with a warm breath, set it into the wall right beside the mice's old home. At night the scale glowed like a little lantern. Everyone who crossed the bridge slowed down beside it and went on tiptoe.",
              1: "The dragon kept watch by the cradle with its eyes wide open. It no longer needed to close the road, because now the bridge itself reminded everyone: tread gently, little ones live here."
            },
            "wave-goodnight": {
              0: "The dragon blinked sleepily, curled itself around the cradle and fell asleep, for the first time since the stone had come loose. The villagers tiptoed across the bridge and shushed one another in whispers so as not to wake it.",
              1: "With every sleepy breath, a little golden puff drifted from the dragon's nostrils. The puffs circled over the cradle like warm fireflies, and the mice slept snug all night long."
            }
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
            "name-promise": "/assets/illustrations/dragon-bridge/dragon-tale-lanterns-water-name-promise-revised.webp",
            "wave-goodnight": "/assets/illustrations/dragon-bridge/dragon-tale-lanterns-water-wave-goodnight.webp"
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
        curiosityNote: {
          title: "Did you know...?",
          body: "Long ago, crossing a bridge sometimes cost money. In old Poland this fee was called \"mostowe\", bridge money, and it was meant to pay for mending the bridge."
        },
      },
      {
        title: "What the Book Remembered",
        body: [
          "Long after the candles had gone out at the inn, a dragon slept by the old bridge. Beside it, in a cradle of reeds, the river mice slept too.",
          "On the last page, the book wrote very quietly: strength can shelter, courage can listen, and kindness can open even the oldest road.",
          "The end."
        ],
        echoes: {
          7: {
            "name-promise": "The book remembered the thank-you and the gift.",
            "wave-goodnight": "The book remembered the quiet goodnight."
          }
        },
        paragraphByChoice: {
          7: {
            "name-promise": {
              0: "Long after the candles had gone out at the inn, a dragon kept watch by the old bridge. Beside it, in a cradle of reeds, the river mice slept, and the copper scale glowed in the wall.",
              1: "On the last page, the book wrote very quietly: strength can shelter, courage can listen, and gratitude leaves a light behind for others."
            },
            "wave-goodnight": {
              0: "Long after the candles had gone out at the inn, a dragon slept by the old bridge. Beside it, in a cradle of reeds, the river mice slept too, and little golden puffs of dragon dreams drifted above them.",
              1: "On the last page, the book wrote very quietly: strength can shelter, courage can listen, and even the most faithful guardian can sleep in peace when it knows it is not alone."
            }
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
            "name-promise": "/assets/illustrations/dragon-bridge/dragon-tale-ending-name-promise-revised-2.webp",
            "wave-goodnight": "/assets/illustrations/dragon-bridge/dragon-tale-ending-wave-goodnight-revised.webp"
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
          "In Moonhill, the evening bell called everyone home each day. It rang when blue smoke curled from the chimneys and the hens went looking for their roosts.",
          "But that evening, the bell tower was silent. Families came out into the square in woollen shawls, with horn lanterns in their hands, and everyone looked up and listened.",
          "Gustaw laid a hand on his shield. Meanwhile, Oliwia noticed that Koniczynka, his patient mare, was stretching her nose toward the path to the old orchard, where moths glimmered like silver leaves."
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-quiet-tower.webp",
        artAnimation: "moonhill-quiet-tower",
        cue: "lantern",
        visual: "tower",
        choices: [],
        curiosityNote: {
          title: "Did you know...?",
          body: "Before clocks were common, the village bell told people when to gather, when to work and when to come home. It was the voice of the whole village."
        },
      },
      {
        title: "Two Ways Into the Mystery",
        body: [
          "The reeve thought of the key to the tower. The baker looked at the bell rope. And the children looked toward the orchard, because Koniczynka kept gazing between the pear trees.",
          "Oliwia felt a little knot in her tummy, but she listened to everyone in turn. Soon the whole village was wondering together why the bell was silent and how to help it.",
          "They could follow the mare's nose toward the silver moths. Or they could ask the oldest villagers whether the mountain wind had been up to its tricks."
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-two-ways-to-begin.webp",
        artAnimation: "moonhill-two-ways",
        cue: "banner",
        visual: "orchard",
        choices: [
          {
            id: "follow-clover",
            label: "Follow Koniczynka",
            response: "Koniczynka will lead everyone to where the silver moths are flickering."
          },
          {
            id: "ask-elders",
            label: "Ask the elders",
            response: "The elders remember the old mischief of the mountain wind."
          }
        ],
      },
      {
        title: "The Rope in the Pear Tree",
        body: [
          "Behind the tower they found that, after a windy afternoon, the bell rope had slipped out through an open shutter and tangled itself high in the branches of the old pear tree.",
          "Right beside it, finches slept in a nest hidden among leaves that smelled of rain and fruit. One hard tug, and the little nest could fall from the branch.",
          "The bell was not broken for good, and it was not cross with the village. It was waiting for someone who would look carefully first and only then decide how to help."
        ],
        echoes: {
          1: {
            "follow-clover": "Koniczynka led the way, so the book noticed the signs in the orchard.",
            "ask-elders": "The elders were asked, so the book remembered the old wind."
          }
        },
        paragraphByChoice: {
          1: {
            "follow-clover": {
              0: "Koniczynka led everyone behind the tower, straight to the pear tree. Silver moths were circling the rope tangled high in its branches.",
              1: "Pear leaves clung to the rope, and right beside it finches slept in a nest that smelled of rain and fruit. One hard tug, and the little nest could fall from the branch."
            },
            "ask-elders": {
              0: "Grandmother Janina led everyone behind the tower and pointed to the pear tree that always bends toward the bell tower when a strong wind comes down from the mountains.",
              1: "That was where the rope had tangled, high in the branches, right beside a finch nest hidden among leaves that smelled of rain and fruit. One hard tug, and the little nest could fall."
            }
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
            "follow-clover": "/assets/illustrations/moonhill-bell/moonhill-pear-rope-follow-clover.webp",
            "ask-elders": "/assets/illustrations/moonhill-bell/moonhill-pear-rope-ask-elders.webp"
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
        curiosityNote: {
          title: "Did you know...?",
          body: "Pear trees can live for a very long time, and bees love their spring blossoms. In old villages, an orchard was both a pantry and a shelter for birds."
        },
      },
      {
        title: "Quiet by the Nest",
        body: [
          "The carpenter brought an ash ladder and set it down so softly that not even the stones by the wall heard a thing.",
          "The baker wrapped the bottom rung in cloth, Oliwia kept her eyes on the fluffy nest, and Koniczynka stood perfectly still, as if even her tail knew how to keep quiet.",
          "The rope had to be freed the right way. But how can you be strong and gentle at the same time, with birds asleep right beside you?"
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-sleeping-finches.webp",
        artAnimation: "moonhill-sleeping-finches",
        cue: "notes",
        visual: "finches",
        choices: [
          {
            id: "move-slowly",
            label: "Untangle it slowly",
            response: "Slow hands will let the finches sleep on."
          },
          {
            id: "steady-ladder",
            label: "Hold the ladder steady",
            response: "A steady ladder will let everyone work calmly."
          }
        ],
      },
      {
        title: "The Freed Rope",
        body: [
          "Loop by loop, the rope came loose. A pear leaf drifted down onto Oliwia's sleeve, as if to tell her she had chosen well.",
          "When the last knot slipped free, everyone smiled without a sound. The finches slept on, snug under their mother's wing.",
          "The rope hung from the tower once more. But when the carpenter gave it a gentle pull, there was only a dull clunk, as if the bell had cleared its throat and fallen silent."
        ],
        echoes: {
          3: {
            "move-slowly": "Everyone moved slowly, so the nest stayed quiet.",
            "steady-ladder": "The ladder stood steady, so the rope came down safely."
          }
        },
        paragraphByChoice: {
          3: {
            "move-slowly": {
              0: "Loop by loop, the rope came loose, and every hand moved as slowly as dust drifting in lantern light. A pear leaf drifted down onto Oliwia's sleeve.",
              1: "When the last knot slipped free, everyone smiled without a sound. The finches slept on, snug under their mother's wing."
            },
            "steady-ladder": {
              0: "The ladder stood firm under the carpenter's boots, so he reached the knot without brushing a single branch. A pear leaf drifted down onto Oliwia's sleeve.",
              1: "When the last knot slipped free, the carpenter lowered the rope with both hands. The finches slept on, snug under their mother's wing."
            }
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
            "move-slowly": "/assets/illustrations/moonhill-bell/moonhill-untangled-rope-move-slowly.webp",
            "steady-ladder": "/assets/illustrations/moonhill-bell/moonhill-untangled-rope-steady-ladder.webp"
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
      },
      {
        title: "The Crack in the Bell",
        body: [
          "Inside the tower, along the rim of the bronze bell, ran a crack as thin as a hair. They only saw it when they brought the lantern very close.",
          "The carpenter touched the bell with two fingers and nodded. “No use being cross about it. Tonight we'll help it find its voice again.”",
          "Everyone added something of their own. Someone knew about bells, someone could hold a ladder firmly, and someone simply knew how to cheer the others on when it was needed."
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-small-crack.webp",
        artAnimation: "moonhill-small-crack",
        cue: "bell",
        visual: "crack",
        choices: [
          {
            id: "invite-smith",
            label: "Ask the blacksmith for help",
            response: "The blacksmith will bring a little hammer and shiny rivets."
          },
          {
            id: "thank-bell",
            label: "Thank the bell",
            response: "Everyone will treat the bell like an old friend, not a broken thing."
          }
        ],
        curiosityNote: {
          title: "Did you know...?",
          body: "Old bells were cast from bronze, a metal made by mixing copper with tin. A bronze bell has a warm voice that carries a very long way."
        },
      },
      {
        title: "The Village Mends the Bell",
        body: [
          "By candlelight and moonlight, the villagers worked in a circle. The blacksmith tapped softly, the carpenter held the beam steady, and the baker passed oat rolls from hand to hand.",
          "Oliwia polished the bell with a linen cloth until the lantern light gleamed inside it. Down below, Koniczynka pricked up her ears, listening for any sound from above.",
          "The silent tower became a workshop, and everyone in it looked like a family gathered round someone they would never leave alone."
        ],
        echoes: {
          5: {
            "invite-smith": "The blacksmith came, so the tower filled with careful tapping.",
            "thank-bell": "The bell was thanked, so the work went more cheerfully."
          }
        },
        paragraphByChoice: {
          5: {
            "invite-smith": {
              0: "By candlelight and moonlight, the blacksmith worked in the circle with a little hammer and shiny rivets. The carpenter held the beam steady, and the baker passed oat rolls from hand to hand.",
              1: "Between one careful tap and the next, Oliwia polished the bell with a linen cloth until the lantern light gleamed inside it. Down below, Koniczynka pricked up her ears, listening for any sound from above."
            },
            "thank-bell": {
              0: "By candlelight and moonlight, the villagers first laid their hands on the bell and thanked it for every evening it had called them home.",
              1: "Then Oliwia polished it with a linen cloth, the blacksmith tapped softly and the carpenter held the beam steady. Down below, Koniczynka pricked up her ears, listening for any sound from above."
            }
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
            "invite-smith": "/assets/illustrations/moonhill-bell/moonhill-mending-invite-smith.webp",
            "thank-bell": "/assets/illustrations/moonhill-bell/moonhill-mending-thank-bell.webp"
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
      },
      {
        title: "Welcoming the New Voice",
        body: [
          "At last the bell was ready. It would never ring as loudly as before, but the blacksmith smiled: “A quiet voice can still call people home.”",
          "The moon rose above the tower. The finches stirred in the orchard, and the children in the square held their breath. The whole village was listening and waiting.",
          "The book waited for one last gesture. How should they welcome the new voice of the bell they all needed?"
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-first-new-sound.webp",
        artAnimation: "moonhill-first-sound",
        cue: "bell",
        visual: "moon",
        choices: [
          {
            id: "ring-gently",
            label: "Ring it gently",
            response: "The village will hear a quiet sound, just as it should be."
          },
          {
            id: "share-song",
            label: "Hum along with the bell",
            response: "The neighbours' voices will join the bell's."
          }
        ],
      },
      {
        title: "The Bell Sounds Different",
        body: [
          "The bell rang more softly than before, but its voice was clear and sweet. It did not reach across the whole valley, yet it filled the village from window to window.",
          "Parents and children, the elders, the baker, the blacksmith, the carpenter and a very proud Koniczynka all listened together. She had a white smudge of flour on her nose from the rolls she had eaten.",
          "Moonhill remembered that a community is not only the people who sit down at the table together. It is also the people who stay to mend the table."
        ],
        echoes: {
          7: {
            "ring-gently": "The pull was gentle, so the first note sounded special.",
            "share-song": "The village hummed along, so the first note was not alone."
          }
        },
        paragraphByChoice: {
          7: {
            "ring-gently": {
              0: "The bell rang more softly than before, but its voice was clear and sweet. The gentle pull carried the note from house to house without any needless noise.",
              1: "Parents and children, the elders, the baker, the blacksmith, the carpenter and a very proud Koniczynka all listened together. She had a white smudge of flour on her nose from the rolls she had eaten."
            },
            "share-song": {
              0: "The bell rang more softly than before, and the villagers hummed along until no one could tell where the bell ended and the voices began.",
              1: "Parents and children, the elders, the baker, the blacksmith, the carpenter and a very proud Koniczynka all listened together. Even the finches in the orchard slept peacefully."
            }
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
            "ring-gently": "/assets/illustrations/moonhill-bell/moonhill-softer-ring-ring-gently.webp",
            "share-song": "/assets/illustrations/moonhill-bell/moonhill-softer-ring-share-song.webp"
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
      },
      {
        title: "A Goodnight Song",
        body: [
          "Long after supper, the bell rested in the tower above the village, and its mended rim glimmered in the moonlight.",
          "Moonhill remembered that quiet things are not unimportant. Sometimes they are only waiting for helping hands, patient friends and a gentle song for a new beginning.",
          "The end."
        ],
        echoes: {
          7: {
            "ring-gently": "The book remembered the gentle ringing.",
            "share-song": "The book remembered the song they shared."
          }
        },
        paragraphByChoice: {
            7: {
              "ring-gently": {
                0: "Long after supper, the bell kept watch in the tower above the village, and one clear silver note still seemed to linger by its mended rim.",
                1: "Moonhill remembered that quiet things are not unimportant. Sometimes they are only waiting for helping hands, patient friends and one careful pull."
              },
              "share-song": {
                0: "Long after supper, the bell kept watch in the tower above the village, and the tune the neighbours had hummed still seemed to float beneath the moon.",
                1: "Moonhill remembered that quiet things are not unimportant. Sometimes they are only waiting for helping hands, patient friends and a gentle song for a new beginning."
              }
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
            "ring-gently": "/assets/illustrations/moonhill-bell/moonhill-last-ring-ring-gently.webp",
            "share-song": "/assets/illustrations/moonhill-bell/moonhill-last-ring-share-song.webp"
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
        ending: true
      }
    ]
  }
];
