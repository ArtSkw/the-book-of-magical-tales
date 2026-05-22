# Tale Template

Use this template when adding a new tale to `stories.js`.

Every tale should follow the project rules in `BRIEF.md`:

- 9-10 pages, preferably 10.
- 3 short paragraphs per page.
- Choice pages on pages 2, 4, 6, and 8.
- Every page needs `title`, `body`, `cue`, `visual`, `choices`, and `virtue`.
- Every page needs a distinct illustration composition. Page 1 can be a cover-like wide tableau; later pages should vary between close-ups, medium scenes, detail vignettes, low views, object-focused images, group scenes, and final tableaux.
- Page 10 should be the ending page, have no choices, and end with `"Koniec."` in Polish and `"The end."` in English.
- All `visual` and `visualByChoice` IDs must exist in `illustrationCatalog.js`.
- Choices should be kind, valid, nonviolent, and softly acknowledged later.
- Each tale should include 3-4 optional `curiosityNote` entries, shown as "Czy wiesz, że...?" / "Did you know...?" popovers. Three is the minimum; add a fourth only when the story has a genuinely worthwhile topic.
- Every tale should be written Polish-first, then adapted into English. Polish should define the read-aloud rhythm, folk-tale warmth, page titles, and emotional pacing; English should preserve the same structure and image beats while reading naturally.

## Story Planning Pass

Before writing the JS object, outline:

- **Medieval detail:** craft, place, object, custom, tool, food, weather sign, map, song, garden, animal care, or village duty.
- **Fantasy detail:** creature, old oath, gentle magic, hidden path, enchanted object, wise animal, moon/star sign, tiny folk, or forest spirit.
- **Developmental focus:** responsive listening, emotional naming, co-regulation, cooperation, repair, gratitude, patience, courage, honesty, or stewardship.
- **Educational thread:** what the child learns through action, not exposition.
- **Final reflection:** what virtue the story names by the end.
- **Illustration rhythm:** one distinct composition per page, with the focal subject and camera scale named before image generation.
- **Curiosity hooks:** three concrete topics from the tale, such as a craft, animal, plant, medieval object, village custom, food, weather sign, or old belief.
- **Bilingual voice:** the Polish source wording first, then the English adaptation approach, including any names or terms that should remain consistent.

## Curiosity Note Pass

After drafting the story, choose 3-4 pages for optional curiosity notes:

- Tie every note to something visible or mentioned on that page.
- Keep each note short, warm, and wonder-based rather than encyclopedic.
- Use 3 notes as the default. Add a fourth only when research or story content provides a truly interesting, child-friendly hook.
- Prefer real-world details children can imagine: mills, bridges, bells, birds, reeds, orchards, candles, village work, tools, food, or old customs.
- Avoid frightening historical facts, violence, disease, punishment, or anything that pulls the tale out of its gentle mood.
- Write the Polish note first, then adapt it into natural English.
- Do not add notes to every page; rarity should make the button feel like a small discovery.

## Polish-First Writing Pass

When adding or rewriting a tale:

- Draft the Polish version first as original children's folk-fantasy prose.
- Preserve page count, paragraph count, choice IDs, choice meaning, echoes, virtues, and illustration alignment when adapting into English.
- Use warm, clear, read-aloud Polish phrasing with oral rhythm and occasional soft repetition.
- Prefer grounded Polish diction: "wioska", "młyn", "sad", "potok", "bochenek", "płótno", "dzwonnica", "ścieżka", "łąka".
- Avoid awkward calques, stiff word order, and overly ornate pseudo-medieval diction.
- Avoid gendered second-person phrases when possible. Prefer neutral wording such as "Po tym wyborze..." or "Dzięki temu...".
- Add 3-4 curiosity notes per tale, written as short wonder-sparking facts tied to concrete page content.
- Adapt into English second, preserving meaning and page beats without copying Polish syntax too literally.
- Check both language versions against the current book layout after the pass.

## 10-Page Rhythm

1. **Invitation:** place, mood, and small problem.
2. **First clue + choice:** child chooses how to begin kindly.
3. **Consequence:** acknowledge the first choice.
4. **Wider problem + choice:** a new complication or helper appears.
5. **Consequence:** acknowledge the second choice.
6. **Mending/listening + choice:** child chooses how to continue carefully.
7. **Deeper understanding:** the problem is reframed.
8. **Final choice:** closing gesture, promise, or welcome.
9. **Resolution:** repair, understanding, return, comfort, or protection.
10. **Reflection and ending:** final choice is acknowledged and the tale ends with `"Koniec."` in Polish and `"The end."` in English.

## Copyable JS Skeleton

```js
{
  id: "new-tale-id",
  shortTitle: "Ribbon Title",
  title: "The Full Tale Title",
  kicker: "A tale of ...",
  illustration: "new-illustration-family",
  pages: [
    {
      title: "Page One Title",
      body: [
        "Paragraph one: place, mood, sensory detail, or action.",
        "Paragraph two: character feeling, discovery, dialogue, or complication.",
        "Paragraph three: values, wonder, or setup for what matters."
      ],
      cue: "lantern",
      visual: "page-one-visual",
      choices: [],
      curiosityNote: { title: "Did you know...?", body: "Short curiosity note tied to this page topic." },
      virtue: "wonder"
    },
    {
      title: "Page Two Choice",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "Paragraph three that invites a kind choice."
      ],
      cue: "breath",
      visual: "page-two-visual",
      choices: [
        {
          id: "choice-a",
          label: "Kind action A",
          response: "Immediate gentle response for choice A."
        },
        {
          id: "choice-b",
          label: "Kind action B",
          response: "Immediate gentle response for choice B."
        }
      ],
      virtue: "patience"
    },
    {
      title: "Page Three Consequence",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "Paragraph three."
      ],
      echoes: {
        1: {
          "choice-a": "Because you chose action A, this story detail changes.",
          "choice-b": "Because you chose action B, this other story detail changes."
        }
      },
      visualByChoice: {
        1: {
          "choice-a": "visual-for-choice-a",
          "choice-b": "visual-for-choice-b"
        }
      },
      cue: "lantern",
      visual: "page-three-visual",
      choices: [],
      virtue: "kindness"
    },
    {
      title: "Page Four Choice",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "Paragraph three."
      ],
      cue: "banner",
      visual: "page-four-visual",
      choices: [
        {
          id: "choice-c",
          label: "Kind action C",
          response: "Immediate gentle response for choice C."
        },
        {
          id: "choice-d",
          label: "Kind action D",
          response: "Immediate gentle response for choice D."
        }
      ],
      curiosityNote: { title: "Did you know...?", body: "Short curiosity note tied to this page topic." },
      virtue: "cooperation"
    },
    {
      title: "Page Five Consequence",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "Paragraph three."
      ],
      echoes: {
        3: {
          "choice-c": "Because you chose action C, a helper or detail changes.",
          "choice-d": "Because you chose action D, a different helper or detail changes."
        }
      },
      visualByChoice: {
        3: {
          "choice-c": "visual-for-choice-c",
          "choice-d": "visual-for-choice-d"
        }
      },
      cue: "notes",
      visual: "page-five-visual",
      choices: [],
      virtue: "friendship"
    },
    {
      title: "Page Six Choice",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "Paragraph three."
      ],
      cue: "glint",
      visual: "page-six-visual",
      choices: [
        {
          id: "choice-e",
          label: "Kind action E",
          response: "Immediate gentle response for choice E."
        },
        {
          id: "choice-f",
          label: "Kind action F",
          response: "Immediate gentle response for choice F."
        }
      ],
      curiosityNote: { title: "Did you know...?", body: "Short curiosity note tied to this page topic." },
      virtue: "courage"
    },
    {
      title: "Page Seven Understanding",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "Paragraph three."
      ],
      echoes: {
        5: {
          "choice-e": "Because you chose action E, understanding deepens this way.",
          "choice-f": "Because you chose action F, understanding deepens that way."
        }
      },
      visualByChoice: {
        5: {
          "choice-e": "visual-for-choice-e",
          "choice-f": "visual-for-choice-f"
        }
      },
      cue: "lantern",
      visual: "page-seven-visual",
      choices: [],
      virtue: "wisdom"
    },
    {
      title: "Page Eight Final Choice",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "Paragraph three."
      ],
      cue: "bell",
      visual: "page-eight-visual",
      choices: [
        {
          id: "choice-g",
          label: "Final gentle gesture G",
          response: "Immediate gentle response for gesture G."
        },
        {
          id: "choice-h",
          label: "Final gentle gesture H",
          response: "Immediate gentle response for gesture H."
        }
      ],
      virtue: "loyalty"
    },
    {
      title: "Page Nine Resolution",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "Paragraph three."
      ],
      echoes: {
        7: {
          "choice-g": "Because you chose gesture G, the resolution reflects it.",
          "choice-h": "Because you chose gesture H, the resolution reflects it."
        }
      },
      visualByChoice: {
        7: {
          "choice-g": "visual-for-choice-g",
          "choice-h": "visual-for-choice-h"
        }
      },
      cue: "notes",
      visual: "page-nine-visual",
      choices: [],
      virtue: "peace"
    },
    {
      title: "Page Ten Ending",
      body: [
        "Paragraph one.",
        "Paragraph two.",
        "The end."
      ],
      echoes: {
        7: {
          "choice-g": "Because you chose gesture G, the final page remembers it.",
          "choice-h": "Because you chose gesture H, the final page remembers it."
        }
      },
      visualByChoice: {
        7: {
          "choice-g": "visual-for-choice-g",
          "choice-h": "visual-for-choice-h"
        }
      },
      cue: "glint",
      visual: "page-ten-visual",
      choices: [],
      virtue: "gratitude",
      ending: true
    }
  ]
}
```
