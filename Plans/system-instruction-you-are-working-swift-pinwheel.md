# Fix: "100%" text gets cut off inside Habit Strength ring

## Context

On the Habit Detail screen, the "Habit Strength" card shows a circular progress ring (64px) with the current strength percentage rendered in the center. When the value reaches 100%, the rendered text "100%" is wider than the ring's interior and visually clips against the ring stroke (see `.context/attachments/image.png`).

The ring container is 64px wide with a 5px stroke on each side, leaving ~54px of clear interior. The percentage text uses `text-2xl` (~24px bold), which renders "100%" at ~52–58px — right at the edge, with no overflow guard. Smaller values (e.g. "0%", "42%") fit fine, but anything 3-digit + `%` clips.

The fix should be surgical — only adjust the text rendering so it always fits cleanly inside the ring, regardless of value.

## Approach

Minimal change to `AnimatedPercentage.tsx` — the only component responsible for the percentage label inside the ring.

Two small additions to the existing `<Text>` element:

1. Drop the font size one step from `text-2xl` (24px) to `text-xl` (20px). This alone gives "100%" enough horizontal room inside the 54px interior with comfortable padding.
2. Add `numberOfLines={1}` and `adjustsFontSizeToFit` as a defensive guard for accessibility font-scaling (so dynamic text sizes don't reintroduce the clip).

No changes to ring sizing, layout, or surrounding components — the ring is intentionally 64px to fit above the fold (per the comment in `constants.ts:16`), so we adjust the text, not the ring.

## File to modify

**`src/components/HabitStrengthSection/StrengthHero/AnimatedPercentage.tsx`** (line 35)

Current:
```tsx
<Text className='text-2xl font-bold' style={{ color: themeColors.text.primary }}>{displayValue}%</Text>
```

After:
```tsx
<Text
  adjustsFontSizeToFit
  numberOfLines={1}
  className='text-xl font-bold'
  style={{ color: themeColors.text.primary }}
>
  {displayValue}%
</Text>
```

That's the entire diff — one file, one element.

## Files NOT changed

- `ProgressRing.tsx` — ring sizing/layout is fine; the center container (`absolute inset-0 items-center justify-center`) already centers content correctly.
- `constants.ts` — `RING_SIZE = 64` was deliberately chosen to keep the section above the fold; do not change.
- `StrengthHero.tsx`, `HabitStrengthSection.tsx`, `HabitDetailContent.tsx` — unaffected.

## Verification

1. Run the app (`npm start` / Expo) and open a habit with 100% strength → "100%" should sit cleanly centered inside the orange ring with visible padding on left/right, no clipping.
2. Check intermediate values (e.g. 0%, 8%, 42%, 99%) → all should remain centered and visually balanced; the smaller font should still feel proportionate to the 64px ring.
3. Toggle iOS/Android Dynamic Type / large text accessibility setting → text should auto-shrink rather than clip, thanks to `adjustsFontSizeToFit`.
4. `npx tsc --noEmit` to confirm no type regressions.
