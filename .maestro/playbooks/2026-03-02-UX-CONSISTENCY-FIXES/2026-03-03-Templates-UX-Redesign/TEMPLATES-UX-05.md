# Phase 05: Full-Width Stacked Pack Cards

**Spec**: `specs/003-templates-ux-redesign/spec.md`
**Design Reference**: `.superdesign/design_iterations/templates_ux_redesign_1.html` (see `.pack-card` section)
**Requirements**: FR-008

## Context

The current `PremiumPacksSection` renders pack cards in a horizontal `FlatList` carousel. Each `PremiumPackCard` is 200px wide with a vertical layout (emojis on top, name, description, CTA at bottom). The redesign changes this to full-width vertically stacked cards with a horizontal layout (content on the left, "Import Pack" CTA button on the right).

The `PremiumPack` data structure: `{ id, name, description, backgroundGradient: [string, string], emojiGroup: string[], habits: PremiumPackHabit[] }`. The gradient colors remain the same. The habit count is `pack.habits.length`.

## Tasks

- [x] Redesign `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPackCard.tsx`. Change from a 200px-wide vertical card to a full-width horizontal card. The outer `Pressable` should have no fixed width (it fills parent width). Inside, wrap with `LinearGradient` using `colors={pack.backgroundGradient}` and `start/end` for 135-degree angle. Style the gradient container: `borderRadius: 16, padding: 16 24 (vertical horizontal), flexDirection: 'row', alignItems: 'center', gap: 16, marginHorizontal: 16, marginBottom: 12`. The left side (`flex: 1`): emoji group row (22px emojis with 6px gap), pack name (16px, white, fontWeight 700, marginTop 8), description (13px, `rgba(255,255,255,0.75)`, marginTop 3), habit count in JetBrains Mono (11px, `rgba(255,255,255,0.5)`, marginTop 4, show `${pack.habits.length} habits`). The right side: "Import Pack" button (`paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)'`, white text 13px fontWeight 700).
  - ✅ Implemented: Removed fixed 200px width, added 135° LinearGradient via `start={{x:0,y:0}} end={{x:1,y:1}}`, horizontal layout with flex:1 content area, "Import Pack" CTA, JetBrains Mono habit count, removed `index` prop, testID derived from `pack.id`.

- [x] Redesign `src/screens/TemplatesScreen/components/PremiumPacksSection/PremiumPacksSection.tsx`. Replace the horizontal `FlatList` with a simple `View` that maps over `packs` and renders `PremiumPackCard` for each. Since there are only 3 packs, a FlatList is unnecessary — a `.map()` inside a `View` is simpler and eliminates horizontal scroll. Remove the `contentContainerStyle` with `gap` and `paddingHorizontal` since each card now handles its own margins. The section container should have `marginTop: spacing.lg` (keep existing).
  - ✅ Replaced FlatList with View + .map(), removed FlatList import, each card handles its own marginHorizontal:16 and marginBottom:12.

- [x] Remove the `index` prop from `PremiumPackCard` if it's no longer needed (it was used for `testID`). If keeping the testID, derive it from `pack.id` instead: `testID={`templates-pack-${pack.id}`}`.
  - ✅ Done in task 1 — `index` prop removed, testID now uses `pack.id`.

- [x] Remove the `Package` import from lucide-react-native in `PremiumPackCard.tsx` if not already done in Phase 01. Remove any unused styles.
  - ✅ No `Package` import existed (already removed in prior phase). All unused styles from the old vertical layout (`topRow`, `card` with fixed width) are gone.

- [x] Ensure all files comply with the 100-line limit. Run `npx tsc --noEmit` to verify TypeScript.
  - ✅ PremiumPackCard.tsx: 76 lines, PremiumPacksSection.tsx: 40 lines. Zero TypeScript errors in both files.
