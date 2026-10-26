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
          "Toward evening, Sir Gustaw and little Oliwia came to an old stone bridge. For as long as anyone could remember, packhorses with saddlebags, millers with sacks of flour and children carrying milk to the village had crossed it.",
          "Moss grew between the stones, soft as a green blanket, and a brook murmured under its single arch. In the very middle of the bridge sat a copper dragon. For a dragon it was small, about the size of a horse. It did not look fierce at all. It looked worried.",
          "It did not roar, and it frightened no one. It sat up straight with its front paws resting on the wall and its tail curled around one loose stone, as if it were guarding something very fragile."
        ],
        choices: [],
      },
      {
        title: "A Little Surprise",
        body: [
          "The dragon sighed and let out a puff so small it could have fitted in a milk cup. The puff was golden at the edges, and it sank onto the loose stone slowly, ever so slowly.",
          "Then, from beneath the stones, came a tiny sound: peep, peep, peep. The brook nearly drowned it out, and the reeds leaned in the wind as if they wanted to listen too.",
          "Gustaw did not take a single step. He rested his shield against his knee and breathed slowly. Oliwia breathed with him, and she never took her eyes off the dragon."
        ],
        choices: [
          {
            id: "ask",
            label: "Ask what happened",
            response: "A gentle question will give the dragon courage to show what it is guarding."
          },
          {
            id: "listen",
            label: "Wait and listen",
            response: "In the quiet, Oliwia will hear the faintest peep from under the stone."
          }
        ],
      },
      {
        title: "The Stone's Secret",
        body: [
          "Oliwia knelt at the edge of the bridge and found a nest of river mice, tucked in among moss, lime and tiny grass roots.",
          "The smallest mouse was hiding behind a stone warmed by the dragon's breath. The dragon was afraid that every step on the bridge would frighten the little family out of their home.",
          "The dragon had not closed the road on a whim. The loose stone rocked under every step, and the little nest trembled with it. Someone had to guard those too small to call for help themselves."
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
              1: "Underneath, Oliwia saw a nest of river mice, tucked in among moss, lime and tiny grass roots. The smallest mouse was hiding behind a stone warmed by the dragon's breath."
            },
            listen: {
              0: "Oliwia waited in silence until the peep came again. It came from the edge of the bridge, where moss covered a narrow crack between the stones.",
              1: "Inside was a nest of river mice, tucked in among lime and tiny grass roots. The smallest mouse was shivering behind a stone warmed by the dragon's breath."
            }
          }
        },
        choices: [],
      },
      {
        title: "A First Small Gesture",
        body: [
          "The evening grew chilly, and mist rose from the brook like a white ribbon. In the mossy crack, the mice trembled and twitched their whiskers.",
          "Gustaw held a lantern, Oliwia held half a loaf of rye bread wrapped in linen, and the dragon breathed out warmth so gently it would not have blown out a candle.",
          "They had to begin with something small and calm: a gesture that would not frighten the mice and would show the dragon it could trust the travellers."
        ],
        choices: [
          {
            id: "lantern",
            label: "Hold up the lantern",
            response: "The lantern light will show where a hand can safely reach."
          },
          {
            id: "bread",
            label: "Share the bread",
            response: "The smell of bread will give the mice courage."
          }
        ],
      },
      {
        title: "The Red Pennant",
        body: [
          "Gustaw planted a red pennant by the path to the mill. It fluttered in the wind, and the people in the village saw that something important was happening on the bridge.",
          "Soon the miller came with an armful of sheep's wool, the baker with a clean kerchief, and the basket maker with a bundle of reeds that smelled of rain. Each of them brought something different.",
          "Nobody laughed at how small the matter was."
        ],
        echoes: {
          3: {
            lantern: "Gustaw held the lantern high, so the helpers could see where to stand.",
            bread: "Oliwia shared the bread, so the mice dared to peek out."
          }
        },
        paragraphByChoice: {
          3: {
            lantern: {
              0: "Gustaw planted a red pennant by the path to the mill and held his lantern high. Its light showed the safest stones under the moss, and the pennant gave the village a sign.",
              1: "Soon the miller came with an armful of sheep's wool, the baker with a clean kerchief, and the basket maker with a bundle of reeds that smelled of rain. In the bright light, each of them knew where to step."
            },
            bread: {
              0: "Gustaw planted a red pennant by the path to the mill, while crumbs of bread waited beside the mossy crack. The pennant fluttered and gave the village a sign.",
              1: "The mice smelled the bread and poked out their noses just as the miller arrived with sheep's wool, the baker with a clean kerchief, and the basket maker with reeds that smelled of rain."
            }
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
          "The basket maker wove a cradle from reeds, wool and dry moss, and the baker lined it with her clean kerchief. The cradle came out as round as a nutshell and as light as a spring leaf.",
          "The dragon lowered its snout and warmed the cradle with one tiny breath. The mice blinked and their whiskers quivered, but not one of them ran away.",
          "Now the nest had to move from the stone into the cradle. A move like that needs careful hands and even calmer hearts."
        ],
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
              0: "The dragon leaned over the wall and breathed on the stones, one after another, from the crack all the way to the cradle. The stones grew warm and glowed amber, like embers that no longer burn. The first mouse crossed them as if on a rug and stepped onto the wool. Then the second.",
              1: "The smallest came last, following the dragon's warm nose. When all three were snug inside, the basket maker lifted the cradle ever so gently, and Gustaw slid his shield underneath so that no one could fall."
            }
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
          "When the mice were safe, the dragon stepped off the road, and the bridge was open again. Oliwia promised the dragon that at the inn she would ask every traveller to cross it gently. And the miller promised that tomorrow, with the bridge money, he would set the loose stone firmly back in place.",
          "Gustaw's sword gleamed in its scabbard. Not because anyone had won a battle, but because someone smaller had been helped.",
          "The book rustled a page. It wanted to see how they would say goodbye before the path led the travellers on to an inn full of candles."
        ],
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
        title: "On Tiptoe Across the Bridge",
        body: [
          "The villagers crossed the bridge one by one. Each of them glanced down to where the new mouse cradle sat among the reeds.",
          "The dragon curled up on a warm stone. It seemed smaller now than when everyone had been afraid of it, but it was still keeping watch nearby.",
          "Oliwia understood that a closed road is sometimes waiting for a question. And that before you push on, it is best to listen."
        ],
        echoes: {
          7: {
            "name-promise": "The dragon heard a thank-you, so it left the bridge one of its scales.",
            "wave-goodnight": "Oliwia waved goodnight, so the dragon could sleep at last."
          }
        },
        paragraphByChoice: {
          7: {
            "name-promise": {
              0: "The dragon gave the bridge one of its own copper scales and, with a warm breath, set it into the wall right beside the mice's old home. At night the scale glowed like a little lantern. Everyone who crossed the bridge slowed down beside it and went on tiptoe.",
              1: "The dragon kept watch by the cradle with its eyes wide open. It no longer needed to close the road, because now the bridge itself reminded everyone: tread gently, little ones live close by."
            },
            "wave-goodnight": {
              0: "The dragon blinked sleepily, curled itself around the cradle and fell asleep, for the first time since the stone had come loose. The villagers tiptoed across the bridge and shushed one another in whispers so as not to wake it.",
              1: "With every sleepy breath, a wisp of warm golden air drifted from the dragon's nostrils. It wrapped the cradle in warmth and slowly melted into the dark, and the mice slept snug until morning."
            }
          }
        },
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
              0: "Long after the candles had gone out at the inn, a dragon slept by the old bridge. Beside it, in a cradle of reeds, the river mice slept too, and wisps of warm, sleepy dragon breath melted into the air above them.",
              1: "On the last page, the book wrote very quietly: strength can shelter, courage can listen, and even the most faithful guardian can sleep in peace when it knows it is not alone."
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
          "In Moonhill, the evening bell called everyone home each day. It rang when blue smoke curled from the chimneys and the hens went looking for their roosts.",
          "But that evening, the bell tower was silent. Families came out into the square in woollen shawls, with horn lanterns in their hands, and everyone looked up and listened.",
          "Gustaw tipped his head back too. Meanwhile, Oliwia noticed that Koniczynka, his patient mare, was stretching her nose toward the path to the old orchard, where moths glimmered like silver leaves."
        ],
        choices: [],
        curiosityNote: {
          title: "Did you know...?",
          body: "In the Middle Ages, the evening bell also told people to cover the fire in the hearth, so no house would burn at night. The French called it \"couvre-feu\", and so English got the word curfew."
        },
      },
      {
        title: "A Key, a Rope and a Mare's Nose",
        body: [
          "The reeve thought of the key to the tower. The baker looked around for the bell rope. And the children looked toward the orchard, because Koniczynka kept gazing between the pear trees.",
          "Oliwia felt a little knot in her tummy, but she listened to everyone in turn. Soon the whole village was wondering together why the bell was silent and how to help it.",
          "They could follow the mare's nose toward the silver moths. Or they could ask the oldest villagers whether the mountain wind had been up to its tricks."
        ],
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
            "ask-elders": "The village asked the elders, so the book remembered the old wind."
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
        choices: [],
      },
      {
        title: "Quiet by the Nest",
        body: [
          "The carpenter brought an ash ladder and set it down so softly that not even the stones by the wall heard a thing.",
          "The baker wrapped the bottom rung in cloth, Oliwia kept her eyes on the fluffy nest, and Koniczynka stood perfectly still, as if even her tail knew how to keep quiet.",
          "The rope had to be freed the right way. But how can you be strong and gentle at the same time, with birds asleep right beside you?"
        ],
        choices: [
          {
            id: "move-slowly",
            label: "Untangle it slowly",
            response: "Slow hands will let the finches sleep on."
          },
          {
            id: "lullaby",
            label: "Hum the finches a lullaby",
            response: "A soft lullaby will keep the finches from waking."
          }
        ],
      },
      {
        title: "A Free Rope, a Hoarse Bell",
        body: [
          "Loop by loop, the rope came loose. A pear leaf drifted down onto Oliwia's sleeve, as if to tell her she had chosen well.",
          "When the last knot slipped free, everyone smiled without a sound. The finches slept on, snug under their mother's wing.",
          "The rope hung from the tower once more. But when the carpenter gave it a gentle pull, there was only a hoarse rattle, as if the bell had lost its voice."
        ],
        echoes: {
          3: {
            "move-slowly": "Everyone moved slowly, so the nest stayed quiet.",
            "lullaby": "Oliwia and Gustaw hummed a lullaby, so the finches slept as if under a spell."
          }
        },
        paragraphByChoice: {
          3: {
            "move-slowly": {
              0: "Loop by loop, the rope came loose, and every hand moved as slowly as dust drifting in lantern light. A pear leaf drifted down onto Oliwia's sleeve.",
              1: "When the last knot slipped free, everyone smiled without a sound. The finches slept on, snug under their mother's wing."
            },
            "lullaby": {
              0: "Oliwia and Gustaw began to hum a lullaby very softly, and the carpenter loosened the rope loop by loop in time with it. A pear leaf drifted down onto Oliwia's sleeve.",
              1: "When the last knot slipped free, the lullaby faded away. The finches slept on, snug under their mother's wing, and the smallest one moved its beak as if humming in its sleep."
            }
          }
        },
        choices: [],
      },
      {
        title: "A Crack and a Forgotten Name",
        body: [
          "Inside the tower, along the rim of the bronze bell, ran a crack as thin as a hair. They only saw it when they brought the lantern very close.",
          "The carpenter touched the bell with two fingers and nodded. “No use being cross about it. Tonight we'll help it find its voice again.”",
          "Grandmother Janina stroked the bronze. “This bell had a name once. We used to call it by its name, and now no one remembers it.”"
        ],
        choices: [
          {
            id: "invite-smith",
            label: "Ask the blacksmith for help",
            response: "The blacksmith will bring a little hammer and shiny rivets."
          },
          {
            id: "thank-bell",
            label: "Remember the bell's name",
            response: "Grandmother Janina will search her memory for the name the bell was given at its christening."
          }
        ],
      },
      {
        title: "Three Shining Rivets",
        body: [
          "By candlelight and moonlight, the villagers worked in a circle. The blacksmith tapped softly, the carpenter held the beam steady, and the baker passed oat rolls from hand to hand.",
          "Oliwia polished the bell with a linen cloth until the lantern light gleamed inside it. Down below, Koniczynka pricked up her ears, listening for any sound from above.",
          "The silent tower became a workshop, and everyone in it looked like a family gathered round someone they would never leave alone."
        ],
        echoes: {
          5: {
            "invite-smith": "The blacksmith came, so the tower filled with careful tapping.",
            "thank-bell": "Grandmother Janina remembered the bell's name, so the bronze woke up."
          }
        },
        paragraphByChoice: {
          5: {
            "invite-smith": {
              0: "By candlelight and moonlight, the blacksmith tapped in shiny rivets with a little hammer. The carpenter held the beam steady, and the baker passed oat rolls from hand to hand.",
              1: "Between one careful tap and the next, Oliwia polished the bell with a linen cloth until the lantern light gleamed inside it. Down below, Koniczynka pricked up her ears, listening for any sound from above."
            },
            "thank-bell": {
              0: "By candlelight and moonlight, Grandmother Janina remembered the bell's name: Wieczornica, because every evening it gathered the neighbours. Everyone laid their hands on the bell and whispered its name together, and the bronze trembled warmly, as if waking up.",
              1: "Then Oliwia polished it with a linen cloth, the blacksmith tapped softly and the carpenter held the beam steady. Down below, Koniczynka pricked up her ears, listening for any sound from above."
            }
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
              body: "Old bells were given names, and blessing a new bell was called its christening. The famous bell of Wawel Castle in Kraków was cast in 1520 and named Zygmunt, after the king. It still rings today."
            }
          }
        },
      },
      {
        title: "Welcoming the New Voice",
        body: [
          "At last the bell was ready. It would never ring as loudly as before, but the blacksmith smiled: “A quiet voice can still call people home.”",
          "The moon peeped out from the clouds above the tower. The finches stirred in the orchard, and the children in the square held their breath. The whole village was listening and waiting.",
          "The book paused before one last gesture. How should they welcome the new voice of the bell they all needed?"
        ],
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
          "Moonhill remembered that the whole village had mended the bell, and everyone had added something of their own."
        ],
        echoes: {
          7: {
            "ring-gently": "The pull was gentle, so the first note rang clear and pure.",
            "share-song": "The village hummed along, so the first note was not alone."
          }
        },
        paragraphByChoice: {
          7: {
            "ring-gently": {
              0: "The bell rang more softly than before, but its voice was clear and sweet. The gentle pull carried the note from house to house.",
              1: "Parents and children, the elders, the baker, the blacksmith, the carpenter and a very proud Koniczynka all listened together. She had a white smudge of flour on her nose from the rolls she had eaten."
            },
            "share-song": {
              0: "The bell rang more softly than before, and the villagers hummed along until no one could tell where the bell ended and the voices began.",
              1: "Parents and children, the elders, the baker, the blacksmith, the carpenter and a very proud Koniczynka all listened together. In the orchard, a little finch lifted its head and listened too."
            }
          }
        },
        choices: [],
        curiosityNoteByChoice: {
          7: {
            "ring-gently": {
              title: "Did you know...?",
              body: "A bell could say different things: fast ringing meant danger, slow ringing meant sorrow. In mountain villages it rang long into foggy nights, so lost travellers could find their way home."
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
                0: "Long after supper, silver moths fluttered in from the orchard. The polished bell gleamed in the moonlight, so they settled on its three rivets and shimmered like three little stars.",
                1: "Ever since, they come back each evening when the bell gently calls everyone home. And people say that Moonhill wears three little stars in memory of that night."
              },
              "share-song": {
                0: "Long after supper, the finch chicks wriggled in their nest and, half asleep, softly sang back the tune they had heard from the square.",
                1: "Ever since, the bell calls the village home in the evening, and at dawn the finches wake it with the same song. Now Moonhill has two voices: one of bronze and one of feathers."
              }
          }
        },
        choices: [],
        ending: true
      }
    ]
  }
];
