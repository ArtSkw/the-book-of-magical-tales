// The sound script of the book (sound.js plays it), redesigned 2026-10-25 after the user read both
// tales with sound: immersion while reading calmly, never several layers at once on a page turn.
//
// - One continuous bed per setting: the place of the story and its time of day, as the set bibles'
//   colour scripts have them (evening, dusk, deep dusk, night). It runs on across pages, never
//   restarting, and changes only where the place or the time does: a long, slow crossfade that
//   starts once the new page has landed. A tale's title spread (and the book between tales) has the
//   reading room's own bed, the hearth.
// - No sound fires as a page lands. A page may have up to two spot sounds of what is in it (the
//   dragon breathing beside the children, the finches, Koniczynka, the bell): part of the place,
//   low, first heard some seconds after the page has settled, now and then again, or never more.
//   sound.js holds them back while anything else sounds (a turn, a choice, a theme).
// - Each tale has two themes: an opening one on its title spread and a closing one on its last
//   page, kin to each other (same instruments and key, in D or a key with D in it, so the D harp of
//   the choices sits with them). A theme or a spot whose file is not mastered (sounds.js) is simply
//   skipped, and a theme heard is not played again for the same page for a while.
// - The opening, like a film's (2026-10-26, after the user read the book with sound): the tale's
//   theme starts on its title spread over the hearth, and some seconds in (OPENING) the place of its
//   first page rises beneath the music, slowly taking over from the hearth; while the theme sounds
//   the bed stays several dB under its reading level (the theme lowers it), so the music leads. The
//   theme is never cut by a turn: it rings on to its natural end while the reader goes on into the
//   tale, the place bed simply carrying on into page 1 (no restart, no new crossfade) and settling
//   to its reading level as the music ends. Spot sounds wait for it, so page 1's first comes after
//   it. Back on the title spread while it still sounds, nothing starts again. If it ends with the
//   reader still on the title spread, the place stays there, at its reading level. It gives way,
//   with a gentle fade, only to another tale (a ribbon), "Begin again", or the sound turned off (a
//   hidden tab fades everything and resumes it). A closing theme gives way to any turn. No theme
//   (not mastered, heard a moment ago, or a tale opened straight at a later page): the beds as above.
//
// A new tale: add its places and pages here (and its files to scripts/sfx), nothing in sound.js.

// The reading room: under the title spreads, and between tales. Its candle sputters now and then.
export const ROOM = { loop: "room-bed", spots: [{ id: "candle-sputter", first: [20, 45], again: [40, 90], max: 3 }] };

// A spot: an id, or { id, first: [s, s] after the page lands, again: [s, s] | null, max plays, db }.
const SPOT = { first: [6, 20], again: [45, 120], max: 2 };
// The opening: the first page's place rises under the theme `at` s after the theme starts, over `rise` s.
const OPENING = { at: 5, rise: 8 };

export const TALES = {
  "dragon-bridge": {
    themes: { intro: "dragon-intro-theme", ending: ["dragon-ending-theme", "motif-end"] }, // the first that is mastered
    // the bridge over the brook, as the light goes (SET_BIBLE_dragon-bridge.md, colour script)
    places: {
      "bridge-evening": "db-bed-evening", // p1-3: early evening, the brook under the arch, reeds
      "bridge-dusk": "db-bed-dusk", // p4-7: cold misty dusk
      "bridge-deepdusk": "db-bed-deepdusk", // p8: deep dusk, the inn lit across the meadow
      "bridge-night": "db-bed-night", // p9-10: night
    },
    pages: {
      1: { place: "bridge-evening", spots: ["db-huff"] }, // the worried dragon on the bridge
      2: { place: "bridge-evening", spots: ["db-sigh", "db-peeps"] }, // its sigh; the peep, peep under the stones
      3: { place: "bridge-evening", spots: ["db-peeps", { id: "db-warm-breath", db: -3 }] }, // the mice's nest, the warmed pebble
      4: { place: "bridge-dusk", spots: ["db-warm-breath", "db-mice"] }, // its warm breath; the mice trembling
      5: { place: "bridge-dusk", variantFrom: 4, spots: { lantern: ["db-pennant"], bread: ["db-pennant", "db-mice"] } }, // the pennant in the wind
      6: { place: "bridge-dusk", spots: ["db-warm-breath"] }, // the dragon warms the cradle
      7: { place: "bridge-dusk", variantFrom: 6, spots: { crumbs: ["db-nibble", "db-peeps"], "warm-path": ["db-warm-breath", "db-peeps"] } },
      8: { place: "bridge-deepdusk", spots: ["db-sigh"] }, // the dragon by the cradle on the bank
      9: { place: "bridge-night", variantFrom: 8, spots: { "name-promise": ["db-warm-breath", "db-owl"], "wave-goodnight": ["db-breath-sleep", "db-owl"] } },
      10: { place: "bridge-night", ending: true, spots: [{ id: "db-breath-sleep", first: [18, 30] }] }, // asleep by the bridge, after the theme
    },
  },
  "moonhill-bell": {
    themes: { intro: "bell-intro-theme", ending: ["bell-ending-theme", "motif-end"] },
    // the hilltop village (SET_BIBLE_moonhill-bell.md, colour script)
    places: {
      "square-evening": "mh-bed-square-evening", // p1-2: the square at evening
      "orchard-evening": "mh-bed-orchard-evening", // p3: the pear orchard behind the tower
      "orchard-dusk": "mh-bed-orchard-dusk", // p4-5: the orchard at late dusk
      tower: "mh-bed-tower", // p6-7: inside the bell tower at night (the redo3 take)
      "village-night": "mh-bed-night", // p8-10: the village under the moon
    },
    pages: {
      1: { place: "square-evening", spots: ["mh-mare"] }, // Koniczynka stretching her nose to the orchard
      2: { place: "square-evening", spots: [{ id: "mh-mare", first: [15, 30], max: 1 }] }, // ... still gazing between the pear trees
      3: { place: "orchard-evening", variantFrom: 2, spots: { "follow-clover": ["mh-finch", "mh-mare"], "ask-elders": ["mh-finch"] } }, // the finches' nest beside the rope
      4: { place: "orchard-dusk", spots: [{ id: "mh-finch-stir", max: 1 }] }, // the sleeping nest (everyone keeps quiet)
      5: { place: "orchard-dusk", spots: [{ id: "mh-finch-stir", max: 1 }] }, // the finches sleep on
      6: { place: "tower", spots: ["mh-bronze"] }, // Janina's hand on the bronze
      7: { place: "tower", variantFrom: 6, spots: { "invite-smith": ["mh-rivets"], "thank-bell": ["mh-bronze"] } }, // the soft taps; the hands on the bell
      8: { place: "village-night", spots: ["mh-finch-stir"] }, // the finches stir in the orchard
      9: { place: "village-night", variantFrom: 8, spots: { "ring-gently": [{ id: "mh-bell", first: [5, 10], again: [60, 120], max: 2 }], "share-song": [{ id: "mh-bell", first: [5, 10], again: [60, 120], max: 2 }, { id: "mh-hum", first: [14, 24], max: 1 }] } },
      10: { place: "village-night", ending: true, variantFrom: 8, spots: { "ring-gently": [{ id: "mh-bell-far", first: [18, 30], max: 1 }], "share-song": [{ id: "mh-chicks", first: [18, 30], max: 1 }] } },
    },
  },
};

const norm = (s) => ({ ...SPOT, ...(typeof s === "string" ? { id: s } : s) });
const first = (v) => [].concat(v || []);

// What a spread sounds like: { bed (a loop id), spots: [{ id, first, again, max, db }], theme (an id
// list, the first mastered one plays) | null, ring (the theme rings on across the turns of its tale),
// opening ({ bed, at, rise }: the place rising under an opening theme) | null, key } for tale
// `taleId`, story page `page` (0 = its title spread), `resolved` = { choicePage: choiceId } (main.js
// resolved()).
export function sceneFor(taleId, page, resolved = {}) {
  const T = TALES[taleId];
  if (!T || !page) {
    const opening = !page && T?.places[T.pages[1]?.place] ? { bed: T.places[T.pages[1].place], ...OPENING } : null;
    return { bed: ROOM.loop, spots: ROOM.spots.map(norm), theme: page ? null : first(T?.themes?.intro), ring: true, opening, key: `${taleId}|${page}` };
  }
  const P = T.pages[page] || {};
  let spots = P.spots || [];
  let variant = "";
  if (!Array.isArray(spots)) {
    variant = resolved[P.variantFrom] || Object.keys(spots)[0];
    spots = spots[variant] || Object.values(spots)[0] || [];
  }
  return { bed: T.places[P.place] || ROOM.loop, spots: spots.slice(0, 2).map(norm), theme: P.ending ? first(T.themes?.ending) : null, ring: false, opening: null, key: `${taleId}|${page}|${variant}` };
}

// Every id a tale may play, to load it ahead (sound.js preloadTale).
export function taleIds(taleId) {
  const T = TALES[taleId];
  if (!T) return [];
  // the themes first (the opening one is wanted as soon as the tale is open), then the beds, then the spots
  const ids = new Set([...first(T.themes?.intro), ...first(T.themes?.ending), ...Object.values(T.places)]);
  for (const P of Object.values(T.pages)) {
    const sp = Array.isArray(P.spots) ? P.spots : Object.values(P.spots || {}).flat();
    for (const s of sp) ids.add(norm(s).id);
  }
  return [...ids];
}
