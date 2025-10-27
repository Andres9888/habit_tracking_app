# Phase 3 Integration Guide
**Complete Feature Connection Map**

## Overview

This guide shows how all 4 Phase 3 features work together to create a cohesive user experience:

1. **Milestone Celebration** → Triggers achievement modals
2. **Share Card Generator** → Enables social sharing from celebrations
3. **Templates Library** → Provides starting point for new habits
4. **Habit Detail Stats** → Shows advanced analytics and predictions

---

## Feature Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                            │
└─────────────────────────────────────────────────────────────┘

1. Templates Library
   ↓ User browses and imports "Morning Meditation" template

2. Habit Creation
   ↓ Habit created with 0% strength

3. Daily Tracking
   ↓ User completes habit over multiple days
   ↓ Strength increases: 0% → 18% → 25% → 42% → 65%

4. Milestone Celebration ⭐
   ↓ Triggers at 60% (Strong level 💪)
   ↓ Confetti animation + achievement modal

5. Share Card Generator
   ↓ User taps "Share Achievement"
   ↓ Generates beautiful share card
   ↓ Posts to Instagram/Twitter/Facebook

6. Habit Detail Stats
   ↓ User taps habit to see full history
   ↓ Views 30-day trend graph
   ↓ Sees 7-day prediction (Premium)
   ↓ Gets risk assessment and suggestions
```

---

## 1. Templates Library → Habit Creation

### Integration Point: Import Flow

**File:** `src/screens/TemplatesScreen.tsx`
**Connects to:** Existing habit creation logic

```typescript
// When user imports a template
const handleImport = async (template: Template) => {
  // Create habit from template using Convex mutation
  const habitId = await convex.mutation(api.templates.importTemplate, {
    templateId: template._id,
    customizations: {
      name: template.name, // Can be customized
      icon: template.icon,
      iconColor: template.iconColor,
      // ... other fields
    },
  });

  // Initialize with 0% strength
  // Ready for tracking!
};
```

**User Flow:**
1. User taps Templates tab
2. Browses categories (Morning, Health, Productivity, Mindfulness)
3. Taps template card → Preview modal
4. Taps "Import" → Habit created
5. Returns to Home tab with new habit visible

**Analytics Tracked:**
- Template impressions (which templates are viewed)
- Import rate per template
- Popular templates (sorted by imports)

---

## 2. Daily Tracking → Milestone Detection

### Integration Point: Habit Completion

**File:** `src/App.tsx` (or your habit completion logic)
**Hook:** `useMilestoneDetection`

```typescript
import { useMilestoneDetection } from './hooks/useMilestoneDetection';
import MilestoneCelebration from './components/MilestoneCelebration';

function HabitTrackingScreen() {
  const [habits, setHabits] = useState([...]);

  // Detect milestones for all habits
  const { milestone, clearMilestone } = useMilestoneDetection(
    habits.map(h => ({
      id: h._id,
      name: h.name,
      strength: h.strength || 0,
    }))
  );

  const handleCompleteHabit = async (habitId: string) => {
    // 1. Mark habit as complete
    await convex.mutation(api.tracking.complete, { habitId });

    // 2. Recalculate strength (backend mutation)
    // This will update habit.strength value

    // 3. Hook automatically detects if strength crossed threshold
    // milestone will be populated if true
  };

  return (
    <>
      {/* Your habit list UI */}

      {/* Milestone celebration modal (auto-shows when detected) */}
      {milestone && (
        <MilestoneCelebration
          visible={true}
          level={milestone.level}
          strength={milestone.strength}
          habitName={milestone.habitName}
          onClose={clearMilestone}
          onShare={() => {
            // Transition to Share Card Generator
            setShowShareCard(true);
          }}
        />
      )}
    </>
  );
}
```

**Milestone Thresholds:**
- 20% → Starting 🌱
- 40% → Building 🌿
- 60% → Developing 🌳
- 80% → Strong 💪
- 90%+ → Automatic ⚡

**What Happens:**
1. User completes habit
2. Backend recalculates strength
3. Hook detects threshold crossing
4. Celebration modal auto-displays
5. Confetti animation plays
6. Haptic feedback triggers

---

## 3. Milestone Celebration → Share Card

### Integration Point: Share Button

**File:** `src/components/MilestoneCelebration.tsx`
**Connects to:** `ShareCardGenerator`

```typescript
import { ShareCardGenerator, type ShareCardData } from './ShareCardGenerator';

function MilestoneCelebration({ level, strength, habitName, onClose }) {
  const [showShareCard, setShowShareCard] = useState(false);

  const handleShare = () => {
    // Transition from celebration to share card
    setShowShareCard(true);
  };

  const shareData: ShareCardData = {
    habitName,
    milestoneLevel: level,
    strengthPercentage: strength,
    userName: currentUser?.name, // Optional
  };

  return (
    <>
      {/* Celebration modal UI */}
      <Button onPress={handleShare}>Share Achievement</Button>

      {/* Share card generator */}
      <ShareCardGenerator
        visible={showShareCard}
        data={shareData}
        onClose={() => {
          setShowShareCard(false);
          onClose(); // Close celebration too
        }}
      />
    </>
  );
}
```

**Transition Flow:**
1. User sees celebration modal (confetti)
2. Taps "Share Achievement" button
3. Celebration modal stays in background
4. Share card generator slides up
5. User customizes card (gradient, message)
6. Selects platform (Instagram/Twitter/Facebook)
7. Taps Share → Native share sheet
8. Posts to social media
9. Both modals dismiss

**Share Card Customizations:**
- Background gradient (5 presets)
- Personal message (100 char max)
- User name visibility toggle
- Platform format selection

---

## 4. Habit List → Habit Detail Stats

### Integration Point: Habit Card Tap

**File:** `src/App.tsx`
**Component:** `HabitDetailScreen`

```typescript
import HabitDetailScreen from './screens/HabitDetailScreen';

function App() {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  return (
    <>
      {/* Home screen with habit cards */}
      <FlatList
        data={habits}
        renderItem={({ item: habit }) => (
          <HabitCard
            habit={habit}
            onPress={() => setSelectedHabit(habit)} // Open detail
            onComplete={() => handleComplete(habit._id)}
          />
        )}
      />

      {/* Habit detail modal */}
      <HabitDetailScreen
        visible={selectedHabit !== null}
        habit={selectedHabit}
        onClose={() => setSelectedHabit(null)}
        isPremium={user.isPremium}
      />
    </>
  );
}
```

**Detail Screen Features:**

**For All Users:**
- Enhanced strength indicator (large, full variant)
- Formula transparency ("See how it's calculated")
- Edit/Pause/Archive/Delete buttons

**For Premium Users:**
- 30-day strength history graph (line chart)
- 7-day predictions with confidence levels
- Risk assessment (High/Medium/Low)
- Trend indicators (Improving/Stable/Declining)
- Suggested actions based on risk

**Paywall Triggers:**
- Tap locked chart → Show paywall modal
- Tap locked predictions → Show paywall modal

---

## Complete User Flow Example

### Scenario: New User Journey (Day 1 to Day 45)

**Day 1: Discovery**
```
1. User opens app
2. Navigates to Templates tab
3. Browses "Mindfulness" category
4. Selects "5-Minute Meditation" template
5. Previews template (sees citation: "Goyal et al. 2014")
6. Taps "Import" → Habit created
7. Returns to Home tab
8. Sees new habit: "5-Minute Meditation" (0% strength 🌱)
9. Completes first session
10. Strength updates to 3%
```

**Day 7: First Milestone**
```
11. Strength reaches 21% (crosses 20% threshold)
12. 🎉 Milestone Celebration modal appears
13. Confetti animation plays (green + gold)
14. Badge shows: 🌱 Starting Level (21%)
15. User taps "Share Achievement"
16. Share card generator opens
17. Selects "Growth" gradient background
18. Adds message: "Week 1 of daily meditation!"
19. Selects Instagram Story format
20. Taps Share → Posts to Instagram
```

**Day 14: Deeper Engagement**
```
21. Strength now at 38%
22. User taps habit card → Opens Habit Detail
23. Sees enhanced strength indicator
24. Taps "See how it's calculated" tooltip
25. Understands: Accessibility × Compliance = 38%
26. Tries to view 30-day chart → Paywall appears
27. Starts 7-day free trial
28. Now sees full history graph
```

**Day 30: Strong Habit**
```
29. Strength reaches 62% (crosses 60% threshold)
30. 🎉 Celebration modal: 💪 Strong Level!
31. More impressive confetti + heavy haptic
32. User shares again (different gradient)
33. Opens Habit Detail
34. Views 30-day trend (premium unlocked)
35. Sees 7-day prediction: "67% expected strength"
36. Risk assessment: "Low risk, keep it up!"
37. Suggested action: "Maintain current frequency"
```

**Day 45: Fully Automatic**
```
38. Strength reaches 82% (crosses 80% threshold)
39. 🎉 Final celebration: ⚡ Automatic Level!
40. User feels accomplished
41. Explores Templates again
42. Imports "Morning Pages" template
43. Cycle begins for new habit
```

---

## Integration Checklist

Use this checklist to verify all features are properly connected:

### ✅ Templates → Habits
- [ ] Templates tab visible in tab bar
- [ ] Category filtering works (All, Morning, Health, Productivity, Mindfulness)
- [ ] Template cards display correctly
- [ ] Preview modal shows full details + citation
- [ ] Import creates habit in database
- [ ] New habit appears in Home tab
- [ ] Template usage analytics tracked

### ✅ Habits → Milestones
- [ ] useMilestoneDetection hook installed
- [ ] Hook detects threshold crossings (20%, 40%, 60%, 80%)
- [ ] MilestoneCelebration modal displays on detection
- [ ] Confetti animation plays (100 particles)
- [ ] Correct emoji shows for each level
- [ ] Haptic feedback triggers
- [ ] Reduce Motion alternative works

### ✅ Milestones → Sharing
- [ ] "Share Achievement" button visible in celebration modal
- [ ] Button tap opens ShareCardGenerator
- [ ] Share card displays correct milestone data
- [ ] Gradient backgrounds work (5 presets)
- [ ] Personal message input works
- [ ] User name toggle works
- [ ] Platform format selection works
- [ ] Native share sheet opens
- [ ] Share completes successfully

### ✅ Habits → Detail Stats
- [ ] Habit card tap opens HabitDetailScreen
- [ ] Enhanced strength indicator shows
- [ ] Formula transparency tooltip works
- [ ] Edit/Pause/Archive/Delete buttons present
- [ ] Free users see locked charts with upgrade prompts
- [ ] Premium users see full 30-day history graph
- [ ] Premium users see 7-day predictions
- [ ] Risk assessment displays correctly
- [ ] Suggested actions show
- [ ] Swipe-to-dismiss gesture works

---

## Code File Map

### Core Integration Files

**App Entry Point:**
```
src/App.tsx
├── Imports: HabitDetailScreen, MilestoneCelebration
├── Hooks: useMilestoneDetection
└── Modals: HabitDetail, Milestone, ShareCard
```

**Phase 3 Components:**
```
src/
├── components/
│   ├── MilestoneCelebration.tsx      (Celebration modal)
│   ├── ShareCardGenerator.tsx        (Social sharing)
│   ├── TemplateCard.tsx              (Template display)
│   ├── StrengthHistoryChart.tsx      (30-day graph)
│   └── PredictionInsights.tsx        (7-day forecast)
│
├── screens/
│   ├── TemplatesScreen.tsx           (Templates tab)
│   └── HabitDetailScreen.tsx         (Detail modal)
│
└── hooks/
    └── useMilestoneDetection.ts      (Threshold detection)
```

**Backend Functions:**
```
convex/
├── templates.ts
│   ├── list()              (Query templates by category)
│   ├── importTemplate()    (Create habit from template)
│   └── seedTemplates()     (Populate 20 templates)
│
└── schema.ts
    ├── templates           (Template definitions)
    └── templateUsage       (Analytics tracking)
```

---

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         CONVEX BACKEND                          │
└────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
    [templates]          [habits]            [tracking]
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Templates       │  │ Habit Strength  │  │ Completion      │
│ Library         │──│ Calculation     │──│ Detection       │
│                 │  │ (Backend)       │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                    │                    │
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Import Flow     │  │ Milestone       │  │ Celebration     │
│ (Create Habit)  │  │ Detection Hook  │  │ Modal           │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                             │                    │
                             │                    │
                             ▼                    ▼
                     ┌─────────────────┐  ┌─────────────────┐
                     │ Habit Detail    │  │ Share Card      │
                     │ Screen          │  │ Generator       │
                     └─────────────────┘  └─────────────────┘
```

---

## Testing Integration Points

### 1. Templates → Habits
**Test:** Import template and verify habit creation
```bash
1. Open Templates tab
2. Select "Morning Meditation"
3. Tap Import
4. Go to Home tab
5. ✅ Verify habit appears with 0% strength
```

### 2. Habits → Milestones
**Test:** Complete habits until milestone triggers
```bash
1. Complete "Morning Meditation" daily
2. After ~7 days, strength should reach 20%
3. ✅ Verify celebration modal appears
4. ✅ Verify confetti animation
5. ✅ Verify haptic feedback
```

### 3. Milestones → Sharing
**Test:** Share achievement from celebration
```bash
1. In celebration modal, tap "Share Achievement"
2. ✅ Verify ShareCardGenerator opens
3. Select gradient and add message
4. Tap Share
5. ✅ Verify native share sheet opens
```

### 4. Habits → Detail Stats
**Test:** View habit history and predictions
```bash
1. Tap any habit card
2. ✅ Verify HabitDetailScreen opens
3. If premium:
   - ✅ Verify 30-day chart displays
   - ✅ Verify predictions show
4. If free:
   - ✅ Verify locked state with upgrade prompt
```

---

## Troubleshooting

### Milestones Not Triggering
**Symptoms:** Habit strength increases but no celebration modal

**Checks:**
- Is `useMilestoneDetection` hook imported and used?
- Is `MilestoneCelebration` component rendered in App?
- Is `milestone` state checked for null before rendering?
- Check console for errors

**Fix:**
```typescript
// Ensure hook is called at top level
const { milestone, clearMilestone } = useMilestoneDetection(
  habits.map(h => ({ id: h._id, name: h.name, strength: h.strength || 0 }))
);

// Ensure modal is rendered
{milestone && (
  <MilestoneCelebration
    visible={true}  // Must be true when milestone exists
    {...milestone}
    onClose={clearMilestone}
  />
)}
```

### Share Card Not Generating
**Symptoms:** Share button tapped but nothing happens

**Checks:**
- Are dependencies installed? (`react-native-view-shot`, `expo-sharing`)
- Is device (not simulator)?
- Check console for errors

**Fix:**
```bash
npm install react-native-view-shot expo-sharing
npx expo prebuild --clean
```

### Templates Not Loading
**Symptoms:** Templates tab empty or loading forever

**Checks:**
- Did templates seed successfully?
- Is Convex connected?
- Check network tab for API errors

**Fix:**
```bash
# Re-seed templates
npx convex run templates:seedTemplates

# Verify seeding
npx convex run templates:list
```

### Charts Not Showing (Premium Users)
**Symptoms:** History chart shows "locked" even for premium

**Checks:**
- Is `isPremium` prop passed correctly to HabitDetailScreen?
- Is subscription status up to date?

**Fix:**
```typescript
// Ensure premium status is checked
<HabitDetailScreen
  visible={showDetail}
  habit={selectedHabit}
  isPremium={user?.subscription?.status === 'active'}
  onClose={() => setShowDetail(false)}
/>
```

---

## Performance Optimization

### Milestone Detection
- Hook uses `useMemo` to prevent re-detection on every render
- Only recalculates when habit strength values change
- Stores previous milestone to prevent duplicates

### Share Card Generation
- Image generation is on-demand (not automatic)
- Preview uses CSS transform (no re-render)
- Off-screen rendering (no layout thrashing)

### Charts Rendering
- SVG-based (lightweight, performant)
- Data memoized (only recalculates on prop change)
- Handles up to 90 days of data smoothly

### Templates Loading
- Indexed by category in Convex
- Client-side filtering for instant UX
- Pagination for future expansion (not needed for 20 templates)

---

## Next Steps

After verifying integration:

1. **Analytics Setup**
   - Track template imports
   - Track milestone celebrations
   - Track share card generations
   - Track detail screen views

2. **A/B Testing**
   - Test different gradient themes
   - Test celebration timing (immediate vs delayed)
   - Test share card layouts

3. **Premium Conversion**
   - Monitor paywall trigger rate from detail screen
   - Track free trial starts from milestone sharing
   - Optimize upgrade prompts

4. **User Feedback**
   - Collect feedback on template quality
   - Survey favorite celebration moments
   - Ask about share card designs

---

## Resources

- **UX Specification:** `/docs/ux-specification.md` (Section 9.2, Flow 5, Section 8.2)
- **Component Docs:** Each component has inline JSDoc
- **Example Integrations:** Check `*.example.tsx` files
- **Backend Functions:** `convex/templates.ts`

---

**Integration Status:** ✅ All features connected and ready for testing

**Last Updated:** October 22, 2025
