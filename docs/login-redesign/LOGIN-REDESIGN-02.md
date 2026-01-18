# Login Redesign - Phase 2: Button & Layout Changes

## Context
Continuing the login UI/UX redesign. This phase focuses on simplifying the button hierarchy and adding compliance elements.

**Spec:** `docs/SPEC_login-redesign.md`
**Depends on:** Phase 1 complete

---

## Tasks

- [x] **2.1 Consolidate email buttons** - In `src/screens/auth/WelcomeScreen.tsx`, replace the two buttons (GET STARTED + SIGN IN) with a single "Continue with Email" button that navigates to SignUpScreen. Use `bg-stone-800` styling matching current GET STARTED button.
  - *Completed: Replaced two buttons with single "Continue with Email" button using `bg-stone-800 rounded-2xl` styling*

- [x] **2.2 Add sign-in text link** - Below the "Continue with Email" button, add a text element: "Already have an account? **Sign in**" where "Sign in" is a touchable text link (emerald-600 color) that navigates to SignInScreen. Style: `text-sm text-stone-500` for regular text, `text-emerald-600 font-semibold` for the link.
  - *Completed: Added "Already have an account? Sign in" text with emerald-600 colored link*

- [x] **2.3 Update AuthDivider to lowercase** - In `src/screens/auth/components/AuthDivider/AuthDivider.tsx`, change "OR" to "or" (lowercase). This creates a softer, friendlier tone.
  - *Completed: Changed "OR" to "or" for a friendlier tone*

- [x] **2.4 Create LegalFooter component** - Create `src/screens/auth/components/LegalFooter/LegalFooter.tsx` with "Terms · Privacy" text links. Style: `text-xs text-stone-400`. Links should open URLs (placeholder for now: `https://dailyhabits.app/terms` and `https://dailyhabits.app/privacy`). Export from index.ts and add to barrel export.
  - *Completed: Created LegalFooter component with Terms and Privacy links using Linking.openURL*

- [x] **2.5 Add LegalFooter to WelcomeScreen** - Import and render `LegalFooter` at the bottom of WelcomeScreen, below all buttons with appropriate spacing (`mt-4`).
  - *Completed: Added LegalFooter to WelcomeScreen with mt-4 spacing*

- [x] **2.6 Update button border radius** - Change social sign-in buttons and primary buttons from `rounded-3xl` to `rounded-2xl` (16px) for a slightly more modern look. Update in `SocialSignInButton.tsx` and WelcomeScreen button styles.
  - *Completed: Updated SocialSignInButton and Continue with Email button from rounded-3xl to rounded-2xl*
