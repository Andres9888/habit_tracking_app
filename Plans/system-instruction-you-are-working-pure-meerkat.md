# Plan: Habit Detail Stats Row — Drop the Dots

## Context

On the Habit Detail screen the hero header shows three stats inline:

`🔥 132 streak  ·  ⭐ 132 best  ·  ✓ 132 total`

Andres saw on iPhone 16 Pro Max that "total" already truncates to "tota" at 132 days. With longer streaks (1,000+ days the row breaks worse — Pro Max is the *widest* iPhone, so smaller phones are worse.

## Decision (Andres, this turn)

Take the **minimal** approach first and see if it fixes it:

1. **Drop the two `·` dot separators** between the three stats.
2. **Keep** the word labels (`streak`, `best`, `total`).
3. **Keep** numbers as raw integers — **no commas**, no abbreviation.

Same row spacing otherwise. The fix is "remove two `<View />` elements + their surrounding gaps."

## Why This Should Work

Each removed dot frees up: 3pt (dot) + 10pt × 2 (the two `gap: 10` flexbox gaps that flanked it) = **23pt per dot, ~46pt total** for the inline row. Looking at the v2 mockup screenshot, that's enough to:

- Recover "total" fully at **1,234 days on Pro Max** (the realistic worst case — 3.4 years daily)
- Recover "total" at 1,234 days on a 320pt phone (iPhone SE / mini) too
- Survive 5-digit values (12,345 = 33 years) on Pro Max with tight room
- Still overflow at 5-digit values on 320pt phones — defer that to a follow-up

Reference mockup: `.superdesign/design_iterations/long_day_overflow_2.html` (open at `http://localhost:8765/long_day_overflow_2.html` while the local server is running).

## Files to Modify

Only one file:

- `src/screens/HabitDetailScreen/components/DetailHero.tsx` — lines 75–81

### Current code (lines 75–81)

```tsx
<View className='mt-1 flex-row items-center' style={{ gap: 10 }}>
  <DetailHeroStat emoji='🔥' label='streak' value={habit.currentStreak ?? 0} {...statProps} />
  <View style={dotStyle} />
  <DetailHeroStat emoji='⭐' label='best' value={habit.bestStreak ?? 0} {...statProps} />
  <View style={dotStyle} />
  <DetailHeroStat emoji='✓' label='total' value={totalCompletions} {...statProps} />
</View>
```

### Change to

```tsx
<View className='mt-1 flex-row items-center' style={{ gap: 12 }}>
  <DetailHeroStat emoji='🔥' label='streak' value={habit.currentStreak ?? 0} {...statProps} />
  <DetailHeroStat emoji='⭐' label='best' value={habit.bestStreak ?? 0} {...statProps} />
  <DetailHeroStat emoji='✓' label='total' value={totalCompletions} {...statProps} />
</View>
```

Two changes: remove the two `<View style={dotStyle} />` separators, bump gap from `10` to `12` so the stats don't visually crash into each other now that no dot lives between them.

The `dotStyle` const on line 30 becomes unused — also delete that line to keep the component clean.

### Anti-changes (do NOT touch)

- `DetailHeroStat.tsx` — leave alone. Labels still rendered, numbers still raw.
- No `formatNumber` helper added.
- No commas, no abbreviation logic.
- No layout restructure (icon stays inline, no stat card below name).
- Kept `DetailHeroStat`'s API the same.

## Verification

1. **Visual:** launch the iOS app/sim, open a habit. Test values: open one with `currentStreak ≈ 100+` (truncation regime). On iPhone 16 Pro Max sim, confirm "total" is fully visible. On iPhone SE sim, confirm same at 3-digit values. Screenshot before/after.
2. **Lint/types:** `npm run lint` and `tsc --noEmit` clean. `dotStyle` removal must not leave unused-var warning.
3. **Snapshot tests:** if any exist for `DetailHero`, update intentionally with a one-liner reason in the commit.
4. **Pre-commit hook:** if it fails on max-lines or unicorn rules, fix the specific lint issue — do not `--no-verify`.

## Rollback

Single file, ~5 lines changed. If the fix produces visual regressions (stats too close, missing visual rhythm), revert with `git revert` and reconsider with the v1 mockup options (drop labels, abbreviation, or stat-card redesign).
