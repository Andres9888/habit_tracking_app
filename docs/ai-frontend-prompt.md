# AI Frontend Development Prompt
**Generated:** 2025-10-27
**Project:** Habit Tracker with Science-Backed Intelligence
**Platform:** React Native (iOS-first)

---

## Project Overview

You are building a **premium habit tracking mobile app** that combines cutting-edge behavioral science with elegant, intuitive design. The app leverages peer-reviewed research (Zhang et al. 2021, Lally et al. 2010) to compute real habit strength and predict future behavior with 65-77% accuracy.

**Unique Value Proposition:**
- Science-backed intelligence with computational models for habit prediction
- Beautiful, flexible UX (Productive-level design quality)
- Insight-driven analytics showing true habit automaticity (not just streaks)
- Premium subscription model justified by unique scientific features

**Target Users:** Productivity-focused professionals and behavior change enthusiasts who value evidence-based approaches over gamification.

**Revenue Model:** Subscription-based ($7-10/month or $79.99/year) with freemium tier (3 habits max)

---

## Technical Stack

**Platform:** React Native
**Backend:** Convex (already implemented with habit strength algorithms)
**Existing Components:**
- CreateHabitModal
- ColorPickerSheet
- HabitStrengthIndicator

**Key Technologies:**
- React Native Gesture Handler (swipe gestures)
- React Native Reanimated (60fps animations)
- Victory Native (charts and visualizations)
- AsyncStorage (offline persistence)
- StoreKit 2 / react-native-iap (subscriptions)

---

## Design System Foundation

### Color Palette
- **Primary:** Greens (growth theme) - #2ECC71, #27AE60
- **Secondary:** Blues (trust) - #3498DB, #2980B9
- **Neutral:** Grays for backgrounds and text
- **Success:** Green shades
- **Error:** Red for destructive actions

### Typography
- **Font Family:** SF Pro (iOS native)
- **Sizes:** H1 (32px), H2 (24px), H3 (20px), Body (16px), Caption (14px)
- **Weights:** Regular (400), Medium (500), Bold (700)

### Spacing System
- **8pt Grid:** All spacing uses multiples of 8 (8, 16, 24, 32, 48, 64)
- **Touch Targets:** Minimum 44x44pt for all tappable elements

### Animation Principles
- **Spring Physics:** Use Reanimated with consistent spring parameters
- **60fps Performance:** All animations use native driver
- **Reduce Motion:** Respect iOS accessibility setting (fallback to fades)

---

## Core Features to Implement

### Epic 1: MVP Foundation (Priority 1)

#### 1. Habit Creation Flow
**User Story:** As a new user, I want to create my first habit with customization options.

**UI Components Needed:**
```
<CreateHabitModal>
  <Input name="habitName" maxLength={50} required />
  <Input name="description" maxLength={200} multiline optional />
  <ColorPickerSheet colors={presetColors} />
  <IconSelector icons={20+} />
  <FrequencyPicker options={['daily', 'custom']} />
  <Button label="Create Habit" onPress={handleCreate} />
</CreateHabitModal>
```

**Key Behaviors:**
- "Create" button disabled until name provided
- Optimistic UI updates for instant feedback
- Form validation with Zod schema
- Accessibility: All inputs labeled for VoiceOver

---

#### 2. Daily Habit Check-Off
**User Story:** As a user, I want to quickly check off habits with gestures.

**UI Components:**
```
<HabitList>
  <HabitCard
    onSwipeRight={markComplete}
    onTap={toggleCompletion}
    completed={habit.completedToday}
  >
    <HabitIcon icon={habit.icon} color={habit.color} />
    <HabitName>{habit.name}</HabitName>
    <StrengthIndicator strength={habit.strength} compact />
    <CheckmarkAnimation visible={habit.completedToday} />
  </HabitCard>
</HabitList>
```

**Key Behaviors:**
- Swipe right to mark complete (animated checkmark)
- Tap to toggle completion state (check/uncheck)
- Completed habits show visual distinction (checkmark icon, muted color)
- Haptic feedback on both completion and uncheck
- Works offline with local-first architecture

---

#### 3. Habit Strength Visual Indicators
**User Story:** As a user, I want to see strength displayed with intuitive visuals.

**UI Components:**
```
<HabitStrengthIndicator
  strength={0.65} // 0-1 scale
  strengthLevel="Strong" // Starting, Building, Developing, Strong, Automatic
  compact={false}
  showLabel={true}
>
  <Emoji level={strengthLevel} /> // 🌱 🌿 🌳 💪 ⚡
  <ProgressBar
    percentage={strength * 100}
    color={getColorByLevel(strengthLevel)}
    animated
  />
  <PercentageText>{(strength * 100).toFixed(0)}%</PercentageText>
  <LevelLabel>{strengthLevel}</LevelLabel>
</HabitStrengthIndicator>
```

**Key Behaviors:**
- Emoji mapping: 🌱 Starting, 🌿 Building, 🌳 Developing, 💪 Strong, ⚡ Automatic
- Progress bar fills left-to-right with green gradient
- Smooth animations using spring physics
- Accessibility: Screen reader announces "Meditation habit, 45% strength, Building level"

---

#### 4. Home Screen Layout
**User Story:** As a user, I want to see today's habits at a glance.

**Screen Structure:**
```
<HomeScreen>
  <Header>
    <DateDisplay>{formatDate(today)}</DateDisplay>
    <SettingsButton />
  </Header>

  <ScrollView>
    <DailySummaryCard>
      <CompletedCount>{completedToday}/{totalHabits}</CompletedCount>
      <ProgressRing percentage={completionPercentage} />
    </DailySummaryCard>

    <HabitList>
      {habits.map(habit => <HabitCard key={habit.id} {...habit} />)}
    </HabitList>
  </ScrollView>

  <FAB onPress={openCreateHabitModal} icon="plus" />
</HomeScreen>
```

---

### Epic 2: Premium Monetization (Priority 2)

#### 5. Subscription Paywall
**User Story:** As a free user, I want to understand premium value before hitting limits.

**UI Components:**
```
<PaywallModal>
  <Header>
    <Headline>Unlock Your Full Potential</Headline>
    <SubHeadline>Science-backed insights to build automatic habits</SubHeadline>
  </Header>

  <FeatureComparison>
    <FeatureRow>
      <FeatureName>Track Habits</FeatureName>
      <FreeValue>Up to 3</FreeValue>
      <PremiumValue>Unlimited</PremiumValue>
    </FeatureRow>
    <FeatureRow>
      <FeatureName>Habit Strength</FeatureName>
      <FreeValue>Basic</FreeValue>
      <PremiumValue>Full analytics</PremiumValue>
    </FeatureRow>
    <FeatureRow locked>
      <FeatureName>Behavior Predictions</FeatureName>
      <FreeValue>—</FreeValue>
      <PremiumValue>✓</PremiumValue>
    </FeatureRow>
  </FeatureComparison>

  <PricingOptions>
    <SubscriptionCard
      title="Monthly"
      price="$9.99/month"
      trialText="7-day free trial"
      selected={selectedPlan === 'monthly'}
      onPress={() => setSelectedPlan('monthly')}
    />
    <SubscriptionCard
      title="Annual"
      price="$79.99/year"
      savings="Save 33%"
      trialText="7-day free trial"
      selected={selectedPlan === 'annual'}
      onPress={() => setSelectedPlan('annual')}
    />
  </PricingOptions>

  <CTAButton onPress={startFreeTrial}>
    Start 7-Day Free Trial
  </CTAButton>

  <LegalText>Cancel anytime. Terms apply.</LegalText>
  <RestoreButton onPress={restorePurchases}>Restore Purchases</RestoreButton>
  <DismissButton onPress={dismiss}>Maybe Later</DismissButton>
</PaywallModal>
```

**Key Behaviors:**
- Soft paywall (users can dismiss)
- Triggers on: creating 4th habit, day 7 of usage, tapping locked features
- Premium features show preview with "Premium" badge

---

#### 6. Analytics Dashboard (Premium)
**User Story:** As a premium subscriber, I want to see advanced analytics.

**UI Components:**
```
<AnalyticsDashboard>
  <StatsOverview>
    <StatCard label="Total Habits" value={totalHabits} />
    <StatCard label="Avg Strength" value={`${avgStrength}%`} />
    <StatCard label="Strongest" value={strongestHabit.name} />
    <StatCard label="Weakest" value={weakestHabit.name} />
  </StatsOverview>

  <StrengthDistributionChart>
    <DonutChart
      data={habitsByLevel}
      colors={levelColors}
      centerLabel="Distribution"
    />
  </StrengthDistributionChart>

  <TrendGraph>
    <LineChart
      data={strengthOverTime}
      xAxis="Date"
      yAxis="Avg Strength %"
      period={selectedPeriod} // 7, 30, 90, all
    />
  </TrendGraph>

  <ComplianceHeatmap>
    <CalendarGrid
      data={completionsByDay}
      colorScale={greenGradient}
      style="github"
    />
  </ComplianceHeatmap>

  <HabitRankingList>
    {habits.map(h => (
      <RankingRow
        name={h.name}
        strength={h.strength}
        level={h.strengthLevel}
      />
    ))}
  </HabitRankingList>
</AnalyticsDashboard>
```

**Key Behaviors:**
- Time period selector (7, 30, 90 days, all time)
- Charts use Victory Native
- Premium badge shown to free users

---

### Epic 5: Polish & Scale (Priority 3)

#### 7. Onboarding Flow (Post-MVP)
**User Story:** As a first-time user, I want to understand the science-backed approach.

**UI Components:**
```
<OnboardingFlow>
  <Screen1>
    <Illustration src={automaticityCurve} />
    <Headline>Real Habit Science, Not Just Streaks</Headline>
    <Body>Based on peer-reviewed research, habits become automatic after ~90 days of consistent practice.</Body>
    <NextButton />
  </Screen1>

  <Screen2>
    <Headline>See It In Action</Headline>
    <InteractiveDemo>
      <DemoHabit name="Morning Run" />
      <TapToComplete onPress={demoComplete} />
      <StrengthUpdate from={0} to={3} animated />
    </InteractiveDemo>
    <NextButton />
  </Screen2>

  <Screen3>
    <Headline>Get Started</Headline>
    <PermissionRequest type="notifications" />
    <CTAButton>Create Your First Habit</CTAButton>
  </Screen3>

  <SkipButton />
  <ProgressDots current={currentScreen} total={3} />
</OnboardingFlow>
```

---

## UX Principles (CRITICAL)

### 1. Science Made Beautiful
- Visualize habit strength curves with elegant graphics
- Every scientific concept gets a visual metaphor
- Automaticity progression shown with growth imagery

### 2. Calm Confidence Over Gamification
- No gimmicky badges or fake achievements
- Refined visual design with subtle animations
- Sophisticated color palettes (premium quality)
- Progress feedback is meaningful (automaticity milestones) not arbitrary (streaks)

### 3. Effortless Daily Rituals
- Core tracking requires zero cognitive load
- Swipe to check-off, tap to toggle (check/uncheck), drag to reorder
- Morning check-in takes <30 seconds
- One-handed use, thumb-friendly tap targets

### 4. Data Transparency Builds Trust
- Always show the "why" behind calculations
- When displaying habit strength, reveal: baseline (time-based) × compliance (recent performance)
- Give users control to recalculate, view history, export data

### 5. Premium Features Feel Indispensable
- Free tier is genuinely useful (3 habits with basic strength)
- Premium unlocks capabilities that fundamentally change the experience
- Paywall moment feels like unlocking superpowers

---

## Accessibility Requirements

1. **VoiceOver Support**
   - All interactive elements labeled
   - Screen reader announces habit strength and level
   - Navigation makes sense in linear order

2. **Dynamic Type**
   - All text respects iOS text size settings
   - Layouts adapt without breaking

3. **Contrast Ratios**
   - Minimum 4.5:1 for normal text
   - 3:1 for large text (WCAG AA)
   - Color not sole indicator (use icons + color)

4. **Touch Targets**
   - Minimum 44x44pt for all tappable elements
   - Adequate spacing between adjacent buttons

5. **Reduce Motion**
   - Animations fall back to simple fades when setting enabled

---

## Performance Requirements

- **Cold Start:** App launches in <2 seconds
- **Hot Start:** Resume from background in <500ms
- **UI Rendering:** Maintain 60fps during scrolling, animations, gestures
- **Memory Usage:** <100MB RAM during normal usage
- **Offline-First:** Works without internet, syncs when available

---

## Implementation Priorities

### Phase 1: Core MVP (Weeks 1-8)
1. Habit creation flow
2. Daily check-off with gestures
3. Habit strength calculation and display
4. Local data persistence
5. Basic design system

### Phase 2: Monetization (Weeks 9-16)
1. Subscription integration (StoreKit)
2. Paywall implementation
3. Analytics dashboard
4. Premium feature gates

### Phase 3: Polish (Weeks 17-24)
1. Onboarding flow
2. Advanced animations
3. Performance optimization
4. Accessibility improvements

---

## Code Generation Guidelines

When generating code:

1. **Use TypeScript** for type safety
2. **Follow React Native best practices**
   - Functional components with hooks
   - React.memo for optimization
   - Custom hooks for shared logic
3. **Styling**
   - Use StyleSheet or styled-components
   - Follow 8pt grid system
   - Use design tokens from theme
4. **Accessibility**
   - Add accessibilityLabel to all interactive elements
   - Use accessibilityRole appropriately
5. **Performance**
   - Use FlatList for long lists (virtualization)
   - Optimize images (WebP format)
   - Use native driver for animations
6. **Testing**
   - Write unit tests for business logic
   - Test accessibility with VoiceOver

---

## Backend Integration (Convex)

The backend is already implemented with:
- `createHabit` mutation
- `updateHabitStrength` mutation
- `generateHabitStrengthSnapshot()` function (Zhang et al. algorithm)

**Data Models:**
```typescript
interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  frequency: 'daily' | 'custom';
  strength: number; // 0-1
  strengthLevel: 'starting' | 'building' | 'developing' | 'strong' | 'automatic';
  createdAt: Date;
  strengthUpdatedAt: Date;
}
```

---

## Next Steps

Use this prompt with an AI coding assistant to:

1. **Generate component scaffolding** for Epic 1 stories
2. **Create design system components** (Button, Card, Input, etc.)
3. **Implement habit creation modal** with form validation
4. **Build home screen** with habit list and check-off gestures
5. **Add habit strength visualizations** with animations

**Recommended Approach:**
Start with Story 1.7 (Design System Foundation), then implement Stories 1.1-1.4 in order.

---

## Questions for AI Assistant

When using this prompt, ask your AI assistant:

1. "Generate the core design system components following the specifications above"
2. "Create the CreateHabitModal component with form validation"
3. "Implement the HabitCard component with swipe gestures and toggle functionality"
4. "Build the HabitStrengthIndicator with emoji mapping and animations"
5. "Create the HomeScreen layout with habit list and FAB"

**Pro Tip:** Provide this entire document as context, then ask for specific components one at a time for best results.
