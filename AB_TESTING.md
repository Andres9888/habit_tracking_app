# A/B Testing Framework

Lightweight, client-side A/B testing for Chain Day. Variants are assigned once per experiment and persisted in AsyncStorage. Analytics flow through the existing `logInteraction` pipeline.

## Quick Start

```ts
import { getVariant, trackEvent } from '@/lib/abTest';

const variant = await getVariant('onboarding_flow');
// variant === 'A' (control) or 'B' (shortened)

// Track a conversion event
trackEvent('first_habit_created', 'onboarding_flow', variant);
```

## How It Works

1. **First call** to `getVariant(id)` randomly assigns the user to a variant based on configured weights and stores it in AsyncStorage (`@abtest_<id>`).
2. **Subsequent calls** return the same variant (sticky assignment).
3. **Disabled experiments** always return `'A'` (control).

## Adding a New Experiment

### 1. Register in the experiment registry

Edit `src/lib/abTest.ts` and add an entry to `experiments`:

```ts
export const experiments: Record<string, ExperimentConfig> = {
  // existing...
  onboarding_flow: { ... },

  // new experiment
  paywall_layout: {
    id: 'paywall_layout',
    enabled: true,
    variants: ['A', 'B', 'C'],
    weights: [0.34, 0.33, 0.33],
  },
};
```

### 2. Create a hook (recommended)

```ts
// src/screens/paywall/usePaywallExperiment.ts
import { useEffect, useState } from 'react';
import { getVariant, trackEvent, type VariantId } from '@/lib/abTest';

const EXP_ID = 'paywall_layout';

export function usePaywallExperiment() {
  const [variant, setVariant] = useState<VariantId>('A');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getVariant(EXP_ID).then((v) => {
      if (!cancelled) { setVariant(v); setReady(true); }
    });
    return () => { cancelled = true; };
  }, []);

  return { ready, variant };
}
```

### 3. Branch your UI

```tsx
const { variant, ready } = usePaywallExperiment();
if (!ready) return <Loading />;

return variant === 'B' ? <NewPaywall /> : <OldPaywall />;
```

### 4. Track conversion events

```ts
trackEvent('first_habit_created', 'paywall_layout', variant);
```

## Analytics Events

| Event | When | Payload |
|---|---|---|
| `ab_variant_assigned` | User first assigned to experiment | `{ experiment, variant }` |
| `ab_onboarding_completed` | User finishes onboarding | `{ experiment, variant }` |
| `ab_first_habit_created` | User creates first habit | `{ experiment, variant }` |

All events are prefixed with `ab_` and logged via `logInteraction`.

## Current Experiments

| ID | Variants | Description |
|---|---|---|
| `onboarding_flow` | A (3 screens), B (2 screens) | Tests whether a shorter onboarding improves completion rate |

## Utilities

```ts
import { resetExperiment, resetAllExperiments } from '@/lib/abTest';

// Reset one experiment (for QA)
await resetExperiment('onboarding_flow');

// Reset all experiments
await resetAllExperiments();
```

## Design Decisions

- **Client-side only** — no server needed; great for early-stage testing
- **AsyncStorage persistence** — survives app restarts, not reinstalls (which is fine for onboarding tests)
- **Weighted random** — supports unequal splits (e.g., 90/10 rollouts)
- **Feature flag pattern** — set `enabled: false` to kill an experiment instantly
