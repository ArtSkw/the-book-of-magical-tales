// Spread manifest for the 3D book. Swap illustrations here; no code changes needed.
//
// Each entry describes one open spread:
//   page        story page 1..10 (0 = the title spread before the tale begins)
//   layout      omitted    – chosen from the page's content: "plate" when choices or a "Did you
//                            know" note sit under the picture, "full" when nothing does. The left
//                            page carries only text, so the art's format follows (pageArt warns
//                            in the console when an image's aspect does not fit)
//               "full"     – portrait 2:3 illustration fills the right page inside a parchment margin
//               "plate"    – framed 5:4 picture, the width of the text column, on the right page with
//                            the choices or the note under it (pageArt.js PLATE)
//               "vignette" – text runs across both pages; transparent spot images sit
//                            below/beside the text (`images` on the right page, `secondary` on the left)
//               "title"    – the title spread (dedication + title page)
//   images      keyed by choice variant: { default: img } or { lantern: img, bread: img }
//   variantFrom story page (1-based) whose choice selects the variant; omitted = always `default`
//   img         a URL under public/ ("/assets/...") or { src, focus, crop, frame, alt }
//               focus = which part of the picture to keep when it is cropped to the frame (0..1)
//               crop  = fractions [l, t, r, b] to trim before framing
//               frame = "gilded" (default: code-drawn gold band) | "painted" (the image carries its
//                       own frame line; only a hairline rule and corner dots are added)
//   tailpiece   optional transparent ornament placed under the text when the page has room
//   alt         { pl, en } short description for the screen-reader mirror (may sit on img or entry)
//
// Art: style A v2 (docs/pilot/MANUSCRIPT_BIBLE.md, SET_BIBLE_*.md), graded with prototypes/grade.py.
// full = 2:3 portrait, plate = 5:4, vignette = transparent webp cropped to the drawing.
// Plates are generated at 1536x1024 with a 5:4 safe area (prompts/_build_a2.py) and exported as
// 1280x1024 crops by prototypes/export_webp.py --plate <focus>. Dragon crop focus (0 = left edge,
// 1 = right edge), chosen so every figure and story prop stays in: p2 0.5, p4 0.35, p5-lantern 1.0
// (pennant), p5-bread 0.2 (mill), p6 0.4, p7-crumbs 0.15 (dragon's head), p7-warm-path 0.85
// (cradle), p8 0.4 (pennant, lit inn), p9-name-promise 0.7 (pennant, five villagers),
// p9-wave-goodnight 0.5. Older 3:2 plates (Moonhill, until its own pass) are cropped live by `focus`.
// Tailpieces are the shared marginal ornaments, so each tale gets plants and small beasts, not one motif.

const V = "/assets/illustrations/v2";
const DB = `${V}/dragon-bridge`;
const MH = `${V}/moonhill-bell`;
const OR = `${V}/ornaments`;
const img = (src, pl, en) => ({ src, alt: { pl, en } });

export const dragonSpreads = [
  { page: 0, layout: "title", images: { default: img(`${DB}/title.webp`, "Złoty medalion: miedziany smok śpi na łuku mostu, spod ogona wyglądają trzy myszki.", "A gold medallion: the copper dragon asleep on the arch of a bridge, three mice peeping from under its tail.") } },
  { page: 1, tailpiece: `${OR}/strawberry-snail.webp`, images: { default: img(`${DB}/p1.webp`, "Gustaw i Oliwia pod dębem patrzą na zmartwionego smoka na środku mostu.", "Gustaw and Oliwia under the oak look at the worried dragon in the middle of the bridge.") } },
  { page: 2, tailpiece: `${OR}/reeds-dragonfly.webp`, images: { default: img(`${DB}/p2.webp`, "Smok wychyla się nad murek, a złoty obłoczek opada pod most.", "The dragon leans over the wall as a golden puff drifts down under the bridge.") } },
  {
    page: 3, tailpiece: `${OR}/oak-wren.webp`, variantFrom: 2,
    images: {
      ask: img(`${DB}/p3-ask.webp`, "Smok uchyla pazurem kamień, pod nim gniazdko myszek; Oliwia klęczy obok.", "The dragon lifts the stone with a claw to show the mice's nest; Oliwia kneels beside it."),
      listen: img(`${DB}/p3-listen.webp`, "Oliwia nasłuchuje przy szczelinie, Gustaw zamarł w pół kroku.", "Oliwia listens at the crack while Gustaw freezes mid-step."),
    },
  },
  { page: 4, tailpiece: `${OR}/hedgehog-clover.webp`, images: { default: img(`${DB}/p4.webp`, "Gustaw z latarnią, Oliwia z chlebem i smok pochylają się nad trzema myszkami.", "Gustaw with the lantern, Oliwia with bread and the dragon bend over the three mice.") } },
  {
    page: 5, tailpiece: `${OR}/columbine-hare.webp`, variantFrom: 4,
    images: {
      lantern: img(`${DB}/p5-lantern.webp`, "Pomocnicy z młyna idą na most, gdzie Gustaw unosi latarnię.", "The helpers from the mill walk onto the bridge where Gustaw holds up the lantern."),
      bread: img(`${DB}/p5-bread.webp`, "Trzy myszki wysuwają noski ku chlebowi, nadchodzą pomocnicy.", "Three mice poke out their noses toward the bread as the helpers arrive."),
    },
  },
  { page: 6, tailpiece: `${OR}/reeds-dragonfly.webp`, images: { default: img(`${DB}/p6.webp`, "Wikliniarz trzyma kołyskę, smok ogrzewa ją oddechem, myszki patrzą z murka.", "The basket maker holds the cradle, the dragon warms it, the mice watch from the wall.") } },
  {
    page: 7, tailpiece: `${OR}/mice-wool.webp`, variantFrom: 6,
    images: {
      crumbs: img(`${DB}/p7-crumbs.webp`, "Myszki idą ścieżką z okruszków do kołyski, najmniejsza zjada okruszek; Oliwia klęczy obok.", "The mice follow a trail of crumbs to the cradle, the smallest nibbling one; Oliwia kneels beside them."),
      "warm-path": img(`${DB}/p7-warm-path.webp`, "Smok chucha na kamienie, które złocą się ciepłem, a myszki idą po nich do kołyski.", "The dragon breathes on the stones, which glow warm and golden, and the mice walk across them to the cradle."),
    },
  },
  { page: 8, tailpiece: `${OR}/fleuron.webp`, images: { default: img(`${DB}/p8.webp`, "Gustaw i Oliwia idą przez otwarty most, smok siedzi przy kołysce na brzegu.", "Gustaw and Oliwia walk across the open bridge; the dragon sits by the cradle on the bank.") } },
  {
    page: 9, tailpiece: `${OR}/owl-hazel.webp`, variantFrom: 8,
    images: {
      "name-promise": img(`${DB}/p9-name-promise.webp`, "Nocą mieszkańcy idą na palcach obok miedzianej łuski, która świeci w murku; smok czuwa przy kołysce.", "At night the villagers tiptoe past the copper scale glowing in the wall; the dragon keeps watch by the cradle."),
      "wave-goodnight": img(`${DB}/p9-wave-goodnight.webp`, "Nocą mieszkańcy idą na palcach, a smok śpi wokół kołyski; nad nią krążą złote obłoczki.", "At night the villagers tiptoe across while the dragon sleeps round the cradle under drifting golden puffs."),
    },
  },
  {
    page: 10, layout: "vignette", variantFrom: 8, secondary: img(`${OR}/fleuron.webp`, "Ozdobnik.", "An ornament."),
    images: {
      "name-promise": img(`${DB}/p10-name-promise.webp`, "Złoty medalion: smok czuwa przy kołysce, nad nią w murku świeci miedziana łuska.", "A gold medallion: the dragon keeps watch by the cradle, the copper scale glowing in the wall above."),
      "wave-goodnight": img(`${DB}/p10-wave-goodnight.webp`, "Złoty medalion: smok śpi wokół kołyski, nad nią krążą złote obłoczki.", "A gold medallion: the dragon asleep round the cradle under drifting golden puffs."),
    },
  },
];

export const moonhillSpreads = [
  { page: 0, layout: "title", images: { default: img(`${MH}/title.webp`, "Złoty medalion: wieża z dzwonem pod sierpem księżyca i gniazdo zięb na gałęzi gruszy.", "A gold medallion: the bell tower under a crescent moon and a finch nest on a pear branch.") } },
  { page: 1, layout: "full", tailpiece: `${OR}/oak-wren.webp`, images: { default: img(`${MH}/p1.webp`, "Rodziny z latarniami patrzą na milczącą wieżę; Koniczynka wyciąga pysk ku sadowi.", "Families with lanterns look up at the silent tower; Koniczynka points her nose toward the orchard.") } },
  // 3:2 art in the 5:4 plate: the window sits right of centre to keep Koniczynka's head (and the reeve's key)
  { page: 2, layout: "plate", tailpiece: `${OR}/hedgehog-clover.webp`, images: { default: { ...img(`${MH}/p2.webp`, "Wójt z kluczem, piekarz patrzy w górę, dzieci i Koniczynka spoglądają ku sadowi.", "The reeve with his key, the baker looking up, the children and Koniczynka gazing toward the orchard."), focus: [0.8, 0.5] } } },
  {
    page: 3, layout: "full", tailpiece: `${OR}/strawberry-snail.webp`, variantFrom: 2,
    images: {
      "follow-clover": img(`${MH}/p3-follow-clover.webp`, "Koniczynka prowadzi pod gruszę, gdzie lina zaplątała się obok gniazda zięb.", "Koniczynka leads them to the pear tree where the rope is tangled beside the finch nest."),
      "ask-elders": img(`${MH}/p3-ask-elders.webp`, "Babcia Janina pokazuje laską gałąź z zaplątaną liną.", "Grandmother Janina points her stick at the branch with the tangled rope."),
    },
  },
  { page: 4, layout: "plate", tailpiece: `${OR}/columbine-hare.webp`, images: { default: img(`${MH}/p4.webp`, "Cieśla cicho stawia drabinę, piekarz owija szczebel, Oliwia patrzy na gniazdo.", "The carpenter quietly sets the ladder, the baker wraps a rung, Oliwia watches the nest.") } },
  {
    page: 5, layout: "vignette", variantFrom: 4, secondary: img(`${OR}/owl-hazel.webp`, "Sowa na leszczynie.", "An owl on a hazel branch."),
    images: {
      "move-slowly": img(`${MH}/p5-move-slowly.webp`, "Cieśla powoli odplątuje linę przy śpiących ziębach.", "The carpenter slowly untangles the rope beside the sleeping finches."),
      "steady-ladder": img(`${MH}/p5-steady-ladder.webp`, "Gustaw i piekarz trzymają drabinę, cieśla opuszcza linę.", "Gustaw and the baker hold the ladder while the carpenter lowers the rope."),
    },
  },
  { page: 6, layout: "full", tailpiece: `${OR}/fleuron.webp`, images: { default: img(`${MH}/p6.webp`, "W świetle latarni widać cienkie pęknięcie na brzegu dzwonu.", "In the lantern light a hair-thin crack shows on the bell's rim.") } },
  {
    page: 7, layout: "plate", tailpiece: `${OR}/oak-wren.webp`, variantFrom: 6,
    images: {
      "invite-smith": img(`${MH}/p7-invite-smith.webp`, "Kowalka wbija nity, piekarz podaje bułeczki, Oliwia poleruje dzwon.", "The blacksmith sets the rivets, the baker passes rolls, Oliwia polishes the bell."),
      "thank-bell": img(`${MH}/p7-thank-bell.webp`, "Mieszkańcy kładą dłonie na dzwonie i dziękują mu.", "The villagers lay their hands on the bell and thank it."),
    },
  },
  { page: 8, layout: "full", tailpiece: `${OR}/strawberry-snail.webp`, images: { default: img(`${MH}/p8.webp`, "Dzieci wstrzymują oddech, nad wieżą wschodzi księżyc.", "The children hold their breath as the moon rises over the tower.") } },
  {
    page: 9, layout: "plate", tailpiece: `${OR}/owl-hazel.webp`, variantFrom: 8,
    images: {
      "ring-gently": img(`${MH}/p9-ring-gently.webp`, "Cała wioska słucha cichego głosu dzwonu.", "The whole village listens to the bell's quiet voice."),
      "share-song": img(`${MH}/p9-share-song.webp`, "Mieszkańcy nucą razem z dzwonem, złota wstęga melodii płynie nad placem.", "The villagers hum with the bell as a golden ribbon of melody drifts over the square."),
    },
  },
  {
    page: 10, layout: "vignette", variantFrom: 8, secondary: img(`${OR}/fleuron.webp`, "Ozdobnik.", "An ornament."),
    images: {
      "ring-gently": img(`${MH}/p10-ring-gently.webp`, "Naprawiony dzwon odpoczywa w wieży pod sierpem księżyca.", "The mended bell rests in the tower under the crescent moon."),
      "share-song": img(`${MH}/p10-share-song.webp`, "Wieża z dzwonem i śpiące zięby na gałęzi gruszy.", "The bell tower and the finches asleep on the pear branch."),
    },
  },
];

// Kept for older imports: the first tale's spreads.
export const spreads = dragonSpreads;

// Normalises an image entry and picks the variant for the current choices.
export function spreadImage(spread, choices) {
  const key = spread.variantFrom ? choices[spread.variantFrom] : "default";
  const entry = spread.images?.[key] || spread.images?.default || Object.values(spread.images || {})[0];
  return normaliseImage(entry);
}

export function normaliseImage(entry) {
  if (!entry) return null;
  const img = typeof entry === "string" ? { src: entry } : { ...entry };
  img.focus ||= [0.5, 0.5];
  img.crop ||= [0, 0, 0, 0];
  img.frame ||= "gilded";
  return img;
}

export function allImageSources(list = spreads) {
  const out = new Set();
  for (const s of list) {
    for (const e of Object.values(s.images || {})) out.add(normaliseImage(e).src);
    if (s.secondary) out.add(normaliseImage(s.secondary).src);
    if (s.tailpiece) out.add(normaliseImage(s.tailpiece).src);
  }
  return [...out];
}
