# Unify Opening Animations & Bottom Bar to Settings Pattern

## Context

Opening/closing animations are inconsistent across the app. Settings uses native `<Modal animationType='slide'>` (full slide from bottom), while CustomModal fullScreen variant used a subtle 80px slide + scale + opacity fade. Internal content animations also varied (missing springs, different durations). This change unifies everything.

## Changes Made (9 files)

### Modal System — Full slide from bottom
1. **useModalStyles.ts** — fullScreenStyle now slides from SCREEN_HEIGHT→0 (was 80→0 with scale+opacity)
2. **runEnterAnimation.ts** — fullScreen backdrop fade reduced from 400ms→200ms

### Content Entrance Animations — Unified spring pattern
3. **BottomActionBar.styles.ts** — 320ms→280ms (durations.enter)
4. **ScreenHeader.tsx** — added missing .duration(280)
5. **MainBrowseView.tsx** — added .springify().damping(18) to stagger
6. **SeeAllView.tsx** — same springify fix
7. **CategoryDrillView.tsx** — same springify fix
8. **ArchivedHabitsModal ModalHeader.tsx** — added FadeInDown entrance (was none)
9. **ArchivedHabitsModal StatsSummaryBar.tsx** — added staggered FadeInDown (was none)
