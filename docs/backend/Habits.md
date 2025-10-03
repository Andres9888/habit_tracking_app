# Habits API (Convex)

Module: `convex/habits.ts`

## create (mutation)
- Args:
  - `name: string`
  - `notes?: string`
- Returns: `Id<"habits">`
- Example:
```ts
const id = await mutate(api.habits.create, { name: "Read", notes: "10 min" });
```

## updateNotes (mutation)
- Args:
  - `habitId: Id<"habits">`
  - `notes: string`
- Returns: `null`

## archive (mutation)
- Args: `{ habitId: Id<"habits"> }`
- Returns: `null`

## unarchive (mutation)
- Args: `{ habitId: Id<"habits"> }`
- Returns: `null`

## remove (mutation)
- Args: `{ habitId: Id<"habits"> }`
- Returns:
  - `habit: { name: string; notes?: string; createdAt: number }`
  - `tracking: Array<{ date: string; completed: boolean }>`

## restore (mutation)
- Args:
  - `habitData: { name: string; notes?: string; createdAt: number }`
  - `trackingData: Array<{ date: string; completed: boolean }>`
- Returns: `Id<"habits">`

## list (query)
- Args: `{}`
- Returns: `Array<Habit>` where `Habit` includes:
  - `_id: Id<"habits">`
  - `name: string`
  - `notes?: string`
  - `createdAt: number`
  - `archived?: boolean`
  - `archivedAt?: number`
  - other optional fields

## listArchived (query)
- Args: `{}`
- Returns: `Array<Habit>` (only archived)

## toggleHabit (mutation)
- Args: `{ habitId: Id<"habits">, date: string(YYYY-MM-DD) }`
- Returns: `null`
- Notes: Rejects future dates; validates `YYYY-MM-DD`.

## getTracking (query)
- Args: `{ dates: string[] }`
- Returns: `Array<Tracking>` where `Tracking` includes:
  - `_id: Id<"tracking">`
  - `habitId: Id<"habits">`
  - `date: string`
  - `completed: boolean`

## getStats (query)
- Args: `{ habitId: Id<"habits"> }`
- Returns: `{ streak: number; consistency: number }`

---

## Usage in client

```ts
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const habits = useQuery(api.habits.list) ?? [];
const createHabit = useMutation(api.habits.create);
await createHabit({ name: "Read" });
```
