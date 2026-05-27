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
        curiosityNote: {
          title: "Did you know...?",
          body: "Old stone bridges were often built from many wedge-shaped stones. The middle stone helped the arch hold its shape, almost like a quiet keeper of the road."
        },
      },
      {
        title: "A Voice Below the Bridge",
        body: [
          "The dragon breathed out a puff small enough to fit inside a milk cup. It was golden at the edges and drifted under the bridge slowly, very slowly.",
          "Then from beneath the stones came a tiny sound: peep, peep, peep. The murmur of the brook almost covered it, and the wind stirred the reeds as if they, too, wanted to hear more.",
          "Gustaw did not take a step. He rested his shield against his knee and took a calm breath, and Oliwia did the same, watching the dragon carefully."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-smoke-thread-closeup.png",
        artAnimation: "smoke-thread",
        cue: "breath",
        visual: "smoke",
        choices: [
          {
            id: "ask",
            label: "Ask what happened",
            response: "A gentle question gives the dragon courage to point out what it is guarding."
          },
          {
            id: "listen",
            label: "Wait and listen",
            response: "The quiet helps Oliwia hear the smallest peep beneath the bridge."
          }
        ],
      },
      {
        title: "The Stone's Secret",
        body: [
          "Oliwia knelt by the edge of the bridge and found a nest of river mice tucked between moss, lime, and tiny grass roots.",
          "The smallest mouse had hidden behind a stone warmed by the dragon's breath. The dragon was afraid that heavy boots would shake the bridge and frighten the little family out of hiding.",
          "The road had not been closed on a whim. The bridge simply held a secret, and the dragon was guarding those too small to call for help on their own."
        ],
        echoes: {
          1: {
            ask: "Because of that question, the book showed the dragon's answer.",
            listen: "Because of that listening, the book followed the smallest sound."
          }
        },
        paragraphByChoice: {
          1: {
            ask: {
              0: "When Oliwia asked what had happened, the dragon tapped one claw against the loose stone and lowered its head toward the gap beneath the bridge.",
              1: "There she found a nest of river mice tucked between moss, lime, and tiny grass roots. The smallest mouse had hidden behind a stone warmed by the dragon's breath."
            },
            listen: {
              0: "Oliwia stayed quiet long enough for the smallest peep to return. It came from the edge of the bridge, where moss covered a narrow gap between the stones.",
              1: "Inside was a nest of river mice tucked between lime and tiny grass roots. The smallest mouse shivered behind a stone warmed by the dragon's breath."
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
      },
      {
        title: "A Plan for the Little Mice",
        body: [
          "The evening grew colder, and mist rose from the brook like a white ribbon. In the mossy crack, the mice trembled their whiskers.",
          "Gustaw held a lantern, Oliwia had half a rye loaf wrapped in linen, and the dragon breathed warmth more gently than one would use a candle flame.",
          "They needed to begin with a small, calm gesture: one that would not frighten the mice and would show the dragon it could trust their company."
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
      },
      {
        title: "Help Comes From the Mill",
        body: [
          "Gustaw planted a red pennant by the path to the mill. The cloth stirred in the wind, giving the people of the village a sign that something important was happening on the bridge.",
          "Thanks to Gustaw's signal, the miller soon arrived with sheep's wool, the village baker with a clean kerchief, and the basket maker with an armful of reeds smelling of rain. Each one carried something different.",
          "No one laughed because the matter was small or unimportant. A village that can care for tiny creatures learns how to care for great matters too."
        ],
        echoes: {
          3: {
            lantern: "Because the lantern was raised, the helpers saw the safe places to work.",
            bread: "Because the bread was shared, the mice dared to come closer."
          }
        },
        paragraphByChoice: {
          3: {
            lantern: {
              0: "Gustaw planted a red pennant by the path to the mill, and the lifted lantern showed the safest stones beneath the moss. The cloth stirred in the wind, giving the people of the village a sign.",
              1: "Thanks to the clear light, the miller soon arrived with sheep's wool, the baker with a clean kerchief, and the basket maker with reeds smelling of rain. Each helper knew where to step."
            },
            bread: {
              0: "Gustaw planted a red pennant by the path to the mill while crumbs of warm bread waited near the mossy crack. The cloth stirred in the wind, giving the people of the village a sign.",
              1: "Drawn by the scent, the mice poked out their noses as the miller arrived with sheep's wool, the baker with a clean kerchief, and the basket maker with reeds smelling of rain."
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
        curiosityNote: {
          title: "Did you know...?",
          body: "Many medieval mills stood beside streams because moving water could turn a great wheel. That wheel helped grind grain into flour for the whole village."
        },
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
            label: "Ask the basket maker for help",
            response: "The basket maker will show how to place the cradle most gently."
          },
          {
            id: "carry-together",
            label: "Carry the nest together",
            response: "Several steady hands will help the mice make their short journey."
          }
        ],
        curiosityNote: {
          title: "Did you know...?",
          body: "Reeds are light, bendy plants that grow near water. People have used them for baskets, mats, roofs, and tiny woven things for a very long time."
        },
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
            "basket-maker": "Because the basket maker helped, the cradle moved at the right angle.",
            "carry-together": "Because everyone carried together, the whole bridge slowed down."
          }
        },
        paragraphByChoice: {
          5: {
            "basket-maker": {
              0: "The basket maker set the cradle beside the stone and tilted it only as much as a leaf tilts under rain. The first mouse stepped onto the wool. Then the second.",
              1: "Oliwia watched the maker's hands and kept her own open and still. Gustaw slid his shield beneath the basket so no one could fall."
            },
            "carry-together": {
              0: "The helpers gathered around the cradle, each taking one small part to steady. The first mouse stepped onto the wool. Then the second.",
              1: "Oliwia kept her hands open and still while Gustaw held the shield beneath them. Everyone moved at the pace of the smallest paws."
            }
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
      },
      {
        title: "A Promise on the Old Bridge",
        body: [
          "When the mice were safe, the dragon moved aside. The bridge opened again, but nobody hurried across it.",
          "Gustaw's sword shone in its scabbard. Not because anyone had won, but because someone smaller had been helped.",
          "The book rustled one page. It wanted to know what would happen next before the path led the travelers onward toward an inn full of candles."
        ],
        art: "/assets/illustrations/dragon-bridge/dragon-tale-promise-path.png",
        artAnimation: "promise-path",
        cue: "glint",
        visual: "oath",
        choices: [
          {
            id: "name-promise",
            label: "Speak words of thanks to the dragon",
            response: "The book will write the thanks in dragon speech."
          },
          {
            id: "wave-goodnight",
            label: "Wave goodnight",
            response: "The dragon answers with one warm, sleepy blink."
          }
        ],
      },
      {
        title: "The Bridge Opens Again",
        body: [
          "The villagers crossed the bridge one by one. Each looked down to where the new mouse cradle rested among the reeds.",
          "The dragon curled on the warm stone. It looked smaller now than when everyone had feared it, but it still kept watch nearby.",
          "Oliwia understood that a closed road sometimes needs a question. And the best answer is not to push forward, but first to listen and understand."
        ],
        echoes: {
          7: {
            "name-promise": "Because the dragon was thanked, the book kept its words in gold.",
            "wave-goodnight": "Because of the goodnight wave, the bridge grew quiet and warm."
          }
        },
        paragraphByChoice: {
          7: {
            "name-promise": {
              0: "The villagers crossed the bridge one by one, pausing beside the golden words the book had written in the dragon's language.",
              1: "The dragon curled on the warm stone near the letters. It looked smaller now than when everyone had feared it, but it still kept watch nearby."
            },
            "wave-goodnight": {
              0: "The villagers crossed the bridge one by one, pausing beside three freshly grown flowers warmed open by the dragon's sleepy breath.",
              1: "The dragon curled on the warm stone with one eye half closed. It looked smaller now than when everyone had feared it, but it still kept watch nearby."
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
      },
      {
        title: "What the Book Remembered",
        body: [
          "Long after the candles burned low, the bridge still stood for what remained there: a dragon, a reed cradle, and river mice sleeping safely by the bank.",
          "On the final page, the book wrote quietly: strength can shelter, courage can listen, and kindness can open even the oldest road.",
          "The end."
        ],
        echoes: {
          7: {
            "name-promise": "The book remembered the spoken thanks.",
            "wave-goodnight": "The book remembered the quiet goodnight."
          }
        },
        paragraphByChoice: {
          7: {
            "name-promise": {
              0: "Long after the candles burned low, the bridge still stood for what remained there: a dragon, golden words of thanks, and river mice sleeping safely by the bank.",
              1: "On the final page, the book wrote quietly that strength can shelter, courage can listen, and gratitude can make an old road come alive again."
            },
            "wave-goodnight": {
              0: "Long after the candles burned low, the bridge still stood for what remained there: a dragon, three freshly grown flowers, and river mice sleeping safely by the bank.",
              1: "On the final page, the book wrote quietly that strength can shelter, courage can listen, and a gentle farewell can leave the road peaceful."
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
        curiosityNote: {
          title: "Did you know...?",
          body: "Before clocks were common, village bells helped people know when to gather, work, rest, or come home. A bell could be the voice of the whole village."
        },
      },
      {
        title: "Two Ways Into the Mystery",
        body: [
          "The reeve thought of the tower key he had. The baker looked toward the bell rope. The children watched the orchards, because Koniczynka kept gazing between the pear trees.",
          "Oliwia felt a small worry in her belly, but she listened to everyone. The villagers began thinking together about how to help when no sound came from the bell tower.",
          "They could follow the horse's nose toward the silver moths. Or they could ask the village elders whether the mountain wind might have something to do with it."
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
      },
      {
        title: "The Rope in the Pear Tree",
        body: [
          "Behind the tower, the bell rope had slipped through an open shutter and tangled high among the branches of the old pear tree after a windy afternoon.",
          "A nest of finches slept nearby, tucked into leaves that smelled of rain and fruit. If anyone pulled too hard, the little nest might fall from the branch.",
          "The bell was not broken beyond help, and it had not turned cross with the village. It was waiting for people who would look carefully before deciding how to help."
        ],
        echoes: {
          1: {
            "follow-clover": "Because Koniczynka led the way, the book noticed the signs in the orchard.",
            "ask-elders": "Because the elders were asked, the book remembered the old wind."
          }
        },
        paragraphByChoice: {
          1: {
            "follow-clover": {
              0: "Koniczynka led them behind the tower, straight to the pear tree where silver moths circled a rope tangled high in the branches.",
              1: "Pear leaves clung to the rope, and tiny finches slept nearby in a nest hidden among leaves that smelled of rain and fruit. If anyone pulled too hard, the little nest might fall from the branch."
            },
            "ask-elders": {
              0: "Grandmother Janina led them behind the tower and pointed to the pear tree that bent toward the bell whenever the mountain wind swept down.",
              1: "There the rope had tangled high among the branches, beside a finch nest hidden among leaves that smelled of rain and fruit. If anyone pulled too hard, the little nest might fall from the branch."
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
        curiosityNote: {
          title: "Did you know...?",
          body: "Pear trees can live for many years, and their spring blossoms are loved by bees. In old villages, an orchard was both a pantry and a little shelter for birds."
        },
      },
      {
        title: "Quiet by the Nest",
        body: [
          "The carpenter brought an ash ladder and set it down so quietly that even the stones by the wall seemed not to hear it.",
          "The village baker wrapped the lowest rung in cloth, Oliwia watched the fluffy nest, and Koniczynka stood still as if even her tail knew how to keep silence.",
          "The rope had to be freed in the right way. But how could the village be strong and gentle at the same time beside sleeping birds?"
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-sleeping-finches.png",
        artAnimation: "moonhill-sleeping-finches",
        cue: "notes",
        visual: "finches",
        choices: [
          {
            id: "move-slowly",
            label: "Pull it free slowly",
            response: "Slow movements will let the finches keep sleeping."
          },
          {
            id: "steady-ladder",
            label: "Hold the ladder firmly",
            response: "A steady ladder will help everyone work calmly."
          }
        ],
      },
      {
        title: "The Freed Rope",
        body: [
          "Loop by loop, the rope loosened. One pear leaf fell onto Oliwia's sleeve, pointing toward the right path she had chosen.",
          "When the last knot slipped free, everyone smiled without shouting. The finches kept sleeping, warm beneath their mother's wing.",
          "The rope hung from the tower again, but when the carpenter pulled it gently, they heard only a dry knock, as if the bell had cleared its throat and gone quiet."
        ],
        echoes: {
          3: {
            "move-slowly": "Because everyone moved slowly, the nest stayed quiet.",
            "steady-ladder": "Because the ladder was held firmly, the rope came down safely."
          }
        },
        paragraphByChoice: {
          3: {
            "move-slowly": {
              0: "Loop by loop, the rope loosened while every hand moved as slowly as drifting dust. One pear leaf fell onto Oliwia's sleeve.",
              1: "When the last knot slipped free, everyone smiled without shouting. The finches kept sleeping, warm beneath their mother's wing."
            },
            "steady-ladder": {
              0: "The ladder stood firm under the carpenter's boots, so he could reach the knot without shaking the branch. One pear leaf fell onto Oliwia's sleeve.",
              1: "When the last knot slipped free, the carpenter lowered the rope with both hands. The finches kept sleeping, warm beneath their mother's wing."
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
      },
      {
        title: "The Crack in the Bell",
        body: [
          "Inside the tower, along the rim of the bronze bell, lay a crack as thin as a strand of hair. The lantern had to be brought very close before anyone could see it.",
          "The carpenter touched the bell with two fingers and nodded. 'There is no use being angry about it. Tonight we will help it find its voice again.'",
          "The villagers joined their strengths: someone knew bells, someone could hold the ladder firmly, and someone simply knew how to give courage when it was needed."
        ],
        art: "/assets/illustrations/moonhill-bell/moonhill-small-crack.png",
        artAnimation: "moonhill-small-crack",
        cue: "bell",
        visual: "crack",
        choices: [
          {
            id: "invite-smith",
            label: "Ask the blacksmith for help",
            response: "The blacksmith will bring a small hammer and shining rivets."
          },
          {
            id: "thank-bell",
            label: "Encourage everyone to thank the bell",
            response: "The bell will be treated like an old friend, not a problem."
          }
        ],
        curiosityNote: {
          title: "Did you know...?",
          body: "Many old bells were cast from bronze, a metal made by mixing copper with tin. Bronze can ring with a warm voice that travels far through the air."
        },
      },
      {
        title: "The Village Mends the Bell",
        body: [
          "By candlelight and moonlight, the villagers worked in a circle. The blacksmith tapped softly, the carpenter steadied the beam, and the village baker passed oat rolls from hand to hand.",
          "Oliwia cleaned the bell with linen until the lantern light gleamed inside it. Below, Koniczynka listened for any tone that might finally come from above.",
          "The silent tower became a workshop, and the workshop looked like a family gathered around something no one wanted to leave alone."
        ],
        echoes: {
          5: {
            "invite-smith": "Because the blacksmith came, the tower filled with careful tapping.",
            "thank-bell": "Because the bell was thanked, everyone worked in better spirits."
          }
        },
        paragraphByChoice: {
          5: {
            "invite-smith": {
              0: "By candlelight and moonlight, the blacksmith worked in the circle with a small hammer and shining rivets. The carpenter steadied the beam, and the baker passed oat rolls from hand to hand.",
              1: "Oliwia cleaned the bell with linen between each careful tap until the lantern light gleamed inside it. Below, Koniczynka listened for any tone that might finally come from above."
            },
            "thank-bell": {
              0: "By candlelight and moonlight, the villagers first placed their hands near the bell and thanked it for all the evenings it had called them home.",
              1: "Then Oliwia cleaned the bell with linen while the blacksmith tapped softly and the carpenter steadied the beam. Below, Koniczynka listened for any tone that might finally come from above."
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
      },
      {
        title: "The Bell Sounds Different",
        body: [
          "The bell sounded more softly than before, yet its voice was bright and pleasant. It did not travel across the whole valley, but it filled the village from window to window.",
          "Parents, children, elders, the baker, the blacksmith, the carpenter, and very proud Koniczynka listened together; she had a white mark of flour on her nose from the rolls she had eaten.",
          "Moonhill remembered that community is not only those who sit together at the table. It is also those who stay to mend the table."
        ],
        echoes: {
          7: {
            "ring-gently": "Because the bell was rung gently, the first note sounded special.",
            "share-song": "Because the village hummed along, the first note had voices around it."
          }
        },
        paragraphByChoice: {
          7: {
            "ring-gently": {
              0: "The bell sounded more softly than before, yet its voice was bright and pleasant. The gentle pull let the note pass from house to house without unnecessary noise.",
              1: "Parents, children, elders, the baker, the blacksmith, the carpenter, and very proud Koniczynka listened together; she had a white mark of flour on her nose from the rolls she had eaten."
            },
            "share-song": {
              0: "The bell sounded more softly than before, and the villagers hummed with it until the note seemed made from both voice and bell.",
              1: "Parents, children, elders, the baker, the blacksmith, the carpenter, and very proud Koniczynka listened together; even the finches stayed calm in the orchard."
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
      },
      {
        title: "A Goodnight Song",
        body: [
          "Long after supper, the bell rested high above the village. Its mended rim shone faintly in the moonlight.",
          "Moonhill remembered that what is quiet is not without meaning. Sometimes it is only waiting for helpful hands, patient friends, and a gentle song toward a new beginning.",
          "The end."
        ],
        echoes: {
          7: {
            "ring-gently": "The book remembered the gentle ringing.",
            "share-song": "The book remembered the shared song."
          }
        },
        paragraphByChoice: {
            7: {
              "ring-gently": {
                0: "Long after supper, the bell kept watch high above the village, and one clear silver note seemed to linger near its mended rim.",
                1: "Moonhill remembered that what is quiet is not without meaning. Sometimes it waits for helpful hands, patient friends, and one careful pull toward a new beginning."
              },
              "share-song": {
                0: "Long after supper, the bell kept watch high above the village, and the melody the neighbors had hummed seemed to float in the moonlit sky.",
                1: "Moonhill remembered that what is quiet is not without meaning. Sometimes it waits for helpful hands, patient friends, and a gentle song toward a new beginning."
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
        ending: true
      }
    ]
  }
];
