# V2: "More to Customize" — Preview Chips + EDIT Pill

## Context

The current centered uppercase pill ("MORE TO CUSTOMIZE · 3 ⌄") looks too much like the non-interactive section labels above it (CHOOSE AN ICON, PICK A COLOR). Users skim past it as a passive header rather than tapping. We need a container that reads as an interactive tile — without going back to the heavy bordered card we just moved away from.

V2 surfaces what's actually inside the section as preview chips (♥ Forgiving · 🌱 Classic · 🎯 30-day) and adds an EDIT pill (the same green pill pattern already used on the inner option rows). Two wins: (1) the chips + pill make the tile obviously interactive, and (2) users learn what the section contains before they decide to tap in.

Chips stay visible even when expanded — they act as a sticky header summary.

---

## Visual Spec

```
┌──────────────────────────────────────────────────┐
│  MORE TO CUSTOMIZE                       EDIT ›  │
│                                                  │
│  [♥ Forgiving]  [🌱 Classic]  [🎯 30-day]        │
└──────────────────────────────────────────────────┘
```

When tapped, expands beneath to reveal the existing helper caption, Growth Type pill, and three `AdvancedOptionRow` cards (no other changes to the expanded content).

## Implementation

**File:** `src/components/AdvancedOptions/AdvancedOptionsSection.tsx`

### Replace the current pill header (lines 112-145)

Current:
```tsx
<View className='items-center py-1'>
  <Pressable className='flex-row items-center gap-2 self-center rounded-full px-4 py-2' ...>
    <Text className='uppercase' ...>More to customize · 3</Text>
    <Animated.View style={chevronStyle}><ChevronDown ... /></Animated.View>
  </Pressable>
</View>
```

Replace with a full-width tile:
```tsx
<Pressable
  accessibilityLabel='More to customize, 3 options'
  accessibilityRole='button'
  accessibilityState={{ expanded }}
  className='rounded-2xl px-4 py-3.5'
  style={({ pressed }) => ({
    backgroundColor: pressed ? colors.primary[100] : colors.card,
    borderWidth: 1,
    borderColor: pressed ? colors.primary[300] : colors.border,
    opacity: pressed ? 0.92 : 1,
  })}
  onPress={toggle}
>
  {/* Top row: label + EDIT pill */}
  <View className='flex-row items-center justify-between'>
    <Text
      className='uppercase'
      style={{
        ...typography.caption,
        fontSize: 12,
        fontWeight: fontWeights.semibold,
        letterSpacing: 0.5,
        color: colors.text.secondary,
      }}
    >
      More to customize
    </Text>
    <View className='flex-row items-center gap-1'>
      <Text style={{
        ...typography.caption,
        fontSize: 11,
        fontWeight: fontWeights.bold,
        letterSpacing: 0.5,
        color: colors.primary[700],
        backgroundColor: colors.primary[100],
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        EDIT
      </Text>
      <Animated.View style={chevronStyle}>
        <ChevronDown color={colors.text.tertiary} size={iconSizes.small} strokeWidth={2} />
      </Animated.View>
    </View>
  </View>

  {/* Chip row */}
  <View className='mt-2.5 flex-row flex-wrap gap-1.5'>
    <PreviewChip icon={<AlgoIcon color={colors.primary[600]} size={12} strokeWidth={2.5} />} label={algoEntry.name} />
    <PreviewChip icon={<Text style={{ fontSize: 12 }}>{resolvedEmojis.starting}</Text>} label={presetLabel} />
    <PreviewChip
      icon={<Target color={colors.status.streakText} size={12} strokeWidth={2.5} />}
      label={streakGoal > 0 ? `${streakGoal}-day` : 'No target'}
    />
  </View>
</Pressable>
```

### Add a small `PreviewChip` helper at the bottom of the file

```tsx
function PreviewChip({ icon, label }: { icon: ReactNode; label: string }) {
  const { colors } = useThemeColors();
  return (
    <View
      className='flex-row items-center gap-1 rounded-full px-2.5 py-1'
      style={{
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.cardBorder,
      }}
    >
      {icon}
      <Text style={{
        ...typography.caption,
        fontSize: 11,
        fontWeight: fontWeights.semibold,
        color: colors.text.secondary,
      }}>
        {label}
      </Text>
    </View>
  );
}
```

Import `ReactNode` from `'react'`.

### Outer wrapper

Keep the existing flat outer:
```tsx
<Animated.View className='mt-4 px-6' entering={...} layout={...}>
```

No card background, no border on this outer — the inner Pressable tile carries the visual weight.

### Expanded content — unchanged

Keep lines ~146-220 as-is (helper caption, Growth Type pill, three `AdvancedOptionRow` cards). When expanded, the chip preview at the top stays visible and acts as a summary.

## Files modified

- `src/components/AdvancedOptions/AdvancedOptionsSection.tsx` (only file)

No theme/token changes, no API surface changes, no impact on `AdvancedOptionRow`, `AdvancedOptionEditAffordance`, or `AdvancedSheet`.

## Verification

1. `npm run lint` (or `tsc -p tsconfig.app.json --noEmit`) — must be clean
2. Open Add or Edit habit modal in the simulator
3. Confirm the new tile reads as interactive — chips + EDIT pill should be unmistakable
4. Tap the tile → chevron rotates, helper caption + Growth pill + 3 option rows expand below
5. Chips at the top stay visible while expanded
6. Tap inner option rows → corresponding sheets open
7. Dark mode: chips use `colors.background` (warm parchment in light, gray-900 in dark) against tile `colors.card`
8. VoiceOver: tile announces "More to customize, 3 options, button, collapsed/expanded"
