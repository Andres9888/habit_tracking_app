# Plan: Make the Strength Curve picker easier to understand

## Context

The Strength Curve picker — opened from the "Advanced" section of the habit create/edit form — currently appears as a partial bottom sheet with three text-only option cards (Quick Win / Textbook / Long Haul). The choice meaningfully changes how the user's habit-strength number behaves over time, but the current UI:

- Uses jargon ("Strength Curve") without showing what a "curve" actually is.
- Shows no visual preview of how each option grows or drops on misses — so the user picks blind.
- Names options after themes ("Textbook", "Long Haul") that don't immediately communicate the trade-off.
- Crams everything into ~86% of the screen, leaving no room for a meaningful illustration or per-option guidance.

User intent (from this session): "make this page easier to understand … maybe full screen, whatever makes sense."

**Goal:** Replace the bottom-sheet picker with a dedicated full-screen page that (a) visualizes each curve, (b) gives concrete habit examples for each, and (c) uses plain-language guidance — so a first-time user can pick the right curve with confidence.

## Recommended approach

A new full-screen modal that reuses the app's existing full-screen `Modal` primitive and the `StrengthChart` curve visualization. No changes to the `AlgorithmMode` enum, persistence, or strength-calculation logic — this is presentation-only.

**Visual target:** `.superdesign/design_iterations/strength_curve_picker_1.html` — **Variant A (left phone)** is the approved direction. Implementation must match it screenshot-for-screenshot before shipping. Variant B (overlay comparison) is not being built.

### Variant A spec (what the implementation must produce)

- **Sticky translucent header** (blur backdrop), with a circular back chevron (left), centered title "Strength curve" (sentence-case, lowercase "curve"), and a filled green pill "Done" button (right).
- **Hero** — H1 "How fast should this habit get automatic?" + sub "Your strength bar grows when you check in and dips when you miss. Pick the rhythm that fits this habit." (Both subject to user approval — see Open copy questions below.)
- **Legend strip** — pill-shaped row with two legend dots: green "Check-ins build strength" + red "Misses dip it".
- **Three option cards**, full-width, vertically stacked, in this order: Quick Win (orange), Textbook (green, DEFAULT + selected by default), Long Haul (purple). Each card:
  - Icon tile + name + (DEFAULT pill on Textbook) + selected check-circle (right) when chosen
  - 1-line description below the name
  - **Per-card curve preview** inside a tinted inner panel — SVG bezier with the algorithm's color, gradient area fill below, a single red "miss dip" marker, axis labels "Day 1 … Day N" where N = `daysToForm`
  - Example chips (3 per card)
  - Bottom row: time chip ("~Nd days to automatic" in primary tint) and either a "Pick" affordance or, on Textbook, the UCL note inline
- **Footer hint** — dashed-border info pill: "Not sure? Stick with Textbook — most habits land here."

### Open copy questions (user to decide before build)

1. Long Haul icon: mountain (mock) vs current ⚡ Zap. **Default: keep mountain.**
2. Tap target: tap-anywhere-to-select (no "Pick" button) vs explicit "Pick" link. **Default: tap-anywhere; drop the "Pick" link.**
3. UCL note: keep on Textbook card only (mock). **Default: keep as-is.**
4. Example chips per mode — current set:
   - Quick Win: 💧 Drink water · 💊 Take vitamins · 🪥 Floss
   - Textbook: 📖 Read 10 min · 🚶 Daily walk · 🧘 5-min meditate
   - Long Haul: 🏃 Run 5K · 🧘 30-min meditate · ✍️ Write 500 words
5. Hero copy strings as drafted.

If user doesn't override before build, ship with the "Default" choices above; otherwise update copy file and re-mock.

### Component changes

**New file:** `src/screens/StrengthCurvePicker/StrengthCurvePickerModal.tsx` (~80 lines target)
- Full-screen modal using `<Modal variant='fullScreen'>` (pattern: `src/components/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx:77-99`).
- Header: back chevron (left) + "Done" (right). Title in scroll area.
- Scrollable body:
  1. **Hero** — large title + 2-line plain-language explainer.
  2. **Three option cards**, full-width, vertically stacked.
- Selecting a card calls `onSelect(mode)` and dismisses.

**New file:** `src/screens/StrengthCurvePicker/StrengthCurveOptionCard.tsx` (~90 lines target)
Each card matches the Variant A card spec above. Built fresh with `react-native-svg` for the curve preview rather than reusing `ChartCurve` — `ChartCurve` is tightly coupled to real strength history and chart-grid hooks; for a teaching aid we just need a static bezier path per mode plus a miss-dip dot. Card supports the per-mode color (orange / green / purple) via a prop.

**New file:** `src/screens/StrengthCurvePicker/CurvePreview.tsx` (~70 lines target)
- Pure `react-native-svg` component. Takes `{ mode, color, daysToForm }`.
- Renders: 3 dashed grid lines, the bezier path, an opacity-12% area fill below the path, one miss-marker dot, and two axis labels ("Day 1" / `Day ${daysToForm}`).
- Bezier control points come from `curveShapes.ts` keyed by mode.

**New file:** `src/screens/StrengthCurvePicker/curveShapes.ts` (~40 lines target)
- Exports three small arrays of `{ x, y }` points (length ~30) shaped to illustrate each algorithm. Hand-tuned, not computed from real strength math — this is a teaching aid, not a simulator.
- Each curve includes a stylized "miss dip" partway through to show the penalty behavior visually.

**New file:** `src/screens/StrengthCurvePicker/StrengthCurvePicker.copy.ts`
- Centralizes all picker copy (hero title/explainer, per-mode "best for" line, per-mode examples). Keeps copy edits in one place and matches the codebase's "copy file" pattern (cf. `algorithmCopy.ts`).
- **Copy must be reviewed/approved by user before merge** — see "Copy drafts to approve" below.

### Wiring changes

**Edit:** `src/components/AdvancedOptions/AdvancedOptionsSection.tsx`
- Replace the `<AdvancedSheet visible={openSheet === 'algorithm'} … >` block (lines 245-255) with `<StrengthCurvePickerModal visible={openSheet === 'algorithm'} selected={strengthAlgorithm} onSelect={…} onClose={…} />`.
- Leave the Growth Icons sheet and Streak Goal sheet untouched — those don't need full-screen treatment.
- Optionally update the row subtitle (`AdvancedOptionsSection.tsx:93`) to drop "Textbook · " prefix once the new picker is in — see copy notes.

**No changes** to:
- `algorithmCopy.ts` — keep `name`/`daysToForm`/`Icon` as the source of truth.
- `AlgorithmMode` type / persistence / strength math.
- `AdvancedSheet.tsx` (still used by Growth Icons + Streak Goal).
- `AlgorithmCard.tsx` / `AlgorithmCardsList.tsx` — keep around in case the legend/disclosure variant elsewhere still uses them.

### Copy drafts to approve

These are *proposals only*; nothing ships until you sign off. Replace any of them.

**Hero title:** "How should this habit's strength change?"
**Hero explainer:** "Pick the rhythm that fits this habit. Your strength bar grows when you check in and dips when you miss."

| Mode | Card name (unchanged) | "Best for" line draft | Example chips draft |
|---|---|---|---|
| forgiving | Quick Win | "Tiny actions that take seconds. Forgives slips." | 💧 Drink water · 💊 Take vitamins · 🪥 Floss |
| balanced  | Textbook (DEFAULT) | "Everyday habits with steady gains and honest setbacks." | 📖 Read 10 min · 🚶 Daily walk · 🧘 5-min meditate |
| strict    | Long Haul | "Big commitments. Months to build; misses sting." | 🏃 Run 5K · 🧘 30-min meditate · ✍️ Write 500 words |

The per-mode `description` strings already in `algorithmCopy.ts` (e.g., "The research default — steady gains, honest setbacks on misses. Based on UCL's 66-day study.") would move to a small "Why" tooltip-or-collapsible at the bottom of each card, so the science note is still discoverable without dominating the card.

## Critical files

- **Edit:** `src/components/AdvancedOptions/AdvancedOptionsSection.tsx` (lines 245-255 + import)
- **New:** `src/screens/StrengthCurvePicker/StrengthCurvePickerModal.tsx`
- **New:** `src/screens/StrengthCurvePicker/StrengthCurveOptionCard.tsx`
- **New:** `src/screens/StrengthCurvePicker/CurvePreview.tsx`
- **New:** `src/screens/StrengthCurvePicker/curveShapes.ts`
- **New:** `src/screens/StrengthCurvePicker/StrengthCurvePicker.copy.ts`
- **New:** `src/screens/StrengthCurvePicker/index.ts` (barrel)
- **Reuse:** `src/components/Modal` (variant='fullScreen'), `react-native-svg`, `algorithmCopy.ts` (data source).
- **Reference mock:** `.superdesign/design_iterations/strength_curve_picker_1.html` (Variant A).

## Verification

1. **Visual** — Run app (`npm start`), open Create Habit, expand Advanced, tap Strength Curve. Confirm:
   - Picker takes full screen with back chevron + Done button.
   - All three options visible with their curve previews on a single phone screen (scroll if needed).
   - Currently-selected option shows a check; DEFAULT pill stays on Textbook.
   - Tapping a card fires selection haptic, updates the row subtitle on the underlying form, and closes the modal.
   - Light + dark mode both render correctly.
2. **Regression** — Confirm Growth Icons and Streak Goal sheets still open as bottom sheets (unchanged behavior).
3. **Lint / types** — `npm run lint -- src/screens/StrengthCurvePicker src/components/AdvancedOptions` and `npx tsc --noEmit` pass.
4. **Max-lines** — Every new file under the 100-line ESLint limit.
5. **Mockup compare** — Take a screenshot of the running RN picker and diff against `.superdesign/design_iterations/strength_curve_picker_1.html` (Variant A). Header chrome, hero, legend strip, each card's icon-tile color, curve color + miss dot, chip set, and footer hint must all be present. Do not claim done until the screenshot matches the mock.

## Out of scope

- Changing the algorithm math, `daysToForm` values, or persistence shape.
- Localization passes — copy goes in the new copy file but English-only for now (matches current `algorithmCopy.ts`).
- A "Custom" curve option.
- Animating between picker and form (use existing modal enter/exit).
