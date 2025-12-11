# Habit Detail Page - Comprehensive Redesign

_UX Specification by Sally (UX Expert) for Jane_
_Created: November 26, 2025_

---

## 🎯 Executive Summary

This redesign transforms the Habit Detail Page from a functional modal into an **engagement powerhouse** that drives retention, celebrates progress, and reduces friction for daily tracking.

### Key Enhancements
1. **Streak Visualization** — Prominent chain display with best streak
2. **Quick Completion** — One-tap complete from detail view
3. **Inline Calendar** — 30-day history at a glance
4. **Enhanced Stats** — Completion rate, total days, miss rate
5. **Notes Integration** — Recent notes + quick add
6. **Visual Polish** — Better hierarchy, micro-interactions, delight

---

## 📐 Layout Architecture

### Screen Structure (Top to Bottom)

```
┌─────────────────────────────────────────┐
│ ← Close                    Edit ✏️      │ Navigation Bar
├─────────────────────────────────────────┤
│                                         │
│         🧘                              │ Hero Section
│    Morning Meditation                   │ - Icon (64pt)
│    "Start your day mindfully"           │ - Name + Notes
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  ✓  Mark Complete for Today     │   │ Quick Action Button
│   └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  🔥 Current Streak                      │ Streak Section
│  ┌───┬───┬───┬───┬───┬───┬───┐         │
│  │ ● │ ● │ ● │ ● │ ● │ ● │ ○ │ 12 days │ - Visual chain
│  └───┴───┴───┴───┴───┴───┴───┘         │ - Best streak badge
│         Best: 28 days 🏆                │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  💪 Habit Strength                      │ Strength Section
│  ▰▰▰▰▰▰▰▱▱▱  68% Strong                │ - Progress bar
│                                         │ - Formula tooltip
│  ℹ️ What powers this?                   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  📅 Last 30 Days                        │ Calendar Section
│  ┌─────────────────────────────────┐   │
│  │ M  T  W  T  F  S  S             │   │ - GitHub-style heatmap
│  │ ■  ■  □  ■  ■  ■  □  Week 1     │   │ - Tap day for details
│  │ ■  ■  ■  □  ■  ■  □  Week 2     │   │
│  │ ■  ■  ■  ■  ■  □  □  Week 3     │   │
│  │ ■  ■  ■  ■  ●  ○  ○  Week 4     │   │ ● = today
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  📊 Stats                               │ Stats Grid
│  ┌──────────┐ ┌──────────┐             │
│  │    47    │ │   89%    │             │ - Total completions
│  │ Total ✓  │ │ Success  │             │ - Success rate
│  └──────────┘ └──────────┘             │ - Current streak
│  ┌──────────┐ ┌──────────┐             │ - Days tracking
│  │    12    │ │   52     │             │
│  │ Streak 🔥│ │ Days     │             │
│  └──────────┘ └──────────┘             │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  📝 Notes                               │ Notes Section
│  ┌─────────────────────────────────┐   │
│  │ "Felt great after 10 min..."   │   │ - Recent note preview
│  │ Nov 25, 2025                    │   │ - Quick add button
│  └─────────────────────────────────┘   │
│  [+ Add Note]                          │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ⚙️ Manage Habit                        │ Actions Section
│  ┌─────────────────────────────────┐   │
│  │ 📅 View Full Calendar           │   │
│  │ ⏸️  Pause Habit                  │   │
│  │ 📦 Archive                       │   │
│  │ 🗑️  Delete                       │   │ (destructive)
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🧩 Component Specifications

### 1. Hero Section

```tsx
interface HeroSectionProps {
  icon: string;           // Emoji
  iconColor: string;      // Background color
  name: string;           // Habit name
  notes?: string;         // Optional description
  completedToday: boolean;
}
```

**Visual Specs:**
- Icon container: 64×64pt, rounded-2xl (16pt radius)
- Icon size: 40pt emoji
- Name: 24pt bold, stone-900
- Notes: 15pt regular, stone-500, max 2 lines
- Spacing: 16pt between elements

**States:**
- Default: Full opacity
- Completed today: Subtle green tint on icon background, checkmark badge

---

### 2. Quick Completion Button

```tsx
interface QuickCompleteProps {
  habitId: Id<'habits'>;
  completedToday: boolean;
  onComplete: () => void;
  onUncomplete: () => void;
}
```

**Visual Specs:**
- Height: 52pt (larger for primary action)
- Border radius: 16pt (rounded-2xl)
- Background:
  - Not completed: Primary green gradient (`from-emerald-500 to-emerald-600`)
  - Completed: Stone-100 with green border
- Text: 17pt semibold, white (or green when completed)
- Icon: Checkmark, 20pt

**States & Animations:**
```
Not Completed → Tap:
1. Scale down (0.97) - 50ms
2. Haptic: Medium impact
3. Scale up with bounce (1.0) - 200ms spring
4. Background transitions to completed state - 300ms
5. Checkmark rotates in - 300ms
6. Confetti burst (subtle, 20 particles) - 500ms

Completed → Tap:
1. Haptic: Light impact
2. Smooth transition to uncompleted state - 200ms
```

---

### 3. Streak Section

```tsx
interface StreakSectionProps {
  currentStreak: number;
  bestStreak: number;
  lastSevenDays: boolean[]; // [true, true, false, true, ...] for chain visual
}
```

**Visual Specs:**
- Section padding: 20pt
- Background: White/90 with subtle shadow
- Border radius: 16pt

**Streak Chain Visual:**
```
Chain Links (horizontal scroll if > 7):
┌───┐   ┌───┐   ┌───┐
│ 🔥 │───│ 🔥 │───│ 🔥 │───...
└───┘   └───┘   └───┘
  ↑       ↑       ↑
Completed days show fire emoji
Missed days show gray circle
Today shows pulsing ring if incomplete

Link size: 36×36pt
Gap: 8pt (chain connector visible)
```

**Best Streak Badge:**
- Position: Below chain, right-aligned
- Icon: 🏆 trophy
- Text: "Best: X days" in stone-500
- If current > best: Show "New Record! 🎉" with celebration

**Animation:**
- Chain links stagger in from left (50ms delay each)
- Fire emojis have subtle pulse animation
- Best streak badge bounces when new record

---

### 4. Strength Section

Reuse existing `HabitStrengthIndicator` with `variant="full"` but enhanced:

**Enhancements:**
- Add trend indicator arrow (↑ improving, ↓ declining, → stable)
- Show change since last week: "+3% this week"
- Premium badge for detailed breakdown

---

### 5. Calendar Heatmap Section

```tsx
interface CalendarHeatmapProps {
  habitId: Id<'habits'>;
  data: { date: string; completed: boolean }[]; // Last 30 days
  onDayPress?: (date: string) => void;
}
```

**Visual Specs:**
- Grid: 7 columns (S M T W T F S), 4-5 rows
- Cell size: 32×32pt
- Cell gap: 4pt
- Cell radius: 8pt

**Cell States:**
```
Completed:   ■ Emerald-500, scale 1.0
Missed:      □ Stone-200, scale 0.9
Today:       ● Emerald-500 with pulsing ring (if incomplete: amber ring)
Future:      ○ Stone-100, disabled
```

**Interaction:**
- Tap cell → Show tooltip with date + completion status
- Long press → Option to toggle completion (within last 7 days only)

**Animation:**
- Cells fade in with stagger (10ms each, left-to-right, top-to-bottom)
- Completed cells have subtle shimmer on first load

---

### 6. Stats Grid Section

```tsx
interface StatsGridProps {
  totalCompletions: number;
  successRate: number;      // Percentage
  currentStreak: number;
  daysTracking: number;     // Days since created
}
```

**Visual Specs:**
- Grid: 2×2
- Card size: Flexible, ~160pt width
- Card padding: 16pt
- Card radius: 12pt
- Card background: White with subtle border

**Card Layout:**
```
┌─────────────────┐
│       47        │  ← Value: 28pt bold, stone-900
│    Total ✓      │  ← Label: 13pt regular, stone-500
└─────────────────┘
```

**Optional Premium Stats (Gated):**
- Average completion time
- Most consistent day of week
- Predicted next completion probability

---

### 7. Notes Section

```tsx
interface NotesSectionProps {
  habitId: Id<'habits'>;
  recentNote?: {
    body: string;
    date: string;
  };
  onAddNote: () => void;
  onViewAllNotes: () => void;
}
```

**Visual Specs:**
- Show most recent note (truncated to 2 lines)
- Date in caption style below
- "Add Note" button: Ghost style with + icon

**Empty State:**
```
┌─────────────────────────────────┐
│  📝 No notes yet               │
│  Capture your thoughts and     │
│  track what works for you.     │
│                                │
│  [+ Add Your First Note]       │
└─────────────────────────────────┘
```

---

### 8. Actions Section

Keep existing actions but with improved visual hierarchy:

**Order (top to bottom, by frequency of use):**
1. View Full Calendar (neutral)
2. Pause Habit (neutral, with warning sublabel)
3. Archive (neutral)
4. Delete (destructive, red tint)

**Visual Specs:**
- Each action: 52pt height, rounded-xl
- Icon: 20pt, left-aligned
- Chevron: Right-aligned for navigation actions
- Destructive: Red-50 background, red-600 text

---

## 🎬 Animations & Micro-interactions

### Page Load Sequence

```
0ms:    Modal slides up (spring, 300ms)
100ms:  Hero section fades in
200ms:  Quick complete button scales in (spring)
300ms:  Streak chain staggers in (50ms per link)
400ms:  Strength bar animates to value
500ms:  Calendar cells stagger in (10ms each)
600ms:  Stats cards fade in simultaneously
700ms:  Notes and actions fade in
```

### Completion Celebration (When marking complete from this screen)

```
0ms:    Button press animation
50ms:   Haptic: Medium impact
100ms:  Button transforms to completed state
200ms:  Streak chain adds new link with bounce
300ms:  Stats update with count-up animation
400ms:  Calendar cell fills in with ripple
500ms:  If milestone reached → Celebration modal
```

### Reduce Motion Alternative

- All animations become instant fades (150ms)
- No springs, bounces, or staggers
- Haptics remain (functional feedback)

---

## 🎨 Visual Design Tokens

### Colors Used

```tsx
const habitDetailColors = {
  // Backgrounds
  pageBg: 'bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100',
  cardBg: 'bg-white/90 backdrop-blur-sm',

  // Streak
  streakFire: '#F59E0B',      // Amber-500
  streakComplete: '#10B981',  // Emerald-500
  streakMissed: '#E5E7EB',    // Stone-200

  // Stats
  statValue: '#1F2937',       // Stone-800
  statLabel: '#6B7280',       // Stone-500

  // Actions
  actionDefault: '#FFFFFF',
  actionDestructive: '#FEF2F2', // Red-50
  textDestructive: '#DC2626',   // Red-600
};
```

### Typography Scale

```tsx
const habitDetailTypography = {
  heroName: 'text-2xl font-bold text-stone-900',        // 24pt
  heroNotes: 'text-base text-stone-500',                // 16pt
  sectionTitle: 'text-lg font-semibold text-stone-800', // 18pt
  statValue: 'text-3xl font-bold text-stone-900',       // 28pt
  statLabel: 'text-sm text-stone-500',                  // 14pt
  buttonText: 'text-base font-semibold',                // 16pt
};
```

### Spacing

```tsx
const habitDetailSpacing = {
  screenPadding: 20,      // px-5
  sectionGap: 16,         // gap-4 between cards
  cardPadding: 20,        // p-5
  innerGap: 12,           // gap-3 within cards
};
```

---

## ♿ Accessibility Requirements

### Screen Reader Announcements

```tsx
// Hero
accessibilityLabel={`${name} habit. ${notes || 'No description'}. ${completedToday ? 'Completed today' : 'Not yet completed today'}`}

// Quick Complete Button
accessibilityLabel={completedToday ? 'Mark as not complete' : 'Mark complete for today'}
accessibilityRole="button"
accessibilityState={{ checked: completedToday }}

// Streak Section
accessibilityLabel={`Current streak: ${currentStreak} days. Best streak: ${bestStreak} days`}

// Calendar Cell
accessibilityLabel={`${format(date, 'EEEE, MMMM d')}. ${completed ? 'Completed' : 'Not completed'}`}
accessibilityRole="button"

// Stats
accessibilityLabel={`${value} ${label}`}
```

### Focus Management

- On modal open: Focus moves to close button
- After completion: Announce "Habit marked complete. Streak is now X days"
- Tab order: Close → Edit → Quick Complete → Streak → Strength → Calendar → Stats → Notes → Actions

### Touch Targets

- All interactive elements: Minimum 44×44pt
- Calendar cells: 32×32pt visible, 44×44pt touch area (with padding)
- Action buttons: 52pt height

---

## 📱 Responsive Considerations

### Small Devices (iPhone SE - 375pt width)

- Stats grid: Reduce card padding to 12pt
- Calendar cells: Reduce to 28×28pt
- Streak chain: Show max 5 visible, scroll for more

### Large Devices (iPhone Pro Max - 428pt width)

- Allow more breathing room between sections
- Calendar cells can be 36×36pt
- Stats grid cards have more padding

---

## 🔗 Data Requirements

### Existing Data (No Backend Changes)

From `habits` table:
- `name`, `icon`, `iconColor`, `notes`
- `strength`, `strengthLevel`
- `currentStreak`, `bestStreak`
- `totalCompletions`, `totalMisses`
- `createdAt`

From `tracking` table:
- Last 30 days completion data
- Today's completion status

From `notes` table:
- Most recent note for this habit

### Computed Values

```tsx
const successRate = totalCompletions / (totalCompletions + totalMisses) * 100;
const daysTracking = Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24));
const lastSevenDays = trackingData.slice(-7).map(t => t.completed);
```

---

## 🚀 Implementation Priorities

### Phase 1: Core Enhancements (2-3 hours)
1. ✅ Hero section redesign
2. ✅ Quick completion button
3. ✅ Streak visualization

### Phase 2: Data Display (2-3 hours)
4. ✅ Stats grid
5. ✅ Calendar heatmap (simplified)
6. ✅ Notes section

### Phase 3: Polish (1-2 hours)
7. ✅ Animations and micro-interactions
8. ✅ Accessibility pass
9. ✅ Reduce motion support

**Total Estimated Time: 5-8 hours**

---

## 📁 Files to Create/Modify

### New Components
- `src/components/StreakChainSection/StreakChainSection.tsx`
- `src/components/QuickCompleteButton/QuickCompleteButton.tsx`
- `src/components/CalendarHeatmap/CalendarHeatmap.tsx`
- `src/components/StatsGrid/StatsGrid.tsx`
- `src/components/NotesSection/NotesSection.tsx`

### Modified Files
- `src/screens/HabitDetailScreen.tsx` (major refactor)

---

## ✅ Success Metrics

After implementation, measure:
- **Completion rate from detail page** (new capability)
- **Time spent on detail page** (engagement)
- **Streak length increase** (retention indicator)
- **Notes added per user** (engagement depth)

---

_Ready to implement! Start with Phase 1 for quickest impact._ 🎨












