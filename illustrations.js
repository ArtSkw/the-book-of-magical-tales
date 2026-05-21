export const renderedVisuals = {
  dragon: [
    "bridge",
    "smoke",
    "mice",
    "mist",
    "mill",
    "wool",
    "oath",
    "flowers",
    "stars",
    "question",
    "sound",
    "lantern",
    "bread",
    "basket",
    "footsteps"
  ],
  bell: [
    "tower",
    "orchard",
    "rope",
    "finches",
    "pear-leaf",
    "crack",
    "workshop",
    "moon",
    "square",
    "hoofprints",
    "elder-scroll",
    "ladder",
    "smith-tools",
    "heart"
  ]
};

function manuscriptDefs(id, glowId) {
  return `
    <filter id="${id}Rough"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="3" /><feDisplacementMap in="SourceGraphic" scale="1.15" /></filter>
    <filter id="${id}Paper"><feTurbulence type="fractalNoise" baseFrequency=".62" numOctaves="2" seed="12" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="table" tableValues="0 .13"/></feComponentTransfer></filter>
    <pattern id="${id}Hatch" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
      <path d="M0 16 H18" stroke="#5e3b25" stroke-width=".9" opacity=".18"/>
    </pattern>
    <linearGradient id="${id}Sky" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#e2cf92"/>
      <stop offset=".58" stop-color="#d6bd78"/>
      <stop offset="1" stop-color="#b79056"/>
    </linearGradient>
    <radialGradient id="${glowId}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe58c" stop-opacity=".82"/><stop offset="1" stop-color="#f2a33b" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}Vellum" cx="50%" cy="46%" r="72%">
      <stop offset="0" stop-color="#ffeeb9" stop-opacity=".25"/>
      <stop offset=".72" stop-color="#d7b06b" stop-opacity=".05"/>
      <stop offset="1" stop-color="#3a2117" stop-opacity=".2"/>
    </radialGradient>
  `;
}

function manuscriptFrame(id) {
  return `
    <rect width="640" height="420" fill="url(#${id}Sky)"/>
    <rect width="640" height="420" filter="url(#${id}Paper)" opacity=".68"/>
    <rect x="22" y="22" width="596" height="376" rx="12" fill="none" stroke="#7f4a2d" stroke-width="8" opacity=".52"/>
    <rect x="38" y="38" width="564" height="344" rx="7" fill="none" stroke="#f1d890" stroke-width="3" opacity=".7"/>
    <path class="ink-line" d="M54 68 C174 48 302 56 414 44 C494 36 552 46 586 62 M64 352 C190 368 330 356 454 370 C520 378 560 370 588 354" fill="none" stroke="#5e3b25" stroke-width="2" opacity=".28"/>
    <g class="manuscript-ornament" fill="none" stroke="#8f2d25" stroke-width="5" stroke-linecap="round">
      <path d="M52 86 C52 56 76 52 92 68 C104 82 88 102 70 94"/>
      <path d="M588 86 C588 56 564 52 548 68 C536 82 552 102 570 94"/>
      <path d="M52 334 C52 364 76 368 92 352 C104 338 88 318 70 326"/>
      <path d="M588 334 C588 364 564 368 548 352 C536 338 552 318 570 326"/>
    </g>
    <g class="illumination-star" fill="#e7bd45" stroke="#5e3b25" stroke-width="2" opacity=".82">
      <path d="M94 58 L100 70 L112 76 L100 82 L94 94 L88 82 L76 76 L88 70 Z"/>
      <path d="M546 58 L552 70 L564 76 L552 82 L546 94 L540 82 L528 76 L540 70 Z"/>
    </g>
    <rect width="640" height="420" fill="url(#${id}Vellum)" pointer-events="none"/>
  `;
}

function dragonBridgeOpeningSvg() {
  return `
    <svg viewBox="0 0 640 420" aria-hidden="true">
      <defs>
        ${manuscriptDefs("dragon", "lantern")}
        <linearGradient id="bridgeRiver" x1="0" x2="1">
          <stop offset="0" stop-color="#4da5af"/>
          <stop offset=".52" stop-color="#7bc7c3"/>
          <stop offset="1" stop-color="#316d7b"/>
        </linearGradient>
      </defs>
      ${manuscriptFrame("dragon")}
      <g class="sky-layer">
        <rect x="38" y="38" width="564" height="344" rx="7" fill="#173345" opacity=".18"/>
        <circle cx="504" cy="78" r="24" fill="#f5cf67"/>
        <circle cx="516" cy="70" r="23" fill="#d6bd78"/>
        <g fill="#f7edc8">
          <circle cx="112" cy="76" r="3"/><circle cx="162" cy="58" r="2.5"/><circle cx="404" cy="64" r="2.5"/>
          <path d="M464 104 L468 96 L476 92 L472 102 L480 108 L470 108 L464 116 L462 108 L452 104 Z"/>
        </g>
      </g>

      <g class="land-layer">
        <path d="M38 274 C120 224 176 244 232 210 C304 166 390 206 468 176 C526 154 570 170 602 150 L602 382 L38 382 Z" fill="#66885c"/>
        <path d="M38 330 C132 292 232 342 332 302 C438 260 526 302 602 268 L602 382 L38 382 Z" fill="#98a95f"/>
        <path class="river-shimmer" d="M38 286 C104 262 112 218 178 204 C228 194 248 228 214 252 C172 282 200 312 290 318 C380 324 476 314 602 284 L602 382 L38 382 Z" fill="url(#bridgeRiver)" opacity=".88"/>
        <path class="river-sparkle" d="M84 284 C126 268 150 246 184 232 M102 314 C178 292 230 318 286 334 M418 312 C478 300 520 292 574 274" fill="none" stroke="#d5f2ea" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      </g>

      <g class="nature-layer tree-breathe">
        <g transform="translate(70 116)">
          <path d="M48 230 L66 72" stroke="#2f2418" stroke-width="7" stroke-linecap="round"/>
          <path d="M58 104 C18 70 40 24 88 42 C122 10 164 54 126 98 C156 136 104 168 58 136 Z" fill="#9fb36f"/>
          <path d="M64 84 C72 118 62 148 50 176 M66 120 L106 94 M58 146 L26 126" fill="none" stroke="#f7edc8" stroke-width="4" stroke-linecap="round"/>
          <circle cx="92" cy="116" r="5" fill="#d74435"/><circle cx="76" cy="138" r="4" fill="#d74435"/>
        </g>
        <g transform="translate(520 116)">
          <path d="M38 224 L54 82" stroke="#2f2418" stroke-width="7" stroke-linecap="round"/>
          <path d="M44 106 C6 64 32 28 78 46 C104 24 138 60 112 98 C146 130 102 170 54 142 Z" fill="#6d8f75"/>
          <path d="M52 86 C58 124 50 150 42 176 M54 126 L88 100 M48 150 L20 132" fill="none" stroke="#f7edc8" stroke-width="4" stroke-linecap="round"/>
        </g>
        <path d="M82 236 C118 204 158 214 184 246" fill="#204b45"/>
        <path d="M462 240 C506 202 554 212 586 248" fill="#224f4b"/>
      </g>

      <g class="architecture-layer" filter="url(#dragonRough)">
        <path d="M78 258 C160 190 456 190 560 256 L526 298 C406 244 236 244 110 300 Z" fill="#a1916e" stroke="#3c2a1e" stroke-width="7"/>
        <path d="M132 258 L512 258" stroke="#584032" stroke-width="7" stroke-dasharray="24 12"/>
        <path d="M98 300 L128 326 L172 304 L486 304 L528 326 L560 300" fill="#7d735e" stroke="#3c2a1e" stroke-width="6"/>
        <g transform="translate(314 70)">
          <rect x="-126" y="78" width="252" height="118" fill="#9b9674" stroke="#3c2a1e" stroke-width="5"/>
          <path d="M-146 86 L-116 46 L-86 86 M-18 78 L12 34 L44 78 M92 86 L122 42 L154 86" fill="#b9342f" stroke="#3c2a1e" stroke-width="5"/>
          <rect x="-106" y="24" width="42" height="172" fill="#9b9674" stroke="#3c2a1e" stroke-width="5"/>
          <rect x="-2" y="12" width="58" height="184" fill="#8e8d6d" stroke="#3c2a1e" stroke-width="5"/>
          <rect x="106" y="32" width="42" height="164" fill="#9b9674" stroke="#3c2a1e" stroke-width="5"/>
          <path d="M-126 78 H126 M-100 112 H-72 M-38 126 H-12 M68 118 H96 M-84 154 H-58 M22 156 H50" stroke="#e9d7a4" stroke-width="3"/>
          <path d="M-22 196 C-22 166 22 166 22 196 Z" fill="#3d3226" stroke="#3c2a1e" stroke-width="4"/>
          <path class="flag-ribbon" d="M-86 22 C-50 10 -36 34 0 18 L0 36 C-36 52 -50 28 -86 40 Z" fill="#f2a24d"/>
          <path class="flag-ribbon" d="M54 10 C90 -2 104 22 140 6 L140 24 C104 40 90 16 54 28 Z" fill="#f2d56f"/>
        </g>
      </g>

      <g class="character-layer" filter="url(#dragonRough)">
        <g transform="translate(172 248)">
          <path d="M0 72 C22 22 86 20 106 74 C78 92 28 92 0 72 Z" fill="#d8b46f" stroke="#3c2a1e" stroke-width="5"/>
          <path d="M78 24 C96 0 118 20 104 44" fill="#d8b46f" stroke="#3c2a1e" stroke-width="5"/>
          <path d="M28 70 L18 112 M84 70 L96 112" stroke="#3c2a1e" stroke-width="5" stroke-linecap="round"/>
          <path d="M12 44 C40 54 72 54 102 42" fill="none" stroke="#b9342f" stroke-width="7"/>
        </g>
        <g transform="translate(204 210)">
          <circle cx="0" cy="0" r="16" fill="#a65a35" stroke="#3c2a1e" stroke-width="4"/>
          <path d="M-14 -14 C-8 -38 16 -34 22 -12" fill="#f0c24d" stroke="#3c2a1e" stroke-width="4"/>
          <path d="M-12 18 L-28 76 M12 18 L30 76 M-18 42 L22 48" stroke="#3c2a1e" stroke-width="6" stroke-linecap="round"/>
          <path d="M-28 26 L-54 54 L-28 76 L-4 44 Z" fill="#b9342f" stroke="#f7edc8" stroke-width="4"/>
          <path d="M18 28 L74 -22" stroke="#f7edc8" stroke-width="8" stroke-linecap="round"/>
          <circle class="character-blink" cx="-6" cy="-2" r="2.5" fill="#21130d"/>
          <circle class="character-blink" cx="8" cy="-2" r="2.5" fill="#21130d"/>
        </g>
        <g transform="translate(286 282)">
          <circle cx="0" cy="0" r="11" fill="#8c4b31" stroke="#3c2a1e" stroke-width="3"/>
          <path d="M-8 -8 C-2 -24 14 -18 14 -4" fill="#d24d3f"/>
          <path d="M-8 12 L-20 46 M8 12 L20 46" stroke="#3c2a1e" stroke-width="4" stroke-linecap="round"/>
        </g>
      </g>

      <g class="creature-layer" transform="translate(390 232)" filter="url(#dragonRough)">
        <path class="dragon-tail" d="M108 88 C184 106 188 30 126 42" fill="none" stroke="#b76a3f" stroke-width="22" stroke-linecap="round"/>
        <path d="M18 82 C-8 46 20 6 70 16 C108 -18 178 10 174 72 C214 74 238 102 216 132 C176 166 112 146 70 126 C42 142 10 124 18 82 Z" fill="#b76a3f" stroke="#3b241a" stroke-width="6"/>
        <path d="M78 26 C56 -2 62 -26 92 -4 C104 8 106 24 100 36 Z" fill="#a3b77a" stroke="#3b241a" stroke-width="5"/>
        <path d="M126 24 C150 -10 178 -8 160 28 C152 42 138 48 126 44 Z" fill="#a3b77a" stroke="#3b241a" stroke-width="5"/>
        <g fill="#f0bc70">
          <circle cx="48" cy="52" r="4"/><circle cx="82" cy="42" r="4"/><circle cx="132" cy="64" r="4"/><circle cx="152" cy="102" r="4"/><circle cx="86" cy="102" r="4"/>
        </g>
        <circle class="dragon-eye" cx="78" cy="70" r="6" fill="#21130d" transform-origin="78 70"/>
        <circle class="dragon-eye" cx="124" cy="70" r="6" fill="#21130d" transform-origin="124 70"/>
        <path d="M88 98 C104 110 122 108 138 96" fill="none" stroke="#3b241a" stroke-width="5" stroke-linecap="round"/>
        <g class="dragon-breath" opacity="0" transform="translate(-18 58)">
          <path d="M0 24 C34 -8 68 -6 98 24 C62 18 36 44 0 24 Z" fill="#ffc05b"/>
          <path d="M20 28 C44 8 70 14 84 36" fill="none" stroke="#fff0a8" stroke-width="5" stroke-linecap="round"/>
        </g>
      </g>

      <g class="magic-layer">
        <path class="gold-glint" d="M86 62 L138 38 M472 62 L536 34 M270 354 L350 340" stroke="#ffe28a" stroke-width="6" stroke-linecap="round" opacity="0"/>
        <g class="lantern-dot" fill="#ffe28a">
          <circle cx="244" cy="326" r="3"/><circle cx="262" cy="344" r="2.5"/><circle cx="506" cy="326" r="3"/><circle cx="528" cy="338" r="2.5"/>
        </g>
      </g>
      <rect x="38" y="38" width="564" height="344" rx="7" fill="none" stroke="#4d2e22" stroke-width="2" opacity=".42"/>
    </svg>
  `;
}

export function dragonSvg(visuals = []) {
  const visualList = Array.isArray(visuals) ? visuals : [visuals].filter(Boolean);
  if (visualList[0] === "bridge") {
    return dragonBridgeOpeningSvg();
  }

  return `
    <svg viewBox="0 0 640 420" aria-hidden="true">
      <defs>
        ${manuscriptDefs("dragon", "lantern")}
      </defs>
      ${manuscriptFrame("dragon")}
      <rect x="58" y="76" width="524" height="272" rx="8" fill="url(#dragonHatch)" opacity=".18"/>
      <path d="M0 322 C112 286 188 342 280 310 C388 272 482 304 640 272 L640 420 L0 420 Z" fill="#78915f"/>
      <path d="M66 286 C170 214 448 216 562 282 L530 322 C398 268 222 268 98 322 Z" fill="#8d8064" stroke="#3c2a1e" stroke-width="8" filter="url(#dragonRough)"/>
      <path d="M120 286 L520 286" stroke="#584032" stroke-width="8" stroke-dasharray="26 14"/>
      <g class="lantern-light" opacity=".6" transform-origin="314 182">
        <circle cx="314" cy="182" r="128" fill="url(#lantern)"/>
      </g>
      ${dragonScene(visuals)}
      <g transform="translate(246 126)" filter="url(#dragonRough)">
        <path d="M54 120 C18 92 28 42 82 36 C126 8 198 35 202 94 C240 100 260 122 250 154 C228 184 168 176 120 158 C88 172 52 164 54 120 Z" fill="#a75a35" stroke="#3b241a" stroke-width="6"/>
        <path d="M110 54 C78 22 78 -8 118 22 C130 34 134 48 130 62 Z" fill="#7e8f59" stroke="#3b241a" stroke-width="5"/>
        <path d="M150 50 C174 14 206 10 188 48 C180 64 166 70 150 66 Z" fill="#7e8f59" stroke="#3b241a" stroke-width="5"/>
        <circle cx="100" cy="92" r="7" fill="#21130d" class="dragon-eye" transform-origin="100 92"/>
        <circle cx="152" cy="92" r="7" fill="#21130d" class="dragon-eye" transform-origin="152 92"/>
        <path d="M110 122 C126 134 144 134 160 122" fill="none" stroke="#3b241a" stroke-width="5" stroke-linecap="round"/>
        <path d="M48 130 C20 160 8 186 34 196 C72 200 74 164 74 144 Z" fill="#a75a35" stroke="#3b241a" stroke-width="5"/>
        <g class="dragon-breath" opacity="0" transform="translate(192 100)">
          <path d="M0 24 C34 -8 68 -6 98 24 C62 18 36 44 0 24 Z" fill="#ffc05b"/>
          <path d="M20 28 C44 8 70 14 84 36" fill="none" stroke="#fff0a8" stroke-width="5" stroke-linecap="round"/>
        </g>
      </g>
      <g transform="translate(74 274)">
        <path d="M0 0 C20 -18 42 -18 66 0" fill="none" stroke="#365332" stroke-width="5"/>
        <circle cx="18" cy="-9" r="8" fill="#c94d45"/>
        <circle cx="44" cy="-11" r="8" fill="#d49c3d"/>
      </g>
      <g class="banner" transform="translate(104 118)">
        <path d="M0 0 L0 152" stroke="#3b241a" stroke-width="6"/>
        <path d="M4 8 C52 -8 74 18 118 6 L118 72 C78 86 46 56 4 72 Z" fill="#8f2d25" stroke="#3b241a" stroke-width="5"/>
      </g>
      ${dragonDetail(visuals)}
      <path class="gold-glint" d="M78 58 L132 34 M94 88 L176 64 M478 86 L548 54" stroke="#ffe28a" stroke-width="6" stroke-linecap="round" opacity="0"/>
      <rect x="38" y="38" width="564" height="344" rx="7" fill="none" stroke="#4d2e22" stroke-width="2" opacity=".42"/>
    </svg>
  `;
}

function dragonDetail(visuals) {
  const visualList = Array.isArray(visuals) ? visuals : [visuals].filter(Boolean);
  const details = {
    bridge: `
      <g class="choice-detail" transform="translate(430 260)" fill="none" stroke="#4f6044" stroke-width="5" stroke-linecap="round">
        <path d="M0 32 C28 4 76 4 112 28"/>
        <path d="M18 52 C48 30 88 32 126 48"/>
      </g>
    `,
    smoke: `
      <g class="choice-detail" transform="translate(414 112)" fill="none" stroke="#efe2a0" stroke-width="6" stroke-linecap="round" opacity=".9">
        <path d="M0 34 C28 0 62 58 92 20"/>
        <path d="M22 62 C54 30 88 80 126 40"/>
      </g>
    `,
    mice: `
      <g class="choice-detail" transform="translate(140 306)" fill="#6e5943" stroke="#3b241a" stroke-width="3">
        <ellipse cx="0" cy="0" rx="14" ry="9"/>
        <circle cx="13" cy="-5" r="5"/>
        <ellipse cx="42" cy="-4" rx="12" ry="8"/>
        <circle cx="53" cy="-9" r="4"/>
        <path d="M-14 2 C-34 8 -34 18 -50 18 M30 -3 C18 8 14 14 0 14" fill="none"/>
      </g>
    `,
    mist: `
      <g class="choice-detail" transform="translate(54 214)" fill="none" stroke="#d8d5bd" stroke-width="5" stroke-linecap="round" opacity=".82">
        <path d="M0 20 C42 0 86 42 132 18"/>
        <path d="M28 50 C76 28 122 66 172 40"/>
      </g>
    `,
    mill: `
      <g class="choice-detail" transform="translate(500 262)" stroke="#3b241a" stroke-width="4">
        <rect x="-34" y="8" width="62" height="42" fill="#b88454"/>
        <path d="M-42 8 L-2 -22 L38 8 Z" fill="#7b3e31"/>
        <circle cx="46" cy="32" r="20" fill="none"/>
        <path d="M46 12 L46 52 M26 32 L66 32"/>
      </g>
    `,
    wool: `
      <g class="choice-detail" transform="translate(108 330)" fill="#eadfb9" stroke="#6b5a42" stroke-width="3">
        <circle cx="0" cy="0" r="12"/>
        <circle cx="16" cy="-8" r="12"/>
        <circle cx="28" cy="4" r="12"/>
        <circle cx="12" cy="10" r="12"/>
      </g>
    `,
    oath: `
      <g class="choice-detail" transform="translate(482 104)" stroke="#3b241a" stroke-width="5" stroke-linecap="round">
        <path d="M0 76 L74 2" />
        <path d="M42 16 L58 32" />
        <path d="M-8 84 L14 62 L24 72 L2 94 Z" fill="#b98624"/>
        <path d="M22 54 C42 42 62 42 82 54" stroke="#ffe28a" stroke-width="4"/>
      </g>
    `,
    flowers: `
      <g class="choice-detail" transform="translate(492 336)">
        <path d="M-46 20 C-22 -4 14 -4 40 20" fill="none" stroke="#365332" stroke-width="5"/>
        <circle cx="-26" cy="6" r="8" fill="#c94d45"/>
        <circle cx="0" cy="-2" r="8" fill="#d49c3d"/>
        <circle cx="28" cy="8" r="8" fill="#496d84"/>
      </g>
    `,
    stars: `
      <g class="choice-detail" transform="translate(464 72)" fill="#ffe28a">
        <path d="M0 16 L6 6 L16 0 L10 12 L18 22 L4 20 L-6 30 L-2 18 L-14 12 Z"/>
        <path d="M72 42 L76 34 L84 30 L80 40 L88 46 L78 46 L72 54 L70 46 L60 42 Z"/>
      </g>
    `,
    question: `
      <g class="choice-detail" transform="translate(466 92)">
        <path d="M0 22 C0 2 34 0 34 20 C34 42 10 36 10 58" fill="none" stroke="#7b2d25" stroke-width="8" stroke-linecap="round"/>
        <circle cx="10" cy="78" r="5" fill="#7b2d25"/>
      </g>
    `,
    sound: `
      <g class="choice-detail" transform="translate(150 250)" fill="none" stroke="#496d84" stroke-width="5" stroke-linecap="round">
        <path d="M0 18 C16 4 34 4 50 18"/>
        <path d="M-12 36 C12 14 40 14 64 36"/>
        <path d="M-24 56 C10 26 42 26 76 56"/>
      </g>
    `,
    lantern: `
      <g class="choice-detail" transform="translate(468 224)">
        <circle cx="0" cy="0" r="62" fill="#ffd36d" opacity=".24"/>
        <path d="M-12 -22 L12 -22 L20 10 L-20 10 Z" fill="#d29a37" stroke="#3b241a" stroke-width="5"/>
        <path d="M-8 -22 C-4 -42 4 -42 8 -22" fill="none" stroke="#3b241a" stroke-width="4"/>
      </g>
    `,
    bread: `
      <g class="choice-detail" transform="translate(92 324)">
        <ellipse cx="0" cy="0" rx="28" ry="14" fill="#c88a43" stroke="#3b241a" stroke-width="4"/>
        <path d="M-14 -2 C-8 -10 2 -10 8 -2 M4 4 C12 -4 20 -2 24 6" fill="none" stroke="#f5d28a" stroke-width="4" stroke-linecap="round"/>
      </g>
    `,
    basket: `
      <g class="choice-detail" transform="translate(496 308)">
        <path d="M-38 -8 L38 -8 L28 42 L-28 42 Z" fill="#b98245" stroke="#3b241a" stroke-width="5"/>
        <path d="M-24 -8 C-18 -42 18 -42 24 -8" fill="none" stroke="#3b241a" stroke-width="5"/>
        <path d="M-26 8 L26 8 M-30 24 L30 24 M-12 -4 L-16 38 M12 -4 L16 38" stroke="#f0c77b" stroke-width="3"/>
      </g>
    `,
    footsteps: `
      <g class="choice-detail" transform="translate(438 328)" fill="#5a3b28">
        <ellipse cx="0" cy="0" rx="7" ry="13" transform="rotate(-18)"/>
        <ellipse cx="32" cy="-12" rx="7" ry="13" transform="rotate(18)"/>
        <ellipse cx="64" cy="-4" rx="7" ry="13" transform="rotate(-18)"/>
      </g>
    `
  };

  return visualList.map((visual) => details[visual] || "").join("");
}

function dragonScene(visuals) {
  const [primary] = Array.isArray(visuals) ? visuals : [visuals].filter(Boolean);
  const scenes = {
    smoke: `
      <g class="scene-layer" fill="none" stroke="#f4df98" stroke-width="7" stroke-linecap="round" opacity=".72">
        <path d="M90 162 C150 108 220 174 282 122 C340 76 412 122 462 88"/>
        <path d="M118 198 C188 154 244 220 320 176 C392 132 466 176 540 132"/>
      </g>
    `,
    mice: `
      <g class="scene-layer" transform="translate(82 270)">
        <ellipse cx="92" cy="42" rx="84" ry="36" fill="#6b7f58" opacity=".44"/>
        <path d="M16 46 C62 10 126 10 178 42" fill="none" stroke="#355335" stroke-width="6" stroke-linecap="round"/>
        <g fill="#6e5943" stroke="#3b241a" stroke-width="3">
          <ellipse cx="68" cy="38" rx="15" ry="10"/>
          <circle cx="82" cy="32" r="5"/>
          <ellipse cx="112" cy="34" rx="13" ry="9"/>
          <circle cx="124" cy="29" r="4"/>
        </g>
      </g>
    `,
    mist: `
      <g class="scene-layer" fill="none" stroke="#efe6c5" stroke-width="10" stroke-linecap="round" opacity=".55">
        <path d="M42 238 C116 200 204 254 292 216 C382 176 470 228 596 180"/>
        <path d="M24 284 C126 248 218 304 330 260 C424 224 512 264 618 232"/>
      </g>
    `,
    mill: `
      <g class="scene-layer" transform="translate(468 216)" stroke="#3b241a" stroke-width="5">
        <path d="M-58 80 L-58 18 L6 -18 L68 18 L68 80 Z" fill="#b88454"/>
        <path d="M-70 22 L6 -28 L80 22" fill="none" stroke="#74352b" stroke-width="10" stroke-linecap="round"/>
        <circle cx="82" cy="64" r="34" fill="none"/>
        <path d="M82 30 L82 98 M48 64 L116 64 M58 40 L106 88 M106 40 L58 88"/>
        <path d="M-100 106 C-36 86 20 110 98 92" fill="none" stroke="#496d84" stroke-width="6" stroke-linecap="round"/>
      </g>
    `,
    wool: `
      <g class="scene-layer" transform="translate(100 288)" fill="#eadfb9" stroke="#6b5a42" stroke-width="4">
        <path d="M18 40 C64 0 142 2 190 42 C150 84 58 82 18 40 Z" fill="#c99a54"/>
        <circle cx="78" cy="38" r="19"/>
        <circle cx="104" cy="26" r="20"/>
        <circle cx="132" cy="40" r="18"/>
      </g>
    `,
    oath: `
      <g class="scene-layer" transform="translate(448 82)" stroke="#3b241a" stroke-width="6" stroke-linecap="round">
        <path d="M0 184 L116 18" />
        <path d="M64 54 L92 82" />
        <path d="M-12 202 L24 154 L42 172 L6 220 Z" fill="#b98624"/>
        <path d="M40 134 C84 110 122 112 154 136" stroke="#ffe28a" stroke-width="5"/>
      </g>
    `,
    flowers: `
      <g class="scene-layer" transform="translate(84 314)">
        <path d="M0 34 C94 -22 228 -14 332 24 C430 58 500 8 558 32" fill="none" stroke="#365332" stroke-width="8" stroke-linecap="round"/>
        <g fill="#c94d45">
          <circle cx="42" cy="14" r="9"/><circle cx="206" cy="2" r="8"/><circle cx="392" cy="22" r="8"/>
        </g>
        <g fill="#d49c3d">
          <circle cx="96" cy="0" r="8"/><circle cx="284" cy="14" r="9"/><circle cx="466" cy="6" r="8"/>
        </g>
      </g>
    `,
    stars: `
      <g class="scene-layer" fill="#ffe28a" opacity=".92">
        <path d="M92 116 L98 104 L110 98 L104 110 L112 120 L98 118 L88 128 L92 116"/>
        <path d="M512 132 L518 120 L530 114 L524 126 L532 136 L518 134 L508 144 L512 132"/>
        <path d="M452 72 L456 64 L464 60 L460 70 L468 76 L458 76 L452 84 L450 76 L440 72 Z"/>
      </g>
    `
  };

  return scenes[primary] || "";
}

export function bellSvg(visuals = []) {
  return `
    <svg viewBox="0 0 640 420" aria-hidden="true">
      <defs>
        ${manuscriptDefs("bell", "windowGlow")}
      </defs>
      ${manuscriptFrame("bell")}
      <rect x="58" y="76" width="524" height="272" rx="8" fill="url(#bellHatch)" opacity=".18"/>
      <path d="M0 310 C130 284 194 336 316 298 C444 258 510 300 640 270 L640 420 L0 420 Z" fill="#6d8a63"/>
      <g filter="url(#bellRough)">
        <path d="M214 102 L330 42 L448 102 L448 332 L214 332 Z" fill="#a88961" stroke="#3c2a1e" stroke-width="7"/>
        <path d="M192 112 L330 38 L470 112" fill="none" stroke="#74352b" stroke-width="18" stroke-linecap="round"/>
        <rect x="286" y="154" width="88" height="118" fill="#4f382c" stroke="#2d1b14" stroke-width="6"/>
        <circle cx="330" cy="210" r="68" fill="url(#windowGlow)" class="lantern-light" opacity=".58"/>
        <g class="bell" transform="translate(330 116)">
          <path d="M-38 42 C-34 10 34 10 38 42 L50 94 L-50 94 Z" fill="#bd8d31" stroke="#3c2a1e" stroke-width="6"/>
          <path d="M-60 96 L60 96" stroke="#3c2a1e" stroke-width="8" stroke-linecap="round"/>
          <circle cx="0" cy="104" r="12" fill="#7d5424" stroke="#3c2a1e" stroke-width="5"/>
          <path d="M18 60 C8 68 6 76 18 84" fill="none" stroke="#6b421f" stroke-width="4"/>
        </g>
      </g>
      <g transform="translate(80 270)" filter="url(#bellRough)">
        <rect x="0" y="42" width="98" height="62" fill="#b88454" stroke="#3c2a1e" stroke-width="5"/>
        <path d="M-10 44 L48 2 L108 44" fill="#7b3e31" stroke="#3c2a1e" stroke-width="5"/>
        <rect x="34" y="62" width="28" height="42" fill="#52352a"/>
      </g>
      <g transform="translate(496 262)" filter="url(#bellRough)">
        <rect x="0" y="48" width="92" height="58" fill="#c09761" stroke="#3c2a1e" stroke-width="5"/>
        <path d="M-8 48 L44 10 L100 48" fill="#5e6f82" stroke="#3c2a1e" stroke-width="5"/>
        <rect x="32" y="66" width="28" height="40" fill="#52352a"/>
      </g>
      <path d="M126 210 C206 174 248 220 322 190 C410 154 462 198 544 166" fill="none" stroke="#8f2d25" stroke-width="5" stroke-dasharray="10 12"/>
      <g class="note" opacity="0" fill="#69381f">
        <path d="M410 178 L410 120 L424 120 L424 172 C436 170 444 176 444 186 C444 198 428 204 416 198 C406 194 404 184 410 178 Z"/>
        <path d="M470 142 L470 96 L482 96 L482 136 C494 134 502 140 502 150 C502 160 488 166 476 160 C466 156 464 148 470 142 Z"/>
      </g>
      ${bellScene(visuals)}
      ${bellDetail(visuals)}
      <path class="gold-glint" d="M112 72 L178 42 M454 78 L548 42 M284 360 L390 342" stroke="#ffe28a" stroke-width="6" stroke-linecap="round" opacity="0"/>
      <rect x="38" y="38" width="564" height="344" rx="7" fill="none" stroke="#4d2e22" stroke-width="2" opacity=".42"/>
    </svg>
  `;
}

function bellDetail(visuals) {
  const visualList = Array.isArray(visuals) ? visuals : [visuals].filter(Boolean);
  const details = {
    tower: `
      <g class="choice-detail" transform="translate(102 118)" stroke="#3b241a" stroke-width="5">
        <path d="M0 142 L0 24 L72 0 L144 24 L144 142" fill="#a88961"/>
        <path d="M-10 30 L72 -8 L154 30" fill="none" stroke="#74352b" stroke-width="9"/>
        <rect x="54" y="58" width="36" height="56" fill="#4f382c"/>
      </g>
    `,
    orchard: `
      <g class="choice-detail" transform="translate(94 180)" stroke="#3b241a" stroke-width="4">
        <path d="M20 108 L36 34 M74 110 L60 34 M32 54 C0 20 48 -10 62 34 C94 12 122 48 82 70 Z" fill="#6c8052"/>
        <circle cx="42" cy="58" r="6" fill="#d6a13d"/>
        <circle cx="70" cy="48" r="6" fill="#d6a13d"/>
      </g>
    `,
    rope: `
      <g class="choice-detail" transform="translate(470 88)" fill="none" stroke="#7a5938" stroke-width="7" stroke-linecap="round">
        <path d="M0 0 C42 46 -16 90 32 138 C64 170 16 196 54 230"/>
        <path d="M-12 82 C18 62 44 72 50 102"/>
      </g>
    `,
    "pear-leaf": `
      <g class="choice-detail" transform="translate(118 106)" stroke="#3b241a" stroke-width="4">
        <path d="M0 52 C-8 10 42 -8 74 20 C52 54 20 70 0 52 Z" fill="#78915f"/>
        <path d="M4 52 C28 36 48 26 72 20" fill="none"/>
      </g>
    `,
    crack: `
      <g class="choice-detail" transform="translate(390 160)" fill="none" stroke="#7b2d25" stroke-width="5" stroke-linecap="round">
        <path d="M0 0 L18 28 L8 58 L34 92 L22 132"/>
      </g>
    `,
    workshop: `
      <g class="choice-detail" transform="translate(474 306)" stroke="#3b241a" stroke-width="5" stroke-linecap="round">
        <path d="M0 34 L82 34" />
        <path d="M10 34 L22 68 M72 34 L62 68" />
        <circle cx="22" cy="14" r="10" fill="#ffd36d" stroke="none"/>
        <path d="M48 18 L76 -10" />
      </g>
    `,
    moon: `
      <g class="choice-detail" transform="translate(502 84)">
        <circle cx="0" cy="0" r="34" fill="#f6df9a" stroke="#3b241a" stroke-width="4"/>
        <circle cx="14" cy="-6" r="34" fill="#d4c183"/>
      </g>
    `,
    square: `
      <g class="choice-detail" transform="translate(118 318)" fill="#8f2d25" stroke="#3b241a" stroke-width="4">
        <path d="M0 0 C22 -12 42 12 64 0 L64 38 C42 50 22 26 0 38 Z"/>
        <path d="M-4 -4 L-4 72" fill="none"/>
      </g>
    `,
    hoofprints: `
      <g class="choice-detail" transform="translate(94 220)" fill="#5a3b28">
        <path d="M0 0 C-12 -10 -12 -30 0 -38 C12 -30 12 -10 0 0 Z"/>
        <path d="M42 26 C30 16 30 -4 42 -12 C54 -4 54 16 42 26 Z"/>
        <path d="M84 8 C72 -2 72 -22 84 -30 C96 -22 96 -2 84 8 Z"/>
      </g>
    `,
    "elder-scroll": `
      <g class="choice-detail" transform="translate(492 126)">
        <path d="M-38 -8 L30 -8 C46 -8 46 24 30 24 L-38 24 C-54 24 -54 -8 -38 -8 Z" fill="#ead18e" stroke="#3b241a" stroke-width="5"/>
        <path d="M-22 4 L16 4 M-22 14 L8 14" stroke="#7b2d25" stroke-width="4" stroke-linecap="round"/>
      </g>
    `,
    finches: `
      <g class="choice-detail" transform="translate(122 132)" fill="#4f6044" stroke="#3b241a" stroke-width="4">
        <path d="M0 12 C14 -8 38 -4 46 18 C28 12 16 18 0 12 Z"/>
        <path d="M56 26 C70 6 94 10 102 32 C84 26 72 32 56 26 Z"/>
      </g>
    `,
    ladder: `
      <g class="choice-detail" transform="translate(504 196)" stroke="#6b421f" stroke-width="6" stroke-linecap="round">
        <path d="M0 104 L42 0 M30 110 L72 6"/>
        <path d="M14 70 L46 78 M26 42 L58 50 M38 14 L70 22"/>
      </g>
    `,
    "smith-tools": `
      <g class="choice-detail" transform="translate(126 342)" stroke="#3b241a" stroke-width="5" stroke-linecap="round">
        <path d="M0 26 L46 -20" />
        <path d="M34 -28 L58 -4" />
        <path d="M74 24 L120 -22" />
        <path d="M76 22 L94 40 L128 6 L110 -12 Z" fill="#7d8a8f"/>
      </g>
    `,
    heart: `
      <g class="choice-detail" transform="translate(486 130)">
        <path d="M0 18 C-32 -8 -8 -44 18 -20 C44 -44 68 -8 36 18 L18 36 Z" fill="#9d342d" stroke="#3b241a" stroke-width="5"/>
      </g>
    `
  };

  return visualList.map((visual) => details[visual] || "").join("");
}

function bellScene(visuals) {
  const [primary] = Array.isArray(visuals) ? visuals : [visuals].filter(Boolean);
  const scenes = {
    orchard: `
      <g class="scene-layer" transform="translate(62 164)" stroke="#3b241a" stroke-width="5">
        <path d="M52 172 L72 62 M146 174 L124 62 M82 92 C24 34 106 -18 134 58 C184 22 226 94 150 126 Z" fill="#6c8052"/>
        <circle cx="96" cy="92" r="9" fill="#d6a13d"/>
        <circle cx="142" cy="74" r="8" fill="#d6a13d"/>
      </g>
    `,
    rope: `
      <g class="scene-layer" transform="translate(430 54)" fill="none" stroke="#7a5938" stroke-width="10" stroke-linecap="round">
        <path d="M40 0 C92 58 12 118 68 178 C106 220 42 258 88 330"/>
        <path d="M12 116 C48 88 88 104 94 144"/>
      </g>
    `,
    finches: `
      <g class="scene-layer" transform="translate(78 104)" stroke="#3b241a" stroke-width="5">
        <path d="M0 78 C76 34 154 42 232 74" fill="none" stroke="#5e3b25" stroke-width="8" stroke-linecap="round"/>
        <g fill="#4f6044">
          <path d="M58 52 C82 20 122 28 132 64 C104 52 84 66 58 52 Z"/>
          <path d="M146 68 C170 36 210 44 220 80 C192 68 172 82 146 68 Z"/>
        </g>
      </g>
    `,
    "pear-leaf": `
      <g class="scene-layer" transform="translate(88 78)" stroke="#3b241a" stroke-width="5">
        <path d="M0 92 C-14 20 74 -22 136 28 C100 88 42 126 0 92 Z" fill="#78915f"/>
        <path d="M8 92 C52 62 92 42 132 28" fill="none"/>
      </g>
    `,
    crack: `
      <g class="scene-layer" transform="translate(328 118)" fill="none" stroke="#7b2d25" stroke-width="7" stroke-linecap="round">
        <path d="M0 0 L22 42 L8 84 L42 128 L24 184"/>
      </g>
    `,
    workshop: `
      <g class="scene-layer" transform="translate(112 300)" stroke="#3b241a" stroke-width="6" stroke-linecap="round">
        <path d="M0 36 L420 36" />
        <path d="M28 36 L48 92 M390 36 L362 92" />
        <circle cx="86" cy="6" r="18" fill="#ffd36d" stroke="none"/>
        <path d="M172 16 L238 -30 M286 22 L352 -28" />
        <path d="M286 22 L314 50 L366 -4 L338 -30 Z" fill="#7d8a8f"/>
      </g>
    `,
    moon: `
      <g class="scene-layer">
        <rect x="38" y="38" width="564" height="344" rx="7" fill="#243044" opacity=".2"/>
        <circle cx="510" cy="94" r="46" fill="#f6df9a" stroke="#3b241a" stroke-width="4"/>
        <circle cx="528" cy="86" r="46" fill="#d6bd78"/>
      </g>
    `,
    square: `
      <g class="scene-layer" transform="translate(76 306)" stroke="#3b241a" stroke-width="5">
        <path d="M0 64 C90 12 188 20 292 58 C394 96 474 44 544 62" fill="none" stroke="#5e3b25" stroke-width="7"/>
        <path d="M58 0 C94 -18 126 18 160 0 L160 54 C126 72 94 36 58 54 Z" fill="#8f2d25"/>
        <path d="M50 -6 L50 92" fill="none"/>
      </g>
    `
  };

  return scenes[primary] || "";
}
