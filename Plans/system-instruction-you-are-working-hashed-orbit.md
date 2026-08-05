# Fix: "100%" overflows the Habit Strength ring

## Context

On the Habit Detail screen, the "Habit Strength" card renders a 64px circular progress ring with the percentage value centered inside it (e.g. "100%", "78%", "12%"). The percentage Text is styled `text-2xl font-bold` (~24px). At 100%, the rendered "100%" string is wider than the inner diameter of the 64px ring (inner usable width ≈ 54px after the 5px stroke), so the text visibly clips/overflows the ring edge — see screenshot in `.context/attachments/`.

We want a surgical fix that preserves the prominent 24px display for typical 1–99% values and only shrinks the text when it actually doesn't fit (i.e. at 100%). React Native's built-in `adjustsFontSizeToFit` + `numberOfLines={1}` on `<Text>` does exactly this when the Text has a bounded width.

Reference: this same pattern was applied recently in `9dde115b2 fix(habit-detail): drop dot separators so 'total' label fits at 3+ digit values` — surgical UI-fit fix for the "+X total" label on the same screen, so the precedent is established.

## Recommended approach

Add `numberOfLines={1}` + `adjustsFontSizeToFit` to the percentage `<Text>` in `AnimatedPercentage.tsx`, and give it a bounded width matching the ring's inner usable area so RN knows when to scale down. Keep `text-2xl` so values 1–99% render unchanged.

### Files to modify

**`src/components/HabitStrengthSection/StrengthHero/AnimatedPercentage.tsx`** (37 lines today, well under the 100-line limit — stays a single file)

Change the returned `<Text>` to:

```tsx
<Text
  adjustsFontSizeToFit
  className='text-2xl font-bold'
  numberOfLines={1}
  style={{
    color: themeColors.text.primary,
    minimumFontScale: 0.75,
    textAlign: 'center',
    width: RING_INNER_WIDTH,
  }}
>{displayValue}%</Text>
```

- `adjustsFontSizeToFit` + `numberOfLines={1}`: stock RN API that shrinks the font down so the string fits within the Text's width on a single line.
- `minimumFontScale={0.75}`: 24px × 0.75 = 18px floor — comfortably big, prevents over-shrinking for any pathological future value.
- `width`: must be bounded so RN measures overflow. Use a constant from `constants.ts` so it stays in sync with `RING_SIZE` / `RING_STROKE_WIDTH`.
- `textAlign: 'center'`: keeps the now width-bounded Text centered (the parent's `items-center justify-center` only centers the box, not text within it).

**`src/components/HabitStrengthSection/constants.ts`**

Add one derived constant alongside the existing ring sizing block (lines 15–19):

```ts
/** Usable inner width for centered text inside the ring (subtracting stroke on both sides) */
export const RING_INNER_WIDTH = RING_SIZE - RING_STROKE_WIDTH * 2; // 54px
```

Export it and import it in `AnimatedPercentage.tsx`.

That's it — no changes to `ProgressRing.tsx`, no changes to sizing of the ring itself, no changes to the smaller `HabitStrengthHistory/StrengthComparisonCards/ProgressRing.tsx` (it uses `text-sm` in a 56px ring and doesn't have the overflow).

### What this changes for users

- 0–99%: visually identical (text-2xl bold, 24px). No measurable change since the strings ("0%" … "99%") already fit comfortably in 54px at 24px bold.
- 100%: RN auto-shrinks down to ~18–20px so "100%" fits cleanly inside the ring with margin to the stroke. Reads as "this user maxed it out" without clipping.

## Verification

1. **Visual check at 100%**: Open a habit whose strength is 100% on the Habit Detail screen. The "100%" must sit fully inside the ring with daylight between the digits and the orange stroke. Take a screenshot and compare to the attached `simulator_screenshot_81317B26-1F1D-4EDB-9706-5DED0AC80CCA.png` — the new version should not have any text crossing the ring.
2. **Regression check at 1–99%**: Open habits with strength values around e.g. 8%, 47%, 99%. The percentage text should render at the same size as before (text-2xl bold). No visual difference.
3. **Animation check**: Trigger the count-up animation (initial render). The text should not visibly resize mid-animation for values that end below 100%. For values ending at 100%, a single subtle resize is acceptable as the value crosses into 3 digits.
4. **Both platforms**: Spot-check on iOS simulator (primary, per the screenshot) and Android emulator if available — `adjustsFontSizeToFit` behavior differs slightly across platforms but both should keep "100%" within bounds.
5. **Lint/types**: `npm run lint` and `npx tsc --noEmit` should pass with no new warnings.

## Files referenced

- `src/components/HabitStrengthSection/StrengthHero/AnimatedPercentage.tsx` — the Text being clipped (line 35)
- `src/components/HabitStrengthSection/StrengthHero/ProgressRing.tsx` — wraps the Text in a centered View (lines 84–90); no changes needed
- `src/components/HabitStrengthSection/constants.ts` — `RING_SIZE = 64`, `RING_STROKE_WIDTH = 5` (lines 16–17); add `RING_INNER_WIDTH`

## Out of scope

- Resizing the ring itself (the constants comment notes it was deliberately reduced from 72 to 64 to fit above the fold — don't undo that).
- Changing typography globally.
- Touching the smaller ring in `HabitStrengthHistory` — it's already proportioned safely.
