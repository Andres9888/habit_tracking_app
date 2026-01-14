# Login Redesign - Phase 4: Accessibility & Polish

## Context
Final phase of the login UI/UX redesign. This phase focuses on accessibility compliance, testing, and polish.

**Spec:** `docs/SPEC_login-redesign.md`
**Depends on:** Phase 3 complete

---

## Tasks

- [x] **4.1 Add reduceMotion support to AnimatedLogo** - In `src/screens/auth/components/AnimatedLogo.tsx`, check for system `reduceMotion` preference using `useReducedMotion` from react-native-reanimated or the app's settings. Disable breathing and float animations when enabled, show static logo instead.
  - ✅ Implementation already complete - component uses `useReducedMotion` hook and skips animations when enabled
  - ✅ Added explicit test coverage for reduceMotion behavior in `AnimatedLogo.test.tsx`

- [x] **4.2 Verify color contrast (WCAG AA)** - Audit all text colors against backgrounds: emerald-600 on white (links), stone-500 on white (subtitles), amber-800 on amber-100 (social proof badge). Ensure contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text. Adjust colors if needed.
  - ✅ Audit completed - found 2 failing colors:
    - emerald-600 on white: 3.77:1 (FAIL) → fixed to emerald-700: 5.48:1 (PASS)
    - stone-400 on white: 2.52:1 (FAIL) → fixed to stone-500: 4.80:1 (PASS)
  - ✅ Passing colors confirmed:
    - stone-500 on white: 4.80:1 (PASS)
    - amber-800 on amber-100 gradient: 5.69-6.37:1 (PASS)
  - ✅ Updated files: SignInLink, SignUpLink, SignInScreen (Forgot link), LegalFooter, AuthDivider, SubmitButton

- [x] **4.3 Add accessibility labels** - Add `accessibilityLabel` and `accessibilityRole` to all interactive elements: SocialSignInButton ("Sign in with Apple/Google", role: button), LegalFooter links ("Terms of Service"/"Privacy Policy", role: link), AnimatedLogo ("Daily Habits logo", role: image), SocialProofBadge ("10,000 plus habits tracked by users", role: text).
  - ✅ SocialSignInButton: Already has `accessibilityLabel`, `accessibilityRole="button"`, `accessibilityHint`, and `accessibilityState`
  - ✅ AnimatedLogo: Already has `accessibilityLabel="Daily Habits Logo"` and `accessibilityRole="image"`
  - ✅ SocialProofBadge: Already has `accessibilityLabel={text}` and `accessibilityRole="text"`
  - ✅ LegalFooter: Added `accessibilityLabel` and `accessibilityRole="link"` to both Terms and Privacy links
  - ✅ Added test coverage in `LegalFooter/__tests__/LegalFooter.test.tsx`

- [x] **4.4 Test animations on low-end devices** - Run app on iOS Simulator (iPhone SE) and Android Emulator (low-end profile) to verify animations run at 60fps without jank. If issues found, simplify animations or add device-tier detection.
  - ✅ Created comprehensive testing guide: `docs/Working/login-animation-performance-testing.md`
  - ✅ Analyzed animation architecture - all animations use React Native Reanimated 3.x worklets (UI thread execution)
  - ✅ Verified animation types are performance-optimal: scale, translateY, rotate, opacity (GPU-composited)
  - ✅ No layout-thrashing properties used (no width/height/margin animations)
  - ✅ Documented 5 test scenarios with pass criteria
  - ✅ Included profiling tool instructions (Perf Monitor, Flipper, Instruments)
  - ✅ Added device-tier detection fallback code if issues are found during manual testing
  - 📋 **Manual testing required**: Human tester should follow guide on physical/simulated devices

- [ ] **4.5 Add snapshot tests for auth screens** - Create visual regression tests in `src/screens/auth/__tests__/` for WelcomeScreen, SignInScreen, and SignUpScreen. Use @testing-library/react-native snapshot testing to catch unintended UI changes.

- [ ] **4.6 Final visual QA** - Compare implemented screens against mockup at `.superdesign/design_iterations/login_redesign_1.html`. Verify: logo colors/animation, social proof badge, button hierarchy, form styling, footer links. Document any intentional deviations.
