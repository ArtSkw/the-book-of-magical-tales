# The Book of Magical Tales

A browser-based parent-child interactive storybook inspired by illuminated manuscripts, candlelit tables, and gentle medieval fantasy. The app is designed for short co-reading sessions where children make kind, nonviolent choices and see how small details in the tale change afterward.

**Live app → [artskw.github.io/the-book-of-magical-tales](https://artskw.github.io/the-book-of-magical-tales/)**

---

## What It Is

The Book of Magical Tales is a cozy bilingual storybook for children and parents. It presents illustrated fantasy tales in Polish and English, with each story structured around values such as kindness, courage, patience, friendship, care for nature, respect for animals, and quiet cooperation.

The experience is meant to feel like opening an old magical book on a candlelit medieval table: pages glow softly, illustrations breathe with small animated details, choices write themselves into the story, and occasional curiosity notes add little real-world sparks.

---

## Features

- **Two complete tales** — *The Dragon on the Old Bridge* and *The Bell of Moonhill*
- **Bilingual reading** — Polish and English versions with a smooth language transition
- **Choice-aware storytelling** — child choices affect later details, dialogue, helpers, illustrations, and final reflections
- **Curiosity notes** — rare “Did you know...?” popovers tied to page topics such as mills, bells, reeds, bridges, birds, and village life
- **Manuscript-like presentation** — premium book frame, candlelit tabletop, parchment pages, medieval typography, and page-turn controls
- **High-resolution illustrations** — page-specific raster artwork with dedicated CSS “living details”
- **Gentle sound layer** — page rustle, choice chime, and magical ink sounds, with an accessible sound toggle
- **Responsive layout** — scales across desktop and smaller browser windows
- **Local progress memory** — remembers language, sound setting, current story pages, and choices in `localStorage`

---

## Story Philosophy

The stories are written Polish-first, then adapted into English. Polish is treated as the canonical literary source, so each tale should sound natural as a children’s folk/fantasy story rather than like a direct translation.

The narrative direction is:

- medieval and fairy-tale flavored, without violence as the problem-solving path
- warm, imaginative, and concrete enough for young children to follow
- emotionally safe, with tension resolved through listening, care, patience, and shared effort
- educational through story rather than instruction
- designed for parent-child conversation, not passive consumption

Future tales should follow the template documented in [`docs/TALE_TEMPLATE.md`](./docs/TALE_TEMPLATE.md).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build | Vite |
| App | Vanilla JavaScript modules |
| Styling | CSS animations, responsive layout, custom manuscript UI |
| Content | Structured story data in JS modules |
| Assets | High-resolution PNG illustrations, WAV/MP3 sound effects |
| Persistence | Browser `localStorage` |
| Deployment | GitHub Pages via GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually:

```text
http://127.0.0.1:5173/
```

### Validate Story Structure

```bash
npm run validate:stories
```

The validator checks the story template rules: page counts, paragraph counts, choice pages, ending pages, illustration references, and required metadata.

### Build

```bash
npm run build
npm run preview
```

The production build outputs to `dist/`.

---

## Project Structure

```text
.
├── app.js                         # App state, rendering, interaction, audio, page transitions
├── stories.js                     # English story source and shared story metadata
├── locales.js                     # Polish story text and UI translations
├── styles.css                     # Book UI, responsive layout, illustration animations
├── illustrations.js               # Inline fallback SVG illustration helpers
├── illustrationCatalog.js         # Visual/cue catalog used by validation
├── validate-stories.js            # Story data quality checks
├── docs/
│   ├── TALE_TEMPLATE.md           # Future tale structure and writing rules
│   └── ILLUSTRATION_ART_DIRECTION.md
└── public/assets/
    ├── illustrations/             # High-resolution page illustrations
    ├── scene/                     # Table and book scene assets
    └── sounds/                    # Curated sound effects
```

---

## Deployment

This repo is configured for GitHub Pages through `.github/workflows/deploy.yml`.

On every push to `main`, GitHub Actions will:

1. Install dependencies with `npm ci`
2. Validate story structure
3. Build the Vite app
4. Publish `dist/` to GitHub Pages

The Vite `base` path is set to:

```text
/the-book-of-magical-tales/
```

This keeps asset paths working correctly on GitHub Pages.

---

## Roadmap

| Version | Scope |
|---|---|
| **v1.0** | Two bilingual tales, premium book/table scene, responsive layout, sound toggle, choice-aware illustrations |
| v1.1 | Replace static tabletop background with a subtle looping candle video layer |
| v1.2 | Add more tales using the Polish-first story template |
| v1.3 | Improve asset loading strategy for smaller initial downloads |
