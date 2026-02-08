# Phase 9: Migrate Recently Redesigned Screens to Theme Tokens

**Goal:** Replace hardcoded colors introduced during recent UI polish commits in screen-level files.

**Context (Feb 2025):** Recent commits (`fix(ui): audit fixes`, `fix(ui): enforce consistency`, `feat(detail): redesign Habit Detail`, `feat(edit): redesign Edit screen`) improved the visual consistency of screens but introduced new hardcoded hex colors. AnalyticsHeader and StatCard.styles.ts were properly migrated to theme tokens, but SignInScreen.styles.ts, WelcomeScreen.styles.ts, DetailHeader.tsx, EditHeader.tsx, and BrowseHeader.tsx still use raw hex values.

**Pattern to follow:** Import `{ colors }` from `@/theme` and replace hardcoded hex values with theme tokens. Common mappings:

- `#1c1917` → `colors.text.primary` (or `'stone-900'` in Tailwind)
- `#78716c` → `colors.text.secondary` / `colors.gray[500]`
- `#047857` → `colors.primary[700]`
- `#059669` → `colors.primary[600]`
- `#44403c` → `colors.gray[700]` (closest: `colors.gray[700]` is `#374151`, or add stone-700 to theme)
- `#faf9f7` → `colors.light.background`
- `#f5f5f4` → `colors.gray[100]`
- `#ffffff` → `colors.light.card` or `colors.text.inverse`
- `#ecfdf5` → emerald-50, add to theme if not present
- `#57534e` → stone-600, use `colors.gray[600]` (closest)

---

- [ ] **Migrate SignInScreen.styles.ts to theme tokens (CRITICAL — 8 hardcoded colors).** In `src/screens/auth/SignInScreen.styles.ts`, replace all hardcoded hex values with theme imports:
  - `#1c1917` (lines ~6, 68, 78) → `colors.text.primary`
  - `#047857` (lines ~17, 69) → `colors.primary[700]`
  - `#78716c` (lines ~19, 59, 74) → `colors.text.secondary`
  - `#57534e` (lines ~54, 61) → `colors.gray[600]`
  - `#ffffff` (line ~25) → `colors.text.inverse`
  - `#059669` (lines ~38, 44) → `colors.primary[600]`
  - `#faf9f7` (line ~35) → `colors.light.background`
  - Add `import { colors } from '@/theme';` at the top
  - Run `npx eslint src/screens/auth/SignInScreen.styles.ts --fix`

- [ ] **Migrate WelcomeScreen.styles.ts to theme tokens (CRITICAL — 7 hardcoded colors).** In `src/screens/auth/WelcomeScreen.styles.ts`, replace all hardcoded hex values:
  - `#faf9f7` (line ~20) → `colors.light.background`
  - `#f5f5f4` (line ~35) → `colors.gray[100]`
  - `#059669` (line ~44) → `colors.primary[600]`
  - `#1c1917` (lines ~68, 78) → `colors.text.primary`
  - `#78716c` (line ~59) → `colors.text.secondary`
  - `#047857` (line ~69) → `colors.primary[700]`
  - `#ffffff` (line ~54) → `colors.text.inverse`
  - Add `import { colors } from '@/theme';` at the top
  - Run `npx eslint src/screens/auth/WelcomeScreen.styles.ts --fix`

- [ ] **Migrate DetailHeader.tsx to theme tokens (HIGH — 6 hardcoded colors).** In `src/screens/HabitDetailScreen/components/DetailHeader.tsx`:
  - `#1c1917` (lines ~31, 53) → `colors.text.primary`
  - `#44403c` (lines ~38, 60) → `colors.gray[700]` (for icon colors; note: theme gray-700 is `#374151` which is slightly different from stone-700 `#44403c` — use whichever is closest to existing visual, but prefer theme token)
  - `bg-white/80` (lines ~29, 51) — these are translucent overlays and are acceptable as Tailwind classes; leave as-is or replace with `style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}` referencing `colors.light.card` + opacity
  - `#ecfdf5` (line ~96) → add `emerald50: '#ecfdf5'` to `colors.primary` in theme if not present, then reference it; or use a Tailwind class `bg-emerald-50`
  - `#059669` (line ~97) → `colors.primary[600]` (for streak badge shadow)
  - Run `npx eslint src/screens/HabitDetailScreen/components/DetailHeader.tsx --fix`

- [ ] **Migrate EditHeader.tsx to theme tokens (HIGH — 5 hardcoded colors).** In `src/screens/HabitEditScreen/EditHeader.tsx`:
  - `#44403c` (lines ~44, 60) → `colors.gray[700]` (for icon colors)
  - `active:bg-stone-100` (line ~38) — Tailwind class is acceptable, but verify `stone-100` matches `colors.gray[100]`
  - `bg-stone-300` disabled button (line ~50) — replace with theme disabled color or keep as Tailwind if consistent
  - `bg-emerald-600` enabled button (line ~50) → should match `colors.primary[600]`; verify Tailwind class `bg-emerald-600` resolves to `#059669`
  - `text-stone-500` disabled text (line ~62) → verify matches `colors.gray[500]` (`#78716c`; stone-500 is also `#78716c` so this is correct)
  - The Tailwind classes here are generally correct if the Tailwind config maps to theme tokens. The main issue is inline `#44403c` hex values.
  - Run `npx eslint src/screens/HabitEditScreen/EditHeader.tsx --fix`

- [ ] **Migrate BrowseHeader.tsx and remaining screen hardcodes.** Fix remaining screen files:
  - `src/screens/TemplatesScreen/components/BrowseHeader.tsx`: Replace `#1c1917` (line ~24) with `colors.text.primary`, `#78716c` (line ~36) with `colors.text.secondary`
  - `src/screens/HabitEditScreen/HabitEditScreen.tsx`: Replace `bg-[#faf9f7]` with `style={{ backgroundColor: colors.light.background }}`
  - `src/screens/auth/SignUpScreen.tsx`: Replace `bg-[#faf9f7]` with `style={{ backgroundColor: colors.light.background }}`
  - `src/features/habits/HabitsApp.tsx`: Replace hardcoded `#FAF8F5` with `colors.light.background`
  - Run `npx eslint` on each modified file
