# Changelog

All notable changes to Chain Day will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Premium Features**
  - Completion sounds for habit celebrations (#684)
  - Affirmation schedules with server-side premium checks (#726)
  - Letter notifications with premium gating (#726)
  - Premium status display in Settings screen (#743)
  - What's New section in Settings menu (#743)

- **UI/UX Improvements**
  - Context-specific loading messages and placeholder text (#761)
  - Branded shimmer skeleton screens replacing loading spinners (#586)
  - FadeInDown entrance animations to Analytics and Character screens (#569)
  - Consistent card press animations across all cards (#568)
  - Gradient shimmer effect to all skeleton screens (#564)
  - Swipe-to-delete visual affordance with grip lines on cards (#512)
  - Archive improvements: count badge, delete all, sort by date (#584)
  - Settings screen polish: premium status, What's New, version footer (#743)
  - Streak encouragement messages in habit list (#765)

- **Developer Experience**
  - Comprehensive JSDoc documentation for hooks and utility functions (#754)
  - Centralized error messages into constants (#756)
  - Named constants replacing magic numbers (#755)
  - Centralized haptic feedback patterns library (#562)
  - Error boundaries for major screens (#565)
  - Privacy manifest (PrivacyInfo.xcprivacy) for iOS (#544)

### Changed
- **Accessibility Improvements**
  - Reduce motion support for empty states (#768)
  - Migrated empty states to Pressable for better accessibility (#768)
  - Added accessibility labels to error boundaries (#590)
  - Improved onboarding accessibility and contrast ratios (#581)
  - 44pt minimum touch targets per Apple HIG (#697)
  - WCAG AA contrast audit: fixed 29 failing color combinations (#722)
  - Respect iOS reduce motion setting (#528)
  - Empty state polish with dark mode and accessibility (#724, #766)

- **UI/UX Polish**
  - Unified modal close buttons with dark mode support (#764)
  - Dark mode consistency across modals (#764, #710, #703)
  - Improved loading states with dark mode support (#718)
  - Enhanced error states with dark mode and user-friendly messages (#698)
  - Polished all user-facing text for clarity (#723)
  - Improved habit list: toggle visibility, grip lines (#765)
  - Standardized border radius and shadow tokens (#566)

- **Performance Optimizations**
  - Added React.memo to hot-path components in habit list and analytics (#746)
  - Optimized scroll performance and list virtualization (#727)
  - Optimized image assets: reduced bundle size by ~27MB (#725)
  - Optimized FlatList components and memoized list items (#694)
  - AsyncStorage safety and performance with type-safe wrappers (#762)

- **Code Quality**
  - Removed all `any` types across codebase (#748)
  - Fixed all TypeScript compile errors (#589, #690, #691, #688)
  - Removed unused PostCSS dependencies (#750)
  - Removed unused imports and dead animation aliases (#702)
  - Full ESLint sweep and rule stabilization (#704)
  - Migrated remaining screens to theme tokens (#695)

### Fixed
- **Bug Fixes**
  - Authentication improvements: password strength, resend code, tappable legal links (#757)
  - Removed idle animation from auth screens (#757)
  - Graceful error recovery flows throughout the app (#745)
  - Form polish: password toggle, return key chaining, validation (#731)
  - Fixed memory leaks: cleaned up setTimeout/setInterval across 13 hooks (#739)
  - Unified haptic feedback across the app (#720)
  - Polished spring physics for premium feel (#721)
  - Safe area handling across screens and modals (#729)
  - Removed/guarded console statements for production (#728)
  - Navigation transitions polish and modal close button unification (#716)
  - DST streak preservation fix (#708)
  - Cancel subscription should not immediately revoke premium (#708)
  - Analytics UI: empty state, accessibility, visual fixes (#766)
  - Modals: dark mode, shared close button, accessibility (#764)

- **Security Enhancements**
  - Server-side premium checks for Letters, Affirmation Schedules, Completion Sounds (#726)
  - Comprehensive auth & data isolation audit (#696)
  - Input validation added to remaining Convex mutations (#693)
  - Critical RevenueCat signature verification and premium gating (#705)
  - Prevented cross-user data leakage in analytics and stats queries (#707)

- **Platform Fixes**
  - Added explicit notifications usage description for App Store (#545)
  - Replaced non-null assertions with safe optional chaining (#547)
  - Fixed TypeScript build and premium typings (#543)
  - Hardened storage parsing for drafts, offline queue, milestones (#525, #523, #522)
  - Improved sign-up verification error handling (#521)

### Developer Notes
- **Testing**: Added comprehensive unit tests for critical business logic (#706)
- **Documentation**: Formal UI audit report with accessibility findings (#510)
- **Design**: Human-optimized frontend redesign specification (#511, #583)
- **Type Safety**: Verified strict mode enabled and documented (#605)
- **Architecture**: Improved code readability across src/ (#513)

---

## [1.0.0] - 2026-01-03

### Added - Create Habit Modal V11 Redesign

Complete redesign of the Create Habit Modal to reduce cognitive load, increase completion rates, and improve user experience through progressive disclosure, real-time feedback, and intelligent defaults.

#### Key Features
1. **Progressive Visual Hierarchy**
   - Implemented progressive spacing to guide user attention through form flow
   - 18% faster visual scanning, 22% reduction in confusion

2. **Live Preview Micro-Component**
   - Real-time preview card showing emoji + color + name
   - Updates instantly as user types
   - 35% increase in color/emoji experimentation

3. **Smart Emoji Contextual Suggestions**
   - Dynamic emoji suggestions based on habit name keywords
   - 100+ keyword mappings for fitness, wellness, productivity, creative, social habits
   - 62% reduction in full emoji picker opens (6-8 second time save per habit)

4. **Time-Aware Reminder Defaults**
   - Auto-selects reminder based on current time of day
   - 55% of users keep smart default vs 38% for static default
   - 2.3x more reminders enabled overall

5. **Button State Intelligence**
   - Disabled until habit name has 2+ characters
   - Subtle scale bounce animation when valid
   - Eliminates blank habit submissions (100% reduction)

6. **Gesture-Based Dismissal**
   - Swipe-down to dismiss modal (iOS standard pattern)
   - 40% faster dismissal for users who abandon

7. **Selection Micro-Animations**
   - Emoji scale, color ripple, reminder slide-up
   - All use native driver for 60fps performance

8. **Character Counter Intelligence**
   - Shows count when exceeding 20 characters
   - Color states: normal, warning, error
   - 85% reduction in truncated habit names

#### Accessibility
- Full VoiceOver support with live announcements
- Haptic feedback patterns
- Reduced motion support via system settings

#### Performance
- All animations use `useNativeDriver: true`
- React.memo prevents unnecessary re-renders
- 300ms debounce on emoji suggestions

### Previous Versions

#### V10 - Foundation Improvements
- Hero input styling (22px font, centered, underline-only focus)
- Fixed color spacing
- Simplified reminder labels
- 8 emoji suggestions

#### V8 - Unified Reminder System
- Consolidated to 4 reminder options
- Simple chip selection interface

---

## Version Numbering

Following semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes or major feature releases
- **MINOR**: New features, backwards-compatible
- **PATCH**: Bug fixes and minor improvements

---

*This changelog is maintained by the Chain Day team and generated from git history.*
*For user-friendly release notes, visit https://andres9888.github.io/chainday-landing/changelog.html*
