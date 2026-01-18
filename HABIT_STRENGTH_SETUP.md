# Habit Strength System - Quick Setup Guide

## Step 1: Deploy Schema Changes

First, push the updated schema to Convex:

```bash
npx convex dev
# or
npx convex deploy
```

This will update your database schema to include the new habit strength fields.

## Step 2: Initialize Existing Habits

Run this command in the Convex dashboard to calculate strength for all existing habits:

### Option A: Via Convex Dashboard

1. Go to https://dashboard.convex.dev
2. Select your project
3. Click on "Functions" tab
4. Find and run: `initializeHabitStrength:initializeAllHabitStrengths`
5. Wait for completion (you'll see logs in the console)

### Option B: Via Code

Add this to your app temporarily:

```typescript
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';

// In your component
const initializeStrengths = useAction(
  api.initializeHabitStrength.initializeAllHabitStrengths
);

// Call once
await initializeStrengths();
```

### Option C: Via CLI

```bash
npx convex run initializeHabitStrength:initializeAllHabitStrengths
```

## Step 3: Verify It's Working

After initialization, you should see:

1. **In the app**: Small progress bars with emojis below each habit (🌱🌿🌳💪⚡)
2. **In logs**: Console output showing strength calculations for each habit
3. **In database**: `strength` and `strengthLevel` fields populated

## Quick Test

To see habit strength in action immediately:

1. Create a new habit
2. Check it off for today
3. The strength indicator will appear (showing 🌱 and ~15% strength)
4. Check it off for several more days
5. Watch the strength grow and the emoji change!

## Strength Growth Examples

Here's how strength typically grows with consistent daily completion:

| Days Completed | Approximate Strength | Level      | Emoji |
| -------------- | -------------------- | ---------- | ----- |
| 1 day          | 0.15                 | Starting   | 🌱    |
| 3 days         | 0.35                 | Building   | 🌿    |
| 7 days         | 0.60                 | Developing | 🌳    |
| 14 days        | 0.78                 | Strong     | 💪    |
| 21 days        | 0.87                 | Automatic  | ⚡    |
| 30 days        | 0.92                 | Automatic  | ⚡    |

Note: These are approximations. Actual strength depends on consistency and the decay/gain parameters.

## Troubleshooting

### "I don't see the strength indicator"

Check:

1. ✅ Schema deployed? (`npx convex dev` running)
2. ✅ Initialization run? (logs show "Initialization Complete")
3. ✅ Habit has tracking data? (at least one day checked off)
4. ✅ App restarted? (after schema changes)

### "Strength is always 0"

This means:

- Habit has no tracking history, OR
- Initialization hasn't been run yet

Run the initialization script (Step 2 above).

### "Strength seems too low/high"

You can adjust the parameters per habit:

```typescript
import { api } from '@/convex/_generated/api';

const updateParams = useMutation(api.habitStrength.updateHabitParameters);

await updateParams({
  habitId: habit._id,
  habitDecayParam: 0.2, // Higher = faster decay (harder to maintain)
  habitGainParam: 0.1, // Lower = slower growth (takes longer to form)
});

// Then recalculate
const recalc = useMutation(api.habitStrength.recalculateHabitStrength);
await recalc({ habitId: habit._id });
```

## What Happens Automatically

Once set up, habit strength will automatically:

✅ **Update when you check off a habit** - Strength increases
✅ **Update when you miss a habit** - Strength decreases (slowly)
✅ **Show in the UI** - Compact indicator below each habit
✅ **Predict future behavior** - 65-77% accuracy

## Advanced: Bulk Operations

To recalculate strength for all habits (useful after parameter changes):

```typescript
const habits = useQuery(api.habits.list);
const recalc = useMutation(api.habitStrength.recalculateHabitStrength);

for (const habit of habits) {
  await recalc({ habitId: habit._id });
}
```

## Next Steps

- ✅ View the full documentation: `docs/HABIT_STRENGTH_SYSTEM.md`
- ✅ Check individual habit strength: Use `getHabitStrengthInfo` query
- ✅ View dashboard stats: Use `getAllHabitsStrengthStats` query
- ✅ Customize the UI: Modify `HabitStrengthIndicator` component

---

**Need Help?**

- Check the main documentation: `/docs/HABIT_STRENGTH_SYSTEM.md`
- Review the code: `/convex/habitStrength.ts`
- Test with a new habit: Create one and check it off daily!
