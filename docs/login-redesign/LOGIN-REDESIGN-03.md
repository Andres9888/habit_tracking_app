# Login Redesign - Phase 3: Form Styling Updates

## Context
Continuing the login UI/UX redesign. This phase focuses on updating form inputs and the sign-in/sign-up screens to match the new design system.

**Spec:** `docs/SPEC_login-redesign.md`
**Depends on:** Phase 2 complete

---

## Tasks

- [x] **3.1 Update FormInput styling** - In `src/screens/auth/components/FormInput/FormInput.tsx`, change default background to `bg-stone-50`, add emerald focus ring: `focus:bg-white focus:border-emerald-500` with ring effect. Update border radius to `rounded-xl` (12px).
  - ✅ Added focus state management via useState
  - ✅ Changed background from `bg-white` to `bg-stone-50` when unfocused
  - ✅ Added emerald border (`border-emerald-500`) and white background when focused
  - ✅ Changed border radius from `rounded-3xl` to `rounded-xl`

- [x] **3.2 Change FormInput labels to sentence case** - In `FormInput.tsx`, update the label styling to use sentence case instead of uppercase. Remove `uppercase` and `tracking-widest` classes, use `tracking-wide` instead. Labels should display as "Email" not "EMAIL".
  - ✅ Changed label text style from `text-[10px] font-medium tracking-[3px]` to `text-xs font-medium tracking-wide`
  - ✅ Updated label values in SignInScreen and SignUpScreen from "EMAIL"/"PASSWORD" to "Email"/"Password"
  - ✅ Added `labelRight` prop support for inline elements (used for Forgot link)

- [x] **3.3 Add inline Forgot link to SignInScreen** - In `src/screens/auth/SignInScreen.tsx`, add a "Forgot?" link positioned inline with the Password label (flex row with justify-between). Style: `text-xs font-medium text-emerald-600`. Link should trigger forgot password modal.
  - ✅ Added ForgotPasswordModal import and state management
  - ✅ Used new `labelRight` prop on Password FormInput to add inline "Forgot?" link
  - ✅ Link triggers ForgotPasswordModal when pressed

- [x] **3.4 Update SubmitButton color to emerald** - In `src/screens/auth/components/SubmitButton/SubmitButton.tsx`, change background from `bg-stone-800` to `bg-emerald-600`, hover/pressed state to `bg-emerald-700`. Update text to remain white.
  - ✅ Changed background from `bg-stone-800` to `bg-emerald-600`
  - ✅ Changed border from `border-stone-800` to `border-emerald-600`
  - ✅ Added `active:bg-emerald-700` for pressed state

- [x] **3.5 Update SignInScreen layout** - Apply new styling throughout SignInScreen: update header text to "Welcome back" (sentence case), subtitle to "Sign in to continue your streak", add footer link "Don't have an account? **Sign up**" at bottom.
  - ✅ Changed header from "Welcome Back" to "Welcome back"
  - ✅ Changed subtitle from "Sign in to continue tracking your habits" to "Sign in to continue your streak"
  - ✅ Added footer navigation link "Don't have an account? Sign up" with emerald styling
  - ✅ Added `onNavigateToSignUp` prop for navigation callback

- [x] **3.6 Update SignUpScreen layout** - Apply new styling throughout SignUpScreen: update header to "Create account" (sentence case), subtitle to "Start your habit journey today", add footer link "Already have an account? **Sign in**" at bottom.
  - ✅ Changed header from "Create Account" to "Create account"
  - ✅ Changed subtitle from "Start tracking your habits today" to "Start your habit journey today"
  - ✅ Added footer navigation link "Already have an account? Sign in" with emerald styling
  - ✅ Added `onNavigateToSignIn` prop for navigation callback
  - ✅ Updated WelcomeScreen to pass navigation callbacks to both screens
