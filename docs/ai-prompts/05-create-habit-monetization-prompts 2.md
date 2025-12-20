# AI Frontend Prompts - Create Habit Monetization Features

_Generated on 2025-11-02 by Sally (UX Expert)_
_For: Jane | Project: Habit Tracking App_

---

## Overview

These prompts are optimized for AI code generation tools (v0, Lovable, Cursor, etc.) to implement the monetization features for the Create Habit screen. Each prompt is self-contained and includes all necessary context.

**Technology Stack:**
- React Native + NativeWind (Tailwind for RN)
- TypeScript
- react-native-reanimated v4 (animations)
- expo-haptics (haptic feedback)
- Convex (backend)

---

## Prompt 1: Premium Template Card Component

### Context
Create a premium template card component for the Create Habit screen that visually distinguishes premium templates from free ones with a gold shimmer effect and lock icon.

### Prompt

```
Create a React Native component called PremiumTemplateCard with the following requirements:

COMPONENT: PremiumTemplateCard
TECH STACK: React Native, TypeScript, NativeWind (Tailwind CSS for React Native), react-native-reanimated

VISUAL DESIGN:
- Base: White background card with rounded corners (rounded-2xl)
- Premium indicator: Gold "PRO" badge in top-right corner
- Lock icon: 16x16px lock icon (use lucide-react-native) in top-right, color: #9CA3AF
- Shimmer effect: Animated gold shimmer overlay that sweeps across the card every 2 seconds
- Blur: When locked (free user), apply 4px blur to content with gold tint overlay
- Layout: Horizontal layout with icon on left, text in middle, lock/science button on right

STATES:
1. Free template (isPremium: false, isLocked: false): Normal white card
2. Premium locked (isPremium: true, isLocked: true): Gold shimmer, blur, lock icon
3. Premium unlocked (isPremium: true, isLocked: false): Gold accent border, ✨ badge, no blur

INTERACTIONS:
When locked template is tapped:
1. Haptic feedback (medium impact)
2. Lock icon shakes (±2deg rotation, 2 cycles, 300ms)
3. Card briefly scales to 0.98x then returns to 1.0x
4. Call onLockedTap callback to show premium modal

TYPESCRIPT INTERFACE:
```typescript
interface PremiumTemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    icon: string; // emoji
    iconColor: string;
    isPremium: boolean;
  };
  isLocked: boolean; // true if template.isPremium && user is free tier
  onSelect: () => void;
  onViewScience: () => void;
  onLockedTap?: () => void; // called when locked template is tapped
}
```

ANIMATION REQUIREMENTS:
- Shimmer: Use react-native-reanimated for smooth 60fps gold gradient sweep (2s loop)
- Lock shake: Spring animation with damping: 0.8, stiffness: 300
- Scale interaction: Smooth spring feedback on press

ACCESSIBILITY:
- accessibilityLabel: "[Template name]. [Premium feature if locked]. Tap to [select/preview]"
- accessibilityRole: "button"
- Minimum touch target: 48x48px

EXAMPLE USAGE:
```tsx
<PremiumTemplateCard
  template={{
    id: '1',
    name: 'Advanced Sleep Optimizer',
    description: 'Science-backed 8-week program',
    icon: '😴',
    iconColor: '#667EEA',
    isPremium: true
  }}
  isLocked={!userIsPremium}
  onSelect={() => handleSelectTemplate()}
  onViewScience={() => openScienceModal()}
  onLockedTap={() => showPremiumModal()}
/>
```

Please implement this component with all animations and interactions using React Native Reanimated and expo-haptics.
```

---

## Prompt 2: Habit Limit Banner Component

### Context
Create a smart banner that appears at the top of the Create Habit modal to warn users approaching or at their habit limit, with different states for approaching (2/3), at limit (3/3), and a soft upsell CTA.

### Prompt

```
Create a React Native component called HabitLimitBanner that shows habit count status and encourages premium upgrade.

COMPONENT: HabitLimitBanner
TECH STACK: React Native, TypeScript, NativeWind, react-native-reanimated

VISUAL STATES:

1. HIDDEN (current < max - 1):
   - Don't render anything

2. APPROACHING LIMIT (current === max - 1, e.g., 2/3):
   - Background: Amber/Yellow tint (#FEF3C7)
   - Icon: 🎯 or ⚠️
   - Text: "You have 2/3 free habits"
   - Subtitle: "💡 Tip: Track unlimited habits with Premium →"
   - Gentle pulsing animation (1.0x → 1.02x scale, 2s cycle)

3. AT LIMIT (current === max, e.g., 3/3):
   - Background: Red/Orange gradient (#FEE2E2 to #FED7AA)
   - Icon: ⚠️
   - Text: "This is your last free habit!" (bold)
   - Badge: "3/3" in red circle
   - Subtitle: "⭐ Upgrade for unlimited habits →"
   - More prominent pulsing (1.0x → 1.05x scale)

LAYOUT:
┌─────────────────────────────────────┐
│ [Icon] Message here                 │
│        Subtitle with CTA         →  │
└─────────────────────────────────────┘

INTERACTIONS:
- Tappable area expands banner to show full feature comparison
- On tap: Haptic medium impact, scale to 0.98x, show premium modal
- CTA arrow pulses gently (opacity 0.7 → 1.0)

TYPESCRIPT INTERFACE:
```typescript
interface HabitLimitBannerProps {
  current: number; // Current number of habits
  max: number; // Max for free tier (usually 3)
  isPremium: boolean; // If true, don't show banner
  onUpgrade: () => void; // Navigate to premium screen
}
```

ANIMATIONS:
- Entrance: Slide down from top with spring (400ms)
- Pulse: Continuous gentle scale animation
- Press: Quick scale down feedback (100ms)
- Exit: Slide up and fade out (300ms)

ACCESSIBILITY:
- Screen reader: "You have [current] of [max] free habits. Tap to upgrade to premium for unlimited habits."
- accessibilityRole: "button"

EXAMPLE USAGE:
```tsx
<HabitLimitBanner
  current={habitCount}
  max={3}
  isPremium={user.isPremium}
  onUpgrade={() => navigation.navigate('PremiumScreen')}
/>
```

Use react-native-reanimated for all animations. Make sure the component auto-dismisses when user becomes premium.
```

---

## Prompt 3: Premium Color Theme Picker

### Context
Extend the existing color picker to include locked premium gradient themes and seasonal palettes, with preview functionality.

### Prompt

```
Create an enhanced React Native color picker component that shows both free colors and locked premium gradient themes.

COMPONENT: PremiumColorPicker
TECH STACK: React Native, TypeScript, NativeWind, expo-linear-gradient, react-native-reanimated

LAYOUT:
```
Color
[🔴][🟠][🟡][🟢][🔵][🟣][⚫][⚪] ← Free colors (always unlocked)

✨ Premium Themes
[Gradient 1] [Gradient 2] [Gradient 3] [Seasonal] ← Premium (locked for free users)
```

FREE COLORS (existing, don't change):
- Standard solid colors: Red, Orange, Yellow, Green, Blue, Purple, Black, White
- Size: 44x44px circular buttons
- Selected: Border ring (3px)

PREMIUM THEMES (new):
- Gradient cards: 80x44px rounded rectangles
- Each shows actual gradient preview
- If locked: Gold shimmer overlay + small lock icon (16x16px top-right)
- Selected: Gold border ring (3px)

PREMIUM THEMES DATA:
```typescript
const premiumThemes = [
  {
    id: 'sunset',
    name: 'Sunset Gradient',
    colors: ['#FF6B6B', '#FFA500'],
    locked: !isPremium
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    colors: ['#667EEA', '#764BA2'],
    locked: !isPremium
  },
  {
    id: 'forest',
    name: 'Forest Mist',
    colors: ['#10B981', '#059669'],
    locked: !isPremium
  },
  {
    id: 'spring',
    name: 'Spring Blossom',
    colors: ['#FA709A', '#FEE140'],
    type: 'seasonal',
    locked: !isPremium
  }
]
```

INTERACTIONS:

Free user taps locked theme:
1. Haptic: Medium impact
2. Theme card shakes (±1deg, 2 cycles, 200ms)
3. Lock icon pulses (scale 1.0 → 1.2 → 1.0)
4. Show preview modal (slide up from bottom)

Preview Modal Content:
- Full-screen preview of habit with gradient applied
- Theme name and description
- "✨ Premium Feature" badge
- List of benefits:
  • "8 gradient themes"
  • "Seasonal palettes"
  • "Custom color combos"
- CTA: "Unlock Premium Themes" button
- "Try Another Preview" button

Premium user taps theme:
- Immediately applies gradient to habit
- Smooth color transition animation (400ms)
- Haptic: Selection feedback
- Selected border appears

TYPESCRIPT INTERFACE:
```typescript
interface PremiumColorPickerProps {
  selectedColor: string | string[]; // Single color or gradient array
  onSelectColor: (color: string | string[]) => void;
  isPremium: boolean;
  onShowPreview: (theme: ColorTheme) => void;
  onUpgrade: () => void;
}

interface ColorTheme {
  id: string;
  name: string;
  colors: string[]; // Array for gradients
  type?: 'gradient' | 'seasonal';
  locked: boolean;
}
```

ANIMATIONS:
- Shimmer on locked themes: Gold gradient sweep (2s loop)
- Shake on denied tap: Spring rotation ±1deg
- Preview modal entrance: Slide up with spring (400ms)
- Color transition: Smooth interpolation (400ms)

EXAMPLE USAGE:
```tsx
<PremiumColorPicker
  selectedColor={habit.color}
  onSelectColor={(color) => updateHabitColor(color)}
  isPremium={user.isPremium}
  onShowPreview={(theme) => setPreviewTheme(theme)}
  onUpgrade={() => navigation.navigate('Premium')}
/>
```

Implement with expo-linear-gradient for gradients and react-native-reanimated for animations.
```

---

## Prompt 4: AI Feature Teaser Component

### Context
Create a teaser component that appears below the habit name field to preview AI-powered suggestions (locked for free users, functional for premium).

### Prompt

```
Create a React Native component that shows AI-powered habit suggestions for premium users, or a locked teaser for free users.

COMPONENT: AIHabitSuggestions
TECH STACK: React Native, TypeScript, NativeWind, react-native-reanimated

VISUAL DESIGN:

FREE USER (Locked State):
```
┌─────────────────────────────────────┐
│ ✨ AI can suggest optimal times     │
│    and improve this habit name   🔒 │
│    [Unlock AI Features]             │
└─────────────────────────────────────┘
```
- Background: Light purple/blue tint (#EDE9FE)
- Gold shimmer animation on lock icon
- Slides in 2s after user starts typing
- Lock icon: 16x16px

PREMIUM USER (Functional):
```
┌─────────────────────────────────────┐
│ 🤖 AI Suggestions:                  │
│ • "30-min Morning Cardio" (more     │
│   specific) → [Use]                 │
│ • Best time: 6:30 AM → [Apply]      │
│ • Pair with: "Drink water" → [+]    │
│ [Dismiss]                           │
└─────────────────────────────────────┘
```
- Background: White with blue accent border
- Each suggestion is tappable
- Smooth entrance animation (slide up)

BEHAVIOR:

Free User Flow:
1. User types in habit name field
2. After 2s pause, teaser slides up from bottom
3. Haptic: Selection feedback
4. Tap "Unlock AI Features" → Navigate to premium screen
5. Dismissable (slide down)

Premium User Flow:
1. User types habit name
2. After 500ms pause, AI analyzes (show subtle loading)
3. Suggestions appear with stagger (100ms between items)
4. Tap suggestion → Apply with smooth animation
5. Show success checkmark, then fade out suggestion

TYPESCRIPT INTERFACE:
```typescript
interface AIHabitSuggestionsProps {
  habitName: string; // Current user input
  isPremium: boolean;
  onApplySuggestion: (suggestion: Suggestion) => void;
  onUnlock: () => void;
  onDismiss: () => void;
}

interface Suggestion {
  type: 'name' | 'time' | 'pairing';
  value: string;
  reasoning: string;
  confidence: number; // 0-1
}

// Mock AI suggestions for premium users
const mockSuggestions = (habitName: string): Suggestion[] => {
  return [
    {
      type: 'name',
      value: `${habitName.slice(0, 20)} (30 min)`,
      reasoning: 'More specific duration improves completion',
      confidence: 0.85
    },
    {
      type: 'time',
      value: '6:30 AM',
      reasoning: 'Based on your morning routine pattern',
      confidence: 0.92
    },
    {
      type: 'pairing',
      value: 'Drink water',
      reasoning: 'Complementary habit for morning routine',
      confidence: 0.78
    }
  ];
};
```

ANIMATIONS:
- Entrance (locked teaser): Slide up from bottom (300ms spring)
- Entrance (suggestions): Slide up + stagger items (100ms delay each)
- Shimmer on lock: Gold gradient sweep (2s loop)
- Apply suggestion: Scale → Checkmark → Fade out (600ms total)
- Dismiss: Slide down (200ms)

INTERACTIONS:
- Locked state tap: Haptic medium, scale 0.98x, navigate to premium
- Suggestion tap: Haptic selection, scale 0.95x, apply value
- Dismiss: Haptic light, slide down animation

ACCESSIBILITY:
- Free: "AI suggestions available with premium. Tap to unlock."
- Premium: "AI suggests: [suggestion text]. Tap to apply."

EXAMPLE USAGE:
```tsx
<AIHabitSuggestions
  habitName={habitName}
  isPremium={user.isPremium}
  onApplySuggestion={(suggestion) => {
    if (suggestion.type === 'name') setHabitName(suggestion.value);
    if (suggestion.type === 'time') setReminderTime(suggestion.value);
    // etc.
  }}
  onUnlock={() => navigation.navigate('Premium')}
  onDismiss={() => setShowAI(false)}
/>
```

Implement with react-native-reanimated for smooth animations. Use debouncing for user input (lodash.debounce).
```

---

## Prompt 5: Multi-Reminder Section

### Context
Enhance the existing single-reminder section to support multiple reminders for premium users, with a locked "+ Add Reminder" button for free users.

### Prompt

```
Create an enhanced reminder section component that supports multiple reminders for premium users while limiting free users to one.

COMPONENT: MultiReminderSection
TECH STACK: React Native, TypeScript, NativeWind, DateTimePicker, react-native-reanimated

VISUAL DESIGN:

FREE USER (1 Reminder Max):
```
Reminders
┌─────────────────────────────────────┐
│ Morning reminder     [ON]  8:00 AM  │
│                                     │
│ [+ Add Another Reminder] 🔒         │
│ ↓ Locked, shows premium modal on tap
└─────────────────────────────────────┘

💡 Pro Tip: Set multiple reminders with Premium
```

PREMIUM USER (Unlimited):
```
Reminders
┌─────────────────────────────────────┐
│ Morning check       [ON]   8:00 AM  │
│ Midday reminder     [ON]  12:00 PM  │
│ Evening followup    [OFF]  6:00 PM  │
│                                     │
│ [+ Add Another Reminder]            │
└─────────────────────────────────────┘

✨ Premium: Unlimited reminders active
```

REMINDER ITEM LAYOUT:
```
┌──────────────────────────────────────┐
│ [Label/Name]     [Toggle] [Time]  [×]│
│  ↑ Editable       ↑ On/Off  ↑ Tap   ↑│
│  text input                 to edit  │
│                             time   Delete│
└──────────────────────────────────────┘
```

INTERACTIONS:

Free user taps "+ Add Reminder" (at limit):
1. Haptic: Medium + denied pattern
2. Button shakes (±2deg, 2 cycles)
3. Lock icon pulses
4. Modal slides up: "Smart Reminders (Premium)"

Premium user taps "+ Add Reminder":
1. Haptic: Selection feedback
2. New reminder appears with slide-in animation
3. Auto-focus on label input
4. Time picker opens

Time picker interaction:
- Tap time → Show native DateTimePicker (iOS spinner, Android dialog)
- On select → Smooth time update animation
- Haptic on confirm: Light impact

Delete reminder (swipe left or tap X):
- Swipe left reveals delete button
- Haptic: Warning feedback
- Item slides out with fade (300ms)

TYPESCRIPT INTERFACE:
```typescript
interface MultiReminderSectionProps {
  reminders: Reminder[];
  maxReminders: number; // 1 for free, Infinity for premium
  isPremium: boolean;
  onAddReminder: () => void;
  onToggleReminder: (id: string, enabled: boolean) => void;
  onUpdateTime: (id: string, time: Date) => void;
  onUpdateLabel: (id: string, label: string) => void;
  onDeleteReminder: (id: string) => void;
  onShowPremiumModal: () => void;
}

interface Reminder {
  id: string;
  label: string; // e.g., "Morning check", "Midday reminder"
  time: Date;
  enabled: boolean;
}

// Default reminder for new habits
const defaultReminder: Reminder = {
  id: uuid(),
  label: 'Morning reminder',
  time: new Date().setHours(8, 0, 0, 0),
  enabled: true
}
```

PREMIUM MODAL CONTENT:
```
┌─────────────────────────────────────┐
│  ⏰ Smart Reminders (Premium)       │
│                                     │
│  Never miss a habit with:           │
│  ✓ Multiple reminders per habit     │
│  ✓ Custom reminder labels           │
│  ✓ Adaptive timing (AI learns)      │
│  ✓ Smart snooze options             │
│                                     │
│  Free: 1 reminder per habit         │
│  Pro: Unlimited reminders ♾️        │
│                                     │
│  [Upgrade to Premium]               │
│  [Learn More]                       │
└─────────────────────────────────────┘
```

ANIMATIONS:
- Add reminder: Slide in from bottom with spring (400ms)
- Delete reminder: Slide out left + fade (300ms)
- Toggle switch: Smooth color transition (200ms)
- Time update: Number flip animation (300ms)
- Locked button shake: ±2deg rotation (300ms)

ACCESSIBILITY:
- Each reminder: "Reminder [label], [time], [enabled/disabled]. Double tap to edit."
- Add button (locked): "Add another reminder. Premium feature. Tap to unlock."
- Delete: "Delete [label] reminder"

EXAMPLE USAGE:
```tsx
<MultiReminderSection
  reminders={habit.reminders}
  maxReminders={user.isPremium ? Infinity : 1}
  isPremium={user.isPremium}
  onAddReminder={() => addReminder({
    id: uuid(),
    label: 'New reminder',
    time: new Date(),
    enabled: true
  })}
  onToggleReminder={(id, enabled) => updateReminder(id, { enabled })}
  onUpdateTime={(id, time) => updateReminder(id, { time })}
  onUpdateLabel={(id, label) => updateReminder(id, { label })}
  onDeleteReminder={(id) => removeReminder(id)}
  onShowPremiumModal={() => setPremiumModalVisible(true)}
/>
```

Use @react-native-community/datetimepicker for time selection and react-native-reanimated for animations.
```

---

## Prompt 6: Hard Limit Paywall Modal

### Context
Create a full-screen modal that appears when free users try to create a 4th habit (over the limit), offering upgrade options or habit management.

### Prompt

```
Create a premium upgrade modal that blocks habit creation when free users exceed their limit, with elegant design and clear value proposition.

COMPONENT: HardLimitPaywallModal
TECH STACK: React Native, TypeScript, NativeWind, react-native-reanimated, expo-linear-gradient

VISUAL DESIGN:
```
┌─────────────────────────────────────┐
│  ✨ Unlock Unlimited Habits         │
│  ─────────────────────────────────  │
│                                     │
│  You've created 3 amazing habits!   │
│  Ready to build more?               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ FREE        │ PREMIUM       │   │
│  ├─────────────┼───────────────┤   │
│  │ 3 habits    │ ♾️ Unlimited   │   │
│  │ Basic stats │ Full analytics│   │
│  │ 1 reminder  │ Multi-remind  │   │
│  │ Free temps  │ All templates │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Start 7-Day Free Trial]           │
│  [View All Premium Benefits]        │
│  [Manage Existing Habits]           │
│                                     │
│  No credit card required for trial  │
└─────────────────────────────────────┘
```

LAYOUT SECTIONS:

1. HEADER:
   - Sparkle emoji ✨ or gold star icon
   - Headline: "Unlock Unlimited Habits"
   - Divider line

2. CONTEXT MESSAGE:
   - Encouraging tone: "You've created X amazing habits!"
   - Positive framing: "Ready to build more?"

3. COMPARISON TABLE:
   - 2 columns: Free vs Premium
   - 4-5 key features compared
   - Green checkmarks for included, Red X for excluded
   - Gold highlights for Premium column

4. CTA BUTTONS (stacked):
   - Primary: "Start 7-Day Free Trial" (gold gradient, prominent)
   - Secondary: "View All Premium Benefits" (outline)
   - Tertiary: "Manage Existing Habits" (text link)

5. FOOTER:
   - Small text: "No credit card required for trial"
   - Reassuring, reduces friction

COMPARISON DATA:
```typescript
const featureComparison = [
  { feature: 'Active Habits', free: '3', premium: 'Unlimited ♾️' },
  { feature: 'Analytics', free: 'Basic', premium: 'Full Dashboard' },
  { feature: 'Reminders', free: '1 per habit', premium: 'Unlimited' },
  { feature: 'Templates', free: 'Free only', premium: 'All 20+ premium' },
  { feature: 'AI Features', free: '✗', premium: '✓ Included' }
];
```

INTERACTIONS:

Modal Entrance:
1. Background blurs (300ms)
2. Modal scales in from center (0.8 → 1.0, 400ms spring)
3. Content fades in with stagger (100ms per item)
4. Haptic: Medium impact on appearance

Primary CTA ("Start Trial"):
1. Gentle pulsing animation (1.0 → 1.02x scale, 2s loop)
2. Gold gradient shimmer effect
3. On press: Haptic heavy, scale 0.95x, navigate to trial flow
4. Button has rounded corners and shadow

Secondary CTA ("View Benefits"):
1. Outline style, less prominent
2. On press: Haptic selection, expand to full benefits list
3. Accordion-style expansion (400ms)

Tertiary CTA ("Manage Habits"):
1. Text link style, subtle
2. On press: Haptic light, dismiss modal, navigate to habit list
3. Slide down modal (300ms)

Dismissal:
- Swipe down gesture or tap background (if not hard-locked)
- Modal scales out (1.0 → 0.9, 300ms)
- Background unblurs (300ms)
- Haptic: Light impact

TYPESCRIPT INTERFACE:
```typescript
interface HardLimitPaywallModalProps {
  visible: boolean;
  currentHabits: number; // How many they've created
  freeLimit: number; // Usually 3
  onStartTrial: () => void;
  onViewBenefits: () => void;
  onManageHabits: () => void;
  onDismiss?: () => void; // Optional if hard-locked
  dismissible?: boolean; // False for hard paywall, true for soft
}
```

ANIMATIONS:
- Background blur: Smooth transition (300ms ease-out)
- Modal entrance: Scale + opacity (400ms spring)
- Content stagger: Each row fades in (100ms delay)
- CTA pulse: Continuous gentle breathing (2s loop)
- Dismissal: Reverse entrance (300ms ease-in)

ACCESSIBILITY:
- Modal announcement: "You've reached the habit limit. Upgrade to premium for unlimited habits."
- Focus trap: Tab navigation stays within modal
- Escape key: Dismiss modal (if dismissible)
- Each CTA clearly labeled

PREMIUM BENEFITS (Expanded View):
```
✨ Premium Features:

🎯 Unlimited Habits
   Track as many habits as you want. No limits.

📊 Full Analytics Dashboard
   Strength graphs, predictions, insights, and trends.

⏰ Smart Reminders
   Multiple reminders per habit with AI-powered timing.

📚 Premium Templates
   Access to 20+ science-backed habit templates.

🤖 AI-Powered Suggestions
   Get personalized habit optimization and timing.

🎨 Custom Themes & Colors
   Gradient themes, seasonal palettes, custom colors.

✓ Priority Support
   Get help faster with premium support access.
```

EXAMPLE USAGE:
```tsx
<HardLimitPaywallModal
  visible={showPaywall}
  currentHabits={habitCount}
  freeLimit={3}
  onStartTrial={() => navigation.navigate('TrialSignup')}
  onViewBenefits={() => setShowBenefits(true)}
  onManageHabits={() => {
    setShowPaywall(false);
    navigation.navigate('HabitList');
  }}
  dismissible={false} // Hard block, can't dismiss
/>
```

Use react-native-reanimated for animations, expo-linear-gradient for gradients, and expo-blur for background blur.
```

---

## Usage Instructions

### How to Use These Prompts

1. **Copy the full prompt** (including context and example usage)
2. **Paste into your AI coding tool:**
   - **v0 by Vercel**: Paste into chat, it will generate React/Next.js (adapt for React Native)
   - **Lovable.ai**: Use for full-stack app generation
   - **Cursor / GitHub Copilot**: Paste in comment block above where you want code
   - **Claude Code**: Use directly in conversation

3. **Iterate and refine:**
   - Ask for adjustments: "Make the shimmer more subtle"
   - Request variants: "Create a version with dark mode"
   - Fix issues: "The animation is too slow, speed it up"

4. **Test thoroughly:**
   - Test on real devices (iOS and Android)
   - Verify haptics work correctly
   - Check accessibility with screen readers
   - Test with reduced motion enabled

### Customization Tips

**Adjust colors:**
- Replace gold (#FFD700) with your brand color
- Change gradient stops in premium themes
- Modify shimmer opacity for subtlety

**Timing adjustments:**
- Slower animations: Increase duration (300ms → 500ms)
- Faster feedback: Decrease delay (2s → 1s)
- More energetic: Increase scale amounts (1.02x → 1.05x)

**Copy changes:**
- Update CTA text to match your brand voice
- Modify premium benefits list based on your features
- Adjust tone (playful vs professional)

### Implementation Order (Recommended)

1. **Start with PremiumTemplateCard** - Foundation for template monetization
2. **Add HabitLimitBanner** - Immediate conversion trigger
3. **Implement HardLimitPaywallModal** - Hard conversion point
4. **Build PremiumColorPicker** - Value add for engaged users
5. **Create AIFeatureTeaser** - Premium value preview
6. **Finish with MultiReminderSection** - Polish and complete feature set

---

## Testing Checklist

### For Each Component:

**Functionality:**
- [ ] Component renders correctly in all states
- [ ] Interactions trigger expected callbacks
- [ ] Animations run smoothly at 60fps
- [ ] Haptics fire at correct moments
- [ ] Premium/free logic works correctly

**Visual Design:**
- [ ] Matches design spec exactly
- [ ] Colors and gradients look correct
- [ ] Spacing and sizing are accurate
- [ ] Works on various screen sizes (iPhone SE to iPad)
- [ ] Dark mode support (if applicable)

**Accessibility:**
- [ ] Screen reader announces correctly
- [ ] Touch targets are minimum 44x44px
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Works with VoiceOver/TalkBack
- [ ] Respects reduce motion setting

**Performance:**
- [ ] No dropped frames during animations
- [ ] Fast component mount time (<100ms)
- [ ] Minimal re-renders
- [ ] Efficient haptic usage (not excessive)

**Edge Cases:**
- [ ] Handles rapid tapping gracefully
- [ ] Works with empty states
- [ ] Handles very long text inputs
- [ ] Works offline (if applicable)

---

**Document Status:** Complete v1.0
**Last Updated:** 2025-11-02
**Next Review:** After first implementation
**Contact:** Sally (UX Expert)
