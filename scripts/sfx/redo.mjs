// The sounds the user asked to have changed on the library sheet (2026-10-25), and how: three
// takes heard as dry, stiff or sharp, made gentler by processing (lib.mjs oneshot `soft`: a slower
// attack, a low-pass, de-essing for the quill, a little small room, a slower fade). The redo sheet
// (sheets.mjs, ?sheet=redo) plays each raw and at both strengths; picks.mjs ships the user's choice
// (--redo <export>), until then "soft". The rejected room bed became the hearth (see picks.mjs).
export const REDO = {
  "ribbon-silk": { soft: { attack: 0.03, lp: 6000, room: 0.25, fade: 0.15 }, softer: { attack: 0.05, lp: 4500, room: 0.35, fade: 0.22 } },
  "quill-rewrite": { soft: { attack: 0.015, lp: 7000, deess: 0.5, room: 0.2, fade: 0.25 }, softer: { attack: 0.025, lp: 5500, deess: 0.8, room: 0.3, fade: 0.35 } },
  "cover-open": { soft: { attack: 0.08, lp: 5500, room: 0.25, fade: 0.4 }, softer: { attack: 0.12, lp: 4000, room: 0.35, fade: 0.6 } },
};
