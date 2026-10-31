export const stories = [
  {
    id: "dragon-bridge",
    shortTitle: "Dragon Bridge",
    title: "The Dragon on the Old Bridge",
    kicker: "A tale of listening",
    pages: [
      {
        title: "An Unexpected Meeting",
        body: [
          "Towards evening, Sir Gustaw and little Oliwia came to an old stone bridge. A brook murmured under its single arch. For as long as anyone could remember, packhorses with saddlebags had crossed it, and millers with sacks of flour, and children carrying milk to the village.",
          "That evening, in the very middle of the bridge, sat a copper dragon. For a dragon it was small, about the size of a horse. It did not roar, and it frightened no one. It rested its front paws on the low wall and curled its tail around one loose stone.",
          "“A bridge dragon,” Gustaw whispered. “My grandfather told me about them. They guard old crossings, but they never block anyone’s way. If this one does, something must be wrong.”"
        ],
        choices: [],
      },
      {
        title: "A Little Surprise",
        body: [
          "Gustaw knelt and rested his shield against his knee, so that he would look smaller to the dragon. Oliwia stood close beside him and held her breath.",
          "The dragon leaned over the wall and breathed on the loose stone. A golden wisp drifted from its nostrils and settled on the moss, slowly, ever so slowly. Bridge dragons do not breathe fire. They breathe warmth, which heats a stone but never burns anyone.",
          "Then, from under the stone, came a tiny sound: peep, peep, peep. The dragon looked up at the travellers, as if to check whether they had heard it too."
        ],
        choices: [
          {
            id: "ask",
            label: "Ask what it is guarding",
            response: "Oliwia will step closer and gently ask the dragon what it is guarding."
          },
          {
            id: "listen",
            label: "Wait and listen",
            response: "Oliwia and Gustaw will keep perfectly still and listen for what peeps under the stone."
          }
        ],
      },
      {
        title: "The Stone’s Secret",
        bodyByChoice: {
          1: {
            ask: [
              "Oliwia stepped closer. “What are you guarding?” she asked gently. The dragon looked at her for a long time. Then it laid one claw on the loose stone and carefully lifted its edge.",
              "Underneath, in a narrow crack among moss, mortar and tiny grass roots, was a nest of river mice. Three mice huddled together, and the smallest one was trembling.",
              "Every step on the bridge shook the loose stone, and the nest shook with it. And at dawn, heavy carts were going to cross the bridge to market. “The dragon isn’t blocking the road to be unkind,” Oliwia whispered. “It’s guarding the mice, because it can’t tell anyone they live here.”"
            ],
            listen: [
              "Oliwia lay down on the cobbles and put her ear to the wall. She waited in silence until something peeped again. It came from a narrow crack under the loose stone.",
              "Three river mice peeped out of the crack. They lived in a nest tucked in among moss, mortar and tiny grass roots. The dragon lay down beside Oliwia and watched with her as the smallest one trembled.",
              "Every step on the bridge shook the loose stone, and the nest shook with it. And at dawn, heavy carts were going to cross the bridge to market. “The dragon isn’t blocking the road to be unkind,” Oliwia whispered. “It’s guarding the mice, because it can’t tell anyone they live here.”"
            ]
          }
        },
        choices: [],
      },
      {
        title: "The Lantern and the Bread",
        body: [
          "The evening was growing chilly, and mist was rising from the brook. The nest had to be moved before the carts came. But the mice did not know the travellers, and they could easily take fright.",
          "Gustaw lit his lantern. From her bag Oliwia took half a loaf of rye bread wrapped in linen. The dragon breathed so gently that it would not have blown out a candle.",
          "“First they have to trust us,” Gustaw said quietly. “Let them see they have nothing to fear.”"
        ],
        choices: [
          {
            id: "lantern",
            label: "Hold up the lantern",
            response: "Gustaw will hold up the lantern so the mice can see who is kneeling beside them."
          },
          {
            id: "bread",
            label: "Share the bread",
            response: "Oliwia will crumble a little bread right by the crack."
          }
        ],
      },
      {
        title: "The Red Pennant",
        bodyByChoice: {
          3: {
            lantern: [
              "Gustaw held up the lantern. In its light they could see every mossy stone and three pairs of shining little eyes. The mice looked at the light, then at the travellers, and not one of them ran away.",
              "Moving the nest would take more hands, so Gustaw planted a red pennant by the path to the mill. When a knight sets one by the road, everyone around knows that he needs help.",
              "The people who lived nearest came first, each with whatever they had in their hands: the miller with an armful of sheep’s wool, the baker with a clean kerchief, and the basket maker with a bundle of reeds he had just cut by the brook. The lantern showed them where to step safely."
            ],
            bread: [
              "Oliwia crumbled a little bread and laid the crumbs on the linen, right by the crack. First one little nose poked out, then a second, and at last a third. The mice nibbled and looked at Oliwia more and more boldly.",
              "Moving the nest would take more hands, so Gustaw planted a red pennant by the path to the mill. When a knight sets one by the road, everyone around knows that he needs help.",
              "The people who lived nearest came first, each with whatever they had in their hands: the miller with an armful of sheep’s wool, the baker with a clean kerchief, and the basket maker with a bundle of reeds he had just cut by the brook. They stood to one side, so as not to disturb the mice at their supper."
            ]
          }
        },
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
          "The basket maker knew at once what to do. He wove a cradle from the reeds, round and deep, with a high rim, so that no mouse could fall out on the way. The miller lined it with wool, and the baker with her kerchief.",
          "The dragon lowered its snout and warmed the cradle with one tiny breath. The mice watched from the wall. Their whiskers quivered, but not one of them hid in the crack.",
          "“They must climb in by themselves,” said the basket maker. “If we pick them up, they’ll take fright and run.”"
        ],
        choices: [
          {
            id: "crumbs",
            label: "Lay a trail of crumbs",
            response: "Oliwia will lay a trail of crumbs from the crack all the way to the cradle."
          },
          {
            id: "warm-path",
            label: "Ask the dragon for a warm path",
            response: "Oliwia will ask the dragon to warm the stones from the crack all the way to the cradle."
          }
        ],
      },
      {
        title: "The Little Paws Move Home",
        bodyByChoice: {
          5: {
            crumbs: [
              "Oliwia crumbled a crust of bread and laid a trail of crumbs from the crack all the way to the cradle. The first mouse went crumb by crumb until it climbed onto the wool. Then came the second.",
              "The smallest stopped at every crumb and ate it down to the very last bit. The basket maker held the cradle perfectly still, and Gustaw slid his shield underneath it, so that nothing could fall.",
              "When all three were inside, Gustaw and the basket maker carried the cradle to the dry grass on the bank, among the reeds. The dragon blinked at them slowly. “That’s how bridge dragons say thank you,” the basket maker whispered. “My grandfather saw it once too.”"
            ],
            "warm-path": [
              "The dragon leaned over the wall and breathed on the stones, one after another, from the crack all the way to the cradle. The stones grew warm and glowed amber from inside, like embers that no longer burn.",
              "The first mouse crossed the warm stones and climbed onto the wool. The second followed. The smallest set off last, and the dragon guided it with its nose. The basket maker held the cradle, and Gustaw slid his shield underneath it.",
              "When all three were inside, Gustaw and the basket maker carried the cradle to the dry grass on the bank, among the reeds. The dragon blinked at them slowly. “That’s how bridge dragons say thank you,” the basket maker whispered. “My grandfather saw it once too.”"
            ]
          }
        },
        choices: [],
        curiosityNote: {
          title: "Did you know...?",
          body: "The harvest mouse, the smallest mouse in Poland, weighs about as much as a coin. It weaves a round nest of living grass up among the reeds and holds on to the stems with its tail, like a fifth paw."
        },
      },
      {
        title: "A Promise on the Old Bridge",
        body: [
          "Once the mice were safe, the dragon stepped off the road, and the bridge was open again. A few crumbs were left on the wall, just enough for the sparrows’ breakfast.",
          "The miller promised to set the stone firmly back in place the next day, paid for with the travellers’ bridge pennies. And Oliwia promised the dragon that at the inn she would ask every traveller: “Slowly and quietly, mice are sleeping by the bridge.”",
          "Up on the hill, candles were already flickering in the inn windows. The dragon looked at the travellers and did not quite know how to say goodbye. Nobody had stayed on its bridge this long for years and years."
        ],
        paragraphByChoice: {
          5: {
            crumbs: {
              0: "Once the mice were safe, the dragon stepped off the road, and the bridge was open again. A few crumbs were left on the wall, just enough for the sparrows’ breakfast."
            },
            "warm-path": {
              0: "Once the mice were safe, the dragon stepped off the road, and the bridge was open again. The stones on the wall cooled slowly and went dark, one after another."
            }
          }
        },
        choices: [
          {
            id: "name-promise",
            label: "Thank the dragon",
            response: "Oliwia will thank the dragon for looking after the little ones for so long."
          },
          {
            id: "wave-goodnight",
            label: "Wave goodnight",
            response: "Oliwia will wave and wish the dragon goodnight."
          }
        ],
      },
      {
        title: "Whispers on the Bridge",
        bodyByChoice: {
          7: {
            "name-promise": [
              "Oliwia stood before the dragon. “Thank you for looking after the little ones for so long,” she said. The dragon bowed its head, shook one copper scale loose from its side and, with a warm breath, set it into the wall right beside the mice’s old home.",
              "At night the scale glowed amber in the wall. Oliwia kept her word, and from that night on everyone who crossed the bridge slowed down beside the scale and whispered: “Slowly and quietly, mice are sleeping by the bridge.” And the dragon kept watch by the cradle with its eyes open.",
              "That night Oliwia fell asleep at the inn with a tiny reed basket in her hand. The basket maker had woven it for her as a keepsake, from the reeds left over from the cradle."
            ],
            "wave-goodnight": [
              "Oliwia waved to the dragon. “Goodnight, dragon,” she said. The dragon blinked sleepily, curled itself around the cradle and fell asleep, for the first time since the day the stone came loose.",
              "With every breath it took, a wisp of golden warmth rose over the cradle. Oliwia kept her word, so people tiptoed across the bridge and hushed one another in whispers: “Slowly and quietly, mice are sleeping by the bridge.”",
              "That night Oliwia fell asleep at the inn with a tiny reed basket in her hand. The basket maker had woven it for her as a keepsake, from the reeds left over from the cradle."
            ]
          }
        },
        choices: [],
        curiosityNote: {
          title: "Did you know...?",
          body: "Long ago, crossing a bridge sometimes cost money. In old Poland this fee was called “mostowe”, bridge money, and it was meant to pay for mending the bridge."
        },
      },
      {
        title: "What They Say at the Inn",
        body: [
          "Long after the candles at the inn had gone out, the dragon kept watch by the old bridge. Beside it, in the reed cradle, the mice slept, and the copper scale glowed in the wall. At dawn the market carts crossed the bridge slowly and quietly, one cart after another.",
          "Ever since, people at the inn have said: “Before you tell a dragon to get off the road, ask what it is guarding.” And no one has ever been sorry they asked.",
          "The end."
        ],
        paragraphByChoice: {
          7: {
            "name-promise": {
              0: "Long after the candles at the inn had gone out, the dragon kept watch by the old bridge. Beside it, in the reed cradle, the mice slept, and the copper scale glowed in the wall. At dawn the market carts crossed the bridge slowly and quietly, one cart after another."
            },
            "wave-goodnight": {
              0: "Long after the candles at the inn had gone out, the dragon slept by the old bridge. Beside it, in the reed cradle, the mice slept too, wrapped in the warmth of its breath. At dawn the market carts crossed the bridge slowly and quietly, one cart after another."
            }
          },
          1: {
            ask: {
              1: "Ever since, people at the inn have said: “Before you tell a dragon to get off the road, ask what it is guarding.” And no one has ever been sorry they asked."
            },
            listen: {
              1: "Ever since, people at the inn have said: “Before you tell a dragon to get off the road, listen for what peeps under the stone.” And no one has ever been sorry they listened."
            }
          }
        },
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
    pages: [
      {
        title: "When the Bell Did Not Call",
        body: [
          "Gustaw, Oliwia and the mare Koniczynka reached Moonhill just before dusk. On the tower roof an iron crescent moon turned to show which way the wind blew. That is how the hill got its name.",
          "Every evening the bell in that tower called people home, and the children called out with it: “Ding-dong, come home!” But this evening the tower was silent. Families came out onto the square with horn lanterns and looked up.",
          "“Maciej the shepherd is still up by the mountains with his goats,” the reeve said anxiously. “In the mist he won’t come down until he hears the bell.” Meanwhile Koniczynka stretched her nose towards the old orchard, where silver moths shimmered among the pear trees."
        ],
        choices: [],
        curiosityNote: {
          title: "Did you know...?",
          body: "In the Middle Ages, the evening bell also told people to cover the fire in the hearth, so no house would burn at night. The French called it “couvre-feu”, and so English got the word curfew."
        },
      },
      {
        title: "A Key, a Rope and a Mare’s Nose",
        body: [
          "The reeve opened the tower door with his big iron key. The baker looked inside and tipped his head back. “The rope is gone!” he cried. “It always hung right down to the floor.”",
          "Everyone talked at once. Only Oliwia watched Koniczynka, who kept turning her ears towards the pear trees. “Where silver moths circle, something is waiting to be mended,” a girl from the village whispered.",
          "Grandmother Janina leaned on her stick. “Or the mountain wind has been up to its tricks again. This afternoon it blew so hard that the bell clanged by itself and the moon on the roof spun round and round.”"
        ],
        choices: [
          {
            id: "follow-clover",
            label: "Follow Koniczynka",
            response: "Everyone will follow the mare to where the silver moths are circling."
          },
          {
            id: "ask-elders",
            label: "Ask the elders",
            response: "Grandmother Janina will tell them what to look for after a windy afternoon."
          }
        ],
      },
      {
        title: "The Rope in the Pear Tree",
        bodyByChoice: {
          1: {
            "follow-clover": [
              "Koniczynka led everyone round the tower, straight to the old pear tree. The silver moths were circling above a thick branch that reached all the way to the shutter.",
              "On the branch hung the bell rope, tangled in tight loops. The wind had blown it out through the open shutter and wound it round the branch.",
              "Right beside it, in the fork of the branch, was a nest of moss. A chaffinch was keeping her three chicks warm in it, and she did not fly away, although half the village stood under the tree. One hard tug on the rope, and the nest would fall."
            ],
            "ask-elders": [
              "Grandmother Janina remembered at once. “When I was a little girl, the wind stole the rope once before,” she said. “We found it in the old pear tree. That tree always reaches its branches towards the tower.”",
              "They followed her round the tower. Grandmother raised her stick and pointed at a thick branch that reached all the way to the shutter. On it hung the bell rope, tangled in tight loops.",
              "Right beside it, in the fork of the branch, was a nest of moss. A chaffinch was keeping her three chicks warm in it, and she did not fly away, although half the village stood under the tree. One hard tug on the rope, and the nest would fall."
            ]
          }
        },
        choices: [],
      },
      {
        title: "Quiet by the Nest",
        body: [
          "The carpenter brought an ash ladder and slowly leaned it against the trunk, so it would not knock against the bark just below the nest. The baker wrapped the ladder’s feet in cloth, so they would not scrape on the stones.",
          "The chaffinch watched them with her black eyes, but she did not leave her nest. Oliwia never looked away from the little bird, and Koniczynka stood perfectly still and did not even snort.",
          "“If she takes fright, the chicks will get cold,” the carpenter whispered. “We have to untangle the rope so the finch stays on her nest.”"
        ],
        choices: [
          {
            id: "move-slowly",
            label: "Untangle it slowly",
            response: "The carpenter will untangle the loops one by one, without a single tug."
          },
          {
            id: "lullaby",
            label: "Hum the finch a lullaby",
            response: "Oliwia and Gustaw will hum very softly, so the finch feels safe."
          }
        ],
      },
      {
        title: "A Free Rope, a Hoarse Bell",
        bodyByChoice: {
          3: {
            "move-slowly": [
              "The carpenter climbed the ladder and untangled the rope loop by loop, without a single tug. Oliwia stood below and counted the loops in a whisper: five, four, three, two, one.",
              "When the last knot came free, the chaffinch was still keeping her chicks warm. A pear leaf fell from the branch, right onto Oliwia’s sleeve. She tucked it into her bag, next to the little reed basket from the bridge.",
              "The rope hung inside the tower again. But when the carpenter pulled it, instead of “ding-dong” there came only a hoarse clank. The bell had lost its voice."
            ],
            "lullaby": [
              "Oliwia and Gustaw began to hum a lullaby very softly, and the carpenter on the ladder loosened the rope in time with it, loop by loop. The chaffinch half closed her eyes and did not stir.",
              "When the last knot came free, the lullaby faded, and the chaffinch was still keeping her chicks warm. A pear leaf fell from the branch, right onto Oliwia’s sleeve. She tucked it into her bag, next to the little reed basket from the bridge.",
              "The rope hung inside the tower again. But when the carpenter pulled it, instead of “ding-dong” there came only a hoarse clank. The bell had lost its voice."
            ]
          }
        },
        choices: [],
      },
      {
        title: "A Crack and a Forgotten Name",
        body: [
          "Up in the belfry, by the lantern’s light, they found a crack on the bell’s rim, as thin as a hair. All afternoon the wind had tugged at the rope, and the bell had rung and rung until the bronze split.",
          "The carpenter touched the crack with two fingers. “The blacksmith can pin bronze together with rivets,” he said. “But it’s a whole night’s work.”",
          "Grandmother Janina stroked the bell. “Once it had a name, and there was a rhyme about it. The rhyme said what to do when the bell went hoarse. If only I could remember it…”"
        ],
        choices: [
          {
            id: "invite-smith",
            label: "Ask the blacksmith for help",
            response: "The children will run for the blacksmith, and she will bring her little hammer and rivets."
          },
          {
            id: "thank-bell",
            label: "Remember the bell’s name",
            response: "Everyone will help Grandmother Janina remember the bell’s name and the old rhyme."
          }
        ],
      },
      {
        title: "A Night in the Belfry",
        bodyByChoice: {
          5: {
            "invite-smith": [
              "The blacksmith came with her little hammer and a pouch of rivets. She drilled the bronze beside the crack and tapped the rivets in softly, tap after tap. The carpenter held the beam, so the bell would not swing.",
              "The baker brought a basket of warm oat rolls with honey, because the work would go on late into the night. Anyone who stopped for a rest got one, and one was carried down for Koniczynka.",
              "Oliwia polished the bell with a linen cloth until the lantern light shone inside it. When the moon stood over the tower, three rivets gleamed on the bell’s rim, side by side."
            ],
            "thank-bell": [
              "Everyone offered Grandmother a name: Thunder, Jingle, Big Bong… She only shook her head. At last the baker cried, “Evensong! She calls us every evening!” Grandmother’s eyes lit up. She remembered the rhyme.",
              "“When Evensong is hoarse, don’t weep or wail: turn her to the mountains and her voice won’t fail.” The carpenter understood first. “If we turn her, the clapper will strike fresh bronze, and the crack will stay to one side.”",
              "Gustaw and the carpenter loosened the fittings and turned Evensong towards the mountains. The baker brought warm oat rolls with honey, so no one worked on an empty stomach, and one was carried down for Koniczynka."
            ]
          }
        },
        choices: [],
        curiosityNoteByChoice: {
          5: {
            "invite-smith": {
              title: "Did you know...?",
              body: "Bell metal is about four parts copper to one part tin. More tin gives a brighter voice, but it also makes the metal brittle. That is why even a great bell can crack."
            },
            "thank-bell": {
              title: "Did you know...?",
              body: "Old bells were given names, like people. When a clapper had struck one spot for too long, the whole bell was given a quarter turn, so the clapper hit fresh bronze. It is still done today."
            }
          }
        },
      },
      {
        title: "Welcoming the New Voice",
        body: [
          "At last the bell was ready. With its rivets it would sound a little softer than before, but the blacksmith smiled. “A little softer, but Maciej will still hear it.”",
          "The whole village waited on the square. The moon peeped out from behind a cloud, and in the pear tree the chicks woke and poked their heads out of the nest. The chaffinch sat beside them, looking at the tower too.",
          "The baker stood in the tower door with the rope in his hands and looked at Oliwia. “How shall we welcome it?” he asked."
        ],
        paragraphByChoice: {
          5: {
            "invite-smith": {
              0: "At last the bell was ready. With its rivets it would sound a little softer than before, but the blacksmith smiled. “A little softer, but Maciej will still hear it.”"
            },
            "thank-bell": {
              0: "At last Evensong hung facing the mountains. Grandmother Janina gave her a pat. “Now then, old girl, show us the rhyme was true.”"
            }
          }
        },
        choices: [
          {
            id: "ring-gently",
            label: "Ring it gently",
            response: "The baker will pull the rope lightly, so the bell speaks softly."
          },
          {
            id: "share-song",
            label: "Hum along with the bell",
            response: "Everyone on the square will hum the bell’s evening note along with it."
          }
        ],
      },
      {
        title: "The Bell Calls Again",
        bodyByChoice: {
          7: {
            "ring-gently": [
              "The baker pulled the rope lightly, ever so lightly. The bell spoke out clear and bright, and the children called along with it: “Ding-dong, come home!” Its voice drifted from window to window and on, all the way to the mountains.",
              "After a while, goat bells answered it out of the dark. Maciej the shepherd was coming down through the mist, straight towards the sound of the bell, and the reeve let out a sigh of relief.",
              "Everyone listened to the bell: parents and children, the old folk, the blacksmith, the carpenter, and a very contented Koniczynka with a white smudge of flour on her nose from her roll."
            ],
            "share-song": [
              "The baker pulled the rope, and the whole square hummed along with the bell, then sang: “Ding-dong, come home!” No one could tell where the bronze ended and the voices began.",
              "In the pear tree the chicks lifted their heads and listened as hard as they could, as if to remember every note. And out of the dark, goat bells answered: Maciej the shepherd was coming down through the mist, straight towards the sound of the bell.",
              "Everyone listened to the bell: parents and children, the old folk, the blacksmith, the carpenter, and a very contented Koniczynka with a white smudge of flour on her nose from her roll."
            ]
          }
        },
        choices: [],
        curiosityNoteByChoice: {
          7: {
            "ring-gently": {
              title: "Did you know...?",
              body: "Bells carried different news: fast ringing meant danger, slow ringing meant sorrow. In mountain villages, bells rang long into foggy nights, so lost travellers could find their way home."
            },
            "share-song": {
              title: "Did you know...?",
              body: "Young chaffinches learn their song by listening to older birds. That is why chaffinches from different places sing a little differently, as if each valley had its own accent."
            }
          }
        },
      },
      {
        title: "A Keepsake of That Night",
        body: [
          "Long after the square had emptied, three silver moths flew in from the orchard. Nothing was waiting to be mended any more, so they did not circle; they settled in a row on the bell and shimmered in the moonlight like little stars. Ever since, Moonhill has carried three stars on its coat of arms.",
          "And whenever something on the hill goes wrong, people say: “First see where the horse is looking.” And every child knows which horse they mean: a certain patient mare with a red saddlecloth.",
          "The end."
        ],
        paragraphByChoice: {
          7: {
            "ring-gently": {
              0: "Long after the square had emptied, three silver moths flew in from the orchard. Nothing was waiting to be mended any more, so they did not circle; they settled in a row on the bell and shimmered in the moonlight like little stars. Ever since, Moonhill has carried three stars on its coat of arms."
            },
            "share-song": {
              0: "Long after the square had emptied, the chicks cheeped the bell’s tune in their sleep. Ever since, the bell has called the village home each evening, and the chaffinches wake everyone at dawn with the same song. Moonhill has two voices now: one of bronze, one of feathers."
            }
          },
          1: {
            "follow-clover": {
              1: "And whenever something on the hill goes wrong, people say: “First see where the horse is looking.” And every child knows which horse they mean: a certain patient mare with a red saddlecloth."
            },
            "ask-elders": {
              1: "And whenever something on the hill goes wrong, people say: “First ask the old folk, because they remember the old winds.” And Grandmother Janina always nods when she hears it."
            }
          }
        },
        choices: [],
        ending: true
      }
    ]
  }
];
