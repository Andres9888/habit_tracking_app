# My Project - Epic Breakdown

**Author:** Jane
**Date:** 2025-10-22 (Updated: 2025-10-27)
**Project Level:** Level 3 (Full Product)
**Target Scale:** 40 stories across 6 epics, 7-month timeline (includes App Store launch)

---

## Quick Links to Epic Folders

### MVP Epics (Organized by Screen)

**Epic 1** is split into 4 sub-epics based on the screens they touch:

1.1. [Habit Home Screen →](./stories/epic-1-home-screen/README.md) _(Daily Tracking & Progress Display)_
1.2. [Habit Creation Modal →](./stories/epic-1-habit-modal/README.md) _(Create & Edit Habit Form)_
1.3. [Foundation & Infrastructure →](./stories/epic-1-foundation/README.md) _(Backend Systems & Design System)_

**Note:** Onboarding moved to Epic 5 (Post-MVP) to accelerate initial launch

### Post-MVP Epics

2. [Epic 2: Premium Monetization →](./stories/post-mvp/epic-2-analytics-premium/README.md) _(Analytics & Premium Subscription)_
3. [Epic 3: Retention Engine →](./stories/post-mvp/epic-3-predictions-reminders/README.md) _(Predictions & Smart Reminders)_
4. [Epic 4: Viral Growth →](./stories/post-mvp/epic-4-social-sharing/README.md) _(Social Sharing & Referrals)_
5. [Epic 5: Polish & Scale →](./stories/post-mvp/epic-5-performance-polish/README.md) _(Performance & UX Polish + Onboarding)_
6. [Epic 6: App Store Launch →](./stories/epic-6-app-store/README.md) _(Submission, Distribution & Launch)_

---

## Epic Overview

This epic breakdown translates the PRD into actionable development work organized for solo developer efficiency and revenue-first prioritization. The 6 epics are sequenced to:

1. **Launch fast** (MVP in 2 months - onboarding deferred to post-MVP)
2. **Generate revenue** (Subscriptions by month 3)
3. **Retain users** (Churn reduction by month 4)
4. **Drive growth** (Viral features by month 5)
5. **Polish product** (Premium quality + onboarding by month 6)
6. **App Store launch** (Submission and public distribution by month 7)

Each epic is sized for 3-4 week sprints with clear success metrics tied to the $2k → $10k MRR goal. Stories are written to maximize code reuse and minimize technical debt for long-term solo maintainability.

**Strategic Decisions:**
- Onboarding moved to Epic 5 to remove barriers and ship core functionality faster
- App Store submission isolated in Epic 6 to ensure all compliance/launch requirements met after product polish

**Key Principles:**
- **Science-first**: Every story leverages existing Zhang et al./Lally et al. algorithms
- **Revenue-driven**: Premium features prioritized over nice-to-haves
- **Mobile-native**: iOS-first with React Native, premium UX quality
- **Solo-sustainable**: Clean architecture, well-tested, documented

---

## Epic Details

### Epic 1: MVP Foundation - Core Tracking & Science Engine
**Timeline:** Months 1-2 (Weeks 1-8)
**Stories:** 8 stories (includes Story 1.2.1 for edge cases & error handling)
**Goal:** Ship App Store-ready MVP with core science-backed tracking

**Extended Goals:**
- Validate product-market fit with early adopters
- Establish technical foundation for future epics
- Prove habit strength algorithms work in production
- Enable immediate habit tracking without barriers

**Success Metrics:**
- App Store approval achieved
- 100+ beta testers acquired
- Average session time >2 minutes
- 0 critical bugs in production
- Habit strength calculations validated against research benchmarks

---

#### Story 1.1: Habit Creation Flow
**As a** new user
**I want to** create my first habit with customization options
**So that** I can start tracking behavior I want to build

**Prerequisites:**
- Design system foundations (colors, typography, spacing)
- Database schema for habits table
- React Native navigation configured

**Acceptance Criteria:**
1. User can tap "Add Habit" button from home screen
2. Form includes fields: name (required, max 50 chars), description (optional, max 200 chars), color picker (8 preset options), icon selector (20+ icons), frequency (daily/custom days)
3. "Create" button disabled until name provided
4. On submit, habit created with initial strength = 0%, strengthLevel = "starting"
5. User redirected to home screen showing new habit
6. Error handling: duplicate names warned, network failures handled gracefully
7. Accessibility: All inputs labeled for VoiceOver, Dynamic Type supported

**Technical Notes:**
- Use Convex mutation `createHabit` from existing backend
- Color picker: ColorPickerSheet component (already implemented)
- Icon library: React Native Vector Icons or similar
- Form validation: Zod schema for type safety
- Optimistic UI updates for instant feedback

---

#### Story 1.2: Daily Habit Check-Off
**As a** user with active habits
**I want to** quickly check off completed habits with gestures
**So that** my daily tracking ritual takes <30 seconds

**Prerequisites:**
- Story 1.1 complete (habits exist)
- Habit strength calculation function available

**Acceptance Criteria:**
1. Home screen displays today's habits in list format
2. Swipe right on habit card to mark complete (animated checkmark)
3. Tap on habit card toggles completion state (check/uncheck)
4. Completed habits show visual distinction (checkmark icon, muted color)
5. Unchecking a habit reverses completion state and recalculates strength
6. Completion triggers immediate strength recalculation in background
7. Works offline with local-first architecture
8. Haptic feedback on both completion and uncheck (iOS native vibration)

**Technical Notes:**
- Gesture handlers: React Native Gesture Handler library
- Mutation: `updateHabitStrength` from convex/habitStrength.ts
- Animation: Reanimated for 60fps performance
- Optimistic updates: Update UI immediately, sync to backend async
- Background calculation: Use Web Worker or async queue to avoid UI blocking

---

#### Story 1.2.1: Check-Off Edge Cases & Error Handling
**As a** user checking off habits in various edge case scenarios
**I want to** have the app handle errors, conflicts, and unusual situations gracefully
**So that** I never lose data or experience confusing behavior

**Prerequisites:**
- Story 1.2 complete (tap toggle with haptic feedback)
- toggleCompletion mutation implemented
- Convex backend configured

**Acceptance Criteria:**
1. Rapid successive taps debounced with 300ms cooldown (no duplicate mutations)
2. Network failures handled with retry queue and exponential backoff (1s, 2s, 4s delays)
3. Toast notifications for all error states ("Connection issue", "Habit deleted", etc.)
4. Multi-device conflict resolution using last-write-wins strategy (timestamp-based)
5. Offline mutations queued and synced automatically when reconnecting
6. Sync status indicator shows pending operations count during sync
7. Animation interruptions handled gracefully (tap during animation cancels and toggles)
8. Date boundary validation prevents timezone-related errors
9. Corrupted habit data detected with restore/repair functionality
10. Mutations persist across app kills (AsyncStorage queue + auto-sync on relaunch)
11. Strength calculation failures don't block completion (async, non-blocking)
12. Comprehensive test suite covering all edge cases (20+ unit tests, integration tests)

**Technical Notes:**
- Debounce: `isToggling` state flag with 300ms cooldown in HabitCard
- Retry queue: `src/utils/retryQueue.ts` with exponential backoff manager
- Error handling: Try/catch wrapper around all mutations + Sentry logging
- Conflict resolution: Timestamp comparison in `convex/tracking.ts`
- Offline support: NetInfo detection + AsyncStorage persistence
- Sync indicator: `src/components/SyncStatusIndicator.tsx` component
- Date validation: Client-side YYYY-MM-DD calculation, server format validation only
- Data repair: Zod schema validation + repair mutation
- App kill recovery: `src/hooks/useAppState.ts` + launch sync in App.tsx
- Testing: `src/components/__tests__/HabitCard.edgeCases.test.tsx` + manual checklist

**Success Metrics:**
- Zero data loss incidents in production
- <0.1% completion tracking failures
- 99.9% sync success rate within 5 minutes
- No user reports of "lost progress"
- Debounce prevents >95% of duplicate mutations

**Documentation:**
- Full specifications: `docs/stories/epic-1-home-screen/habit-card/bugs/story-1.2.1-edge-cases.md`
- Task Master task: Task 2 with 12 subtasks in `.taskmaster/tasks/`

---

#### Story 1.3: Habit Strength Calculation Engine
**As a** user checking off habits
**I want to** see my habit strength increase automatically
**So that** I understand my progress toward automaticity

**Prerequisites:**
- Zhang et al. algorithm implemented (already done in convex/habitStrength.ts)
- Story 1.2 complete (tracking data exists)

**Acceptance Criteria:**
1. On habit completion, system calculates strength using: Baseline(days) × Compliance(30-day window)
2. Baseline follows logistic curve: 1 / (1 + exp(-k × (days - m))) normalized to 100% at day 90
3. Compliance uses Beta-smoothed success rate with α=β=1 (Laplace smoothing)
4. Strength categorized into levels: Starting (0-20%), Building (20-40%), Developing (40-60%), Strong (60-80%), Automatic (80-100%)
5. Calculation completes in <100ms (non-blocking)
6. Results persist to habit document: strength, strengthLevel, strengthUpdatedAt
7. Edge cases handled: brand new habits (0%), perfect compliance (100%), missed days (decay)
8. Algorithm matches research benchmarks: ~22% at day 7, 100% at day 90 with perfect compliance

**Technical Notes:**
- Reuse existing generateHabitStrengthSnapshot() from convex/habitStrength.ts
- Validation: Unit tests comparing output to Lally et al. curve expectations
- Performance: Cache calculations, only recompute on new tracking data
- Documentation: Inline comments cite research papers (Zhang 2021, Lally 2010)

---

#### Story 1.4: Habit Strength Visual Indicators
**As a** user viewing my habits
**I want to** see strength displayed with intuitive visuals
**So that** I grasp my progress at a glance without reading numbers

**Prerequisites:**
- Story 1.3 complete (strength values calculated)
- HabitStrengthIndicator component (already exists)

**Acceptance Criteria:**
1. Each habit card displays strength as: emoji icon, progress bar, percentage text, level label
2. Emoji mapping: 🌱 Starting, 🌿 Building, 🌳 Developing, 💪 Strong, ⚡ Automatic
3. Progress bar fills left-to-right, color-coded by level (green gradient)
4. Compact view for habit list (emoji + mini bar + percentage)
5. Full view in habit detail screen (all elements + description text)
6. Animations: smooth progress bar fills (spring physics), emoji changes with celebration micro-animation
7. Accessibility: Screen reader announces "Meditation habit, 45% strength, Building level"

**Technical Notes:**
- Use existing HabitStrengthIndicator component from src/components
- Animation library: Reanimated for native performance
- Color palette: Match existing design system (greens for growth theme)
- Component props: strength (0-1), strengthLevel (string), compact (boolean), showLabel (boolean)

---

#### Story 1.5: Local Data Persistence
**As a** user
**I want to** access my habit data instantly even offline
**So that** the app feels responsive and I never lose progress

**Prerequisites:**
- Convex backend configured
- React Native AsyncStorage or similar available

**Acceptance Criteria:**
1. All habit data cached locally on device
2. App launches and displays habits in <2 seconds (cold start)
3. Habit check-offs work offline, queue for sync when online
4. Sync conflicts resolved with last-write-wins (timestamp comparison)
5. Background sync every 30 seconds when app active and online
6. Sync status indicator: subtle icon showing online/syncing/offline state
7. Data migration handled gracefully on schema changes
8. No data loss: local persistence backed by redundant storage

**Technical Notes:**
- Convex provides built-in optimistic updates and sync
- Offline queue: Implement retry logic with exponential backoff
- Conflict resolution: Use strengthUpdatedAt timestamp for winner
- Storage: Convex client handles caching, supplement with AsyncStorage for app state
- Performance: Index habits by userId and date for fast queries

---

#### Story 1.6: Habit Editing & Management
**As a** user with existing habits
**I want to** edit, archive, and delete habits
**So that** I can maintain a clean, relevant habit list

**Prerequisites:**
- Story 1.1 complete (habits created)
- Edit UI designed

**Acceptance Criteria:**
1. Long-press habit card reveals context menu: Edit, Archive, Delete
2. Edit: Opens same form as creation, pre-filled with current values, "Save Changes" CTA
3. Archive: Removes from active list, preserves data, recoverable from "Archived" section
4. Delete: Shows confirmation dialog "Are you sure? This will delete all tracking history", requires second tap
5. Bulk operations: Select multiple habits (checkbox mode), batch archive/delete
6. Habit reordering: Long-press and drag to reorder list (persists order preference)
7. Filter view: All (active), Archived, By Category (if categories implemented)

**Technical Notes:**
- Mutations: updateHabit, archiveHabit, deleteHabit
- Soft delete: archived flag instead of hard delete for data recovery
- Reordering: Use sortOrder field, update on drag-and-drop
- Animations: Smooth list reordering with LayoutAnimation
- Confirmation dialogs: React Native Alert API

---

#### Story 1.7: Core Design System Foundation
**As a** developer
**I want to** establish reusable design components
**So that** future features maintain visual consistency

**Prerequisites:**
- Design specifications (colors, typography, spacing)
- React Native project initialized

**Acceptance Criteria:**
1. Design tokens file: colors (primary, secondary, success, error, background), typography (fontFamily, sizes, weights), spacing (4px grid: 4, 8, 12, 16, 24, 32, 48)
2. Reusable components: Button (primary, secondary, ghost variants), Card, Input, Typography (H1-H4, Body, Caption)
3. Theme system: Light mode implemented, dark mode prepared (theme context)
4. Consistent spacing: All layouts use 8pt grid system
5. Accessibility: Minimum contrast ratios (WCAG AA), touch targets 44x44pt minimum
6. Documentation: Storybook or component playground for design reference
7. Performance: Components optimized with React.memo where appropriate

**Technical Notes:**
- Styling: Styled-components or StyleSheet with theme provider
- Typography: SF Pro (iOS native) with fallbacks
- Color palette: Greens (growth theme), blues (trust), neutral grays
- Icons: React Native Vector Icons or SF Symbols
- Testing: Visual regression tests with jest-image-snapshot

---

### Epic 2: Premium Monetization - Analytics & Subscription
**Timeline:** Months 2-3 (Weeks 9-16)
**Stories:** 7 stories
**Goal:** Convert 5-10% of free users to $7-10/month subscribers

**Extended Goals:**
- Unlock revenue stream toward $2k MRR
- Validate subscription pricing and feature value
- Build analytics infrastructure for retention insights
- Establish premium feature paywall strategy

**Success Metrics:**
- 5-10% free-to-paid conversion within 30 days
- 40% trial-to-paid conversion (7-day free trial)
- MRR growth trajectory toward $2k by month 6
- Premium feature engagement >70% among subscribers
- <5% payment failures/disputes

---

#### Story 2.1: In-App Purchase Integration (iOS StoreKit)
**As a** developer
**I want to** integrate App Store subscriptions
**So that** users can purchase premium features

**Prerequisites:**
- Apple Developer account configured
- App Store Connect subscriptions created (monthly, annual)
- Backend subscription validation endpoint ready

**Acceptance Criteria:**
1. StoreKit 2 integration with async/await APIs
2. Product fetching: Retrieve subscription offerings from App Store on app launch
3. Purchase flow: Present system payment sheet, handle authentication (Face ID/Touch ID)
4. Receipt validation: Server-side validation via Apple's verifyReceipt API
5. Subscription status: Check active subscription on app launch and periodically
6. Restore purchases: Button in settings to restore on new device
7. Error handling: Payment canceled, network errors, invalid receipts all handled gracefully
8. Sandbox testing: Works in TestFlight and Xcode sandbox environment

**Technical Notes:**
- Library: react-native-iap or expo-in-app-purchases
- Backend: Convex function validateAppleReceipt(receiptData)
- Security: Never trust client-side subscription status, always validate server-side
- Grace period: Handle billing retry period gracefully (user retains access)
- Compliance: Follow App Store Review Guidelines 3.1.1

---

#### Story 2.2: Subscription Tiers & Free Trial
**As a** potential customer
**I want to** try premium features risk-free
**So that** I can decide if subscription is worth the cost

**Prerequisites:**
- Story 2.1 complete (IAP integration)
- Paywall UI designed

**Acceptance Criteria:**
1. Two subscription tiers: Monthly ($9.99), Annual ($79.99 - 33% discount)
2. 7-day free trial for both tiers, cancel anytime before charge
3. Trial eligibility: First-time subscribers only (tracked by Apple ID)
4. Clear pricing display: "$9.99/month after 7-day trial" (no hidden fees)
5. Auto-renewal disclosure: "Renews automatically, cancel anytime in Settings"
6. Comparison table: Free vs Premium feature comparison on paywall screen
7. Trial reminder: Notification 1 day before trial ends ("Your trial ends tomorrow")
8. Cancellation: Direct link to iOS Settings > Subscriptions for easy cancellation

**Technical Notes:**
- App Store Connect: Configure introductory offer (7-day trial, $0)
- Pricing: Tier 1 - $9.99/month, Tier 2 - $79.99/year (display as $6.66/month)
- Notifications: Local notification scheduled 1 day before trial expiration
- Analytics: Track trial starts, conversions, cancellations by tier
- A/B testing: Test $7.99 vs $9.99 pricing in future iterations

---

#### Story 2.3: Strategic Paywall Implementation
**As a** free user
**I want to** understand premium value before hitting limits
**So that** I'm motivated to upgrade rather than frustrated

**Prerequisites:**
- Story 2.2 complete (subscription system)
- Paywall screen designed

**Acceptance Criteria:**
1. Free tier limits: 3 habits maximum, basic strength display only
2. Paywall triggers: Creating 4th habit, day 7 of usage, tapping locked premium features
3. Paywall screen content: "Unlock Your Full Potential" headline, feature comparison (free vs premium with checkmarks/locks), testimonial quote, "Start 7-Day Free Trial" CTA, "Restore Purchases" link, "Maybe Later" dismissal
4. Soft paywall: Users can dismiss and continue with free tier (not forced upgrade)
5. Feature teases: Locked features show preview with "Premium" badge and tap-to-paywall
6. Upgrade prompts: Contextual nudges when premium features would add value (e.g., "See why your 'Exercise' habit dropped to 45% - Premium Analytics")
7. Timing optimization: No paywall in first 24 hours (let users experience value first)

**Technical Notes:**
- Paywall library: RevenueCat or custom implementation
- Trigger logic: useSubscriptionStatus hook checking limits
- Analytics: Track paywall impressions, conversions, dismissals by trigger type
- Design: Premium feel (beautiful graphics, social proof, clear value prop)
- Compliance: Transparent about trial terms, no dark patterns

---

#### Story 2.4: Premium Analytics Dashboard
**As a** premium subscriber
**I want to** see advanced analytics about my habits
**So that** I understand what's working and what needs attention

**Prerequisites:**
- Story 2.1 complete (subscription access checks)
- Habit strength history data available

**Acceptance Criteria:**
1. Dashboard accessed via "Analytics" tab (premium badge shown to free users)
2. Overview cards: Total habits, average strength, strongest habit, weakest habit
3. Strength distribution chart: Pie/donut chart showing habits by level (Starting, Building, etc.)
4. Trend graph: Line chart showing average strength over last 30 days
5. Compliance heatmap: Calendar grid showing completion rate by day (GitHub-style)
6. Habit ranking: List sorted by strength with percentage and level indicators
7. Time period selector: Last 7 days, 30 days, 90 days, All time
8. Data export: "Export CSV" button downloads all habit tracking data

**Technical Notes:**
- Charts: Victory Native or Recharts for React Native
- Data queries: Convex aggregation functions for efficiency
- Caching: Pre-compute analytics overnight for performance
- Design: Match premium aesthetic, clean data visualization
- Accessibility: Charts include text summaries for screen readers

---

#### Story 2.5: Habit Strength History Graphs
**As a** premium subscriber
**I want to** view historical strength progression for each habit
**So that** I can see when automaticity kicked in or when I regressed

**Prerequisites:**
- Story 2.4 complete (analytics infrastructure)
- Strength snapshots saved over time

**Acceptance Criteria:**
1. Accessed from habit detail screen (tap habit card → "View History")
2. Line graph showing strength percentage (0-100%) over time since creation
3. Inflection points marked: When habit crossed 20% (Building), 60% (Strong), 80% (Automatic)
4. Comparison view: Overlay baseline curve vs compliance curve to show contributions
5. Historical events overlaid: "7-day streak broken", "Resumed after pause"
6. Zoom/pan: Pinch to zoom, scroll to pan time range
7. Benchmark overlay: Show Lally et al. expected automaticity curve for comparison
8. Export: Share graph as image to social media or save to photos

**Technical Notes:**
- Store snapshots: Save strength value with timestamp on each calculation
- Graph library: Victory Native Line Chart with custom markers
- Data efficiency: Aggregate daily snapshots, don't query every calculation
- Annotations: Use VictoryScatter for milestone markers
- Sharing: React Native Share API + react-native-view-shot for image generation

---

#### Story 2.6: Weekly Insight Reports
**As a** premium subscriber
**I want to** receive weekly summaries of my progress
**So that** I stay motivated and know where to focus effort

**Prerequisites:**
- Story 2.4 complete (analytics data)
- Notification permissions granted

**Acceptance Criteria:**
1. Delivered every Sunday at 6:00 PM (configurable time in settings)
2. Report content: "Your Week in Habits" headline, habits gained strength (list with % increase), habits lost strength (list with % decrease), habit at risk (prediction <40%), suggested focus ("Work on 'Exercise' - 12% compliance drop"), celebration (if any habit reached new level)
3. In-app notification: Opens to full report screen with detailed breakdown
4. Report history: View past 12 weeks of reports in Analytics tab
5. Personalization: Uses user's name, references specific habits by name
6. Actionable: Each insight includes recommended action ("Try morning reminders for Exercise")
7. Opt-out: Settings toggle to disable weekly reports

**Technical Notes:**
- Scheduled job: Convex cron job runs Sunday 6PM user's timezone
- Report generation: Analyze week's tracking data, compute trends
- Notification: Push notification (if permitted) + in-app storage
- NLP: Template-based insights with dynamic habit names and numbers
- Analytics: Track report open rate, insight action rate

---

#### Story 2.7: Subscription Management & Restore Purchases
**As a** subscriber
**I want to** manage my subscription and restore on new devices
**So that** I have control and can access premium across devices

**Prerequisites:**
- Story 2.1 complete (IAP foundation)

**Acceptance Criteria:**
1. Settings screen shows current subscription status: "Premium (Annual)" or "Free Tier"
2. If subscribed: Display expiration date, renewal date, "Manage Subscription" button (deep link to iOS Settings)
3. If free: "Upgrade to Premium" button launches paywall
4. Restore Purchases button: Validates receipts with Apple, unlocks premium if valid
5. Restore flow: Shows loading spinner, success confirmation "Premium restored!", error handling for no purchases found
6. Cross-device sync: User signs into new device, taps Restore, premium access enabled
7. Subscription changes: If user downgrades, premium access continues until end of billing period

**Technical Notes:**
- Deep linking: Use Linking API to open App Store subscription management
- Restore: Call StoreKit restoreCompletedTransactions(), validate receipts
- Backend: Store subscription status in user document, validate on each app launch
- Grace period: Handle billing retry period (user keeps access during retry)
- Analytics: Track restore attempts, success rate, subscription changes

---

### Epic 3: Retention Engine - Predictive Intelligence & Interventions
**Timeline:** Months 3-4 (Weeks 17-24)
**Stories:** 6 stories
**Goal:** Reduce churn to <5% monthly through predictive interventions

**Extended Goals:**
- Implement Zhang et al. behavior prediction system
- Deploy adaptive reminder infrastructure
- Create automated intervention campaigns
- Protect revenue by keeping subscribers engaged long-term

**Success Metrics:**
- <5% monthly churn rate among subscribers
- Predictive reminders demonstrably improve completion rates by >10%
- Premium feature engagement >70%
- Users report interventions as helpful (NPS feedback)
- Retention curve: >80% D30, >60% D90

---

#### Story 3.1: Behavior Prediction Engine
**As a** user (backend system)
**I want to** predict tomorrow's completion probability for each habit
**So that** interventions can be triggered proactively

**Prerequisites:**
- Habit strength calculation (Story 1.3) complete
- Memory accessibility model implemented

**Acceptance Criteria:**
1. Prediction function: predictCompletionProbability(habitStrength, accessibility)
2. Model achieves 65-77% accuracy (Zhang et al. benchmark)
3. Calculated nightly for all active habits
4. Stored in habit document: predictedCompletionProb, lastPredictionAt
5. Factors considered: Habit strength (primary), memory accessibility (secondary), recent compliance trend
6. Calibration: Periodically validate predictions against actual outcomes, tune parameters if drift detected
7. Fallback: If insufficient data (<7 days tracking), use baseline estimate (50% probability)

**Technical Notes:**
- Algorithm: predictedProb = habitStrength * accessibility (simplified) or logistic regression
- Research: Zhang et al. (2021) validated model parameters
- Scheduled job: Convex cron runs at midnight user timezone
- Validation: A/B test predictions against random baseline to confirm lift
- Storage: Index predictions for fast reminder queries

---

#### Story 3.2: Adaptive Reminder System (Premium)
**As a** premium subscriber
**I want to** receive reminders only when I'm likely to forget
**So that** I'm not annoyed by unnecessary notifications

**Prerequisites:**
- Story 3.1 complete (predictions available)
- Push notification permissions granted

**Acceptance Criteria:**
1. Reminder triggers: Only when predictedCompletionProb < 40% (high failure risk)
2. Timing: Sent at user-configured time (e.g., 8:00 AM for morning habits)
3. Personalization: "You have a 35% chance of completing Exercise today - let's beat the odds! 💪"
4. Adaptive frequency: If user ignores 3 reminders, reduce frequency or pause
5. Context-aware: Don't send if habit already completed today
6. Multi-habit batching: Group multiple at-risk habits into single notification
7. Opt-in: Users can disable predictive reminders globally or per-habit in settings
8. Effectiveness tracking: Measure completion rate lift from reminders vs no reminders

**Technical Notes:**
- Notification service: Expo Notifications or Firebase Cloud Messaging
- Scheduling: Convex function schedules notifications based on predictions
- Personalization: Template system with habit name, probability, encouragement
- Analytics: Track reminder send, open, completion, ignore rates
- Privacy: Predictions computed server-side, never exposed raw data to third parties

---

#### Story 3.3: Automated Intervention Campaigns
**As a** user whose habit is declining
**I want to** receive supportive interventions automatically
**So that** I can recover before the habit fully breaks

**Prerequisites:**
- Story 3.1 complete (predictions and trend detection)

**Acceptance Criteria:**
1. Intervention tiers based on strength:
   - **Gentle nudge** (strength 40-60%): "Your 'Meditation' habit is slipping - get back on track today"
   - **Intensive support** (strength <40%): "3-day recovery challenge: Complete 'Exercise' 3 days in a row to rebuild momentum"
   - **Celebration** (strength >80%): "Amazing! Your 'Reading' habit is automatic - time to build another?"
2. Trigger conditions: 20% strength drop in 7 days, 3 consecutive missed days, crossing strength threshold
3. Campaign sequences: Day 1 - awareness, Day 3 - encouragement, Day 7 - recovery strategy
4. Opt-out: Users can disable intervention campaigns in settings
5. Effectiveness: Track recovery rate (% of users who rebound after intervention)
6. Respectful timing: No campaigns during user-set "pause" periods or vacations

**Technical Notes:**
- Campaign engine: Convex scheduled functions check conditions daily
- State machine: Track campaign progress (sent, opened, completed, abandoned)
- Content library: Pre-written intervention messages based on behavioral science
- Personalization: Use habit name, user name, specific context
- Analytics: Measure intervention efficacy (recovery rate, user feedback)

---

#### Story 3.4: Progress Milestone Celebrations
**As a** user building habits
**I want to** be recognized when I reach meaningful milestones
**So that** I feel accomplishment and stay motivated

**Prerequisites:**
- Habit strength calculation (Story 1.3) complete

**Acceptance Criteria:**
1. Milestone definitions:
   - **First completion** (Day 1): "Great start! Your first step toward automaticity 🎉"
   - **Building achieved** (20% strength): "Your habit is Building! You're on the path to automaticity 🌿"
   - **Strong achieved** (60% strength): "Your habit is Strong! Automaticity is near 💪"
   - **Automatic achieved** (80% strength): "Congratulations! Your habit is Automatic - backed by science ⚡"
   - **90-day milestone**: "90 days of 'Exercise'! You've reached the Lally automaticity benchmark 🏆"
2. Delivery: In-app modal with confetti animation, push notification (if enabled)
3. Shareable: "Share Your Achievement" button creates beautiful social card
4. Frequency: No more than 1 celebration per habit per week (avoid spam)
5. Personalization: Uses habit name, specific milestone, emoji celebration
6. Opt-out: Settings toggle to disable milestone celebrations

**Technical Notes:**
- Detection: Monitor strength changes, trigger on threshold crossings
- Animation: Lottie confetti or react-native-confetti
- Share cards: Generate image with react-native-view-shot (habit name, milestone, science badge)
- Persistence: Track milestone achievements to prevent duplicate celebrations
- Design: Premium aesthetic, emphasizes science credibility

---

#### Story 3.5: Habit Pause/Resume with Strength Preservation
**As a** user going on vacation or taking a break
**I want to** pause habits without losing progress
**So that** I can resume later without starting from zero

**Prerequisites:**
- Habit management (Story 1.7) complete

**Acceptance Criteria:**
1. Pause action: Long-press habit → "Pause Habit" option
2. Pause dialog: "Taking a break? Pause to freeze your strength and resume anytime" with date picker for resume date
3. While paused: Habit hidden from active list (moved to "Paused" section), strength frozen (no decay calculations), no reminders or interventions sent
4. Auto-resume: Automatically reactivates on specified resume date
5. Manual resume: "Resume Habit" button in Paused section, strength restored to paused value
6. Visual indicator: Paused habits show "⏸ Paused until [date]" badge
7. Analytics tracking: Pause frequency, duration, resume rate

**Technical Notes:**
- Schema: Add pausedAt, resumeAt, strengthAtPause fields to habits table
- Calculation exclusion: Skip paused habits in strength decay logic
- Scheduled job: Convex cron checks resumeAt dates, reactivates automatically
- UI: Filter paused habits from main list, show in dedicated section
- Use case: Supports life events (illness, travel) without penalizing users

---

#### Story 3.6: Predictive Insights in UI
**As a** premium subscriber
**I want to** see predictions and insights directly in the app
**So that** I can proactively prevent habit failures

**Prerequisites:**
- Story 3.1 complete (predictions calculated)

**Acceptance Criteria:**
1. Home screen widget: "Habits at Risk Today" card showing habits with <40% completion probability
2. Habit detail screen: "Prediction" section displaying: "Tomorrow's completion probability: 38%" with visual meter, "Factors: Recent compliance down 15%" breakdown, "Recommended action: Schedule morning reminder"
3. Analytics dashboard: "Weekly Forecast" graph showing predicted completion rate next 7 days
4. Proactive warnings: Small warning icon on habit cards when probability <40%
5. Transparency: "How is this calculated?" link explains model and research basis
6. Actionable: Each prediction includes suggested intervention (reminder, schedule change, etc.)
7. Premium-only: Free users see "Unlock Predictions" teaser

**Technical Notes:**
- Data: Query predictions from habit document
- Visualization: Progress meter or probability gauge
- Factor breakdown: Display strength, accessibility, compliance contributions
- Educational: Link to help docs explaining Zhang et al. model
- Design: Integrate seamlessly into existing habit cards and analytics

---

### Epic 4: Viral Growth - Social Proof & Referrals
**Timeline:** Months 4-5 (Weeks 25-32)
**Stories:** 5 stories
**Goal:** Achieve 1.3+ viral coefficient for organic user acquisition

**Extended Goals:**
- Reduce customer acquisition cost through viral mechanics
- Accelerate MRR growth toward $10k goal
- Build social proof and credibility
- Create network effects through referrals

**Success Metrics:**
- 1.3+ viral coefficient (each user brings 1.3+ new users)
- Share feature used by >20% of premium subscribers
- Referral program drives >15% of new signups
- App Store rating >4.5 stars with 100+ reviews
- Social media mentions increase 3x

---

#### Story 4.1: Beautiful Achievement Share Cards
**As a** user hitting a milestone
**I want to** share my achievement on social media
**So that** I celebrate publicly and inspire others (driving app downloads)

**Prerequisites:**
- Story 3.4 complete (milestones defined)

**Acceptance Criteria:**
1. Triggered when: User reaches milestone (Building, Strong, Automatic, 90-day)
2. Share card design: Gradient background (growth theme), habit name and milestone ("90 Days of Morning Meditation"), strength percentage with visual meter, science badge ("Backed by Lally et al. research"), subtle app name and icon (bottom), "Track your habits scientifically" tagline, user's name (optional, toggle in settings)
3. Customization: Choose background color/gradient, add personal message overlay, select which elements to include
4. Export options: Share to Instagram Story, Instagram Feed, Twitter/X, Facebook, Save to Photos, Copy Link
5. Attribution: App Store link embedded in social posts when possible
6. Analytics: Track share button taps, successful shares, platform distribution

**Technical Notes:**
- Image generation: react-native-view-shot to convert React component to image
- Design: Use brand colors, premium typography, clean layout
- Templates: Pre-designed card templates for each milestone type
- Social integration: React Native Share API for native share sheet
- Attribution: Use Branch.io or similar for deep linking and attribution tracking

---

#### Story 4.2: Social Media Integration
**As a** user
**I want to** seamlessly share to my preferred platform
**So that** the sharing process is frictionless

**Prerequisites:**
- Story 4.1 complete (share cards generated)

**Acceptance Criteria:**
1. Native share sheet: Uses iOS native share dialog with app-specific options
2. Platform-specific optimization: Instagram Story (1080x1920px), Instagram Feed (1080x1080px), Twitter (1200x675px), Facebook (1200x630px)
3. Pre-filled captions: Auto-generated with hashtags #habittracking #behaviorscience #90daychallenge and App Store link
4. One-tap sharing: No extra authentication required (uses native app integrations)
5. Fallback: If platform app not installed, offer "Copy Link" option
6. Success feedback: "Posted to Instagram!" confirmation toast
7. Privacy: User controls whether to include habit details or just generic achievement

**Technical Notes:**
- Library: react-native-share for cross-platform sharing
- Platform detection: Check installed apps, show relevant options
- Image sizing: Generate multiple resolutions for different platforms
- UTM parameters: Add tracking to shared App Store links (?utm_source=social&utm_medium=share)
- Analytics: Track share completions by platform

---

#### Story 4.3: Referral Program (Premium Feature)
**As a** premium subscriber
**I want to** refer friends and get rewarded
**So that** I save money and help friends discover the app

**Prerequisites:**
- Story 2.1 complete (subscription system)
- Referral tracking backend ready

**Acceptance Criteria:**
1. Referral dashboard: Accessed in Settings, displays unique referral link, referral code (6-character), total referrals (pending, converted), rewards earned (months of free premium)
2. Reward structure: Referrer gets 1 month free premium when friend subscribes, friend (referee) gets 1 month free premium on signup
3. Sharing: "Share Your Referral Link" button opens share sheet with pre-filled message: "Try the science-backed habit tracker I use - [link]"
4. Tracking: Referral link uses unique code, tracks clicks, signups, conversions
5. Redemption: Free months applied automatically to subscription (extends expiration date)
6. Limit: Max 12 referrals per year (1 free year maximum)
7. Terms: Clear T&Cs displayed, no gaming/fraud detection

**Technical Notes:**
- Attribution: Use Branch.io or Firebase Dynamic Links for referral tracking
- Backend: Store referral relationships (referrerId, refereeId, status, createdAt)
- Subscription extension: Update subscription expiration date on successful conversion
- Fraud prevention: Detect self-referrals, device fingerprinting, email verification
- Analytics: Track referral funnel (link clicks, signups, conversions), LTV by source

---

#### Story 4.4: Evidence-Based Habit Templates Library
**As a** new user
**I want to** browse pre-built habit templates
**So that** I can quickly start tracking proven behaviors

**Prerequisites:**
- Habit creation (Story 1.1) complete

**Acceptance Criteria:**
1. Template library: Accessed via "Browse Templates" button on habit creation screen
2. Categories: Morning Routine (meditation, exercise, journaling), Health & Fitness (hydration, steps, sleep), Productivity (deep work, reading, learning), Mindfulness (gratitude, breathing, mindfulness)
3. Template cards: Habit name, description, recommended frequency, difficulty level (beginner, intermediate, advanced), science reference (e.g., "Proven effective in Lally et al. 2010 study")
4. One-tap import: Tap template → habit created with defaults, customizable before saving
5. Curated: Quality-controlled, research-backed habits only (no spam)
6. Community voting: Users can upvote helpful templates (future: user-submitted templates)
7. Free access: Template browsing free, import limited to 3 for free users (unlimited for premium)

**Technical Notes:**
- Data source: JSON file or Convex table with curated templates
- Schema: name, description, frequency, category, difficulty, scienceReference, icon, color
- UI: Scrollable grid or list, search/filter by category
- Import: Pre-fill creation form with template data, allow edits
- Analytics: Track template views, imports, completion rates by template

---

#### Story 4.5: App Store Rating Prompts
**As a** satisfied user
**I want to** be prompted to rate the app at the right moment
**So that** I can support the app's growth (and others discover it)

**Prerequisites:**
- App published on App Store

**Acceptance Criteria:**
1. Trigger timing: After 7 days of usage AND after completing 10 total habit check-offs AND after reaching first "Building" milestone (20% strength)
2. Native prompt: Uses iOS StoreKit SKStoreReviewController (native rating dialog)
3. Frequency: Max once per app version, never more than 3 times total
4. Dismissable: User can dismiss without rating (no guilt trip)
5. Timing: Only shown during positive moments (after milestone celebration, not after failed tracking)
6. Fallback: If user dismisses 2x, offer "Share Feedback" button to email instead
7. Analytics: Track prompt shown, user rated, rating value (if available)

**Technical Notes:**
- API: StoreKit SKStoreReviewController (iOS 14+)
- Tracking: AsyncStorage to track prompt history (shown count, last shown date)
- Trigger logic: Check conditions on milestone events, wait 24 hours after major updates
- Best practice: Never interrupt user flow, show after completing action
- Attribution: Monitor App Store Connect for review velocity after prompts

---

### Epic 5: Polish & Scale - Premium UX & Performance
**Timeline:** Months 5-6 (Weeks 33-40)
**Stories:** 7 stories (includes onboarding moved from MVP)
**Goal:** Deliver Productive-level design quality and scale to 10,000+ users

**Extended Goals:**
- Justify premium pricing through superior UX
- Prepare infrastructure for growth to $10k MRR
- Complete accessibility and compliance requirements
- Establish app as category leader

**Success Metrics:**
- App feels "premium" vs competitors (user feedback)
- Performance benchmarks met (60fps, <2s launch)
- Supports 10,000+ users without degradation
- Accessibility audit passes WCAG AA
- Data export and privacy compliance ready

---

#### Story 5.1: Refined Design System & Animations
**As a** user
**I want to** enjoy smooth, delightful animations throughout the app
**So that** the premium experience justifies the subscription cost

**Prerequisites:**
- Story 1.8 complete (design system foundation)

**Acceptance Criteria:**
1. Microinteractions: Habit check-off (bouncy checkmark animation), strength level up (confetti + level badge growth), swipe gestures (rubber-band spring physics), button taps (subtle scale feedback)
2. Page transitions: Smooth slide/fade between screens (iOS-native feel), modal presentations (spring animation from bottom)
3. Loading states: Skeleton screens for data loading (no spinners), shimmer effect on placeholder cards
4. Haptic feedback: Success vibrations (completion), alert vibrations (failure), subtle taps (UI interactions)
5. 60fps performance: All animations use native driver (Reanimated), no dropped frames
6. Accessibility: Animations respect "Reduce Motion" setting (fall back to fades)
7. Consistency: All animations share spring physics parameters (tension, friction)

**Technical Notes:**
- Animation library: React Native Reanimated (useSharedValue, withSpring, withTiming)
- Haptics: react-native-haptic-feedback for iOS native vibrations
- Skeletons: react-native-skeleton-placeholder or custom implementation
- Performance: Use LayoutAnimation for simple transitions, Reanimated for complex
- Testing: Record animations at 120fps, verify no jank

---

#### Story 5.2: Basic Onboarding Flow
**As a** first-time user
**I want to** understand the science-backed approach quickly
**So that** I'm motivated to start tracking habits

**Prerequisites:**
- Core habit features complete (Epic 1)
- Onboarding screen designs finalized

**Acceptance Criteria:**
1. Three-screen onboarding flow on first app launch
2. Screen 1: "Real Habit Science, Not Just Streaks" - Shows Lally automaticity curve visualization, explains 90-day formation
3. Screen 2: "Live Demo" - Interactive: create example "Morning Run" habit, tap to complete, see strength calculate to 3%, delete example
4. Screen 3: "Get Started" - Permission requests (notifications) with clear value prop, "Create Your First Habit" CTA
5. Swipe or tap "Next" to advance screens
6. "Skip" option available (top-right) but tracks skip rate in analytics
7. Never shows again after completion (AsyncStorage flag)
8. Completion rate >60% target

**Technical Notes:**
- Library: react-native-onboarding-swiper or custom implementation
- Visualizations: Use Victory Native charts for automaticity curve
- Persistence: AsyncStorage for onboarding_completed flag
- Analytics: Track screen views, completion rate, skip points
- Design: Match premium aesthetic (calm, science-forward, no gimmicks)

---

#### Story 5.3: Advanced Onboarding with Interactive Demo
**As a** new user
**I want to** experience the habit science interactively
**So that** I'm convinced to commit before creating real habits

**Prerequisites:**
- Story 5.2 complete (basic onboarding)

**Acceptance Criteria:**
1. Enhanced Screen 2 (replaces basic demo): Interactive automaticity curve: User drags slider from Day 1 → Day 90, curve animates growth, strength percentage updates in real-time, "With perfect compliance, you reach 100% automaticity by day 90" education
2. Live prediction demo: Create sample "Morning Run" habit with 14 days of mock data (70% compliance), show prediction calculation: "Based on 14 days of data, you have a 68% chance of completing tomorrow", reveal breakdown: Baseline (32%), Compliance (70%) = 68% prediction
3. Before/after comparison: "Without our science" (shows simple streak counter) vs "With our predictions" (shows adaptive reminders preventing failure)
4. Skip prevention: Make demo so engaging users don't want to skip (gamification of education)
5. Completion tracking: Measure time spent on each screen, interaction rate
6. A/B test: Basic onboarding vs advanced interactive to measure impact on retention

**Technical Notes:**
- Interactions: Pan responder for slider, animated charts updating on drag
- Sample data: Pre-populated 14-day habit with realistic compliance pattern
- Visualizations: Victory Native charts for automaticity curve
- Education: Tooltips explaining baseline vs compliance contributions
- Analytics: Track interaction depth, completion rate, D7 retention by cohort

---

#### Story 5.4: Cross-Device Sync (Convex Backend)
**As a** user with multiple iOS devices
**I want to** access my habits seamlessly across iPhone and iPad
**So that** I can track anywhere without manual syncing

**Prerequisites:**
- Convex backend configured (already in place)
- Authentication system ready

**Acceptance Criteria:**
1. Real-time sync: Habit check-offs sync across devices within 30 seconds when online
2. Conflict resolution: Last-write-wins based on strengthUpdatedAt timestamp
3. Offline resilience: Devices queue changes offline, sync when reconnected
4. First-launch sync: New device fetches all user data on first sign-in
5. Subscription sync: Premium status recognized across all devices
6. Settings sync: App preferences (notification time, theme) sync across devices
7. Bandwidth efficiency: Only sync changed data, not entire dataset

**Technical Notes:**
- Backend: Convex provides real-time subscriptions and optimistic updates
- Auth: Use Clerk or Auth0 for secure user authentication
- Sync strategy: Convex client automatically handles sync, configure retry logic
- Conflict detection: Compare timestamps, merge non-conflicting changes
- Performance: Index queries by userId for fast retrieval

---

#### Story 5.5: Performance Optimization
**As a** user
**I want to** experience instant app responsiveness
**So that** daily tracking feels effortless and premium

**Prerequisites:**
- All core features implemented (Epics 1-3)

**Acceptance Criteria:**
1. Cold start: App launches in <2 seconds from tap to interactive home screen
2. Hot start: Resume from background in <500ms
3. UI rendering: Maintain 60fps during scrolling, animations, gestures
4. Memory usage: <100MB RAM during normal usage (prevent background kills)
5. List performance: Habit list scrolls smoothly with 100+ habits (virtualization)
6. Network efficiency: API calls optimized, batch requests where possible
7. Battery impact: Minimal background drain (<1% per hour with location off)

**Technical Notes:**
- Profiling: Use React Native Performance Monitor, Xcode Instruments
- Optimizations: Memoize components with React.memo, use FlatList for long lists, lazy load heavy screens, optimize images (WebP, appropriate resolutions), debounce expensive calculations
- Bundle size: Code split routes, tree-shake unused dependencies
- Network: Implement request caching, prefetch likely-needed data
- Testing: Performance regression tests, monitor with Sentry Performance

---

#### Story 5.6: Accessibility Improvements
**As a** user with accessibility needs
**I want to** use the app with assistive technologies
**So that** I can build habits regardless of ability

**Prerequisites:**
- All UI components implemented

**Acceptance Criteria:**
1. VoiceOver support: All interactive elements labeled ("Tap to complete Morning Meditation habit"), screen reader announces habit strength ("Exercise habit, 65% strength, Strong level"), navigation makes sense in linear order
2. Dynamic Type: All text respects iOS text size settings (up to XXXL), layouts adapt without breaking or clipping
3. Contrast ratios: Minimum 4.5:1 for normal text, 3:1 for large text (WCAG AA), color not sole indicator (use icons + color for states)
4. Touch targets: Minimum 44x44pt for all tappable elements, adequate spacing between adjacent buttons
5. Reduce Motion: Animations fall back to simple fades when setting enabled
6. Keyboard navigation: Support for external keyboard (iPad), logical tab order

**Technical Notes:**
- Testing: Enable VoiceOver, test all flows, use Xcode Accessibility Inspector
- Semantic HTML: Use proper heading hierarchy (Text with accessibilityRole="header")
- ARIA equivalents: accessibilityLabel, accessibilityHint, accessibilityRole props
- Color tools: Use Figma contrast checker or online tools
- Compliance: WCAG 2.1 Level AA standard

---

#### Story 5.7: Data Export & Privacy Compliance
**As a** user
**I want to** export my data and have control over privacy
**So that** I own my information and trust the app

**Prerequisites:**
- All data models finalized

**Acceptance Criteria:**
1. Data export: "Export My Data" button in Settings → generates CSV or JSON file → includes all habits, tracking history, strength calculations, timestamps → email or download to Files app
2. Data deletion: "Delete My Account" option → confirmation dialog with warning → deletes all user data permanently (GDPR right to erasure) → confirmation email sent
3. Privacy policy: Clear, readable policy linked in app → explains data collection (minimal: device ID, habit names, completion timestamps, subscription status) → third-party sharing disclosure (none beyond payment processing) → user rights (access, deletion, portability)
4. GDPR compliance: Consent for analytics (opt-in checkbox), data portability (export feature), right to deletion (account delete)
5. CCPA compliance: "Do Not Sell" disclosure (we don't sell data), privacy notice in app
6. Terms of Service: Clear terms linked in app, acceptance required on signup

**Technical Notes:**
- Export format: CSV for broad compatibility, JSON for developer users
- Deletion: Hard delete from Convex database, not soft delete (compliance requirement)
- Privacy policy: Use Termly or similar generator, host on website
- Compliance: Legal review recommended before launch
- Analytics opt-in: Use consent management platform or custom implementation

---

### Epic 6: App Store Launch - Submission & Distribution
**Timeline:** Month 6-7 (Weeks 41-48)
**Stories:** 8 stories
**Goal:** Successfully submit and launch app on Apple App Store

**Extended Goals:**
- Pass App Store review on first submission
- Achieve strong App Store presence with optimized metadata
- Ensure all compliance and legal requirements met
- Set up analytics and monitoring for post-launch
- Prepare beta testing infrastructure

**Success Metrics:**
- App Store approval achieved within 2 submission attempts
- App Store page optimized with 4.5+ star potential
- TestFlight beta with 50+ external testers before submission
- All privacy/legal compliance requirements met
- Launch day downloads >100 from initial audience

---

#### Story 6.1: App Store Connect Configuration
**As a** developer preparing for launch
**I want to** set up App Store Connect properly
**So that** I can manage the app lifecycle and submissions

**Prerequisites:**
- Apple Developer account active ($99/year)
- Bundle ID registered
- Development and distribution certificates configured

**Acceptance Criteria:**
1. App record created in App Store Connect with correct bundle ID
2. App name reserved (must be unique across App Store)
3. Primary language set to English (US)
4. Bundle ID configured: com.yourcompany.habittracker (or similar)
5. SKU defined for internal tracking
6. App category: Health & Fitness (primary), Productivity (secondary)
7. Age rating completed via questionnaire (likely 4+)
8. Content rights: Confirm you own or have rights to all content
9. Export compliance: Determine if CCATS required (encryption declaration)

**Technical Notes:**
- Use Xcode to manage certificates and provisioning profiles
- App name limit: 30 characters
- Bundle ID cannot be changed after first submission
- Age rating affects discoverability and available features
- Export compliance: Most apps use standard encryption (HTTPS) which is exempt

---

#### Story 6.2: App Metadata & ASO (App Store Optimization)
**As a** potential user browsing the App Store
**I want to** understand what the app does and why it's valuable
**So that** I can decide whether to download

**Prerequisites:**
- App branding finalized (name, tagline)
- Unique value proposition defined
- Competitive research completed

**Acceptance Criteria:**
1. **App Name** (30 chars): "HabitStrength: Science Tracker" or similar - includes keyword
2. **Subtitle** (30 chars): "Build automatic habits faster" - clear value prop
3. **Description** (4000 chars):
   - Hook paragraph: The problem and unique solution
   - Bullet points: 5-7 key features with science backing
   - Social proof: Research citations (Lally et al., Zhang et al.)
   - Premium features: Clear free vs paid distinction
   - Call to action: "Start building automatic habits today"
4. **Keywords** (100 chars): Comma-separated, researched via App Store search
   - Example: "habit,tracker,science,atomic,strength,automaticity,productivity,routine"
5. **Promotional text** (170 chars): Editable without new version - use for updates/sales
6. **What's New** (4000 chars): For updates - initial launch can be brief

**Technical Notes:**
- Keywords research: Use App Store search suggestions, competitor analysis
- Avoid keyword stuffing in name/subtitle (rejection risk)
- Description doesn't affect search ranking (keywords do)
- Competitive keywords: "atomic habits", "productive", "streaks"
- Update promotional text for sales, new features, press mentions

---

#### Story 6.3: App Screenshots & Preview Video
**As a** potential user
**I want to** see the app in action before downloading
**So that** I know if it fits my needs

**Prerequisites:**
- App UI finalized and polished
- Key features implemented and working
- Device for screenshots (iPhone 14 Pro Max recommended for largest size)

**Acceptance Criteria:**
1. **Screenshots** (2-10 images, min 3 required):
   - iPhone 6.7" (1290 x 2796): Required, scales to smaller devices
   - Include text overlays highlighting features
   - Screenshot 1: Home screen with habits and strength indicators (hero shot)
   - Screenshot 2: Habit strength visualization with science explanation
   - Screenshot 3: Analytics dashboard (premium features)
   - Screenshot 4: Predictions and insights
   - Screenshot 5: Clean, beautiful design showcase
2. **Design guidelines**:
   - High contrast, readable text on overlays
   - Show real data (not Lorem Ipsum)
   - Consistent color scheme matching app
   - Text describes benefit, not just feature ("See exactly when habits become automatic")
3. **App Preview video** (optional, recommended):
   - 15-30 seconds showing core flow
   - Check off habit → strength updates → insight revealed
   - No audio required (use captions)
   - Export as .mov or .mp4, max 500MB

**Technical Notes:**
- Tools: Figma/Sketch for mockups, or real screenshots + overlay tool
- Screenshot services: App Store Screenshot Builder, Previewed.app
- Video capture: QuickTime screen recording on simulator, edit in iMovie/Final Cut
- Localization: Can provide screenshots per language later
- First 3 screenshots most important (visible without scrolling)

---

#### Story 6.4: App Icon & Visual Assets
**As a** user
**I want to** recognize the app by its icon
**So that** I can find it easily on my home screen

**Prerequisites:**
- Brand identity established (colors, style)
- Design system finalized

**Acceptance Criteria:**
1. **App Icon** (1024x1024px):
   - Simple, recognizable design (works at small sizes)
   - No transparency (solid background required)
   - No text (iOS design guidelines)
   - Reflects brand: Growth/strength theme (e.g., upward arrow, plant, strength symbol)
   - Export all required sizes via Xcode asset catalog
2. **Icon alternatives** for iOS 18+ (optional):
   - Light/dark mode variants
   - Tinted icon option
3. **Launch screen**:
   - Simple splash (app icon + background)
   - No loading indicators (Apple guideline)
   - Displays while app loads
4. **Design review**:
   - Test icon at various sizes (home screen, notifications, settings)
   - Ensure stands out among similar apps
   - Get feedback from beta testers

**Technical Notes:**
- Icon generator: appicon.co or use Xcode asset catalog
- Avoid gradients that don't scale well
- Competitive analysis: Check top habit tracker icons
- Consistency: Icon colors should match app color scheme
- Rejection risk: Icons with screenshots, Android-style, or misleading imagery

---

#### Story 6.5: Privacy Policy & Terms of Service
**As a** user concerned about privacy
**I want to** understand how my data is used
**So that** I can trust the app

**Prerequisites:**
- Data collection practices documented
- Legal entity established (or personal name)

**Acceptance Criteria:**
1. **Privacy Policy** (hosted on web):
   - What data collected: Habit names, completion timestamps, device ID, email (if auth)
   - How data used: App functionality only, no third-party sharing
   - Data storage: Convex backend, encrypted at rest
   - User rights: Access, export, delete (GDPR/CCPA compliance)
   - Contact information: Email for privacy inquiries
   - Effective date and update policy
2. **Terms of Service**:
   - License grant: Users can use app, not reverse engineer
   - Subscription terms: Pricing, renewal, cancellation policy
   - Disclaimer: No medical advice, informational purposes only
   - Limitation of liability: Standard legal protections
   - Governing law: Your jurisdiction
3. **Hosting**:
   - Privacy policy URL: https://yourwebsite.com/privacy
   - Terms URL: https://yourwebsite.com/terms
   - Both accessible without login
   - Both linked in app (Settings screen)
4. **App Store Privacy Labels** (configured in App Store Connect):
   - Data Used to Track You: None (no third-party tracking)
   - Data Linked to You: User ID, health data (habits)
   - Data Not Linked to You: Crash data, diagnostics

**Technical Notes:**
- Generator tools: Termly, iubenda, or custom template
- Host on: GitHub Pages (free), your domain, or Carrd
- Review: Have lawyer review if budget allows
- Update requirement: Notify users of material changes
- Rejection risk: Missing privacy policy or incorrect labels

---

#### Story 6.6: TestFlight Beta Testing
**As a** developer
**I want to** test the app with real users before public launch
**So that** I can catch bugs and gather feedback

**Prerequisites:**
- App Store Connect configured (Story 6.1)
- App builds successfully in release mode
- Crash reporting configured (Sentry or similar)

**Acceptance Criteria:**
1. **Internal testing** (up to 100 testers):
   - Upload first build to TestFlight via Xcode or Fastlane
   - Add internal testers (teammates, if any)
   - Verify app installs and runs on real devices
   - Test all critical flows (create habit, check off, view strength)
2. **External testing** (up to 10,000 testers):
   - Submit build for Beta App Review (Apple reviews TestFlight builds)
   - Add external testers by email or public link
   - Target: 50+ beta testers from r/productivity, Product Hunt "upcoming"
   - Collect feedback via TestFlight feedback or Google Form
3. **Testing focus areas**:
   - Onboarding flow (when added in Epic 5)
   - Habit creation and tracking
   - Strength calculation accuracy
   - Subscription purchase flow
   - Crash-free rate >99%
4. **Iteration**:
   - Fix critical bugs found in beta
   - Upload new builds (version increments)
   - Re-test on fixes before final submission

**Technical Notes:**
- Xcode: Archive → Distribute → TestFlight
- Fastlane: Automate builds with fastlane deliver
- Beta review time: 24-48 hours typically
- Version numbering: 1.0 (build 1), 1.0 (build 2), etc.
- Crash reporting: Sentry, Crashlytics, or TestFlight built-in
- Feedback: TestFlight feedback mechanism + custom survey

---

#### Story 6.7: App Review Preparation & Submission
**As a** developer
**I want to** pass App Review on first try
**So that** I can launch without delays

**Prerequisites:**
- All Epic 1-5 features complete and polished
- TestFlight beta completed with feedback addressed
- All metadata and assets finalized

**Acceptance Criteria:**
1. **Pre-submission checklist**:
   - ✅ App builds without warnings in release mode
   - ✅ No crashes in critical flows (tested via TestFlight)
   - ✅ Subscription flow works end-to-end (sandbox tested)
   - ✅ All placeholder text removed
   - ✅ Privacy policy and terms linked in app
   - ✅ App Store Connect metadata complete
   - ✅ Screenshots show actual app (not mockups)
   - ✅ Age rating accurate
2. **Demo account** (for reviewers):
   - Email: reviewer@habitstrengthapp.com (or similar)
   - Password: Provided in "App Review Information"
   - Account has sample data (3-5 habits with history)
   - Premium subscription active (sandbox environment)
3. **Review notes** (App Review Information section):
   - Explain science-backed features ("Uses Lally et al. habit formation model")
   - Subscription testing: "Use sandbox test account to test premium features"
   - Special instructions: "Create habit → check off to see strength calculation"
   - Backend: "Uses Convex backend for real-time sync"
4. **Common rejection reasons avoided**:
   - ❌ Crashes or major bugs
   - ❌ Incomplete functionality ("coming soon" features)
   - ❌ Misleading metadata (screenshots don't match app)
   - ❌ Subscription issues (unclear pricing, can't cancel)
   - ❌ Privacy violations (data collection not disclosed)
   - ❌ Guideline 4.2: Minimum functionality (app does too little)
5. **Submission**:
   - Build selected in App Store Connect
   - "Manually release" selected (control launch timing)
   - Export compliance completed
   - Submit for Review button pressed
   - Monitor review status daily

**Technical Notes:**
- Review time: 24-48 hours typical, can be 7+ days
- Rejection: Address issues, resubmit with notes explaining fixes
- Expedited review: Available in emergencies (use sparingly)
- Release: "Manually release" lets you control launch timing (press releases, social posts)
- Binary rejection: Requires new build upload
- Metadata rejection: Can fix without new build

---

#### Story 6.8: Launch Day Preparation & Monitoring
**As a** developer launching publicly
**I want to** ensure smooth launch and catch issues immediately
**So that** first impressions are positive

**Prerequisites:**
- App approved by Apple (Story 6.7)
- Monitoring and analytics configured
- Support infrastructure ready

**Acceptance Criteria:**
1. **Pre-launch**:
   - Press release drafted (if applicable)
   - Product Hunt submission prepared
   - Reddit posts scheduled (r/productivity, r/getdisciplined)
   - Twitter/X announcement ready
   - Friends/family mobilized to download and review
   - Support email monitored: support@habitstrengthapp.com
2. **Launch timing**:
   - Release early morning Tuesday-Thursday (best engagement)
   - Avoid Fridays (support burden over weekend)
   - "Manually release this version" → click "Release" button in App Store Connect
   - App appears in App Store within 2-4 hours
3. **Launch day monitoring**:
   - Watch crash reports (Sentry/Crashlytics)
   - Monitor App Store reviews (respond within 24 hours)
   - Check server health (Convex dashboard)
   - Track downloads (App Store Connect analytics)
   - Subscription conversions (RevenueCat or App Store Connect)
4. **First 24-hour goals**:
   - >100 downloads
   - <1% crash rate
   - At least 5 positive reviews (from beta testers/early supporters)
   - No critical bugs reported
   - First paying subscriber
5. **Post-launch**:
   - Thank beta testers publicly
   - Share launch results on social media
   - Begin collecting user feedback for v1.1
   - Monitor support emails and respond promptly
   - Iterate on App Store metadata based on conversion rates

**Technical Notes:**
- Analytics: App Store Connect Analytics + internal (Mixpanel, Amplitude)
- Monitoring: Set up alerts for crash rate >1%, server errors
- Support: Use Intercom, Help Scout, or plain email
- Reviews: Respond professionally, never argue, take feedback seriously
- Hotfix: If critical bug found, prepare 1.0.1 emergency update
- Promotion: Use free channels first (Reddit, Product Hunt, Twitter)

---

## Out of Scope (Future Phases)

Features intentionally excluded from v1.0 to maintain solo dev velocity and revenue focus:

