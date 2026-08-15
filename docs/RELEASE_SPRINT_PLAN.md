# App Store Release Sprint Plan

> **Archived plan.** Use
> [`App Store Submission Checklist.md`](./App%20Store%20Submission%20Checklist.md)
> as the current source of truth. This sprint predates the ChainDay release
> configuration and is retained only for historical context.

**Target**: App Store submission in ~2-3 weeks
**Pace**: 2-4 work sessions per day
**Start Date**: _______________

---

## Phase 1: Critical Blockers (Days 1-5)

### Day 1-2: Authentication Foundation
- [ ] Set up Apple Sign-In with Expo AuthSession
- [ ] Configure Apple Developer Console (App ID, Sign-In capability)
- [ ] Implement sign-in flow UI
- [ ] Test on physical iOS device (required for Apple Sign-In)

### Day 3: Authentication Polish + Google Sign-In
- [ ] Add Google Sign-In as secondary option
- [ ] Implement secure session persistence
- [ ] Add sign-out functionality
- [ ] Handle auth error states gracefully

### Day 4: Legal Compliance
- [ ] Draft Privacy Policy (use template generator)
- [ ] Draft Terms of Service
- [ ] Host documents (GitHub Pages, Notion, or your domain)
- [ ] Add acceptance flow in onboarding
- [ ] Link privacy policy in app settings

### Day 5: EAS Build Configuration
- [ ] Run `eas build:configure`
- [ ] Create `eas.json` with development, preview, production profiles
- [ ] Set up App Store Connect credentials
- [ ] Create first TestFlight build
- [ ] Test build on physical device

---

## Phase 2: Quality & Polish (Days 6-10)

### Day 6-7: Test Coverage Sprint
- [ ] Fix SafeAreaProvider test setup issues
- [ ] Implement 10 auto-pending tests (+18.5% coverage)
- [ ] Fix Reanimated mock issues
- [ ] Target: 55-60% coverage

### Day 8: Bug Fixes
- [ ] Fix streak calculation off-by-one errors (InsightsSection.tsx)
- [ ] Fix Personal Bests calculation (ProgressSection/utils.ts)
- [ ] Fix template preview modal sizing
- [ ] Fix keyboard blocking habit detail input

### Day 9: Error Handling & Loading States
- [ ] Add error boundaries to main screens
- [ ] Implement loading skeletons for habit list
- [ ] Add retry logic for failed API calls
- [ ] Handle offline state gracefully

### Day 10: More Test Coverage
- [ ] Add Convex backend tests (habits.ts critical)
- [ ] Integration tests for auth flow
- [ ] Target: 65-70% coverage

---

## Phase 3: User Experience (Days 11-14)

### Day 11-12: Onboarding Flow
- [ ] Welcome screen with app value proposition
- [ ] Account creation/sign-in screen
- [ ] Quick tutorial (3-4 screens max)
- [ ] First habit creation prompt
- [ ] Skip option for returning users

### Day 13: Accessibility & Performance
- [ ] Add VoiceOver labels to interactive elements
- [ ] Test with VoiceOver enabled
- [ ] Verify React.memo on heavy components
- [ ] Profile and fix any jank

### Day 14: Final Polish
- [ ] Remove/disable dark mode toggle (force light mode)
- [ ] Remove hardcoded Figma token
- [ ] Final QA pass on physical device
- [ ] Fix any remaining visual bugs

---

## Phase 4: App Store Submission (Days 15-17)

### Day 15: App Store Assets
- [ ] Create app icon (1024x1024 + all sizes)
- [ ] Generate screenshots for:
  - [ ] iPhone 6.7" (iPhone 15 Pro Max)
  - [ ] iPhone 6.5" (iPhone 11 Pro Max)
  - [ ] iPhone 5.5" (iPhone 8 Plus)
  - [ ] iPad Pro 12.9" (if supporting tablet)
- [ ] Write app description (short + long)
- [ ] Prepare keywords (100 char limit)

### Day 16: App Store Connect Setup
- [ ] Create app listing in App Store Connect
- [ ] Upload screenshots and metadata
- [ ] Set pricing (Free)
- [ ] Configure age rating
- [ ] Add privacy policy URL
- [ ] Prepare review notes

### Day 17: Submission
- [ ] Build final production release via EAS
- [ ] Upload to App Store Connect
- [ ] Submit for review
- [ ] Prepare responses for common rejection reasons

---

## Post-Submission Buffer (Days 18-21)

Apple review typically takes 1-3 days. Use this time for:
- [ ] Address any rejection feedback
- [ ] Prepare marketing materials
- [ ] Set up crash monitoring (Sentry)
- [ ] Plan post-launch improvements

---

## Daily Checklist Template

```
Date: _______________
Sessions completed: [ ] 1  [ ] 2  [ ] 3  [ ] 4

Morning:
- [ ] Review today's tasks
- [ ] Work session 1: _____________
- [ ] Work session 2: _____________

Afternoon/Evening:
- [ ] Work session 3: _____________
- [ ] Work session 4: _____________
- [ ] Update this checklist
- [ ] Note any blockers: _____________
```

---

## Quick Reference: Key Commands

```bash
# Development
npm run ios                    # Run on simulator
npm run test:coverage          # Check test coverage

# Task Master
task-master next               # Get next task
task-master set-status --id=X --status=done

# EAS Build
eas build:configure            # Initial setup
eas build --platform ios       # Build for iOS
eas submit --platform ios      # Submit to App Store
```

---

## Scope Cut Options (If Running Behind)

If you're behind schedule, consider cutting:
1. **Google Sign-In** - Apple Sign-In only is acceptable
2. **Onboarding tutorial** - Just welcome + sign-in screens
3. **Test coverage target** - 50% is functional, 70%+ is ideal
4. **Enhanced statistics** - Post-launch feature
5. **Help system** - Post-launch feature

**Absolute minimum for launch**: Auth + Legal + EAS + Basic QA + Assets

---

## Notes & Blockers

_Use this section to track issues as they arise:_

-
-
-
