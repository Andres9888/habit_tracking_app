# Calendar Heatmap Quick Reference
## Developer Implementation Guide

**Version:** 1.0
**Last Updated:** 2025-12-22

---

## 🎯 TL;DR - Key Changes

| What | From (V4 Traditional) | To (V3 GitHub-Style) |
|------|----------------------|---------------------|
| **Layout** | Vertical (weeks as rows) | Horizontal (weeks as columns) |
| **Time Range** | 1 month | 3 months (90 days) |
| **Cell Size** | 45px × 45px | 24px × 24px (mobile) |
| **Navigation** | Month arrows | Horizontal scroll |
| **Pattern Recognition** | Poor (vertical scan) | Excellent (day-of-week rows) |

---

## 📐 Critical Dimensions

```typescript
// Mobile (Primary Target)
const MOBILE_SPEC = {
  cellSize: 24,              // 24px × 24px cells
  gap: 3,                    // 3px between cells
  dayLabelWidth: 20,         // Left column width
  totalWeeks: 13,            // ~3 months
  totalWidth: 371,           // Fits 390px iPhone
  hitSlop: { top: 4, bottom: 4, left: 4, right: 4 }, // Increase tap area
};

// Calculation
// Width = (24px cell + 3px gap) × 13 weeks + 20px labels
//       = 27px × 13 + 20px = 371px ✅
```

---

## 🎨 Color System

```typescript
// Streak-based intensity
const CELL_COLORS = {
  empty:       '#f5f5f4',  // stone-100
  day1to6:     '#6ee7b7',  // emerald-300 (fresh start)
  day7to13:    '#34d399',  // emerald-400 (building)
  day14to29:   '#10b981',  // emerald-500 (strong)
  day30plus:   '#059669',  // emerald-600 (legendary)
  todayPending: '#fef3c7', // amber-50 (with pulse)
  todayDone:   '#10b981',  // emerald-500 + amber border
  future:      '#fafaf9',  // stone-50 (dashed, 40% opacity)
};
```

---

## 🏗️ Layout Structure

```tsx
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  <View style={{ flexDirection: 'row' }}>
    {/* Day Labels (Sticky Left) */}
    <View style={{ flexDirection: 'column', paddingRight: 8 }}>
      <Text style={dayLabelStyle}>S</Text>
      <Text style={dayLabelStyle}>M</Text>
      <Text style={dayLabelStyle}>T</Text>
      <Text style={dayLabelStyle}>W</Text>
      <Text style={dayLabelStyle}>T</Text>
      <Text style={dayLabelStyle}>F</Text>
      <Text style={dayLabelStyle}>S</Text>
    </View>

    {/* Week Columns (13 columns) */}
    {weeks.map((week, columnIndex) => (
      <View key={columnIndex} style={{ flexDirection: 'column', marginLeft: 3 }}>
        {week.map((dateStr, rowIndex) => (
          <DayCell
            key={rowIndex}
            dateStr={dateStr}
            cellSize={24}
            gap={3}
            // ... other props
          />
        ))}
      </View>
    ))}
  </View>
</ScrollView>
```

---

## ⚡ Auto-Scroll Implementation

```typescript
// Scroll to show current week on right edge
useEffect(() => {
  if (scrollViewRef.current) {
    const todayColumnIndex = weeks.findIndex(week =>
      week.some(date => date && isToday(parseISO(date)))
    );

    if (todayColumnIndex !== -1) {
      const scrollX = Math.max(0, (todayColumnIndex - 10) * (cellSize + gap));
      scrollViewRef.current.scrollTo({
        x: scrollX,
        animated: true,
      });
    }
  }
}, [weeks]);
```

---

## 🔄 Streak Position Calculation

```typescript
/**
 * Calculate position in current streak for color intensity
 * Returns: 0 (not completed), 1-6, 7-13, 14-29, 30+
 */
function calculateStreakPosition(
  date: string,
  completedDates: Set<string>
): number {
  if (!completedDates.has(date)) return 0;

  let position = 1;
  const d = new Date(date);

  // Count backward to find streak start
  while (position < 100) {
    d.setDate(d.getDate() - 1);
    const prevDateStr = d.toISOString().split('T')[0];
    if (!completedDates.has(prevDateStr)) break;
    position++;
  }

  return position;
}

// Map to color
function getStreakColor(position: number): string {
  if (position === 0) return CELL_COLORS.empty;
  if (position <= 6) return CELL_COLORS.day1to6;
  if (position <= 13) return CELL_COLORS.day7to13;
  if (position <= 29) return CELL_COLORS.day14to29;
  return CELL_COLORS.day30plus;
}
```

---

## 🎬 Animations

### Entry Animation (Right-to-Left Cascade)

```typescript
// Stagger by column (most recent first)
const getAnimationDelay = (columnIndex: number, totalColumns: number) => {
  return (totalColumns - columnIndex - 1) * 15; // 15ms per column
};

// Usage
<Animated.View
  entering={FadeIn.delay(getAnimationDelay(colIndex, weeks.length)).duration(200)}
>
  {/* Week column content */}
</Animated.View>
```

### Today Cell Pulse

```typescript
// Pulse animation for pending today cell
const pulseAnimation = useSharedValue(1);

useEffect(() => {
  pulseAnimation.value = withRepeat(
    withSequence(
      withTiming(1.05, { duration: 700, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      withTiming(1, { duration: 700, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    ),
    -1, // Infinite
    false
  );
}, []);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: pulseAnimation.value }],
}));
```

---

## ♿ Accessibility

### Cell Accessibility Label

```typescript
function getCellA11yLabel(
  date: string,
  completed: boolean,
  streakPosition: number
): string {
  const dateStr = format(parseISO(date), 'EEEE, MMMM d');
  const statusStr = completed
    ? `completed, ${streakPosition} day streak`
    : 'not completed';
  return `${dateStr}, ${statusStr}`;
}

// Usage
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={getCellA11yLabel(date, completed, streakPosition)}
  accessibilityHint="Double tap to view details or toggle completion"
  accessibilityState={{ checked: completed, disabled: isFuture }}
>
  {/* Cell content */}
</Pressable>
```

### Reduce Motion Support

```typescript
const prefersReducedMotion = useAccessibilityInfo().isReduceMotionEnabled;

const entering = prefersReducedMotion
  ? undefined
  : FadeIn.delay(animationDelay).duration(200);
```

---

## 🎯 Hit Target Optimization

```typescript
// Increase tap area without changing visual size
<Pressable
  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
  style={{
    width: 24,
    height: 24,
    // ... other styles
  }}
>
  {/* Cell content */}
</Pressable>
```

**Why:** 24px is below Apple's 44px recommendation. `hitSlop` makes it easier to tap without increasing visual size.

---

## 📊 Horizontal Grid Generation

```typescript
/**
 * Generate horizontal grid for 3 months
 * Returns: { weeks: string[][], monthLabels: { weekIndex, label }[] }
 */
function generateHorizontalGrid(
  currentDate: Date,
  completedDates: Set<string>,
  habitCreatedAt?: number
): {
  weeks: (string | null)[][];
  monthLabels: { weekIndex: number; label: string }[];
} {
  const endDate = currentDate;
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 90); // ~3 months

  const weeks: (string | null)[][] = [];
  let currentWeek: (string | null)[] = Array(7).fill(null);
  let weekIndex = 0;

  // Find the Sunday before startDate
  const firstSunday = new Date(startDate);
  firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());

  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;

  for (let d = new Date(firstSunday); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay(); // 0 = Sunday
    const dateStr = d.toISOString().split('T')[0];

    currentWeek[dayOfWeek] = dateStr;

    // Track month changes for labels
    if (d.getMonth() !== lastMonth) {
      monthLabels.push({
        weekIndex,
        label: d.toLocaleDateString('en-US', { month: 'short' }),
      });
      lastMonth = d.getMonth();
    }

    // Complete week (Saturday reached)
    if (dayOfWeek === 6) {
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(null);
      weekIndex++;
    }
  }

  // Add partial final week if needed
  if (currentWeek.some(d => d !== null)) {
    weeks.push(currentWeek);
  }

  return { weeks, monthLabels };
}
```

---

## 🐛 Common Pitfalls

### ❌ Don't: Show date numbers in cells
```tsx
// BAD - Too small to read
<Text style={{ fontSize: 8 }}>{dayOfMonth}</Text>
```

**Why:** 24px cells are too small for legible date numbers. Use color intensity instead.

### ❌ Don't: Use vertical layout
```tsx
// BAD - Traditional calendar layout
<View style={{ flexDirection: 'column' }}>
  {weeks.map(week => (
    <View style={{ flexDirection: 'row' }}>
      {week.map(day => <DayCell />)}
    </View>
  ))}
</View>
```

**Why:** Vertical layout makes day-of-week patterns invisible.

### ❌ Don't: Animate left-to-right
```tsx
// BAD - Draws attention to old data first
const delay = columnIndex * 15;
```

**Why:** Right-to-left (recent-to-old) feels more natural for time-based data.

### ✅ Do: Use FlatList for performance
```tsx
// GOOD - Virtualizes for smooth scroll
<FlatList
  horizontal
  data={weeks}
  renderItem={({ item, index }) => <WeekColumn week={item} index={index} />}
  keyExtractor={(item, index) => `week-${index}`}
  getItemLayout={(data, index) => ({
    length: cellSize + gap,
    offset: (cellSize + gap) * index,
    index,
  })}
  removeClippedSubviews={true}
/>
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] `generateHorizontalGrid` returns 13 weeks for 3 months
- [ ] `calculateStreakPosition` correctly counts backward
- [ ] `getStreakColor` maps position to correct color
- [ ] Month labels appear at correct week indices

### Component Tests
- [ ] Day labels render in correct order (S M T W T F S)
- [ ] Cells render with correct colors based on streak
- [ ] Today cell has pulse animation
- [ ] Future cells are disabled and styled correctly
- [ ] Horizontal scroll works smoothly

### Integration Tests
- [ ] Auto-scrolls to current week on mount
- [ ] Tapping cell shows tooltip with details
- [ ] Haptic feedback fires on tap (iOS/Android)
- [ ] Screen reader announces cell labels correctly
- [ ] Reduced motion preference disables animations

### Manual Testing (5+ Devices)
- [ ] iPhone SE (small screen) - 375px width
- [ ] iPhone 14 Pro - 390px width
- [ ] iPhone 14 Pro Max - 428px width
- [ ] iPad Mini - 834px width
- [ ] Android (various)

---

## 🔗 Related Files

- **Spec:** `docs/specs/habit-details-screen/calendar-heatmap-github-style.md`
- **UX Analysis:** `docs/specs/habit-details-screen/calendar-heatmap-ux-analysis.md`
- **Design Mockups:** `.superdesign/design_iterations/calendar_heatmap_3.html`
- **Current Implementation:** `src/components/CalendarHeatmap/CalendarHeatmap.tsx`

---

## 🚀 Quick Start Commands

```bash
# Run tests
npm test -- CalendarHeatmap

# Run specific test file
npm test -- CalendarHeatmap.test.tsx

# Run with coverage
npm test -- --coverage CalendarHeatmap

# Run integration tests
npm test -- CalendarHeatmap.integration.test.tsx

# Start app and navigate to habit details
npm start
```

---

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/calendar-heatmap-github-style

# Commit convention
git commit -m "feat(calendar): implement GitHub-style horizontal layout"
git commit -m "feat(calendar): add streak-based color intensity"
git commit -m "feat(calendar): implement auto-scroll to current week"
git commit -m "test(calendar): add horizontal grid generation tests"
git commit -m "docs(calendar): update component documentation"

# Push and create PR
git push origin feature/calendar-heatmap-github-style
gh pr create --title "Calendar Heatmap: GitHub-Style Horizontal Layout" \
  --body "Implements GitHub-style 3-month horizontal heatmap with pattern recognition focus"
```

---

## ⚙️ Environment Setup

```bash
# Install dependencies
npm install

# Required packages (already installed)
- react-native-reanimated
- date-fns
- lucide-react-native
- react-native-gesture-handler
```

---

## 🎓 Learning Resources

- **GitHub Contribution Graph:** [github.com](https://github.com) - Study the pattern
- **Reanimated Docs:** [docs.swmansion.com/react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Date-fns Guide:** [date-fns.org](https://date-fns.org/)
- **React Native A11y:** [reactnative.dev/docs/accessibility](https://reactnative.dev/docs/accessibility)

---

## 🆘 Troubleshooting

### Issue: Cells too small to tap

**Solution:**
```typescript
<Pressable hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
```

### Issue: Scroll feels janky

**Solution:** Use FlatList instead of ScrollView
```tsx
<FlatList
  horizontal
  removeClippedSubviews={true}
  maxToRenderPerBatch={5}
  windowSize={7}
/>
```

### Issue: Animation not smooth

**Solution:** Use `useNativeDriver: true`
```typescript
Animated.timing(value, {
  toValue: 1,
  duration: 200,
  useNativeDriver: true, // ✅
});
```

### Issue: Screen reader not announcing streak

**Solution:** Include streak in accessibility label
```typescript
accessibilityLabel={`${dateStr}, ${completed ? `${streakPosition} day streak` : 'not completed'}`}
```

---

**Last Updated:** 2025-12-22
**Maintainer:** UX Expert (BMAD AI)
**Status:** ✅ Ready for Development
