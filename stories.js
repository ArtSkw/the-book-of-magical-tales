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
          "The dragon leaned over the wall and breathed on the loose stone. A golden wisp drifted from its nostrils and settled on the moss, slowly, ever so slowly. Bridge dragons breathe no fire, only warmth that heats a stone but burns no one.",
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
              "Underneath, in a narrow crack among moss, mortar and tiny grass roots, was a nest of river mice. Three little ones huddled together, and the smallest was trembling.",
              "Gustaw took a step, and the stone rocked, and the whole nest with it. “And at dawn the carts go to market this way,” the knight remembered. Oliwia understood. “The dragon isn’t cross. It’s guarding the mice, because it can’t tell anyone they live here.”"
            ],
            listen: [
              "Oliwia lay down on the cobbles and put her ear to the wall. She waited in silence until something peeped again. It came from a narrow crack under the loose stone.",
              "Three river mice peered out. They lived in a nest tucked in among moss, mortar and tiny grass roots. The dragon lay down beside Oliwia and watched with her as the smallest one trembled.",
              "When Gustaw shifted from foot to foot, Oliwia felt the stone quiver against her ear, and the nest with it. And at dawn heavy carts would come this way to market! “The dragon isn’t guarding the bridge from us,” she whispered. “It’s guarding the mice from our feet.”"
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
              "To move the nest in one piece, they would need more hands. Gustaw planted a red pennant by the path and shone his lantern on it. When a knight sets that sign by the road, everyone nearby knows he needs help.",
              "The nearest neighbours came straight from their work: the miller with an armful of sheep’s wool, the baker with a clean kerchief and the basket maker with a bundle of reeds. “Mind that wobbly stone, there are mice living under it,” Gustaw whispered, lighting their way."
            ],
            bread: [
              "Oliwia crumbled a little bread and laid the crumbs on the linen, right by the crack. First one little nose poked out, then a second and a third. The mice nibbled and looked at Oliwia more and more boldly.",
              "Moving the nest would take more hands, but calling out would frighten the little ones. So Gustaw quietly planted a red pennant by the path. Everyone nearby understands that sign without a word: a knight needs help.",
              "Soon the neighbours from along the brook arrived, each with whatever they had in their hands: the miller with an armful of wool, the baker with a clean kerchief and the basket maker with a bundle of reeds. They hung back. “I’ve never seen such tiny guests at supper,” the baker whispered."
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
              "Oliwia crumbled a crust and laid a trail along the wall from the crack all the way to the cradle. The first mouse went carefully, from one morsel to the next, until it hopped onto the wool. The second followed.",
              "The smallest stopped at every crumb and ate it to the last scrap, while everyone waited, holding their breath. The basket maker kept the cradle perfectly still, and Gustaw slid his shield underneath, so that nothing could fall into the brook.",
              "When the little one had at last joined the others, all three were carried down to the dry grass on the bank, among the reeds. The dragon blinked, very slowly. “That’s how bridge dragons say thank you,” the basket maker whispered. “My grandfather saw it once too.”"
            ],
            "warm-path": [
              "The dragon leaned over the wall and breathed on the stones from the crack all the way to the cradle, and they warmed and glowed amber from inside, like embers that no longer burn.",
              "The first mouse put out a careful paw, paused, then ran to the cradle. The second followed. The smallest set off last, and the dragon warmed the way for the mouse. The basket maker held the cradle, and Gustaw slid his shield underneath.",
              "Together they carried the little ones down among the reeds, and the dragon lay beside them to keep them warm. Then it blinked at the knight, very slowly. Gustaw smiled. “Grandfather said that’s how bridge dragons say thank you. I thought it was just a story.”"
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
              0: "Once the mice were safe, the bridge was open again. The stones on the wall cooled slowly and went dark, one after another."
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
              "After dark the scale glowed amber. Oliwia kept her word, and from then on everyone who crossed the bridge slowed down at that spot and whispered: “Slowly and quietly, mice are sleeping by the bridge.” And the dragon watched over them with its eyes open.",
              "As they said goodbye, the basket maker pressed a tiny basket into Oliwia’s hand, woven from the reeds left over from the cradle. “So you’ll remember what the dragon was guarding,” he said."
            ],
            "wave-goodnight": [
              "Oliwia waved. “Goodnight, dragon,” she said. It blinked sleepily, curled itself around the cradle and fell asleep, for the first time since the day the stone came loose.",
              "With every breath it took, a wisp of golden warmth rose over the cradle. Oliwia kept her word, so people tiptoed across the bridge and hushed one another in whispers: “Slowly and quietly, mice are sleeping by the bridge.”",
              "At the inn Oliwia lay awake for a long time. She turned over a little basket the basket maker had woven her from the cradle’s leftover reeds, and listened for a soft dragon snore drifting up through the window."
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
              "On the bough hung the bell rope, tangled in tight loops. The wind had blown it out through the open shutter and wound it round and round.",
              "Koniczynka lifted her head towards the fork. Right beside the rope, in a nest of moss, a chaffinch sat keeping her three chicks warm. She did not fly away, although people and a horse stood beneath the tree. “One tug,” Gustaw whispered, “and the nest will come down with the rope.”"
            ],
            "ask-elders": [
              "Grandmother Janina remembered at once. “When I was a little girl, the wind stole the rope once before,” she said. “We found it in the old pear tree. Its branches have always reached up to the belfry.”",
              "They followed her round the tower. Grandmother raised her stick and pointed to a thick branch just below the shutter. There hung the bell rope, tangled in tight loops.",
              "Grandmother narrowed her eyes. “That wasn’t there in my day,” she muttered. In the fork, right beside the rope, a chaffinch had built a nest of moss and was keeping three chicks warm in it. One hard tug, and the little ones would fall."
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
          "“If she takes fright, the chicks will get cold,” the carpenter whispered. “We have to untangle the rope so the finch doesn’t so much as stir.”"
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
              "The carpenter climbed the ladder and untangled the rope loop by loop, without a single tug. Oliwia stood below and counted in a whisper: five, four, three, two, one.",
              "At the last knot the carpenter froze: the chaffinch had moved a wing. But she was only settling in the nest. A pear leaf drifted down from the branch onto Oliwia’s sleeve. She tucked it into her bag, next to the little reed basket from the bridge.",
              "The carpenter threaded the rope back into the tower and pulled, once, carefully. Instead of “ding-dong” a hoarse clank came from above, as if someone had knocked on a cracked pot. The bell had lost its voice."
            ],
            "lullaby": [
              "Oliwia and Gustaw began to hum a lullaby very softly, and the carpenter on the ladder loosened the rope in time with it, loop by loop. The chaffinch half closed her eyes and did not stir.",
              "The last knot came free just as the lullaby ended. The chicks were asleep, and the chaffinch was still keeping them warm. A pear leaf slipped from the branch onto Oliwia’s shoulder. She tucked it into her bag, next to the little reed basket from the bridge.",
              "Gustaw carried the rope to the tower and pulled. Everyone waited for “ding-dong”, but heard only a short, hoarse clank. Grandmother Janina shook her head. “Our bell has a frog in its throat, like me in winter.”"
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
              "The blacksmith came with her little hammer and a pouch of rivets. She drilled the bronze beside the crack and set them in softly, tap after tap, so as not to wake the chicks in the pear tree. The carpenter steadied the beam, so the bell would not swing.",
              "The baker brought a basket of warm oat rolls with honey, because the work would go on late into the night. Anyone who put down their tools helped themselves, and one roll was carried down for Koniczynka.",
              "Oliwia polished the bell with a linen cloth until the lantern light shone inside it. When the moon stood over the tower, three rivets gleamed on the bronze. “Now the crack won’t go any further,” said the blacksmith, putting her hammer away."
            ],
            "thank-bell": [
              "Everyone offered Grandmother a name: Thunder, Jingle, Big Bong… She only shook her head. At last the baker cried, “Evensong! She calls us every evening!” Grandmother’s eyes lit up. She remembered the rhyme.",
              "“When Evensong is hoarse, don’t weep or wail: turn her to the mountains and her voice won’t fail.” The carpenter understood first. “If we turn her, the clapper will strike fresh bronze, and the crack will stay to one side.”",
              "Gustaw and the carpenter loosened the fittings and turned Evensong towards the mountains. The baker, proud of his guess, brought a basket of honey rolls, still warm. He carried the sweetest-smelling one down for Koniczynka."
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
          "“Not too hard, the bronze is freshly mended,” the carpenter reminded them. “But Maciej has to hear us right up in the mountains.” The baker set off to the tower for the rope and glanced back at Oliwia. “How shall we welcome the new voice?”"
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
              "The square grew so quiet that you could hear the lantern wicks crackle. Only Koniczynka, with a white smudge of flour on her nose from her roll, snorted happily, and the children laughed."
            ],
            "share-song": [
              "The baker pulled the rope, and the whole square hummed along with the bell, then sang: “Ding-dong, come home!” No one could tell where the bronze ended and the voices began.",
              "In the pear tree the chicks lifted their heads and listened as hard as they could, as if to remember every note. And out of the dark, goat bells answered: Maciej the shepherd was coming down through the mist, straight towards the sound of the bell.",
              "Parents and children sang, the blacksmith and the carpenter too, and Grandmother Janina loudest of all. Even Koniczynka, with a white smudge of flour on her nose from her roll, nodded her head in time."
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
              0: "When the square had emptied, the chicks went on whistling the tune for a long while. Ever since, the bell has called the village home at dusk, and the chaffinches wake everyone at dawn with the same song. Moonhill has two voices now: one of bronze, one of feathers."
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
  },
  {
    id: "forest-oath",
    shortTitle: "The Forest Oath",
    title: "The Forest Oath",
    kicker: "A tale of a promise kept",
    pages: [
      {
        title: "The Morning That Did Not Come",
        body: [
          "Gustaw, Oliwia and the mare Koniczynka had spent the night in the clearing of Agata the charcoal burner, deep in Oakwood. Beside her hut stood a charcoal clamp: a mound of earth with wood slowly smouldering inside.",
          "After a night of storm, the sun should have been up, but the forest lay in milky mist and no birds sang. “The stag hasn’t come,” said Agata, puzzled. “Every morning a stag with a star between his antlers comes by. Wherever he goes, the mist clears, and I can take my charcoal to the smithy.”",
          "Then three piglets ran out of the mist. Oliwia spotted empty acorn cups and hoofprints in the moss. “Let’s see where they came from,” said Agata. “Hand in hand, step by step.”"
        ],
        choices: [],
        curiosityNote: {
          title: "Did you know...?",
          body: "In a charcoal clamp the wood does not blaze. It smoulders slowly under a layer of earth and turf, often for a dozen days or more. That is how charcoal was made for the smithy long ago."
        },
      },
      {
        title: "A Call in the Mist",
        body: [
          "They set off after the piglets, but just past the charcoal clamp the little ones stopped. Oliwia crouched down and stroked the biggest one’s back, and Koniczynka waited close behind her.",
          "Suddenly a voice called out in the mist: “Dot! Patch! Snout!” The piglets lifted their snouts, and Agata cupped a hand to her ear.",
          "“Someone’s looking for them,” Oliwia whispered. “But they’re leading us somewhere too.”"
        ],
        choices: [
          {
            id: "follow-piglets",
            label: "Keep following the piglets",
            response: "Oliwia will follow the piglets back to where they came from."
          },
          {
            id: "call-back",
            label: "Answer the call",
            response: "Oliwia will call into the mist, so whoever it is knows where they are."
          }
        ],
      },
      {
        title: "The Heartwood",
        bodyByChoice: {
          1: {
            "follow-piglets": [
              "The piglets led everyone through the mist to huge oaks behind a fence. The storm had knocked the gate flat. “This is the Heartwood,” Agata whispered. “The deer keep their winter larder here. We never let village pigs in.”",
              "The piglets ran straight to a boy with a hazel stick. “Dot, Patch, Snout… all here!” he counted quickly. It was Marcin, the swineherd from Dąbrówka. He saw Agata and froze.",
              "Oliwia picked up an empty acorn cup. “Our grandparents promised the Heartwood’s acorns to the deer,” Agata added, “and in return the stag brings us the morning.” Oliwia looked at the full-bellied piglets and understood: the stag with the star had led his herd away, for nothing was left to eat. The larder had to be filled again."
            ],
            "call-back": [
              "Oliwia called into the mist, “We’re over here!” Marcin, the swineherd from Dąbrówka, came running up, breathless. “Dot, Patch, Snout!” he cried happily. But the piglets only circled him and dashed on.",
              "At last the runaways stopped under huge oaks by a broken gate and rooted among empty acorn cups. Agata put her hand to her mouth. “This is the Heartwood, a shelter for wild animals. Pigs from the village must never come in here!”",
              "Agata told them of the oath: their grandparents had given the deer all that falls from the Heartwood’s oaks in autumn, and in return the stag brings the morning. Marcin hung his head. “The piglets ate it all,” Oliwia whispered, “so the stag led his herd away, and the mist stayed. We must gather a new winter store, quickly.”"
            ]
          }
        },
        choices: [],
      },
      {
        title: "Marcin Says Nothing",
        body: [
          "The mist grew paler, but still the sun did not come out. “Where are we going to find so many acorns?” Agata said anxiously. “The deer must eat their fill before winter comes. Marcin grazes his piglets in this forest every day, so he knows best where to look.”",
          "Marcin swallowed hard and blurted out, “The storm broke the gate! There was thunder and wind all night.” He said not a word about the piglets, though they kept rubbing against his legs.",
          "Marcin stared at the ground. Oliwia thought: he’s afraid we’ll be cross with him about the piglets. And as long as he’s scared, he won’t help us look for acorns. She took his hand. “Hand in hand, step by step,” she whispered. Marcin squeezed back, but still said nothing."
        ],
        choices: [
          {
            id: "ask-kindly",
            label: "Ask Marcin gently",
            response: "Oliwia will gently ask Marcin what happened in the night."
          },
          {
            id: "show-tracks",
            label: "Show Marcin the hoofprints",
            response: "Oliwia will show Marcin the little hoofprints in the moss, without a word of blame."
          }
        ],
      },
      {
        title: "The Truth About the Acorns",
        bodyByChoice: {
          3: {
            "ask-kindly": [
              "Oliwia asked gently, “What happened last night, Marcin? Nobody’s cross with you.” Marcin blinked, and then he began to talk so fast they could hardly keep up.",
              "“The thunder frightened the piglets and they ran out of their pen. They were hungry. I’ve been looking for them since dawn. And now the gate’s on the ground, and nothing but empty cups! I know every oak in the wood, and this year there’s hardly anything under them. I was scared to tell.”",
              "“It’s good that you told us.” Agata laid a hand on his shoulder. Worn out from roaming, the piglets fell asleep in the leaves. Gustaw lifted the broken gate and, without a word, showed everyone the crossbar. In the middle was a carved star, split in two: the sign of the old oath."
            ],
            "show-tracks": [
              "Without a word, Oliwia crouched and pointed at the little hoofprints in the moss. They led from the gate straight to the empty acorn cups. Then she smiled at Marcin, so he would know nobody was cross.",
              "Marcin crouched beside her and put a hand on his heart. “The deep ones are Dot’s. She always goes first,” he whispered. “In the night the thunder scared them out of their pen. They were hungry. I take them all round the wood every day, and this year there’s hardly anything under the oaks. I was scared to tell.”",
              "Agata leaned on her rake. “You’ve a good eye, Marcin. And it’s good that you told us.” Gustaw propped the gate against a post. On the crossbar was the star their grandparents had carved for the oath, now split in two."
            ]
          }
        },
        choices: [],
        curiosityNote: {
          title: "Did you know...?",
          body: "Long ago, every autumn, swineherds drove their pigs into the oak woods to eat their fill of acorns. Wild boar still search for acorns under the oaks every autumn."
        },
      },
      {
        title: "A Lean Year",
        body: [
          "Agata looked at the cracked star. “We promised the deer these acorns,” she said quietly. “But the piglets need to eat too.”",
          "Marcin thought hard. “I’ve got a sack of acorns in my hut at the edge of the forest. I’ve been gathering them all autumn, to feed the piglets through the winter. Out in the wood there’s only the odd one left, under the leaves.”",
          "Oliwia thought of the deer, who had to eat their fill before winter. The first frost of the year had already turned the grass white."
        ],
        choices: [
          {
            id: "give-sack",
            label: "Ask Marcin about his sack",
            response: "Marcin will decide for himself whether to give the deer his store of acorns."
          },
          {
            id: "gather-forest",
            label: "Gather acorns all through the forest",
            response: "Everyone will search the whole forest for acorns to carry to the Heartwood."
          }
        ],
      },
      {
        title: "A New Star",
        bodyByChoice: {
          5: {
            "give-sack": [
              "Oliwia looked at Marcin. “It’s your sack. You decide.” Marcin was silent for a long while. “Our grandparents gave their word, so I’ll keep it too.” He ran to his hut with Koniczynka, and the mare carried the sack to the Heartwood on her back.",
              "Agata added her own acorns. “We’ll find something for your piglets too. Everyone in the village will give a handful of oats.” Oliwia and Agata poured the acorns over the fence, where they dropped into the leaves with a soft rustle. “Hand in hand, step by step,” Marcin kept saying.",
              "Meanwhile Gustaw built a new gate of pale planks and hung it between the posts. Marcin set his chisel to the crossbar and tapped with his mallet until a star appeared, just like the old one. “Now it’s my promise too,” he said."
            ],
            "gather-forest": [
              "Together they went from oak to oak, with Marcin leading. “There’s always something under this one, and I picked that one clean yesterday,” he said. Agata raked the leaves aside, and here and there an acorn gleamed beneath them.",
              "Nobody snuffled about harder than the piglets. Under the beech trees they found beechnuts, little three-sided nuts, and crunched them up eagerly. “Those are for them, and the acorns are for the deer!” said Marcin happily.",
              "With their hands and Oliwia’s basket full, they returned to the Heartwood and tipped everything onto the moss. Gustaw and Agata built a new gate, and Marcin carved a star on its crossbar, just like the old one. The piglets, full of beechnuts, never even glanced at the acorns."
            ]
          }
        },
        choices: [],
        curiosityNote: {
          title: "Did you know...?",
          body: "Oaks do not grow the same number of acorns every year. One year there are heaps of them, then for several years far fewer. Foresters call a year of plenty a mast year."
        },
      },
      {
        title: "A Star in the Mist",
        body: [
          "When they had finished, the mist began to thin. A small golden star glinted between the trunks, and beneath it antlers appeared.",
          "The stag stepped calmly out of the mist, with the hinds and their young behind him. The smallest fawn was stuck behind a branch the storm had blown down, and bleated softly because it could not reach its mother.",
          "Everyone stood still, so as not to frighten the herd. “The fawn can’t get through on its own,” Marcin whispered, holding Oliwia’s hand tighter. Behind them Koniczynka gave a soft snort."
        ],
        choices: [
          {
            id: "make-way",
            label: "Step back and let the hind lead it",
            response: "Everyone will quietly step back under the trees and give the hind time to help her fawn herself."
          },
          {
            id: "help-fawn",
            label: "Let Koniczynka pull the branch away",
            response: "Gustaw will tie a rope round the far end of the branch, and Koniczynka will slowly pull it aside."
          }
        ],
      },
      {
        title: "Day Comes Back to the Forest",
        bodyByChoice: {
          7: {
            "make-way": [
              "Everyone quietly stepped back under the trees. After a while the hind came back for her fawn, nudged it with her nose and led it round the branch. Then the whole herd went through the new gate into the Heartwood, and soon came the crunch of acorns.",
              "Only the stag with the star walked on, down the path. Wherever he passed, the mist parted, and sunlight blazed between the oaks. The frost on the grass turned into shining drops.",
              "They followed him, not too close, the piglets trotting behind. “Hand in hand, step by step, straight into the sun!” Oliwia laughed. On the path she found a single acorn still in its cup and tucked it into her bag, beside the little reed basket and the pear leaf, to plant along the road ahead."
            ],
            "help-fawn": [
              "Gustaw tied a rope round the far end of the branch, and Koniczynka slowly pulled it aside. Nobody went near the fawn. It darted to its mother on its own and pressed against her side.",
              "The stag with the star gave them a calm look. The hinds went through the new gate into the Heartwood, and he set off through the forest. The mist drew back before him, one band at a time, and behind him the oaks turned gold in the sun.",
              "Gustaw stroked Koniczynka’s neck. “Well done, girl.” Where the branch had lain, Oliwia found an acorn still in its cup, safe through the storm. She tucked it into her bag, beside the little reed basket and the pear leaf, to plant along the road ahead. “Hand in hand, step by step, straight into the sun!” she sang as they set off."
            ]
          }
        },
        choices: [],
        curiosityNote: {
          title: "Did you know...?",
          body: "Stags shed their antlers every year, usually at the end of winter, and new ones start growing straight away. Forest mice love to gnaw shed antlers, because they are full of calcium."
        },
      },
      {
        title: "The Star on the Gate",
        body: [
          "By noon all of Oakwood shone gold. Soup was bubbling in Agata’s clearing, the piglets were asleep in the shade, and the deer were feeding in the Heartwood.",
          "Ever since, when people from Dąbrówka pass the gate with the star, they say: “A promise to the forest is kept, even in a lean year.” And Marcin always smiles when they do.",
          "The end."
        ],
        paragraphByChoice: {
          7: {
            "make-way": {
              0: "By noon all of Oakwood shone gold. Soup was bubbling in Agata’s clearing, the piglets were asleep in the shade, and the deer were feeding in the Heartwood."
            },
            "help-fawn": {
              0: "By noon all of Oakwood shone gold. Soup was bubbling in Agata’s clearing, the piglets were asleep in the shade, and in the Heartwood the smallest fawn never left its mother’s side."
            }
          },
          5: {
            "give-sack": {
              1: "Ever since, when people from Dąbrówka pass the gate with the star, they say: “A promise to the forest is kept, even in a lean year.” And Marcin always smiles when they do."
            },
            "gather-forest": {
              1: "Ever since, when people from Dąbrówka pass the gate with the star, they say: “A promise to the forest is kept, even in a lean year.” And every autumn the village gathers acorns for the Heartwood, hand in hand."
            }
          }
        },
        choices: [],
        ending: true
      }
    ]
  }
];
