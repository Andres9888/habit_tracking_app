---
type: report
title: RES-004 Performance Dashboard Implementation Report
created: 2026-01-22
tags:
  - performance
  - dashboard
  - monitoring
  - dev-tools
related:
  - "[[SECURITY-PERFORMANCE-SPEC]]"
  - "[[PERF-001-performance-baseline-report]]"
---

# RES-004: Performance Dashboard Implementation Report

## Summary

Created a comprehensive dev-only performance monitoring dashboard that provides real-time visibility into FPS, memory usage, network latency, and component render performance. The dashboard is accessible via a floating action button (FAB) and can be expanded to show detailed metrics with historical data.

## Files Created

### Core Components (12 files, ~780 lines)

| File | Lines | Description |
|------|-------|-------------|
| `src/components/PerformanceDashboard/types.ts` | 97 | Type definitions for dashboard state, tabs, and metrics |
| `src/components/PerformanceDashboard/useDashboardData.ts` | 195 | Data aggregation hook with reducer pattern |
| `src/components/PerformanceDashboard/PerformanceDashboard.tsx` | 173 | Main dashboard component with FAB and expanded view |
| `src/components/PerformanceDashboard/index.ts` | 25 | Barrel exports with JSDoc examples |
| `src/components/PerformanceDashboard/components/StatusIndicator.tsx` | 42 | Good/warning/critical status dot |
| `src/components/PerformanceDashboard/components/MetricCard.tsx` | 66 | Individual metric display card |
| `src/components/PerformanceDashboard/components/TabBar.tsx` | 67 | Navigation tabs for dashboard sections |
| `src/components/PerformanceDashboard/components/OverviewTab.tsx` | 64 | Summary view of all metrics |
| `src/components/PerformanceDashboard/components/FPSTab.tsx` | 100 | Detailed FPS with history chart |
| `src/components/PerformanceDashboard/components/MemoryTab.tsx` | 100 | Memory usage with timeline |
| `src/components/PerformanceDashboard/components/NetworkTab.tsx` | 99 | P95 latency and recent requests |
| `src/components/PerformanceDashboard/components/RendersTab.tsx` | 99 | Slow components and render counts |
| `src/components/PerformanceDashboard/components/index.ts` | 10 | Barrel exports for components |

### Test Files (4 files, ~270 lines)

| File | Tests | Description |
|------|-------|-------------|
| `__tests__/PerformanceDashboard.test.tsx` | 12 | Main component visibility, tabs, metrics |
| `__tests__/useDashboardData.test.ts` | 14 | Hook state management and actions |
| `__tests__/StatusIndicator.test.tsx` | 8 | Status colors and sizes |
| `__tests__/MetricCard.test.tsx` | 10 | Value display and subtitle |

**Total: 44 tests**

## Architecture

### Dashboard State Management

Uses a reducer pattern for predictable state updates:

```typescript
interface DashboardState {
  activeTab: DashboardTab;
  fps: FPSData;
  isExpanded: boolean;
  isVisible: boolean;
  memory: MemoryData;
  network: NetworkData;
  renders: RenderData;
  thresholds: PerformanceThresholds;
}
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ FrameMonitor │    │MemoryMonitor │    │NetworkMonitor│  │
│  │   (onFrame)  │    │  (polling)   │    │  (polling)   │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                   │          │
│         └───────────────────┼───────────────────┘          │
│                             │                              │
│                             ▼                              │
│                   ┌──────────────────┐                     │
│                   │ useDashboardData │                     │
│                   │   (aggregator)   │                     │
│                   └────────┬─────────┘                     │
│                            │                               │
│                            ▼                               │
│                   ┌──────────────────┐                     │
│                   │   Dashboard UI   │                     │
│                   │  (React Native)  │                     │
│                   └──────────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Features

### 1. Floating Action Button (FAB)
- Shows overall status indicator (green/yellow/red)
- Displays current FPS
- Tap to expand dashboard

### 2. Mini View (Collapsed)
- Three key metrics: FPS, Memory, P95 Latency
- Minimal screen footprint
- Tap expand button for details

### 3. Expanded View (5 Tabs)

| Tab | Metrics Shown | Visualizations |
|-----|---------------|----------------|
| Overview | FPS, Memory, P95, Slow Renders | 4 metric cards with status |
| FPS | Current, Average, Jank Rate | Bar chart history (30 samples) |
| Memory | Usage, Peak, Growth | Timeline chart |
| Network | P95, Avg, Error Rate, Pending | Recent requests list |
| Renders | Slow Count, Total | Slow components list |

### 4. Status Indicators

| Level | Color | FPS | Memory | P95 Latency |
|-------|-------|-----|--------|-------------|
| Good | Green | ≥55 | <50% budget | <140ms |
| Warning | Amber | 30-54 | 50-74% | 140-199ms |
| Critical | Red | <30 | ≥75% | ≥200ms |

## Configuration

```typescript
interface DashboardConfig {
  defaultExpanded?: boolean;  // Default: false
  enabled?: boolean;          // Default: true (in __DEV__)
  historyLimit?: number;      // Default: 60 samples
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  updateInterval?: number;    // Default: 1000ms
}
```

## Usage

### Basic Usage

```tsx
import { PerformanceDashboard } from '@/components/PerformanceDashboard';

function App() {
  return (
    <>
      <MainContent />
      {/* Only renders in __DEV__ mode */}
      <PerformanceDashboard />
    </>
  );
}
```

### With Configuration

```tsx
<PerformanceDashboard
  config={{
    defaultExpanded: true,
    position: 'bottom-left',
    updateInterval: 500,
  }}
/>
```

## Integration Points

### PerformanceProvider
The dashboard hooks into the existing `PerformanceContext` via:
- `usePerformance()` hook for accessing all monitors
- `onFrameData()` subscription for real-time FPS
- Polling for memory, network, and render data when visible

### Sentry Integration
Works alongside the existing Sentry performance integration:
- Dashboard shows local metrics (in-app)
- Sentry receives issues for cloud monitoring
- Both use the same underlying monitors

## Dev-Only Enforcement

The component returns `null` in production:

```tsx
export function PerformanceDashboard({ config }: Props) {
  if (typeof __DEV__ === 'undefined' || !__DEV__) {
    return null;
  }
  return <DashboardContent config={config} />;
}
```

## Performance Impact

- **Render cost**: Minimal when hidden (FAB only)
- **Polling**: Only active when dashboard is visible
- **Memory**: ~60 samples retained in history refs
- **Bundle size**: Tree-shaken in production builds

## Testing Notes

All 44 tests cover:
- Component visibility toggling
- Tab navigation and state
- Metrics display formatting
- Status level calculation
- Configuration options
- Dev-only behavior

## Future Enhancements

1. **Export Report**: Button to export performance report as JSON
2. **Recording Mode**: Capture metrics during specific user flows
3. **Baseline Comparison**: Compare current vs saved baseline
4. **Remote Dashboard**: Push metrics to external monitoring service
5. **Custom Thresholds UI**: Allow adjusting thresholds in-app
