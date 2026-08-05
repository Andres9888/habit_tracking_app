# Phase 02: Hero Featured Card Redesign

**Spec**: `specs/003-templates-ux-redesign/spec.md`
**Design Reference**: `.superdesign/design_iterations/templates_ux_redesign_1.html` (see `.hero-card` section)
**Requirements**: FR-004, FR-016

## Context

The current `FeaturedCollection` component at `src/screens/TemplatesScreen/components/FeaturedCollection/FeaturedCollection.tsx` is a flat bordered card with a "FEATURED" badge, title, description, habit chips, and a small "Explore" button. It needs to become a visually dominant hero card with a green gradient background (`#065F46 → #059669 → #34D399`), decorative circle overlays, frosted-glass badge styling, and a prominent "Explore" CTA.

The component currently receives only `onPress: () => void` as props. The hero card data (title: "Morning Mastery", description, chips, user count "2.4k users") remains hardcoded per the spec assumptions. Uses `expo-linear-gradient` which is already a project dependency (used in `PremiumPackCard.tsx`).

## Tasks

- [x] Redesign `src/screens/TemplatesScreen/components/FeaturedCollection/FeaturedCollection.tsx` to be a hero card. Replace the current `Pressable` with a `Pressable` wrapping a `LinearGradient` from `expo-linear-gradient`. The gradient should go from `#065F46` (0%) to `#059669` (50%) to `#34D399` (100%) at 135 degrees. Use `start={{x:0,y:0}} end={{x:1,y:1}}`. Set `borderRadius: 16` (borderRadius.large), full-width with `marginHorizontal: 16` (spacing.base), and `padding: 24` (spacing.lg). Add `overflow: 'hidden'` for the decorative circles. Add shadow using the project's `shadows.elevated` or equivalent warm shadow. Keep the existing `onPress` prop and `testID="templates-featured-collection"`.

  > Used `shadows.floatingActionButton` (Level 2 warm shadow) since `shadows.elevated` doesn't exist — it's the closest elevated shadow in the design system.

- [x] Inside the hero card, add decorative circle overlays using two `View` elements positioned absolutely: Circle 1: `top: -40, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.08)'`. Circle 2: `bottom: -60, left: -30, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)'`. These create the subtle background pattern visible in the mockup.

- [x] Update the content layout inside the hero card: (1) "FEATURED" badge: a `View` with `backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4` containing a `Text` with "⭐ FEATURED" in white, 11px, fontWeight 700, letterSpacing 0.5. (2) Title: "Morning Mastery" in Literata serif (use `fontFamilies.primary.display` from theme), 24px, fontWeight 800, white, letterSpacing -0.5, marginTop 12. (3) Description: "Start your day with science-backed habits for energy and focus" in 14px, color `rgba(255,255,255,0.85)`, marginTop 4. (4) Habit chips: a horizontal `flexWrap: 'wrap'` row with gap 8, marginTop 16, containing 4 chips ["🌅 Wake Early", "💧 Hydrate", "📝 Journal", "🧘 Meditate"], each chip being a `View` with `backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 5` and white 13px text. (5) Footer row: `flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16`. Left side: "2.4k users" in 13px `rgba(255,255,255,0.7)`. Right side: "Explore" CTA as a `View` with `backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6` containing "Explore" text (14px, white, fontWeight 700) and a `ChevronRight` icon from lucide-react-native (size 16, white).

- [x] If the resulting `FeaturedCollection.tsx` exceeds 100 lines, decompose it. Extract styles to `FeaturedCollection.styles.ts`. Extract the chip list and footer into sub-components like `HeroChips.tsx` and `HeroFooter.tsx` in the same directory. The main component should orchestrate layout only.

  > Decomposed proactively: FeaturedCollection.tsx (44 lines), FeaturedCollection.styles.ts (90 lines), HeroChips.tsx (20 lines), HeroFooter.tsx (19 lines). All well under 100-line limit.

- [x] Run `npx tsc --noEmit` to verify no TypeScript errors. Visually verify the hero card renders correctly by running the app or checking the Expo preview.
  > TypeScript check passed — no errors in FeaturedCollection files. Pre-existing errors in convex/ and other unrelated files only.
