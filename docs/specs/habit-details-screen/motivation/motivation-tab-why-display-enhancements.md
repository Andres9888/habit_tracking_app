# Motivation Tab - Why Display Enhancements

## Overview

Improve the visual presentation of the "Your Why" section in the Motivation tab with premium styling, progress indicators, and contextual reminders.

## Current State

The Why section currently shows:

- Simple card with rose icon
- Plain text display of the Why statement
- "Add your why" placeholder if empty

## Proposed Enhancements

### D1: Progress Indicator for Motivation Sections

Add visual completion indicators showing which motivation fields are filled.

**Implementation:**

```tsx
// Filled state - green checkmark
<View className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 items-center justify-center">
  <Check className="w-3 h-3 text-white" />
</View>

// Empty state - outline circle
<View className="w-5 h-5 rounded-full border-2 border-stone-200 items-center justify-center">
  <View className="w-2 h-2 rounded-full bg-stone-200" />
</View>
```

**Progress Bar:**

```tsx
<View className='mb-4 rounded-xl bg-white p-4'>
  <View className='mb-2 flex-row items-center justify-between'>
    <Text className='text-xs font-medium text-stone-500'>Motivation Setup</Text>
    <Text className='text-xs font-bold text-rose-500'>
      {filledCount} of {totalCount} complete
    </Text>
  </View>
  <View className='h-2 overflow-hidden rounded-full bg-stone-100'>
    <View
      className='h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500'
      style={{ width: `${(filledCount / totalCount) * 100}%` }}
    />
  </View>
</View>
```

**Acceptance Criteria:**

- [x] Each section shows checkmark (filled) or empty circle (not filled)
- [x] Progress bar shows "X of 4 complete"
- [x] Progress bar animates on change

**Implementation Notes (D1):**

- Added `MotivationProgressBar` component with animated width using spring physics
- Added `EmptyCircleIndicator` component for unfilled sections (stone-200 border with inner dot)
- Progress bar uses rose gradient when incomplete, emerald when all 4 sections complete
- Checkmarks and empty circles added to Why, Identity, Cue, and Vision Board sections
- Vision Board uses smaller inline indicator due to different layout structure

### D2: Premium Quote-Style Why Display

When Why is filled, display it in an elegant quote design.

**Implementation:**

```tsx
<View className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 p-5'>
  {/* Decorative quote marks */}
  <Text className='absolute left-4 top-2 font-serif text-6xl text-rose-500/20'>
    "
  </Text>
  <Text className='absolute bottom-0 right-4 font-serif text-6xl text-rose-500/20'>
    "
  </Text>

  {/* Heart icon with heartbeat animation */}
  <View className='absolute right-4 top-4'>
    <Animated.View style={heartbeatStyle}>
      <View className='h-8 w-8 items-center justify-center rounded-full bg-rose-500/20'>
        <Heart className='h-4 w-4 text-rose-400' fill='currentColor' />
      </View>
    </Animated.View>
  </View>

  {/* Quote content */}
  <Text className='pr-10 pt-4 text-lg font-medium italic leading-relaxed text-white'>
    {habit.why}
  </Text>

  {/* Tap hint */}
  <View className='mt-4 flex-row items-center gap-1'>
    <Edit3 className='h-3 w-3 text-stone-400' />
    <Text className='text-[10px] text-stone-400'>Tap to edit</Text>
  </View>
</View>
```

**Heartbeat Animation:**

```tsx
const heartbeatStyle = useAnimatedStyle(() => ({
  transform: [
    {
      scale: withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.15, { duration: 150 }),
          withTiming(1, { duration: 150 }),
          withTiming(1.1, { duration: 150 }),
          withTiming(1, { duration: 1550 })
        ),
        -1, // infinite
        false
      ),
    },
  ],
}));
```

**Acceptance Criteria:**

- [x] Dark gradient background (stone-800 to stone-900)
- [x] Large decorative quote marks (rose-500 at 20% opacity)
- [x] Heart icon with subtle heartbeat animation
- [x] Italic white text for the quote
- [x] "Tap to edit" hint at bottom

**Implementation Notes (D2):**

- Created `PremiumWhyDisplay` component in HabitDetailScreen.tsx
- Uses LinearGradient with colors `#292524` (stone-800) to `#1c1917` (stone-900)
- Decorative quote marks use `rgba(244, 63, 94, 0.2)` for rose-500 at 20% opacity
- Heartbeat animation uses `withRepeat` + `withSequence` for realistic double-pulse effect (1→1.15→1→1.1→1)
- Animation respects `reduceMotion` preference for accessibility
- Quote text styled with `italic`, white color, and `leading-relaxed` for readability
- "Tap to edit" hint with Edit3 icon at bottom

### D3: Improved Empty State

When Why is not filled, show an encouraging call-to-action.

**Implementation:**

```tsx
<Pressable
  className='items-center rounded-2xl border-2 border-dashed border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100 p-6'
  onPress={handleOpenWhyEditor}
>
  <View className='mb-3 h-14 w-14 items-center justify-center rounded-full bg-rose-100'>
    <Plus className='h-6 w-6 text-rose-400' />
  </View>
  <Text className='font-semibold text-stone-700'>Add Your Why</Text>
  <Text className='mt-1 text-xs text-stone-400'>
    Define your deeper motivation
  </Text>
</Pressable>
```

**Recommended Badge:**

```tsx
<View className='mb-2 flex-row items-center gap-2'>
  <Heart className='h-4 w-4 text-rose-400' />
  <Text className='text-[10px] font-bold uppercase tracking-[2px] text-stone-400'>
    Your Why
  </Text>
  <View className='rounded-full bg-rose-100 px-2 py-0.5'>
    <Text className='text-[9px] font-bold text-rose-500'>RECOMMENDED</Text>
  </View>
</View>
```

**Acceptance Criteria:**

- [x] Dashed border with gradient background
- [x] Plus icon in rose circle
- [x] Clear "Add Your Why" text
- [x] "RECOMMENDED" badge for empty state
- [x] Pressable opens Why Editor

**Implementation Notes (D3):**

- Created `EmptyWhyState` component in HabitDetailScreen.tsx
- Uses LinearGradient with colors `#fafaf9` (stone-50) to `#f5f5f4` (stone-100)
- Dashed border with `border-2 border-dashed border-stone-200` styling
- Centered Plus icon (24px) in rose-100 circle (w-14 h-14)
- RECOMMENDED badge with rose-100 background and rose-500 text
- "Your Why" label with Heart icon and 2px letter spacing
- Pressable with scale animation on press (0.98 spring-based)
- Full accessibility support with proper labels and role

### D4: Streak Warning Reminder Card

Show the user's Why when they're about to break their streak.

**When to Show:**

- User hasn't completed habit today
- Current streak >= 3 days
- Time is after 6 PM (or habit's preferred time)

**Implementation:**

```tsx
{
  showStreakWarning && (
    <View className='mb-4 flex-row items-center gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-4'>
      <View className='h-10 w-10 items-center justify-center rounded-full bg-red-500'>
        <Flame className='h-5 w-5 text-white' />
      </View>
      <View className='flex-1'>
        <Text className='text-sm font-semibold text-red-700'>
          Don't break your {streak}-day streak!
        </Text>
        <Text className='mt-0.5 text-xs text-red-600'>
          Remember: "{truncate(habit.why, 40)}..."
        </Text>
      </View>
    </View>
  );
}
```

**Acceptance Criteria:**

- [ ] Shows only when streak at risk
- [ ] Displays current streak count
- [ ] Shows truncated Why as reminder
- [ ] Red/warning color scheme
- [ ] Dismissible (optional)

### D5: Pro Tip Card (Empty State Only)

Show motivational statistics to encourage filling the Why field.

**Implementation:**

```tsx
{
  !habit.why && (
    <View className='mb-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4'>
      <View className='flex-row items-start gap-3'>
        <Text className='text-2xl'>💡</Text>
        <View>
          <Text className='text-sm font-semibold text-amber-800'>Pro tip</Text>
          <Text className='mt-1 text-xs text-amber-700'>
            People with a defined "why" are 42% more likely to maintain their
            habits long-term.
          </Text>
        </View>
      </View>
    </View>
  );
}
```

**Acceptance Criteria:**

- [ ] Only shows when Why is empty
- [ ] Amber/gold color scheme
- [ ] Lightbulb emoji
- [ ] Compelling statistic or tip

## Files to Modify

- `src/screens/HabitDetailScreen.tsx` - MotivationTabContent component

## Design Reference

**Mockup:** `.superdesign/design_iterations/motivation_tab_why_section_1.html`

## Out of Scope

- Inline editing (edit without opening modal)
- Why history
- Sharing/exporting Why

## Success Metrics

- Increased Why completion rate
- Higher engagement with Motivation tab
- Reduced streak breaks (with reminder card)
