# Login Redesign - Phase 1: Core Visual Updates

## Context
Implementing the login UI/UX redesign based on the approved mockup at `.superdesign/design_iterations/login_redesign_1.html`. This phase focuses on core visual identity changes.

**Spec:** `docs/SPEC_login-redesign.md`

---

## Tasks

- [x] **1.1 Update AnimatedLogo component** - Change `src/screens/auth/components/AnimatedLogo.tsx` to use emerald gradient background (`#059669` → `#10b981` → `#34d399`), add float animation alongside breathing animation, replace emoji checkmark with SVG checkmark icon. Use `expo-linear-gradient` for gradient. Respect `reduceMotion` setting.
  - ✅ Implemented emerald gradient using `expo-linear-gradient` with colors `['#059669', '#10b981', '#34d399']`
  - ✅ Added float animation (translateY 0 → -6 → 0) with 2-second duration
  - ✅ Replaced emoji with SVG `Check` icon from `lucide-react-native`
  - ✅ Added `useReducedMotion` hook to respect accessibility preferences
  - ✅ Updated tests to reflect new implementation

- [x] **1.2 Create SocialProofBadge component** - Create `src/screens/auth/components/SocialProofBadge/SocialProofBadge.tsx` with amber gradient background (`#fef3c7` → `#fde68a`), star icon, text "10,000+ habits tracked". Export from `src/screens/auth/components/SocialProofBadge/index.ts` and add to barrel export in `src/screens/auth/components/index.ts`.
  - ✅ Created `SocialProofBadge/SocialProofBadge.tsx` with amber gradient
  - ✅ Used `Star` icon from `lucide-react-native` with amber-600 fill
  - ✅ Created barrel export in `SocialProofBadge/index.ts`
  - ✅ Added to `src/screens/auth/components/index.ts` barrel exports
  - ✅ Added comprehensive tests

- [x] **1.3 Update app name in WelcomeScreen** - Change "Habit Tracker" to "Daily Habits" in `src/screens/auth/WelcomeScreen.tsx` (line 44-46).
  - ✅ Changed app name to "Daily Habits"

- [x] **1.4 Update tagline in WelcomeScreen** - Change "Build better habits, one day at a time" to "Build lasting habits with science-backed techniques" in `src/screens/auth/WelcomeScreen.tsx` (line 47-49).
  - ✅ Updated tagline to "Build lasting habits with science-backed techniques"

- [x] **1.5 Add gradient background to WelcomeScreen** - Add subtle `LinearGradient` background from `stone-50` (#fafaf9) to white (#ffffff) on the Welcome screen container.
  - ✅ Added `LinearGradient` wrapper with `colors={['#fafaf9', '#ffffff']}` (stone-50 to white)
  - ✅ Used vertical gradient direction (top to bottom)

- [x] **1.6 Integrate new components into WelcomeScreen** - Import and use the updated `AnimatedLogo` and new `SocialProofBadge` in `WelcomeScreen.tsx`. Position logo at top, social proof badge below tagline.
  - ✅ Imported `AnimatedLogo` and `SocialProofBadge` from components
  - ✅ Positioned `AnimatedLogo` at top of content area
  - ✅ Positioned `SocialProofBadge` below tagline
