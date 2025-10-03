# Data Model (Convex Schema)

Defined in `convex/schema.ts`.

## Tables

### habits
- `name: string`
- `notes?: string`
- `createdAt: number`
- `order?: number`
- `tags?: string[]`
- `userId?: string`
- `archived?: boolean`
- `archivedAt?: number`
- `consecutiveDays?: number`
- `strength?: number`
- `totalCompletions?: number`
- `totalMisses?: number`

### tracking
- `habitId: Id<"habits">`
- `date: string`
- `completed: boolean`
- `userId?: string`
- Index: `by_habit_and_date (habitId, date)`

### userSettings
- `showStreaks: boolean`
- `showConsistency: boolean`
- `showMotivationalMessages: boolean`
- `showEmojis: boolean`
- `showCalendarView: boolean`
- `catTheme: boolean`
- `darkMode: boolean`
- `userId?: string`

### articles
- `title: string`
- `content: string`
- `category: string`
- `createdAt: number`
- Index: `by_category (category)`
