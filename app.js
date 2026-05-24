import { stories } from "./stories.js";
import { dragonSvg, bellSvg } from "./illustrations.js";
import { storyTranslations, uiText } from "./locales.js";

const STORAGE_KEY = "bookOfMagicalTalesState";
const ASSET_BASE = import.meta.env.BASE_URL || "/";

const ART_ANIMATION_PRESETS = {
  "cover-bridge": ["sun-warmth", "river-lower", "water-sparkle-one", "dragon-soft", "leaf-drift", "tree-hush", "cover-mote-one", "cover-mote-two"],
  "smoke-thread": ["smoke-column", "nest-glow", "river-lower", "water-sparkle-one", "listen-mote", "grass-hush"],
  "loose-stone-ask": ["claw-tap-one", "claw-tap-two", "stone-dust", "nest-glow", "grass-hush"],
  "loose-stone-listen": ["sound-ring-one", "sound-ring-two", "nest-glow", "listen-mote", "grass-hush"],
  "warm-plan": ["lantern-flame", "bread-scent", "plan-breath", "river-back", "reeds-sway"],
  "friends-lantern": ["lantern-pool", "banner-soft", "mill-window", "river-side", "tree-hush"],
  "friends-bread": ["bread-scent-wide", "crumb-glint-one", "crumb-glint-two", "mouse-mote", "tree-hush"],
  "basket-craft": ["craft-breath", "wool-soft", "reed-glint", "nest-glow", "grass-hush"],
  "tiny-footsteps-maker": ["basket-rim", "hand-glint", "mouse-mote", "dragon-nose", "grass-hush"],
  "tiny-footsteps-carry": ["footstep-one", "footstep-two", "footstep-three", "shield-glint", "carry-breath", "grass-hush"],
  "promise-path": ["oath-glint", "path-glow", "inn-light", "flower-hush", "grass-hush"],
  "promise-name": ["promise-writing", "promise-star-one", "promise-star-two", "lantern-small", "river-moonline", "water-sparkle-two", "tree-hush"],
  "promise-wave": ["wave-arc", "dragon-blink", "flower-red", "flower-gold", "flower-blue", "river-moonline", "water-sparkle-two", "tree-hush"],
  "ending-name": ["ending-writing", "lantern-flame", "ending-ornament", "sleep-mote", "river-moonline", "water-sparkle-one", "reeds-sway"],
  "ending-wave": ["ending-star-one", "ending-star-two", "ending-flower", "ending-ornament", "sleep-mote", "river-moonline", "water-sparkle-two", "tree-hush"],
  "moonhill-quiet-tower": ["moonhill-lantern-left", "moonhill-lantern-right", "moonhill-moth-one", "moonhill-moth-two", "moonhill-smoke", "moonhill-orchard-hush"],
  "moonhill-two-ways": ["moonhill-key-glint", "moonhill-moth-one", "moonhill-moth-two", "moonhill-lantern-left", "moonhill-clover-nudge"],
  "moonhill-rope-clover": ["moonhill-rope-sway", "moonhill-leaf-one", "moonhill-moth-one", "moonhill-hoof-glow", "moonhill-orchard-hush"],
  "moonhill-rope-elders": ["moonhill-scroll-glow", "moonhill-rope-sway", "moonhill-leaf-one", "moonhill-moth-two", "moonhill-orchard-hush"],
  "moonhill-sleeping-finches": ["moonhill-nest-breathe", "moonhill-ladder-glint", "moonhill-cloth-soft", "moonhill-orchard-hush"],
  "moonhill-untangle-slow": ["moonhill-nest-breathe", "moonhill-rope-sway", "moonhill-falling-leaf", "moonhill-hand-glint"],
  "moonhill-untangle-ladder": ["moonhill-ladder-glint", "moonhill-rope-sway", "moonhill-nest-breathe", "moonhill-hand-glint"],
  "moonhill-small-crack": ["moonhill-bell-glow", "moonhill-crack-glint", "moonhill-lantern-center", "moonhill-dust-mote"],
  "moonhill-mending-smith": ["moonhill-hammer-spark", "moonhill-rivet-glint", "moonhill-bell-glow", "moonhill-lantern-center"],
  "moonhill-mending-thanks": ["moonhill-heart-glow", "moonhill-polish-glint", "moonhill-bell-glow", "moonhill-lantern-center"],
  "moonhill-first-sound": ["moonhill-moon-glow", "moonhill-bell-note-one", "moonhill-bell-note-two", "moonhill-lantern-left", "moonhill-orchard-hush"],
  "moonhill-ring-gently": ["moonhill-soft-note", "moonhill-window-glow", "moonhill-lantern-left", "moonhill-moon-glow"],
  "moonhill-share-song": ["moonhill-song-ribbon", "moonhill-song-mote-one", "moonhill-song-mote-two", "moonhill-finch-glow", "moonhill-lantern-left"],
  "moonhill-ending-ring": ["moonhill-ending-note", "moonhill-moon-glow", "moonhill-window-glow", "ending-ornament"],
  "moonhill-ending-song": ["moonhill-song-ribbon", "moonhill-window-glow", "moonhill-moon-glow", "ending-ornament"]
};

const state = {
  storyIndex: 0,
  pageIndex: 0,
  choices: {},
  bookmarks: {},
  language: "pl",
  soundEnabled: true,
  promptOpen: false,
  choiceNudge: false,
  languageAnimating: false,
  wakeToken: 0
};

const ENTRY_ANIMATION_MS = 2550;
const BOOK_OPEN_CONTENT_DELAY_MS = 1120;
const BOOK_OPEN_ANIMATION_MS = 1850;
const LANGUAGE_FADE_MS = 180;
const LANGUAGE_ARRIVE_MS = 1080;
const TABLE_SCENE_IMAGE_SIZE = { width: 1535, height: 1024 };
const TABLE_SCENE_CANDLE_POINT = { x: 0.923, y: 0.18 };
let sceneAnchorFrame = 0;
let pendingStoryImageSoundStoryId = "";

const els = {
  body: document.body,
  shell: document.querySelector(".storybook-shell"),
  tableScene: document.querySelector(".table-scene"),
  bookCoverStart: document.querySelector("#bookCoverStart"),
  book: document.querySelector(".book"),
  storyTabs: document.querySelector("#storyTabs"),
  storyKicker: document.querySelector("#storyKicker"),
  storyTitle: document.querySelector("#storyTitle"),
  illustrationFrame: document.querySelector("#illustrationFrame"),
  pageCount: document.querySelector("#pageCount"),
  pageProgress: document.querySelector("#pageProgress"),
  pageTitle: document.querySelector("#pageTitle"),
  storyText: document.querySelector("#storyText"),
  choicePanel: document.querySelector("#choicePanel"),
  parentPromptButton: document.querySelector("#parentPromptButton"),
  promptCard: document.querySelector("#promptCard"),
  restartStory: document.querySelector("#restartStory"),
  languageSwitch: document.querySelector("#languageSwitch"),
  soundToggle: document.querySelector("#soundToggle"),
  prevPage: document.querySelector("#prevPage"),
  nextPage: document.querySelector("#nextPage"),
  candleButton: document.querySelector("#candleButton")
};

const storyAudio = (() => {
  const soundMap = {
    button: { src: "/assets/sounds/button-press.wav", volume: 0.52 },
    choice: { src: "/assets/sounds/choice-chime.mp3", volume: 0.62 },
    ink: { src: "/assets/sounds/magic-ink.wav", volume: 0.58 },
    illustrationDragon: { src: "/assets/sounds/dragon-story-image-sound.wav", volume: 0.62 },
    illustrationBell: { src: "/assets/sounds/moonhill-story-image-sound.wav", volume: 0.56 },
    bookOpen: { src: "/assets/sounds/book-opening.wav", volume: 0.72 },
    pageTurn: { src: "/assets/sounds/page-turn.wav", volume: 0.56 }
  };
  const illustrationEnvelope = {
    fadeInMs: 260,
    fadeOutMs: 2200,
    fadeOutLeadMs: 2600,
    minFadeOutDelayMs: 900
  };

  const sounds = Object.fromEntries(
    Object.entries(soundMap).map(([name, settings]) => {
      const audio = new Audio(assetPath(settings.src));
      audio.preload = "auto";
      audio.volume = settings.volume;
      return [name, audio];
    })
  );

  function play(name) {
    const base = sounds[name];
    if (!base) return;
    const audio = base.cloneNode();
    audio.volume = base.volume;
    audio.play().catch(() => {});
  }

  function fadeVolume(audio, from, to, duration = 180) {
    const startedAt = performance.now();

    function tick(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      audio.volume = from + (to - from) * progress;
      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    }

    window.requestAnimationFrame(tick);
  }

  function playFaded(name, options = {}) {
    const base = sounds[name];
    if (!base) return;

    const {
      fadeInMs = 180,
      fadeOutMs = 420,
      fadeOutLeadMs = 520,
      minFadeOutDelayMs = 700
    } = options;
    const audio = base.cloneNode();
    const targetVolume = base.volume;
    audio.volume = 0;
    let fadeOutScheduled = false;

    const fadeOut = () => fadeVolume(audio, audio.volume, 0, fadeOutMs);
    const scheduleFadeOut = () => {
      if (fadeOutScheduled) return;
      fadeOutScheduled = true;
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      window.setTimeout(fadeOut, Math.max(duration * 1000 - fadeOutLeadMs, minFadeOutDelayMs));
    };

    audio.addEventListener("loadedmetadata", scheduleFadeOut, { once: true });
    audio.addEventListener("ended", () => {
      audio.volume = 0;
    }, { once: true });

    audio.play()
      .then(() => {
        fadeVolume(audio, 0, targetVolume, fadeInMs);
        if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
          scheduleFadeOut();
        }
      })
      .catch(() => {});
  }

  return {
    button() {
      play("button");
    },
    pageTurn() {
      play("pageTurn");
    },
    bookOpen() {
      play("bookOpen");
    },
    ink() {
      play("ink");
    },
    choice() {
      play("choice");
    },
    illustration(storyType) {
      playFaded(storyType === "bell" ? "illustrationBell" : "illustrationDragon", illustrationEnvelope);
    },
    illustrationIntro(storyType) {
      playFaded(storyType === "bell" ? "illustrationBell" : "illustrationDragon", illustrationEnvelope);
    }
  };
})();

function updateSceneCandleAnchor() {
  if (!els.tableScene) return;

  const rect = els.tableScene.getBoundingClientRect();
  const scale = Math.max(
    rect.width / TABLE_SCENE_IMAGE_SIZE.width,
    rect.height / TABLE_SCENE_IMAGE_SIZE.height
  );
  const renderedWidth = TABLE_SCENE_IMAGE_SIZE.width * scale;
  const renderedHeight = TABLE_SCENE_IMAGE_SIZE.height * scale;
  const offsetX = (rect.width - renderedWidth) / 2;
  const offsetY = (rect.height - renderedHeight) / 2;
  const candleX = offsetX + renderedWidth * TABLE_SCENE_CANDLE_POINT.x;
  const candleY = offsetY + renderedHeight * TABLE_SCENE_CANDLE_POINT.y;

  els.tableScene.style.setProperty("--scene-candle-x", `${candleX}px`);
  els.tableScene.style.setProperty("--scene-candle-y", `${candleY}px`);
}

function scheduleSceneCandleAnchorUpdate() {
  if (sceneAnchorFrame) return;
  sceneAnchorFrame = window.requestAnimationFrame(() => {
    sceneAnchorFrame = 0;
    updateSceneCandleAnchor();
  });
}

function text() {
  return uiText[state.language] || uiText.en;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value);
}

function assetPath(path = "") {
  if (!path || /^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) return path;

  const normalizedBase = ASSET_BASE.endsWith("/") ? ASSET_BASE : `${ASSET_BASE}/`;
  return path.startsWith("/")
    ? `${normalizedBase}${path.slice(1)}`
    : `${normalizedBase}${path}`;
}

function cssAsset(path) {
  return `url("${assetPath(path)}")`;
}

function setupSceneAssets() {
  document.documentElement.style.setProperty(
    "--tabletop-background",
    cssAsset("/assets/scene/premium-tabletop-background-v2.png")
  );
  document.documentElement.style.setProperty(
    "--book-frame-background",
    cssAsset("/assets/scene/premium-book-frame-flat-bright-transparent.png")
  );
  document.documentElement.style.setProperty(
    "--book-cover-background",
    cssAsset("/assets/scene/premium-book-cover-closed-v1.png")
  );
}

function mergeChoiceMap(baseValue, translationValue) {
  if (!translationValue || typeof translationValue !== "object") return baseValue;

  return Object.entries(translationValue).reduce(
    (merged, [key, value]) => ({
      ...merged,
      [key]: value && typeof value === "object" && !Array.isArray(value)
        ? mergeChoiceMap(baseValue?.[key], value)
        : value
    }),
    { ...(baseValue || {}) }
  );
}

function translatedPage(page, translation = {}) {
  const translated = { ...page, ...translation };

  if (translation.body) translated.body = translation.body;
  if (translation.choices) {
    translated.choices = page.choices.map((choice, index) => ({
      ...choice,
      ...(translation.choices[index] || {})
    }));
  }

  translated.echoes = mergeChoiceMap(page.echoes, translation.echoes);
  translated.virtueByChoice = mergeChoiceMap(page.virtueByChoice, translation.virtueByChoice);

  return translated;
}

function translatedStory(story) {
  const translation = storyTranslations[state.language]?.[story.id];
  if (!translation) return story;

  return {
    ...story,
    ...translation,
    pages: story.pages.map((page, index) => translatedPage(page, translation.pages?.[index]))
  };
}

function currentStory() {
  return translatedStory(stories[state.storyIndex]);
}

function currentPage() {
  return currentStory().pages[state.pageIndex];
}

function loadSavedState() {
  try {
    if (!window.localStorage) return;
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.choices = saved.choices || {};
    state.bookmarks = saved.bookmarks || {};
    if (saved.language === "pl" || saved.language === "en") {
      state.language = saved.language;
    }
    if (Object.hasOwn(saved, "soundEnabled")) {
      state.soundEnabled = saved.soundEnabled === true;
    }
    const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
    if (requestedLanguage === "pl" || requestedLanguage === "en") {
      state.language = requestedLanguage;
    }
  } catch {
    state.choices = {};
    state.bookmarks = {};
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        choices: state.choices,
        bookmarks: state.bookmarks,
        language: state.language,
        soundEnabled: state.soundEnabled
      })
    );
  } catch {
    // Bookmark memory is a comfort feature; the story should still work without storage.
  }
}

function renderSoundToggle() {
  const label = state.soundEnabled ? text().soundOn : text().soundOff;
  els.soundToggle.classList.toggle("is-on", state.soundEnabled);
  els.soundToggle.setAttribute("aria-label", label);
  els.soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
  els.soundToggle.querySelector("span").textContent = state.soundEnabled ? text().soundLabel : text().quietLabel;
}

function playSound(effect) {
  if (!state.soundEnabled) return;
  storyAudio[effect]?.();
}

function playButtonSound() {
  playSound("button");
}

function playIllustrationAccent() {
  if (!state.soundEnabled) return;
  storyAudio.illustration(currentStory().illustration);
}

function openBookFromCover() {
  if (!els.shell.classList.contains("is-book-closed")) return;

  playSound("bookOpen");
  els.bookCoverStart.disabled = true;
  els.bookCoverStart.setAttribute("aria-hidden", "true");
  els.shell.classList.add("is-opening-book");

  window.setTimeout(() => {
    els.shell.classList.remove("is-book-closed");
    els.shell.classList.add("is-book-opened");
    pendingStoryImageSoundStoryId = currentStory().id;
    playPendingStoryImageSoundWhenImageLoads(currentStory(), resolvedPage(currentPage()));
  }, BOOK_OPEN_CONTENT_DELAY_MS);

  window.setTimeout(() => {
    els.shell.classList.remove("is-opening-book");
  }, BOOK_OPEN_ANIMATION_MS);
}

function saveBookmark(story = currentStory()) {
  state.bookmarks[story.id] = state.pageIndex;
  saveState();
}

function storyChoices(storyId = currentStory().id) {
  if (!state.choices[storyId]) {
    state.choices[storyId] = {};
  }
  return state.choices[storyId];
}

function selectedChoiceId(pageIndex = state.pageIndex, storyId = currentStory().id) {
  return storyChoices(storyId)[pageIndex] || "";
}

function selectedChoice(page = currentPage()) {
  const choiceId = selectedChoiceId();
  return page.choices.find((choice) => choice.id === choiceId);
}

function pageNeedsChoice(page = currentPage()) {
  return page.choices.length > 0 && !selectedChoiceId();
}

function renderNavigationState(story = currentStory(), page = currentPage()) {
  const needsChoice = pageNeedsChoice(page);
  els.prevPage.disabled = state.pageIndex === 0;
  els.nextPage.disabled = state.pageIndex === story.pages.length - 1 || needsChoice;
  els.nextPage.classList.toggle("needs-choice", state.choiceNudge && needsChoice);
}

function choiceVariant(variantsByPage) {
  if (!variantsByPage) return "";

  const choices = storyChoices();
  const sourcePages = Object.keys(variantsByPage)
    .map(Number)
    .sort((a, b) => b - a);

  for (const sourcePage of sourcePages) {
    const choiceId = choices[sourcePage];
    const variant = variantsByPage[sourcePage]?.[choiceId];
    if (variant) return variant;
  }

  return "";
}

function choiceAsset(defaultAsset, variantsByPage) {
  return choiceVariant(variantsByPage) || defaultAsset || "";
}

function resolvedPage(page) {
  const echo = choiceVariant(page.echoes);
  const cue = choiceVariant(page.cueByChoice) || page.cue;
  const choiceVisual = choiceVariant(page.visualByChoice);
  const visuals = [page.visual, choiceVisual].filter(Boolean);
  const virtue = choiceVariant(page.virtueByChoice) || page.virtue;
  const art = choiceAsset(page.art, page.artByChoice);
  const artAnimation = choiceAsset(page.artAnimation, page.artAnimationByChoice);
  const body = echo ? [page.body[0], echo, ...page.body.slice(1)] : page.body;

  return { body, cue, visuals, virtue, echo, ending: page.ending, art, artAnimation };
}

function renderTabs() {
  els.storyTabs.innerHTML = stories
    .map(
      (story, index) => {
        const displayedStory = translatedStory(story);
        const savedPage = state.bookmarks[story.id] || 0;
        const savedLabel = savedPage > 0 ? `<span class="tab-page-mark">${escapeHtml(text().savedPage(savedPage + 1))}</span>` : "";
        return `
        <button class="story-tab ${index === state.storyIndex ? "is-active" : ""}" type="button" data-story="${index}">
          <span>${escapeHtml(displayedStory.shortTitle)}</span>
          ${savedLabel}
        </button>
      `;
      }
    )
    .join("");
}

function renderProgress(story = currentStory()) {
  els.pageProgress.innerHTML = story.pages
    .map(
      (_, index) => `
        <span class="${index === state.pageIndex ? "is-current" : ""} ${index < state.pageIndex ? "is-past" : ""}"></span>
      `
    )
    .join("");
}

function renderLanguageSwitch() {
  document.documentElement.lang = state.language;
  renderSoundToggle();
  els.languageSwitch.setAttribute("aria-label", text().languageLabel);
  els.languageSwitch.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === state.language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderStory() {
  const story = currentStory();
  const page = currentPage();
  const pageDetails = resolvedPage(page);

  els.book.classList.toggle("long-story-title", story.title.length > 28);
  renderLanguageSwitch();
  renderTabs();
  els.storyKicker.textContent = story.kicker;
  els.storyTitle.textContent = story.title;
  els.parentPromptButton.querySelector("span").textContent = text().curiosityNote;
  els.restartStory.textContent = text().restartStory;
  els.pageCount.textContent = text().pageCount(state.pageIndex + 1, story.pages.length);
  renderProgress(story);
  els.pageTitle.textContent = page.title;
  els.storyText.innerHTML = pageDetails.body
    .map((paragraph, index) => {
      const classes = [];
      if (index === 1 && pageDetails.echo) classes.push("branch-note");
      if (pageDetails.ending && index === pageDetails.body.length - 1) classes.push("end-line");
      return `<p class="${classes.join(" ")}">${escapeHtml(paragraph)}</p>`;
    })
    .join("");
  if (pageDetails.ending) {
    state.promptOpen = false;
  }
  renderParentPrompt(page, false);
  els.parentPromptButton.hidden = !page.curiosityNote;
  renderNavigationState(story, page);
  els.restartStory.hidden = !pageDetails.ending;

  renderChoices(page);
  renderIllustration(story.illustration, pageDetails.cue, pageDetails.visuals, pageDetails.art, pageDetails.artAnimation);
  wakeIllustration(false);
  playPendingStoryImageSoundWhenImageLoads(story, pageDetails);
}

function renderParentPrompt(page = currentPage(), animate = false) {
  const note = page.curiosityNote;
  if (!note) {
    state.promptOpen = false;
    els.promptCard.hidden = true;
    els.promptCard.innerHTML = "";
    els.parentPromptButton.setAttribute("aria-expanded", "false");
    return;
  }

  els.promptCard.innerHTML = `
    <p class="prompt-title">${escapeHtml(note.title || text().curiosityNote)}</p>
    <p>${escapeHtml(note.body)}</p>
  `;
  els.promptCard.hidden = !state.promptOpen;
  els.parentPromptButton.setAttribute("aria-expanded", String(state.promptOpen));

  els.promptCard.classList.remove("is-writing");
  if (state.promptOpen && animate) {
    window.requestAnimationFrame(() => {
      els.promptCard.classList.add("is-writing");
    });
  }
}

function renderChoices(page) {
  els.choicePanel.hidden = page.choices.length === 0;
  if (els.choicePanel.hidden) {
    els.choicePanel.innerHTML = "";
    return;
  }

  const choice = selectedChoice(page);
  const choicesHtml = page.choices
    .map(
      (choice) => `
        <button class="choice-button ${choice.id === selectedChoiceId() ? "is-chosen" : ""}" type="button" data-choice="${choice.id}">
          ${escapeHtml(choice.label)}
        </button>
      `
    )
    .join("");

  const guidance = choice
    ? `<p class="choice-feedback choice-result is-writing">${escapeHtml(choice.response)}</p>`
    : `<p class="choice-feedback choice-hint ${state.choiceNudge ? "is-nudging" : ""}">${escapeHtml(text().choiceHint)}</p>`;

  els.choicePanel.innerHTML = choicesHtml + guidance;
}

function renderIllustration(type, cue, visuals, art = "", artAnimation = "") {
  const presetClass = artAnimation ? `art-preset-${artAnimation}` : "";
  els.illustrationFrame.className = `illustration-frame cue-${cue} ${art ? "has-story-art" : ""} ${presetClass}`;
  els.illustrationFrame.innerHTML = art
    ? renderStoryArt(type, art, visuals, artAnimation)
    : type === "dragon"
      ? dragonSvg(visuals)
      : bellSvg(visuals);
}

function renderStoryArt(type, art, visuals = [], artAnimation = "") {
  const details = ART_ANIMATION_PRESETS[artAnimation] || [];
  const overlay = details
    .map((detail) => `<span class="living-detail ${detail}" aria-hidden="true"></span>`)
    .join("");

  return `
    <img class="story-art-image" src="${escapeAttribute(assetPath(art))}" alt="" aria-hidden="true" />
    <span class="story-art-vignette" aria-hidden="true"></span>
    ${overlay}
  `;
}

function wakeIllustration(playAudio = true) {
  state.wakeToken += 1;
  els.illustrationFrame.classList.remove("wake", "sparkle");
  window.requestAnimationFrame(() => {
    els.illustrationFrame.classList.add("wake", "sparkle");
  });
  if (playAudio) playIllustrationAccent();
}

function playPendingStoryImageSoundWhenImageLoads(story, pageDetails) {
  if (pendingStoryImageSoundStoryId !== story.id) return;

  const image = els.illustrationFrame.querySelector(".story-art-image");
  if (!pageDetails.art || !image) {
    pendingStoryImageSoundStoryId = "";
    return;
  }

  const playIntro = () => {
    if (pendingStoryImageSoundStoryId !== story.id) return;
    pendingStoryImageSoundStoryId = "";
    if (!state.soundEnabled) return;
    storyAudio.illustrationIntro(story.illustration);
  };

  if (image.complete && image.naturalWidth > 0) {
    window.requestAnimationFrame(playIntro);
    return;
  }

  image.addEventListener("load", playIntro, { once: true });
}

function turnPage(direction) {
  const story = currentStory();
  const nextIndex = state.pageIndex + direction;
  if (nextIndex < 0 || nextIndex >= story.pages.length) return;
  if (direction > 0 && currentPage().choices.length && !selectedChoiceId()) {
    state.choiceNudge = true;
    renderChoices(currentPage());
    renderNavigationState(story, currentPage());
    return;
  }

  playSound("pageTurn");
  state.pageIndex = nextIndex;
  state.promptOpen = false;
  state.choiceNudge = false;
  saveBookmark(story);
  els.book.classList.remove("turning");
  window.requestAnimationFrame(() => {
    els.book.classList.add("turning");
    renderStory();
  });
}

function chooseStory(index) {
  playButtonSound();
  if (index === state.storyIndex) return;

  state.storyIndex = index;
  const story = currentStory();
  pendingStoryImageSoundStoryId = story.id;
  state.pageIndex = Math.min(state.bookmarks[story.id] || 0, story.pages.length - 1);
  state.promptOpen = false;
  state.choiceNudge = false;
  renderStory();
}

function restartCurrentStory() {
  const story = currentStory();
  playSound("pageTurn");
  state.pageIndex = 0;
  state.promptOpen = false;
  state.choiceNudge = false;
  delete state.bookmarks[story.id];
  delete state.choices[story.id];
  saveState();
  els.book.classList.remove("turning");
  window.requestAnimationFrame(() => {
    els.book.classList.add("turning");
    renderStory();
  });
}

els.storyTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-story]");
  if (!button) return;
  chooseStory(Number(button.dataset.story));
});

els.choicePanel.addEventListener("click", (event) => {
  const button = event.target.closest("[data-choice]");
  if (!button) return;
  storyChoices()[state.pageIndex] = button.dataset.choice;
  saveState();
  state.choiceNudge = false;
  renderNavigationState();
  renderChoices(currentPage());
  playSound("choice");
  wakeIllustration(false);
});

els.parentPromptButton.addEventListener("click", () => {
  state.promptOpen = !state.promptOpen;
  renderParentPrompt(currentPage(), state.promptOpen);
  if (state.promptOpen) playSound("ink");
});

document.addEventListener("click", (event) => {
  if (!state.promptOpen) return;
  if (els.promptCard.contains(event.target) || els.parentPromptButton.contains(event.target)) return;
  state.promptOpen = false;
  renderParentPrompt(currentPage());
});

els.restartStory.addEventListener("click", restartCurrentStory);
els.soundToggle.addEventListener("click", () => {
  if (state.soundEnabled) {
    storyAudio.button();
  }
  state.soundEnabled = !state.soundEnabled;
  saveState();
  renderSoundToggle();
  if (state.soundEnabled) {
    storyAudio.button();
  }
});
els.languageSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("[data-language]");
  if (!button || button.dataset.language === state.language || state.languageAnimating) return;
  const nextLanguage = button.dataset.language;
  playButtonSound();
  playSound("ink");
  state.languageAnimating = true;
  state.promptOpen = false;
  state.choiceNudge = false;
  els.book.classList.remove("language-changing");
  els.languageSwitch.classList.remove("language-changing");
  window.requestAnimationFrame(() => {
    els.book.classList.add("language-changing");
    els.languageSwitch.classList.add("language-changing");
  });
  window.setTimeout(() => {
    state.language = nextLanguage;
    saveState();
    renderStory();
    els.book.classList.add("language-arriving");
    els.languageSwitch.classList.add("language-arriving");
    window.setTimeout(() => {
      els.book.classList.remove("language-changing", "language-arriving");
      els.languageSwitch.classList.remove("language-changing", "language-arriving");
      state.languageAnimating = false;
    }, LANGUAGE_ARRIVE_MS);
  }, LANGUAGE_FADE_MS);
});
els.prevPage.addEventListener("click", () => turnPage(-1));
els.nextPage.addEventListener("click", () => turnPage(1));
els.illustrationFrame.addEventListener("click", () => wakeIllustration(true));
els.illustrationFrame.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    wakeIllustration(true);
  }
});
els.bookCoverStart.addEventListener("click", openBookFromCover);
els.candleButton.addEventListener("click", () => {
  playButtonSound();
  els.body.classList.toggle("dimmed");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") turnPage(-1);
  if (event.key === "ArrowRight") turnPage(1);
  if (event.key === "Escape" && state.promptOpen) {
    state.promptOpen = false;
    renderParentPrompt(currentPage());
  }
});

setupSceneAssets();
loadSavedState();
updateSceneCandleAnchor();
renderStory();
window.addEventListener("resize", scheduleSceneCandleAnchorUpdate);
window.visualViewport?.addEventListener("resize", scheduleSceneCandleAnchorUpdate);
new ResizeObserver(scheduleSceneCandleAnchorUpdate).observe(els.tableScene);
window.setTimeout(() => {
  els.shell.classList.remove("is-entering");
}, ENTRY_ANIMATION_MS);
