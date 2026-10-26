# The Book of Magical Tales

*Księga Magicznych Opowieści*

An interactive storybook for a parent and child to read together, styled as an
old book open on a candlelit table. The child makes choices along the way, and
the tale remembers them.

**Read it:** https://artskw.github.io/the-book-of-magical-tales/

## Reading together

The book is made for short sessions with a parent, not for a child alone with
a screen. The choices are a reason to stop and talk.

- Each tale is built around a value, such as kindness, patience or care for
  animals. It teaches through the story, not through instructions.
- The world is medieval fantasy, nonviolent by design. Problems are solved by
  listening, care and working together.
- Short "Did you know...?" notes connect the story to the real world.
- Polish and English. The Polish text is written first and the English adapted
  from it, so neither reads like a translation.

## How it's made

A Three.js scene on Vite, no framework: the book lies open on a candle-lit desk,
its pages turn, and a ribbon opens each tale.

- Tales are data, written to a shared template. `npm run validate:stories`
  checks each one: page counts, choice pages, endings, what fits on a page, and
  that every picture the book shows exists.
- Every page is typeset at runtime in EB Garamond (self-hosted) over painted
  parchment, with its own illustration; switching language rewrites the page in
  ink instead of swapping it.
- Sound is a small Web Audio engine; files load per tale, only with sound on.
- The chosen language and sound setting stay in the browser.

```sh
npm install
npm run dev        # http://127.0.0.1:5173/the-book-of-magical-tales/
npm run build      # dist/, deployed to GitHub Pages from main
```

`index.html` and `src/book/` are the book; `stories.js` and `locales.js` hold the
tales' text; `public/` its pictures, textures, models and sounds. The art and
sound pipelines live in `prototypes/` and `scripts/sfx/` and never ship.

Two tales so far. New ones follow [docs/TALE_TEMPLATE.md](docs/TALE_TEMPLATE.md).
