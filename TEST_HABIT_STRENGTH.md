# Testing Habit Strength System

## Current Status: ALWAYS VISIBLE (for testing)

The habit strength indicator is now **always visible** on every habit card so you can see it immediately.

## What You Should See

Every habit now shows below the weekly progress bar:
```
🌱 ▓░░░░░░░░░ 0%   (for habits with no strength yet)
```

## To Test It Working:

1. **Check off ANY habit for today**
2. You should see the strength immediately update to:
   ```
   🌱 ▓▓░░░░░░░░ 15%
   ```

3. **Check it off again tomorrow** and watch it grow:
   ```
   🌱 ▓▓▓░░░░░░░ 28%
   ```

## Debug Info

If you still don't see the indicator:

1. Check the console for any errors
2. Make sure `npx convex dev` is running
3. Reload the Expo app (shake device → "Reload")
4. Check that the schema has deployed with:
   ```bash
   npx convex deploy --preview
   ```

## Expected Visual Layout

```
┌──────────────────────────────────┐
│ 😊 Morning Jog         (5/7)     │  ← Habit header
│ ○ ● ● ○ ● ● ○                   │  ← Chain circles
│ ▓▓▓▓▓▓▓▓░░░░░░░                 │  ← Weekly progress
│ 🌱 ▓▓░░░░░░░░ 15%               │  ← STRENGTH (NEW!)
└──────────────────────────────────┘
```

## Once It's Working

After you confirm it's working, you can change back to only showing when strength > 0:

```tsx
// In DraggableHabit.tsx, change:
<View className="pt-1">
  <HabitStrengthIndicator ... />
</View>

// Back to:
{habit.strength !== undefined && habit.strength > 0 && (
  <View className="pt-1">
    <HabitStrengthIndicator ... />
  </View>
)}
```

## Still Not Showing?

Try this quick check in your App.tsx temporarily:

```tsx
// After: const habits = useQuery(api.habits.list) ?? [];
console.log('Habits with strength:', habits.map(h => ({
  name: h.name,
  strength: h.strength,
  strengthLevel: h.strengthLevel
})));
```

This will show you if the strength data is coming through from Convex.
