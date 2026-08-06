# Plan: App Store Icon Variant Exploration

## Context

Current icon (`assets/icon.png`) is a 3D-rendered three-link chain in gold/silver/bronze on green. Concept fits "don't break the chain" perfectly, but at App Store thumbnail size (29–60pt) it reads as ambiguous (lock / blockchain / jewelry / medals) rather than instantly "habit tracker." Top performers in this category win with **one dominant shape + a category shorthand** (checkmark, flame, streak number).

Goal: generate a broad set of icon variants spanning distinct strategic directions, then narrow to 2–3 finalists for App Store A/B testing.

## Strategy: 10 variants across 5 strategic directions

Each direction tests a different conversion hypothesis. Two variants per direction (one closer to current brand, one bolder departure).

### Direction A — "Chain + Shorthand" (evolves current brand)
1. Single bold gold chain link, white checkmark cleanly centered inside, deep green background
2. Single chain link with a flame icon inside (streak emphasis), warm gradient background

### Direction B — "Streak Symbol First" (proven category winner)
3. Bold flame (orange→red gradient), confident silhouette, no chain (Done.-style)
4. Streak number "30" in a gold circle, bold typography, dark background

### Direction C — "Checkmark Primary" (Streaks/Habitify category leaders)
5. Big white checkmark on saturated green→teal gradient, slightly 3D, single object
6. Animated-looking checkmark mid-stroke (motion blur tail), bold purple background to own a color

### Direction D — "Warm/Mascot" (Finch/Fabulous wellness winners)
7. Cute illustrated chain-link character with face/eyes, smiling, soft pastel background
8. Sprout/plant character growing from a chain link base, friendly wellness tone

### Direction E — "Brand-Led / Letter mark"
9. Bold "H" or app-letter monogram constructed from interlocking chain links, premium gold on dark
10. Calendar grid with 7 days, last 5 lit up green with checks, the streak made tangible

## Generation approach

Use **Nano Banana Pro** via `aso-appstore-screenshots` skill's underlying image generation, OR delegate to the **Artist** subagent which handles model selection (Flux 1.1 Pro / Nano Banana / GPT-Image-1). For icons specifically, **Nano Banana Pro** tends to nail crisp shapes + flat-but-premium aesthetic at 1024×1024.

For each variant:
- Generate at 1024×1024
- Save to `assets/icon-variants/v{NN}-{slug}.png`
- Also generate a 60×60 thumbnail render for legibility check

**Prompt pattern (example for Variant 1):**
> "iOS App Store icon, 1024x1024, rounded square mask, single bold gold chain link centered, clean white checkmark inside the link's opening, deep emerald green background with subtle radial gradient, premium 3D render but readable at 29pt thumbnail size, no text, no extra elements, sharp clean silhouette"

## Files involved

- **Read/reference:** `assets/icon.png`, `assets/source/icon.svg`
- **New (create):** `assets/icon-variants/` directory containing 10 PNGs at 1024×1024
- **New (create):** `assets/icon-variants/CONTACT-SHEET.png` — 2×5 grid of all variants for side-by-side review
- **New (create):** `assets/icon-variants/THUMBNAIL-SHEET.png` — same grid at 60×60 sizes (the size that matters most)
- **No app code changes** until a winner is selected; then `app.json` icon paths get updated

## Reuse / existing patterns

- `assets/source/icon.svg` is the editable source; if a winner is vector-friendly, recreate as SVG and re-export
- Expo icon pipeline: `app.json` → `icon`, `splash.image`, `android.adaptiveIcon.foregroundImage`, `web.favicon` all reference `assets/*.png`. Update these atomically once a winner ships.

## Evaluation criteria (in priority order)

1. **Legibility at 60×60** — does it read instantly at App Store browse size?
2. **Category clarity** — does a stranger guess "habit / productivity / wellness" within 1 second?
3. **Differentiation** — does it stand out next to Streaks, Habitify, Finch, Way of Life, Done?
4. **Color ownership** — does the dominant color feel ownable (not generic green)?
5. **Brand fit** — preserves chain metaphor or replaces it cleanly?

After review: pick top 3, prepare for App Store Connect A/B test (Apple's product page optimization supports up to 3 icon treatments simultaneously).

## Verification

- Visually inspect contact sheet and thumbnail sheet
- Open thumbnail sheet at 100% on a phone screen — that is the actual conversion moment
- (Optional) drop top 3 into a Maze or PickFu test for n=50 strangers, ask "Which app would you guess is a habit tracker?" — costs ~$30, settles arguments fast
- Once a winner is picked, update `app.json` icon paths and run `npx expo prebuild --clean` to regenerate native icons; verify in iOS simulator
