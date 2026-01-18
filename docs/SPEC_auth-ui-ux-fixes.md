# Auth UI/UX Fixes Specification

## Overview

This specification addresses 12 UX issues identified in the Daily Habits app authentication screens (Welcome, Sign In, Sign Up, Verification). These fixes build on the previous login redesign and focus on consistency, polish, and accessibility.

**Related Mockup:** `.superdesign/design_iterations/social_auth_mockup_1.html`
**Previous Spec:** `docs/SPEC_login-redesign.md`

---

## UX Issues Summary

| Priority    | ID     | Issue                               | Screen(s)                    | Status    |
| ----------- | ------ | ----------------------------------- | ---------------------------- | --------- |
| 🔴 Critical | UX-001 | Google icon is emoji placeholder    | All auth                     | `done`    |
| 🔴 Critical | UX-002 | Inconsistent button border radius   | All auth                     | `pending` |
| 🔴 Critical | UX-003 | Form label casing inconsistent      | SignIn, SignUp, Verification | `pending` |
| 🟡 Medium   | UX-004 | Back button lacks proper styling    | SignIn, SignUp               | `pending` |
| 🟡 Medium   | UX-005 | Missing "Forgot Password?" link     | SignIn                       | `pending` |
| 🟡 Medium   | UX-006 | No emerald focus ring on inputs     | SignIn, SignUp               | `pending` |
| 🟡 Medium   | UX-007 | Primary button lacks press feedback | All auth                     | `pending` |
| 🟡 Medium   | UX-008 | Form inputs need depth styling      | SignIn, SignUp               | `pending` |
| 🟢 Polish   | UX-009 | Social button press animation       | Welcome, SignIn, SignUp      | `pending` |
| 🟢 Polish   | UX-010 | Divider spacing too large           | Welcome, SignIn, SignUp      | `pending` |
| 🟢 Polish   | UX-011 | Verification screen color mismatch  | Verification                 | `pending` |
| 🟢 Polish   | UX-012 | Missing password visibility toggle  | SignIn, SignUp               | `pending` |

---

## Detailed Issue Specifications

### UX-001: Google Icon is Emoji Placeholder

**Problem:** The Google sign-in button displays a blue circle emoji (`🔵`) instead of the official Google "G" logo.

**Current Implementation:**

```tsx
// SocialSignInButton.tsx - line ~45
<Text className='text-lg'>{icon}</Text> // icon = "🔵" for Google
```

**Proposed Solution:**
Replace emoji with proper SVG icons for both Apple and Google.

```tsx
// Google "G" SVG
<Svg width={20} height={20} viewBox="0 0 24 24">
  <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
  <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
  <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
  <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
</Svg>

// Apple logo SVG
<Svg width={20} height={20} viewBox="0 0 24 24" fill="white">
  <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
</Svg>
```

**Files to Modify:**

- `src/screens/auth/components/SocialSignInButton/SocialSignInButton.tsx`

**Acceptance Criteria:**

- [x] Google button displays official 4-color "G" logo
- [x] Apple button displays official Apple logo (white on black)
- [x] Icons are 20x20px, centered in button
- [x] No layout shift when icons render

**Implementation Notes (UX-001):**

- Used existing `GoogleLogo` and `AppleLogo` SVG components from `@/components/auth/logos/`
- Added `testID` attributes for reliable testing: `google-logo`, `apple-logo`, `social-button-spinner`
- Updated tests to use `getByTestId` instead of checking for emoji text

---

### UX-002: Inconsistent Button Border Radius

**Problem:** Social buttons use `rounded-3xl` (24px) while email/submit buttons use `rounded-xl` (12px).

**Current Implementation:**

```tsx
// SocialSignInButton - rounded-3xl (24px)
className = 'rounded-3xl py-4';

// SubmitButton - rounded-xl (12px)
className = 'rounded-xl py-4';
```

**Proposed Solution:**
Standardize all auth buttons to `rounded-2xl` (16px) for a balanced, modern look.

**Design Rationale:**

- `rounded-3xl` (24px) feels too "pill-like" for a professional app
- `rounded-xl` (12px) feels too sharp next to social buttons
- `rounded-2xl` (16px) provides visual harmony

**Files to Modify:**

- `src/screens/auth/components/SocialSignInButton/SocialSignInButton.tsx`
- `src/screens/auth/components/SubmitButton/SubmitButton.tsx`

**Acceptance Criteria:**

- [ ] All auth buttons use `rounded-2xl` (16px border radius)
- [ ] Visual consistency across Welcome, SignIn, SignUp screens

---

### UX-003: Form Label Casing Inconsistent

**Problem:** Some labels are `UPPERCASE` while others use `Sentence case`.

**Current Implementation:**

```tsx
// VerificationView.tsx
<Text className="...">VERIFICATION CODE</Text>

// FormInput.tsx
<Text className="...">Email</Text>  // Already sentence case
```

**Proposed Solution:**
Standardize all form labels to sentence case for improved readability.

**Design Rationale:**

- Sentence case is 20% faster to read than ALL CAPS (UX research)
- Matches iOS/Android platform conventions
- Less aggressive visual tone

**Files to Modify:**

- `src/screens/auth/components/VerificationView/VerificationView.tsx`

**Acceptance Criteria:**

- [ ] All form labels use sentence case ("Verification code" not "VERIFICATION CODE")
- [ ] Consistent `text-stone-500 font-medium text-sm` styling

---

### UX-004: Back Button Lacks Proper Styling

**Problem:** Back button is a plain text link without adequate touch target or visual weight.

**Current Implementation:**

```tsx
// SignInScreen.tsx
<TouchableOpacity onPress={handleBack}>
  <Text className='font-semibold text-stone-800'>← Back</Text>
</TouchableOpacity>
```

**Proposed Solution:**
Create a proper `BackButton` component with:

- Chevron icon (not arrow emoji)
- 44x44px minimum touch target (Apple HIG requirement)
- Subtle press feedback

```tsx
// Proposed BackButton component
<TouchableOpacity
  onPress={handleBack}
  className='-ml-2 flex-row items-center p-2'
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
>
  <ChevronLeftIcon size={20} color='#44403c' />
  <Text className='ml-1 font-medium text-stone-700'>Back</Text>
</TouchableOpacity>
```

**Files to Create:**

- `src/screens/auth/components/BackButton/BackButton.tsx`
- `src/screens/auth/components/BackButton/index.ts`

**Files to Modify:**

- `src/screens/auth/SignInScreen.tsx`
- `src/screens/auth/SignUpScreen.tsx`

**Acceptance Criteria:**

- [ ] Back button has 44x44px touch target
- [ ] Uses chevron icon instead of arrow emoji
- [ ] Consistent across SignIn and SignUp screens

---

### UX-005: Missing "Forgot Password?" Link

**Problem:** Users cannot easily reset their password from the SignIn screen.

**Current Implementation:** No forgot password link visible on main sign-in form.

**Proposed Solution:**
Add inline "Forgot?" link next to Password label.

```tsx
<View className='mb-2 flex-row items-center justify-between'>
  <Text className='text-sm font-medium text-stone-500'>Password</Text>
  <TouchableOpacity onPress={openForgotPasswordModal}>
    <Text className='text-sm font-medium text-emerald-600'>Forgot?</Text>
  </TouchableOpacity>
</View>
```

**Files to Modify:**

- `src/screens/auth/SignInScreen.tsx`

**Acceptance Criteria:**

- [ ] "Forgot?" link appears inline with Password label
- [ ] Link opens ForgotPasswordModal
- [ ] Link uses emerald-600 color for visibility

---

### UX-006: No Emerald Focus Ring on Inputs

**Problem:** Form inputs lack visual feedback indicating focus state.

**Current Implementation:**

```tsx
// FormInput.tsx
className = 'border border-stone-200 rounded-xl';
// No focus styling defined
```

**Proposed Solution:**
Add emerald focus ring with subtle shadow.

```tsx
// Using NativeWind focus variant
className="border border-stone-200 rounded-xl bg-stone-50/50
           focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"

// Or using state-based styling
const inputStyle = isFocused
  ? "border-emerald-500 bg-white shadow-sm"
  : "border-stone-200 bg-stone-50/50";
```

**Files to Modify:**

- `src/screens/auth/components/FormInput/FormInput.tsx`
- `src/screens/auth/components/PasswordInput/PasswordInput.tsx`

**Acceptance Criteria:**

- [ ] Inputs show emerald border on focus
- [ ] Subtle shadow appears on focus
- [ ] Background transitions from stone-50 to white on focus

---

### UX-007: Primary Button Lacks Press Feedback

**Problem:** Submit button doesn't provide tactile feedback on press.

**Current Implementation:**

```tsx
// SubmitButton.tsx
<TouchableOpacity activeOpacity={0.8}>// No animation</TouchableOpacity>
```

**Proposed Solution:**
Add subtle scale animation on press using Reanimated.

```tsx
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePressIn = () => {
  scale.value = withSpring(0.97, { damping: 15 });
};

const handlePressOut = () => {
  scale.value = withSpring(1, { damping: 15 });
};
```

**Files to Modify:**

- `src/screens/auth/components/SubmitButton/SubmitButton.tsx`

**Acceptance Criteria:**

- [ ] Button scales to 0.97x on press
- [ ] Spring animation for natural feel
- [ ] Respects reduced motion setting

---

### UX-008: Form Inputs Need Depth Styling

**Problem:** Form inputs appear flat and lack visual hierarchy.

**Current Implementation:**

```tsx
className = 'bg-white border border-stone-200';
```

**Proposed Solution:**
Add subtle background tint for depth.

```tsx
className = 'bg-stone-50/50 border border-stone-200';
// Transitions to bg-white on focus (see UX-006)
```

**Files to Modify:**

- `src/screens/auth/components/FormInput/FormInput.tsx`
- `src/screens/auth/components/PasswordInput/PasswordInput.tsx`

**Acceptance Criteria:**

- [ ] Inputs have subtle stone-50/50 background
- [ ] Creates visual depth without being distracting

---

### UX-009: Social Button Press Animation

**Problem:** Social buttons only reduce opacity on press, lacking tactile feedback.

**Proposed Solution:**
Add scale animation matching UX-007.

**Files to Modify:**

- `src/screens/auth/components/SocialSignInButton/SocialSignInButton.tsx`

**Acceptance Criteria:**

- [ ] Social buttons scale to 0.97x on press
- [ ] Consistent with primary button behavior

---

### UX-010: Divider Spacing Too Large

**Problem:** The "or" divider has excessive vertical margin.

**Current Implementation:**

```tsx
// AuthDivider.tsx
className = 'my-6'; // 24px top + 24px bottom = 48px total
```

**Proposed Solution:**
Reduce to `my-4` (16px each side = 32px total).

**Files to Modify:**

- `src/screens/auth/components/AuthDivider/AuthDivider.tsx`

**Acceptance Criteria:**

- [ ] Divider uses `my-4` spacing
- [ ] Tighter layout without feeling cramped

---

### UX-011: Verification Screen Color Mismatch

**Problem:** Verification screen uses `slate-*` colors instead of `stone-*`.

**Current Implementation:**

```tsx
// VerificationView.tsx
className = 'text-slate-600'; // Should be text-stone-600
className = 'text-slate-400'; // Should be text-stone-400
```

**Proposed Solution:**
Replace all `slate-*` with `stone-*` for consistency.

**Files to Modify:**

- `src/screens/auth/components/VerificationView/VerificationView.tsx`

**Acceptance Criteria:**

- [ ] All text colors use stone palette
- [ ] Visual consistency with other auth screens

---

### UX-012: Missing Password Visibility Toggle

**Problem:** Users cannot see their password while typing, leading to errors.

**Current Implementation:** No visibility toggle exists.

**Proposed Solution:**
Add eye icon toggle to password inputs.

```tsx
<View className="relative">
  <TextInput secureTextEntry={!showPassword} ... />
  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2"
  >
    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
  </TouchableOpacity>
</View>
```

**Files to Modify:**

- `src/screens/auth/components/PasswordInput/PasswordInput.tsx`

**Acceptance Criteria:**

- [ ] Eye icon toggles password visibility
- [ ] Icon changes between eye/eye-off states
- [ ] 44x44px touch target for icon

---

## CodeRabbit Review Checklist

### Code Quality

- [ ] **No hardcoded strings** - All user-facing text should be extractable for i18n
- [ ] **Consistent naming** - Components follow `PascalCase`, hooks follow `useCamelCase`
- [ ] **File size < 100 lines** - Per project decomposition rules
- [ ] **No unused imports** - ESLint should pass with no warnings
- [ ] **TypeScript strict mode** - No `any` types, proper interfaces defined

### Accessibility (a11y)

- [ ] **Touch targets ≥ 44x44px** - All interactive elements meet minimum size
- [ ] **Color contrast ≥ 4.5:1** - Text meets WCAG AA standard
- [ ] **Reduced motion support** - Animations respect `useReducedMotion()`
- [ ] **Screen reader labels** - All buttons have `accessibilityLabel`
- [ ] **Focus order logical** - Tab order follows visual layout

### Security

- [ ] **No sensitive data logged** - Password fields never log input
- [ ] **Secure text entry** - Password inputs use `secureTextEntry={true}`
- [ ] **No PII in analytics** - User email not sent to analytics

### Performance

- [ ] **Memoization where needed** - Callbacks wrapped in `useCallback`
- [ ] **No layout thrashing** - Animations use `transform` not `width/height`
- [ ] **Lazy loading** - Heavy components use `React.lazy()` if applicable

### Testing

- [ ] **Unit tests for new components** - BackButton, updated PasswordInput
- [ ] **Snapshot tests updated** - Existing snapshots regenerated
- [ ] **Manual testing checklist** - iOS Simulator + Android Emulator

### Platform Specific

- [ ] **iOS safe areas** - Content respects notch/home indicator
- [ ] **Android keyboard** - Inputs scroll into view when keyboard opens
- [ ] **Keyboard dismiss** - Tapping outside inputs dismisses keyboard

---

## Implementation Tasks

### Phase 1: Critical Fixes (P0)

| Task ID  | Issue  | Description                                        | Files                                        | Status    |
| -------- | ------ | -------------------------------------------------- | -------------------------------------------- | --------- |
| AUTH-001 | UX-001 | Replace emoji icons with SVG in SocialSignInButton | `SocialSignInButton.tsx`                     | `done`    |
| AUTH-002 | UX-002 | Standardize button border radius to `rounded-2xl`  | `SocialSignInButton.tsx`, `SubmitButton.tsx` | `pending` |
| AUTH-003 | UX-003 | Convert label casing to sentence case              | `VerificationView.tsx`                       | `pending` |

### Phase 2: Medium Priority (P1)

| Task ID  | Issue  | Description                                          | Files                                                              | Status    |
| -------- | ------ | ---------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| AUTH-004 | UX-004 | Create BackButton component with proper touch target | New: `BackButton/`, Modify: `SignInScreen.tsx`, `SignUpScreen.tsx` | `pending` |
| AUTH-005 | UX-005 | Add "Forgot?" link inline with Password label        | `SignInScreen.tsx`                                                 | `pending` |
| AUTH-006 | UX-006 | Add emerald focus ring to form inputs                | `FormInput.tsx`, `PasswordInput.tsx`                               | `pending` |
| AUTH-007 | UX-007 | Add press scale animation to SubmitButton            | `SubmitButton.tsx`                                                 | `pending` |
| AUTH-008 | UX-008 | Add depth styling to form inputs                     | `FormInput.tsx`, `PasswordInput.tsx`                               | `pending` |

### Phase 3: Polish (P2)

| Task ID  | Issue  | Description                                 | Files                    | Status    |
| -------- | ------ | ------------------------------------------- | ------------------------ | --------- |
| AUTH-009 | UX-009 | Add press scale animation to social buttons | `SocialSignInButton.tsx` | `pending` |
| AUTH-010 | UX-010 | Reduce divider spacing to `my-4`            | `AuthDivider.tsx`        | `pending` |
| AUTH-011 | UX-011 | Fix slate → stone color mismatch            | `VerificationView.tsx`   | `pending` |
| AUTH-012 | UX-012 | Add password visibility toggle              | `PasswordInput.tsx`      | `pending` |

---

## Files Summary

### New Files to Create

```
src/screens/auth/components/BackButton/
├── BackButton.tsx
└── index.ts
```

### Files to Modify

```
src/screens/auth/components/SocialSignInButton/SocialSignInButton.tsx  # AUTH-001, AUTH-002, AUTH-009
src/screens/auth/components/SubmitButton/SubmitButton.tsx              # AUTH-002, AUTH-007
src/screens/auth/components/VerificationView/VerificationView.tsx      # AUTH-003, AUTH-011
src/screens/auth/components/FormInput/FormInput.tsx                    # AUTH-006, AUTH-008
src/screens/auth/components/PasswordInput/PasswordInput.tsx            # AUTH-006, AUTH-008, AUTH-012
src/screens/auth/components/AuthDivider/AuthDivider.tsx                # AUTH-010
src/screens/auth/SignInScreen.tsx                                      # AUTH-004, AUTH-005
src/screens/auth/SignUpScreen.tsx                                      # AUTH-004
```

---

## Success Metrics

| Metric                    | Current  | Target | Measurement         |
| ------------------------- | -------- | ------ | ------------------- |
| Visual consistency score  | ~70%     | 100%   | Design audit        |
| Touch target compliance   | ~80%     | 100%   | Automated a11y scan |
| Color contrast compliance | ~90%     | 100%   | WCAG audit          |
| User reported auth issues | Baseline | -50%   | Support tickets     |

---

## Rollback Plan

All changes are isolated to auth components. If issues arise:

1. **Git revert** - Each task should be a separate commit
2. **Feature flag** - Consider wrapping major changes in flags
3. **Staged rollout** - TestFlight/internal testing before production

---

_Specification Version: 1.0_
_Created: January 2026_
_Author: Sally | UX Expert (BMAD)_
_Related: SPEC_login-redesign.md, social_auth_mockup_1.html_
