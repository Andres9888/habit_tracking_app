# Contextual Onboarding - Technical Specification

**Version:** 1.0
**Date:** 2025-12-22
**Status:** Draft
**Author:** Sally (UX Expert)

---

## 1. Overview

### 1.1 Purpose
Implement a contextual, tooltip-based onboarding system that guides first-time users through the core features of the habit tracking app **within the actual application interface**, rather than using separate onboarding screens.

### 1.2 Goals
- **Zero friction**: Users interact with the real app, not a separate tutorial
- **Learn by doing**: First habit creation happens during onboarding
- **Clear value proposition**: Highlight unique features (habit strength, motivation)
- **Replayable**: Accessible from Settings for returning users
- **Skippable**: Advanced users can dismiss at any time

### 1.3 Core Principles
- Onboarding **IS** the application (not a separate flow)
- Show, don't tell (minimize text, maximize interaction)
- Celebrate small wins immediately
- No more than 4 tooltip steps

---

## 2. User Experience Flow

### 2.1 First-Time User Journey

```
App Launch (First Time)
    ↓
Step 1: Welcome + "Add First Habit" Spotlight
    ↓
[User creates habit via real UI]
    ↓
Step 2: "Complete Habit" Button Spotlight
    ↓
Step 3: "Habit Strength Meter" Explanation
    ↓
Step 4: "Settings & Help" Pointer
    ↓
Completion Celebration
    ↓
Normal App Usage
```

### 2.2 Onboarding Steps

#### **Step 1: Add Your First Habit**
- **Spotlight**: Add button at bottom of screen
- **Tooltip Position**: Above the button
- **Message**: "Let's Get Started! Tap here to create your first habit. Keep it simple — small habits lead to big changes."
- **Action**: User taps "Add Habit" button → Opens habit creation flow
- **Next Trigger**: After habit is created

#### **Step 2: Complete Your Habit**
- **Spotlight**: Complete button (circle icon) on habit card
- **Tooltip Position**: Below the button
- **Message**: "Complete Your Habit. Tap this button when you've done your habit today. Each completion builds your streak!"
- **Action**: User can tap to complete (optional)
- **Next Trigger**: "Next" button or auto-advance after completion

#### **Step 3: Habit Strength Meter**
- **Spotlight**: Strength meter section on habit card
- **Tooltip Position**: Below the meter
- **Message**: "Habit Strength Meter. This shows how strong your habit is becoming. The more consistent you are, the stronger it gets!"
- **Action**: Read-only, informational
- **Next Trigger**: "Next" button

#### **Step 4: Settings & Help**
- **Spotlight**: Settings icon in header
- **Tooltip Position**: Below the icon
- **Message**: "Settings & Help. Find help, replay this tutorial, or customize your experience anytime from here."
- **Action**: Informational
- **Next Trigger**: "Got It!" button

#### **Completion Screen**
- **Full overlay**: Semi-transparent background
- **Content**:
  - Checkmark icon
  - "You're All Set!"
  - "Ready to build stronger habits?"
  - CTA: "Start Building Habits"
- **Action**: Dismiss overlay, return to normal app

---

## 3. Technical Architecture

### 3.1 Component Structure

```
<OnboardingProvider>
  ├─ <App>
  │   ├─ <Header />
  │   ├─ <HabitList />
  │   └─ <AddButton />
  └─ <OnboardingOverlay>
      ├─ <TooltipSpotlight />
      ├─ <TooltipCard />
      ├─ <PointerHand />
      └─ <SkipButton />
</OnboardingProvider>
```

### 3.2 State Management

#### **Onboarding State**
```typescript
interface OnboardingState {
  isActive: boolean;           // Is onboarding currently running
  currentStep: number;          // Current step (1-4)
  isComplete: boolean;          // Has user completed onboarding ever
  isSkipped: boolean;           // Did user skip this session
  stepTimestamps: number[];     // Track time spent on each step
}
```

#### **Step Configuration**
```typescript
interface OnboardingStep {
  id: number;
  target: string;               // CSS selector for spotlight element
  spotlight: SpotlightConfig;
  tooltip: TooltipConfig;
  pointer: PointerConfig;
  trigger: 'click' | 'manual' | 'auto';
  nextCondition?: () => boolean; // Optional: condition to auto-advance
}

interface SpotlightConfig {
  selector: string;
  padding?: number;             // Extra padding around element
  borderRadius?: number;
}

interface TooltipConfig {
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  title: string;
  message: string;
  primaryButton: ButtonConfig;
  secondaryButton?: ButtonConfig;
}

interface PointerConfig {
  position: { x: number; y: number } | 'auto';
  animation: 'bounce' | 'pulse' | 'none';
}
```

### 3.3 Local Storage Schema

```typescript
// Key: 'onboarding_state'
{
  "hasCompletedOnboarding": boolean,
  "lastShownVersion": string,        // e.g., "1.0.0"
  "completedAt": number,             // Unix timestamp
  "stepsCompleted": number[],        // Array of completed step IDs
  "skippedAt": number | null
}
```

### 3.4 Key Functions

```typescript
// Initialize onboarding
function initOnboarding(): void {
  const state = getOnboardingState();
  if (!state.hasCompletedOnboarding) {
    startOnboarding();
  }
}

// Start onboarding flow
function startOnboarding(): void {
  setOnboardingActive(true);
  showStep(1);
}

// Navigate to specific step
function showStep(stepNumber: number): void {
  // 1. Calculate spotlight position
  // 2. Render overlay
  // 3. Show tooltip
  // 4. Animate pointer
  // 5. Set up event listeners
}

// Complete onboarding
function completeOnboarding(): void {
  setOnboardingActive(false);
  saveOnboardingCompletion();
  showCompletionCelebration();
}

// Skip onboarding
function skipOnboarding(): void {
  setOnboardingActive(false);
  saveOnboardingSkipped();
}

// Replay from settings
function replayOnboarding(): void {
  startOnboarding();
}
```

---

## 4. UI Components

### 4.1 Overlay System

#### **TooltipOverlay**
- **Background**: `rgba(0, 0, 0, 0.85)` with backdrop blur
- **Z-index**: 100
- **Animation**: Fade in (300ms ease-out)
- **Behavior**: Blocks interaction with app except spotlight area

#### **TooltipSpotlight**
- **Visual**: Border + box-shadow creating "cutout" effect
- **Border**: 4px solid `#6366f1` (indigo-500)
- **Shadow**: `0 0 0 9999px rgba(0, 0, 0, 0.85)`
- **Animation**: Pulse (2s infinite)
- **Behavior**: Dynamically positioned based on target element

#### **TooltipCard**
- **Background**: Gradient `linear-gradient(135deg, #1e1e2e, #2a2a3e)`
- **Border**: 2px solid `#6366f1`
- **Border Radius**: 20px
- **Padding**: 20px
- **Max Width**: 280px
- **Shadow**: `0 20px 40px rgba(0, 0, 0, 0.5)`
- **Arrow**: Triangle pointer toward spotlight element

#### **PointerHand**
- **Icon**: 👆 emoji (40px)
- **Animation**: Bounce (1.5s infinite)
- **Position**: Near spotlight, pointing toward target
- **Shadow**: Drop shadow for visibility

#### **SkipButton**
- **Position**: Fixed top-right (50px from top, 24px from right)
- **Background**: `rgba(255, 255, 255, 0.1)` with backdrop blur
- **Padding**: 8px 16px
- **Border Radius**: 20px
- **Text**: "Skip Tutorial"

#### **ProgressDots**
- **Layout**: Horizontal flex, centered
- **Inactive**: 8px circle, `rgba(255, 255, 255, 0.2)`
- **Active**: 24px width pill, `#6366f1`
- **Transition**: 300ms ease

### 4.2 Tooltip Content Structure

```html
<div class="tooltip-card">
  <div class="tooltip-arrow [top|bottom|left|right]"></div>
  <h3 class="tooltip-title">{title}</h3>
  <p class="tooltip-message">{message}</p>
  <div class="tooltip-actions">
    <button class="btn-back" *ngIf="stepNumber > 1">← Back</button>
    <div class="progress-dots">
      <!-- Dynamic dots based on total steps -->
    </div>
    <button class="btn-primary">
      {stepNumber < totalSteps ? 'Next →' : 'Got It! ✓'}
    </button>
  </div>
</div>
```

---

## 5. Settings Integration

### 5.1 Settings Screen Additions

#### **Help Section**
```
Settings
├─ Profile
├─ Notifications
├─ Help & Support  ← NEW SECTION
│   ├─ Replay Tutorial
│   ├─ How It Works (FAQ)
│   ├─ Contact Support
│   └─ App Version
└─ Account
```

#### **Replay Tutorial**
- **Action**: Reset onboarding state, trigger `replayOnboarding()`
- **Icon**: 🔄 or play icon
- **Label**: "Replay Tutorial"
- **Sublabel**: "See the onboarding guide again"

#### **How It Works (FAQ)**
- **Navigation**: Opens dedicated FAQ screen
- **Icon**: ❓ or help circle
- **Label**: "How It Works"
- **Sublabel**: "Learn about features"

### 5.2 FAQ Content Structure

```markdown
# How It Works

## Habits
**Q: What is a habit?**
A: A habit is a repeated action you want to build. Start small — 5 minutes is better than 0!

**Q: How do I create a habit?**
A: Tap the "+" button, name your habit, and choose how often you want to do it.

## Habit Strength
**Q: What is Habit Strength?**
A: A measure of how ingrained your habit is. It grows with consistency and shrinks with missed days.

**Q: How is Habit Strength calculated?**
A: Based on your completion rate over the last 21 days. The more consistent you are, the stronger it gets.

## Streaks
**Q: What is a streak?**
A: Consecutive days you've completed your habit. Streaks help you stay motivated!

**Q: What happens if I miss a day?**
A: Your streak resets, but your Habit Strength only decreases slightly. Don't give up — just start again!

## Motivation
**Q: What is the motivation feature?**
A: A personal reminder of WHY this habit matters to you. We'll show it when you need encouragement.

**Q: Can I change my motivation?**
A: Yes! Edit your habit and update your motivation anytime.
```

---

## 6. Implementation Plan

### 6.1 Phase 1: Core Onboarding System
- [ ] Create `OnboardingProvider` context
- [ ] Implement overlay system (backdrop, spotlight, tooltip)
- [ ] Build tooltip card component with animations
- [ ] Add local storage persistence
- [ ] Implement step navigation logic

### 6.2 Phase 2: Step Configuration
- [ ] Define all 4 onboarding steps
- [ ] Configure spotlight targets dynamically
- [ ] Add tooltip positioning logic (auto-calculate based on target)
- [ ] Implement pointer hand animation
- [ ] Add progress dots

### 6.3 Phase 3: Interaction Logic
- [ ] Add "Skip" functionality
- [ ] Implement back/forward navigation
- [ ] Handle edge cases (screen resize, element not found)
- [ ] Add completion celebration screen
- [ ] Track analytics events

### 6.4 Phase 4: Settings Integration
- [ ] Add "Replay Tutorial" button to Settings
- [ ] Create "How It Works" FAQ screen
- [ ] Implement FAQ content with collapsible sections
- [ ] Add search functionality to FAQ (optional)

### 6.5 Phase 5: Polish & Testing
- [ ] Test on various screen sizes
- [ ] Optimize animations for performance
- [ ] Add accessibility features (keyboard navigation, screen reader support)
- [ ] A/B test tooltip messaging
- [ ] Monitor completion vs. skip rates

---

## 7. Edge Cases & Considerations

### 7.1 Edge Cases

| Scenario | Handling |
|----------|----------|
| User dismisses app mid-onboarding | Save progress, resume on next launch |
| Target element not found | Skip that step, show error in dev mode |
| Screen rotated during onboarding | Recalculate spotlight position |
| User tries to interact outside spotlight | Prevent interaction, pulse spotlight |
| Onboarding version updated | Show updated steps to existing users (optional) |

### 7.2 Accessibility

- **Keyboard Navigation**: Arrow keys to navigate steps, ESC to skip
- **Screen Readers**: Announce each step's content
- **Reduced Motion**: Disable animations if user prefers reduced motion
- **High Contrast**: Ensure tooltip is readable in high-contrast modes

### 7.3 Analytics Events

Track the following events:
- `onboarding_started`
- `onboarding_step_viewed` (with step number)
- `onboarding_step_completed` (with time spent)
- `onboarding_skipped` (with step number where skipped)
- `onboarding_completed`
- `onboarding_replayed`

---

## 8. Design Assets

### 8.1 Colors
- **Primary (Indigo)**: `#6366f1`
- **Secondary (Purple)**: `#8b5cf6`
- **Accent (Purple)**: `#a855f7`
- **Success (Green)**: `#10b981`
- **Background Dark**: `#0f0f1a`
- **Overlay**: `rgba(0, 0, 0, 0.85)`

### 8.2 Typography
- **Font Family**: Inter
- **Tooltip Title**: 18px, bold (700)
- **Tooltip Message**: 14px, regular (400)
- **Button Text**: 14px, semibold (600)

### 8.3 Animations
- **Fade In**: 300ms ease-out
- **Pulse**: 2s infinite ease-in-out
- **Bounce**: 1.5s infinite cubic-bezier
- **Tooltip Transition**: 400ms ease-out

---

## 9. Success Metrics

### 9.1 Primary Metrics
- **Onboarding Completion Rate**: Target ≥ 70%
- **Time to Complete**: Target ≤ 60 seconds
- **Skip Rate**: Target ≤ 30%

### 9.2 Secondary Metrics
- **Habit Creation During Onboarding**: Target 100% (required)
- **First Habit Completion Rate**: Target ≥ 50% (within 24 hours)
- **Tutorial Replay Rate**: Track for UX improvements
- **FAQ Visit Rate**: Track to improve onboarding clarity

---

## 10. Future Enhancements

### 10.1 V2 Features
- [ ] Contextual tips (e.g., "You've completed 7 days! Tap to see your stats")
- [ ] Interactive hints on empty states
- [ ] Gamified tutorial (earn first badge for completing onboarding)
- [ ] Personalized onboarding based on user's goals

### 10.2 Advanced Features
- [ ] Video walkthrough option (for complex features)
- [ ] Multi-language support for tutorial content
- [ ] Onboarding for new features (e.g., when releasing analytics dashboard)
- [ ] In-app coaching tips triggered by usage patterns

---

## 11. Technical Dependencies

### 11.1 Libraries
- **React** (v18+)
- **React Context API** (for state management)
- **Framer Motion** (for animations - optional)
- **Tailwind CSS** (for styling)

### 11.2 APIs
- **Local Storage API**: Persist onboarding state
- **Intersection Observer API**: Detect element visibility (optional)
- **ResizeObserver API**: Handle screen size changes

---

## 12. Open Questions

1. Should we require habit creation during onboarding, or allow skip?
   - **Recommendation**: Require creation for higher engagement

2. Should onboarding auto-advance when user performs the action, or always require "Next" click?
   - **Recommendation**: Auto-advance for actions (e.g., creating habit), manual for info steps

3. Should we show onboarding again after major version updates?
   - **Recommendation**: Only if new features are added; use versioning system

4. Should FAQ be searchable?
   - **Recommendation**: Start without search, add if FAQ grows beyond 10 items

---

## 13. Approval & Sign-off

- [ ] UX Design Approved
- [ ] Technical Architecture Approved
- [ ] Copy/Content Approved
- [ ] Analytics Events Approved
- [ ] Accessibility Requirements Approved

---

**End of Technical Specification**

*This spec is based on the mockup at: `.superdesign/design_iterations/onboarding_contextual_1.html`*
