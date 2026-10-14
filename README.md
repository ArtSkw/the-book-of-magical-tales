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

Vanilla JavaScript and CSS on Vite, no framework.

- Tales are data, written to a shared template. `npm run validate:stories`
  checks each one: page counts, choice pages, endings, illustration references.
- Every page has its own illustration, with small CSS animations on top.
- Switching language rewrites the page in ink instead of swapping it.
- Language, sound and reading progress stay in the browser.

```sh
npm install
npm run dev
```

Two tales so far. New ones follow [docs/TALE_TEMPLATE.md](docs/TALE_TEMPLATE.md).
