# Implementation Checklist ✅

Track your progress as you implement UX improvements and monetization features.

---

## Month 1: Foundation (Weeks 1-4)

### Week 1: UX Quick Wins Part 1

#### Onboarding Flow (2-3 hours)
- [ ] Install `@react-native-async-storage/async-storage`
- [ ] Create `src/screens/onboarding/WelcomeScreen.tsx`
- [ ] Create `src/screens/onboarding/FirstHabitGuide.tsx`
- [ ] Create `src/hooks/useOnboarding.ts`
- [ ] Integrate into `App.tsx`
- [ ] Test first-time user flow
- [ ] Test skip functionality
- [ ] Test habit creation from onboarding
- [ ] Verify onboarding doesn't show again after completion

**Success Criteria**: New users see onboarding, can create first habit easily

---

#### Quick Add Sheet (1-2 hours)
- [ ] Create `src/components/QuickAddHabitSheet.tsx`
- [ ] Implement emoji detection logic
- [ ] Add bottom sheet animation
- [ ] Update FAB press handler in `App.tsx`
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Verify emoji auto-detection works
- [ ] Test keyboard behavior

**Success Criteria**: Users can create habits in <10 seconds

---

### Week 2: UX Quick Wins Part 2

#### Template Expansion (2 hours)
- [ ] Open `convex/templates.ts`
- [ ] Add Health & Fitness templates (10)
- [ ] Add Mindfulness templates (8)
- [ ] Add Productivity templates (12)
- [ ] Add Finance templates (6)
- [ ] Add Relationships templates (5)
- [ ] Add premium-only flag to advanced templates
- [ ] Deploy Convex changes
- [ ] Update `src/screens/TemplatesScreen.tsx` with categories
- [ ] Test template selection
- [ ] Verify premium gating works

**Success Criteria**: 50+ templates available, categorized properly

---

#### Smart Notifications (3 hours)
- [ ] Create `src/services/NotificationService.ts`
- [ ] Implement permission request flow
- [ ] Add daily check-in scheduling
- [ ] Add habit-specific reminders
- [ ] Add smart nudge for at-risk habits
- [ ] Add milestone celebration notifications
- [ ] Integrate notification handler in `App.tsx`
- [ ] Test notification permissions
- [ ] Test daily check-in (set for 1 minute from now)
- [ ] Test habit reminders
- [ ] Verify notifications navigate correctly

**Success Criteria**: Users receive timely, helpful notifications

---

### Week 3: Monetization Setup

#### RevenueCat Integration (2 hours)
- [ ] Sign up for RevenueCat account
- [ ] Create iOS app in RevenueCat dashboard
- [ ] Create Android app in RevenueCat dashboard
- [ ] Configure products:
  - [ ] Monthly: $4.99
  - [ ] Annual: $39.99 (with 7-day trial)
- [ ] Get API keys (iOS & Android)
- [ ] Install `react-native-purchases`
- [ ] Run `npx pod-install` (iOS)
- [ ] Add API keys to `.env`:
  ```
  EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_key
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_key
  ```
- [ ] Initialize RevenueCat in `App.tsx`
- [ ] Test connection to RevenueCat

**Success Criteria**: RevenueCat configured and connected

---

#### Premium Paywall Screen (3 hours)
- [ ] Create `src/screens/PaywallScreen.tsx`
- [ ] Design features list UI
- [ ] Implement pricing cards
- [ ] Add purchase flow
- [ ] Add 7-day trial messaging
- [ ] Add social proof elements
- [ ] Add restore purchases button
- [ ] Test in sandbox mode (iOS)
- [ ] Test in sandbox mode (Android)
- [ ] Test purchase cancellation
- [ ] Test trial activation

**Success Criteria**: Beautiful paywall, purchases work in test mode

---

### Week 4: Premium Features & Testing

#### Premium Feature Gating (2 hours)
- [ ] Create `src/hooks/usePremium.ts`
- [ ] Update existing premium checks:
  - [ ] Analytics screen (show upgrade prompt)
  - [ ] Predictions (show upgrade prompt)
  - [ ] Advanced templates (locked)
  - [ ] Data export (locked)
- [ ] Add premium badge component
- [ ] Test free user experience
- [ ] Test premium user experience
- [ ] Verify unlock after purchase

**Success Criteria**: Free users see upgrade prompts, premium users see all features

---

#### Upgrade Prompts (2 hours)
- [ ] Create `src/components/UpgradePrompt.tsx`
- [ ] Add triggers:
  - [ ] After 7-day streak
  - [ ] After creating 5th habit
  - [ ] After 3 analytics views
  - [ ] When inviting 2nd partner
- [ ] Design beautiful prompt UI
- [ ] Add "Not now" option
- [ ] Add "Start trial" CTA
- [ ] Test each trigger
- [ ] Track prompt views in analytics

**Success Criteria**: Strategic prompts appear at high-intent moments

---

#### Testing & Polish (2 hours)
- [ ] Full QA pass on iOS
- [ ] Full QA pass on Android
- [ ] Test onboarding → quick add → paywall flow
- [ ] Test free → premium upgrade flow
- [ ] Test notifications
- [ ] Fix any bugs found
- [ ] Check app performance
- [ ] Verify analytics tracking
- [ ] Test edge cases
- [ ] Get team feedback

**Success Criteria**: No critical bugs, smooth user experience

---

## Month 2: Engagement (Weeks 5-8)

### Week 5-6: Gamification System

#### XP & Levels (6 hours)
- [ ] Create Convex schema for XP system:
  ```typescript
  xp: v.optional(v.number()),
  level: v.optional(v.number()),
  ```
- [ ] Create `convex/gamification.ts`:
  - [ ] `awardXP` mutation
  - [ ] `calculateLevel` helper
  - [ ] `getXPProgress` query
- [ ] Create `src/components/LevelProgressBar.tsx`
- [ ] Award XP on habit completion (10 XP)
- [ ] Award bonus XP on streaks:
  - [ ] 7 days: +20 XP
  - [ ] 30 days: +100 XP
  - [ ] 100 days: +500 XP
- [ ] Add level-up animation
- [ ] Show XP on home screen
- [ ] Test XP awarding
- [ ] Test level progression

**Success Criteria**: Users earn XP and level up

---

#### Achievements & Badges (6 hours)
- [ ] Design badge system (30+ badges)
- [ ] Create Convex schema:
  ```typescript
  achievements: v.array(v.object({
    id: v.string(),
    unlockedAt: v.number(),
  })),
  ```
- [ ] Create `src/screens/AchievementsScreen.tsx`
- [ ] Create `src/components/BadgeShowcase.tsx`
- [ ] Implement badge checking logic
- [ ] Add badge unlock animations
- [ ] Show badge notifications
- [ ] Add navigation from home screen
- [ ] Test all badge triggers
- [ ] Verify badge persistence

**Success Criteria**: Users unlock and collect badges

---

### Week 7-8: Social Features MVP

#### Accountability Partners (8 hours)
- [ ] Create Convex schema:
  ```typescript
  accountabilityPartners: defineTable({
    userId: v.id('users'),
    partnerId: v.id('users'),
    habitId: v.id('habits'),
    status: v.union(v.literal('pending'), v.literal('active')),
  })
  ```
- [ ] Create `convex/social.ts`:
  - [ ] `invitePartner` mutation
  - [ ] `acceptInvite` mutation
  - [ ] `getPartners` query
- [ ] Create `src/components/InvitePartnerSheet.tsx`
- [ ] Add partner invite flow
- [ ] Show partner completions
- [ ] Add encouragement reactions
- [ ] Test invite flow
- [ ] Test acceptance flow
- [ ] Limit to 1 partner (free) / unlimited (premium)

**Success Criteria**: Users can invite and track with partners

---

#### Habit Sharing (4 hours)
- [ ] Create `src/components/HabitShareSheet.tsx`
- [ ] Implement share to social media
- [ ] Generate share cards with stats
- [ ] Add "Share Progress" button to habit detail
- [ ] Test share on iOS
- [ ] Test share on Android
- [ ] Verify share card renders correctly

**Success Criteria**: Users can share habits and progress

---

#### Reactions & Encouragement (4 hours)
- [ ] Create reactions system (🔥, 💪, 👏, ❤️)
- [ ] Add reaction buttons to partner view
- [ ] Show received reactions
- [ ] Send notification on reaction
- [ ] Test sending reactions
- [ ] Test receiving reactions
- [ ] Verify notifications work

**Success Criteria**: Partners can encourage each other

---

## Month 3: Scale (Weeks 9-12)

### Week 9-10: Advanced Analytics

#### Analytics Dashboard (8 hours)
- [ ] Expand `src/screens/AnalyticsScreen.tsx`
- [ ] Add tabs:
  - [ ] Overview
  - [ ] Habit Deep Dive
  - [ ] Insights
  - [ ] Comparisons
- [ ] Create `src/components/analytics/HeatmapCalendar.tsx`
- [ ] Create `src/components/analytics/ComparisonChart.tsx`
- [ ] Create `src/components/analytics/InsightsCard.tsx`
- [ ] Add data export feature (CSV)
- [ ] Gate behind premium
- [ ] Test all chart types
- [ ] Verify export works

**Success Criteria**: Rich analytics for premium users

---

### Week 11-12: Revenue Diversification

#### Affiliate Integration (6 hours)
- [ ] Sign up for Amazon Associates
- [ ] Create affiliate link generator
- [ ] Add "Recommendations" section to habit detail
- [ ] Match products to habit types:
  - [ ] Reading → Book recommendations
  - [ ] Exercise → Equipment recommendations
  - [ ] Meditation → App recommendations
- [ ] Test affiliate links
- [ ] Track click-through rates

**Success Criteria**: Relevant product recommendations appear

---

#### One-Time Purchases (4 hours)
- [ ] Create in-app products in App Store Connect
- [ ] Configure in RevenueCat:
  - [ ] Theme Pack: $2.99
  - [ ] Template Bundle: $1.99
  - [ ] Badge Collection: $0.99
- [ ] Create purchase UI
- [ ] Test purchases
- [ ] Verify unlocks work

**Success Criteria**: Users can buy individual items

---

#### Premium Template Bundles (2 hours)
- [ ] Create 20 premium templates
- [ ] Gate behind premium/purchase
- [ ] Add "Premium Templates" section
- [ ] Show unlock prompt
- [ ] Test premium access
- [ ] Test one-time purchase access

**Success Criteria**: Additional monetization option available

---

## Analytics Setup

### Install Analytics Tools
- [ ] Choose analytics platform:
  - [ ] Mixpanel (recommended)
  - [ ] Amplitude
  - [ ] PostHog
- [ ] Install SDK
- [ ] Set up events:
  - [ ] `onboarding_started`
  - [ ] `onboarding_completed`
  - [ ] `habit_created`
  - [ ] `habit_completed`
  - [ ] `paywall_viewed`
  - [ ] `trial_started`
  - [ ] `subscription_purchased`
  - [ ] `feature_used`
- [ ] Test event tracking
- [ ] Create dashboard

**Success Criteria**: All key events tracked

---

## A/B Testing Setup

### Configure Testing Platform
- [ ] Choose A/B testing tool:
  - [ ] LaunchDarkly
  - [ ] Optimizely
  - [ ] PostHog
- [ ] Set up feature flags
- [ ] Plan first tests:
  - [ ] Onboarding variations
  - [ ] Paywall pricing
  - [ ] Trial length
  - [ ] Notification timing
- [ ] Implement flag checks
- [ ] Test flag toggling

**Success Criteria**: Can run experiments easily

---

## App Store Optimization

### Listing Optimization
- [ ] Update app description
- [ ] Highlight new features:
  - [ ] "Smart onboarding"
  - [ ] "Quick habit creation"
  - [ ] "Advanced analytics"
  - [ ] "Social accountability"
- [ ] Create new screenshots:
  - [ ] Onboarding screens
  - [ ] Analytics dashboard
  - [ ] Gamification features
- [ ] Update app preview video
- [ ] Optimize keywords
- [ ] Submit for review

**Success Criteria**: Improved app store presence

---

## Marketing Launch

### Content Creation
- [ ] Write blog post announcing features
- [ ] Create social media posts
- [ ] Make demo video
- [ ] Write email to existing users
- [ ] Create press release
- [ ] Submit to Product Hunt

**Success Criteria**: Feature launch promoted

---

## Success Metrics Tracking

### Week 1 Check-in
- [ ] Track onboarding completion rate
- [ ] Track quick add usage
- [ ] Track template selection rate
- [ ] Review user feedback

### Week 4 Check-in
- [ ] Track free trial starts
- [ ] Track conversion rate
- [ ] Calculate MRR
- [ ] Track retention rates
- [ ] Review crash reports

### Month 2 Check-in
- [ ] Track XP engagement
- [ ] Track badge unlocks
- [ ] Track social feature usage
- [ ] Measure retention improvement
- [ ] Adjust based on data

### Month 3 Check-in
- [ ] Track analytics usage
- [ ] Track affiliate clicks
- [ ] Track one-time purchases
- [ ] Calculate total revenue
- [ ] Plan next quarter

---

## Support & Documentation

### User-Facing
- [ ] Update in-app help
- [ ] Create FAQ section
- [ ] Write feature tutorials
- [ ] Update Terms of Service
- [ ] Update Privacy Policy

### Internal
- [ ] Document all new code
- [ ] Write testing guides
- [ ] Create troubleshooting docs
- [ ] Train customer support
- [ ] Create admin tools

---

## Launch Readiness

### Pre-Launch Checklist
- [ ] All features tested on iOS
- [ ] All features tested on Android
- [ ] All features tested on web (if applicable)
- [ ] No critical bugs
- [ ] Performance is good (<2s load)
- [ ] Analytics tracking works
- [ ] Crash rate <1%
- [ ] Customer support ready
- [ ] Marketing materials ready
- [ ] Team aligned on launch

### Launch Day
- [ ] Submit app update
- [ ] Monitor crash reports
- [ ] Watch analytics dashboard
- [ ] Respond to user feedback
- [ ] Fix any urgent issues
- [ ] Post on social media
- [ ] Send announcement email

### Post-Launch (Week 1)
- [ ] Daily metrics review
- [ ] User feedback analysis
- [ ] Bug fix sprint
- [ ] Iterate based on data
- [ ] Plan next features

---

## Celebration Milestones 🎉

Track and celebrate your wins!

- [ ] ✅ First onboarding completion
- [ ] ✅ First quick add usage
- [ ] ✅ First premium subscription
- [ ] ✅ 10 premium subscribers
- [ ] ✅ $1K MRR
- [ ] ✅ $5K MRR
- [ ] ✅ 1,000 active users
- [ ] ✅ 4.5 app store rating
- [ ] ✅ First viral share
- [ ] ✅ First enterprise customer
- [ ] ✅ $10K MRR
- [ ] ✅ 5,000 active users
- [ ] ✅ $35K MRR
- [ ] ✅ Team hire #1
- [ ] ✅ Profitability 🚀

---

## Notes & Learnings

Use this space to track insights, user feedback, and learnings:

```
Week 1:
- 

Week 2:
- 

Week 3:
- 

Week 4:
- 

Ongoing:
- 
```

---

## Questions & Blockers

Track issues as they come up:

```
[ ] Issue: 
    Solution: 

[ ] Blocker: 
    Workaround: 
```

---

## Contact & Resources

**Documentation**:
- `/docs/UX_AND_MONETIZATION_ROADMAP.md` - Full strategy
- `/docs/QUICK_START_IMPLEMENTATION.md` - Code examples
- `/docs/FEATURE_PRIORITIZATION_MATRIX.md` - Decision framework
- `/docs/EXECUTIVE_SUMMARY.md` - Overview

**Support**:
- RevenueCat Docs: https://docs.revenuecat.com
- Expo Notifications: https://docs.expo.dev/versions/latest/sdk/notifications/
- React Native: https://reactnative.dev

**Community**:
- Join indie maker communities
- Share progress on Twitter
- Get feedback from users
- Learn from other habit apps

---

**Last Updated**: November 14, 2025  
**Next Review**: After Month 1 completion

Good luck! You've got this! 🚀
