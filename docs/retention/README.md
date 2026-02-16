# Retention Features - Quick Start

## What's New

Chain Day now includes a comprehensive retention optimization suite:

- ✅ **14 & 60-day milestones** — More celebration moments
- ✅ **Social proof** — "X habits completed today"  
- ✅ **Comeback messaging** — No-guilt return encouragement
- ✅ **Chain nudges** — Smart "don't break the chain" reminders
- ✅ **Smart suggestions** — AI-lite habit recommendations

## Installation

All features are ready to use. Just import and integrate:

```tsx
import { RetentionDashboard } from '@/components/RetentionFeatures';

<RetentionDashboard
  habits={habits}
  completedYesterday={completedYesterday}
  bestStreak={bestStreak}
  onStartToday={handleStart}
  onCompleteNow={handleComplete}
  onSelectSuggestion={handleAdd}
/>
```

## Component API

### RetentionDashboard (All-in-One)

**Props:**
- `habits: HabitWithStreak[]` — User's habits
- `completedYesterday: boolean` — Did user complete anything yesterday?
- `bestStreak?: number` — User's best streak (optional)
- `isPremium?: boolean` — Premium status (optional)
- `onStartToday?: () => void` — Comeback CTA callback
- `onCompleteNow?: () => void` — Chain nudge CTA callback
- `onDismissNudge?: () => void` — Nudge dismiss callback
- `onSelectSuggestion?: (suggestion) => void` — Suggestion callback
- `reduceMotion?: boolean` — Accessibility (optional)

### Individual Components

All features can also be used standalone:

#### SocialProofBanner
```tsx
<SocialProofBanner
  globalCompletions={1247}
  activeUsers={89}
  visible
/>
```

#### ComebackMessage
```tsx
<ComebackMessage
  daysMissed={1}
  bestStreak={14}
  onStartToday={handleStart}
/>
```

#### ChainNudge
```tsx
<ChainNudge
  streak={7}
  incompleteCount={2}
  totalCount={5}
  habitName="Meditation"
  onCompleteNow={handleComplete}
  onDismiss={handleDismiss}
/>
```

#### SmartHabitSuggestions
```tsx
<SmartHabitSuggestions
  existingCategories={['health', 'mindfulness']}
  completionRate={0.75}
  onSelectSuggestion={handleAdd}
/>
```

## Hook API

### useRetentionFeatures

Coordinates feature display logic:

```tsx
const retention = useRetentionFeatures({
  habits,
  completedYesterday,
  bestStreak,
  isPremium,
});

// Returns:
// - shouldShowSocialProof
// - shouldShowComebackMessage  
// - shouldShowChainNudge
// - shouldShowSmartSuggestions
// - globalStats
// - incompleteHabits
// - highestStreakHabit
// - userCategories
// - completionRate
```

## Backend (Convex)

### Global Stats Query

```ts
import { api } from 'convex/_generated/api';
import { useQuery } from 'convex/react';

const stats = useQuery(api.analytics.getGlobalStats);
// { completionsToday: number, activeUsers: number }
```

**Performance Note:** Consider caching with cron for scale:

```ts
// convex/cron.ts
export default defineSchedule({
  schedules: [
    {
      name: 'Cache global stats',
      cronspec: '*/5 * * * *', // Every 5 min
      handler: async (ctx) => {
        await ctx.runMutation(api.analytics.cacheGlobalStats);
      },
    },
  ],
});
```

## Testing

```bash
# Unit tests
npm run test:unit -- RetentionFeatures

# Integration tests  
npm run test:integration -- retention

# E2E
npm run test:e2e -- retention-flow
```

## Design Tokens

All components follow the Chain Day design system:

- **Typography**: 34/22/17/13 (display/title/body/caption)
- **Colors**: Primary green (#047857), accent variants
- **Shadows**: 4px offset, 16px blur, 0.08 opacity
- **Animation**: springify().damping(18), 280ms transitions
- **Border radius**: 16px cards, 12px buttons

## Accessibility

All components support:
- ✅ `reduceMotion` prop (respects system preference)
- ✅ Screen reader labels (`accessibilityLabel`)
- ✅ Keyboard navigation
- ✅ High contrast mode (via design system)

## Performance

Bundle size impact: **~12 KB gzipped**

Optimizations:
- React.memo on all components
- Memoized calculations in hooks
- Conditional rendering (no hidden divs)
- Lazy-loaded suggestions

## Troubleshooting

### Social proof not showing

1. Check Convex connection: `useQuery(api.analytics.getGlobalStats)`
2. Verify tracking records exist for today
3. Check console for errors

### Comeback message not appearing

1. Verify `completedYesterday` prop is `false`
2. Check `habits` array is not empty
3. Ensure `daysSinceLastActivity > 0`

### Chain nudge not triggering

1. Check current time is 6-11 PM
2. Verify `incompleteHabits.length > 0`
3. Ensure highest streak ≥ 3 days
4. Check if user dismissed (local state)

### Suggestions not showing

1. Verify user has 1-4 habits (not 0, not 5+)
2. Check `completionRate > 0.5`
3. Ensure categories are set on habits

## Examples

See `docs/RETENTION_FEATURES.md` for detailed examples and integration guide.

## Support

Questions? Check:
- Full docs: `docs/RETENTION_FEATURES.md`
- Component source: `src/components/RetentionFeatures/`
- Hook source: `src/hooks/useRetentionFeatures.ts`
- Backend: `convex/analyticsGlobal.ts`

---

Built for maximum retention 🚀
