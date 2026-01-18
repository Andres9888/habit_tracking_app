# Streak Chain Visualization - Algorithm Design

## Overview

This document specifies the chain connection algorithm for visual streak representation in the CalendarHeatmap component. The algorithm identifies consecutive completed days and renders visual connectors between them, with strength that evolves based on streak length.

## Architecture

### Core Data Structures

```typescript
/**
 * Represents a contiguous streak segment within the grid
 */
interface StreakSegment {
  /** Unique identifier for the segment */
  id: string;
  /** Start date of the streak (YYYY-MM-DD) */
  startDate: string;
  /** End date of the streak (YYYY-MM-DD) */
  endDate: string;
  /** Number of consecutive completed days */
  length: number;
  /** Array of all dates in the streak (ordered oldest→newest) */
  dates: string[];
  /** Whether this streak is currently active (ends today or yesterday) */
  isActive: boolean;
}

/**
 * Grid position for a cell
 */
interface GridPosition {
  /** Position type based on view mode */
  type: 'horizontal' | 'month' | 'week' | 'year';
  /** Week index (column) for horizontal/year, row for month */
  primaryIndex: number;
  /** Day-of-week index (row) for horizontal/year, column for month */
  secondaryIndex: number;
  /** Pixel coordinates (calculated during render) */
  x?: number;
  y?: number;
}

/**
 * Connection between two consecutive completed cells
 */
interface ChainConnection {
  /** Start date (earlier) */
  fromDate: string;
  /** End date (later) */
  toDate: string;
  /** Position of start cell */
  fromPosition: GridPosition;
  /** Position of end cell */
  toPosition: GridPosition;
  /** Position within the streak (1-indexed) */
  streakPosition: number;
  /** Total length of the containing streak */
  streakLength: number;
  /** Visual strength tier */
  strength: StreakStrength;
}

/**
 * Strength tier for visual rendering
 */
type StreakStrength = 'subtle' | 'growing' | 'strong' | 'very-strong' | 'legendary';
```

### Algorithm Components

#### 1. Streak Segment Detection (`detectStreakSegments`)

Identifies all contiguous streak segments in the completion data.

```typescript
/**
 * Detect all streak segments from completion data
 *
 * @param completedDates - Set of completed date strings (YYYY-MM-DD)
 * @param habitCreatedAt - Timestamp when habit was created
 * @param endDate - Last date to consider (default: today)
 * @returns Array of streak segments
 */
function detectStreakSegments(
  completedDates: Set<string>,
  habitCreatedAt?: number,
  endDate: Date = new Date()
): StreakSegment[]
```

**Algorithm:**

1. Sort all completed dates chronologically
2. Initialize empty segments array and current segment
3. For each date:
   - If no current segment, start new one
   - If date is consecutive to previous, extend segment
   - If gap exists, finalize current segment and start new
4. Mark final segment as "active" if ends today or yesterday
5. Return all segments

**Time Complexity:** O(n log n) where n = number of completed dates
**Space Complexity:** O(n)

#### 2. Position Calculation (`calculateGridPositions`)

Maps dates to grid positions for each view type.

```typescript
/**
 * Calculate grid positions for a set of dates
 *
 * @param dates - Array of date strings to position
 * @param viewMode - Current calendar view mode
 * @param gridData - Grid configuration (weeks/rows/cols)
 * @returns Map of date → GridPosition
 */
function calculateGridPositions(
  dates: string[],
  viewMode: 'week' | 'month' | '3m' | 'year',
  gridData: GridData
): Map<string, GridPosition>
```

**View-Specific Position Calculations:**

| View    | Primary Index            | Secondary Index   | Cell Size  | Gap   |
|---------|--------------------------|-------------------|------------|-------|
| Week    | Day index (0-6)          | n/a               | 64px       | n/a   |
| Month   | Row (0-5)                | Column (0-6)      | ~48px      | 4px   |
| 3-Month | Week column (0-12)       | Day-of-week (0-6) | 20px       | 3px   |
| Year    | Week column (0-52)       | Day-of-week (0-6) | ~10px      | 1px   |

**Pixel Coordinate Formula (Horizontal/Year):**
```
x = (weekIndex * (cellSize + gap)) + (cellSize / 2)
y = (dayOfWeek * (cellSize + gap)) + (cellSize / 2)
```

**Pixel Coordinate Formula (Month):**
```
x = (column * (cellSize + gap)) + (cellSize / 2)
y = (row * (cellSize + gap)) + (cellSize / 2) + headerHeight
```

#### 3. Connection Generation (`generateConnections`)

Creates connection objects between consecutive completed cells.

```typescript
/**
 * Generate connections for streak visualization
 *
 * @param segments - Detected streak segments
 * @param positions - Map of date → GridPosition
 * @returns Array of ChainConnection objects
 */
function generateConnections(
  segments: StreakSegment[],
  positions: Map<string, GridPosition>
): ChainConnection[]
```

**Algorithm:**

1. For each segment:
   - Get ordered dates array
   - For each consecutive pair (date[i], date[i+1]):
     - Get positions from map
     - Calculate streak position (i + 1)
     - Determine strength tier
     - Create ChainConnection object
2. Return all connections

**Strength Tier Mapping:**
```typescript
function getStrengthTier(streakLength: number): StreakStrength {
  if (streakLength >= 21) return 'legendary';
  if (streakLength >= 14) return 'very-strong';
  if (streakLength >= 7)  return 'strong';
  if (streakLength >= 3)  return 'growing';
  return 'subtle';
}
```

#### 4. Path Rendering (`renderConnectionPath`)

Generates SVG path or View-based connector for each connection.

```typescript
/**
 * Render a connection between two cells
 *
 * @param connection - ChainConnection to render
 * @param config - Visual configuration
 * @returns React element for the connection
 */
function renderConnectionPath(
  connection: ChainConnection,
  config: ConnectionConfig
): React.ReactElement
```

**Connection Path Types:**

1. **Horizontal Adjacent** (same row, consecutive columns)
   - Simple horizontal line from right edge of from-cell to left edge of to-cell

2. **Vertical Adjacent** (same column, consecutive rows)
   - Simple vertical line from bottom edge of from-cell to top edge of to-cell

3. **Diagonal** (different row AND column)
   - Curved path or L-shaped connector
   - For week wrap-around in horizontal view

4. **Week Wrap** (Saturday → Sunday)
   - Special handling for horizontal/year views
   - Connect cell at column N, row 6 → column N+1, row 0

## Visual Design

### Connector Styling

Following the established pattern from `HabitChainVisualizer`:

| Strength    | Streak Days | Height | Opacity | Shimmer | Accent Glow |
|-------------|-------------|--------|---------|---------|-------------|
| subtle      | 1-2         | 1.5px  | 35%     | No      | No          |
| growing     | 3-4         | 1.8px  | 45%     | No      | No          |
| strong      | 5-6         | 2.1px  | 55%     | No      | No          |
| very-strong | 7-13        | 2.4px  | 65%     | 1500ms  | Yes         |
| legendary   | 14-20       | 2.7px  | 75%     | 1200ms  | Yes         |
| legendary+  | 21+         | 3.0px  | 85%     | 1000ms  | Yes + shadow|

### Color Strategy

- Use habit's accent color for active streaks
- Use muted variant (`stone-300`) for historical/broken streaks
- Gradient fade at streak boundaries for polished look

### Animation

- **Entry Animation:** Connectors draw from oldest to newest (left→right)
- **Shimmer Effect:** White highlight sweeping left→right for strong streaks
- **Reduce Motion:** Instant visibility, no shimmer

## Performance Considerations

### Optimization Strategies

1. **Memoization**
   - Memoize `detectStreakSegments` on `completedDates` changes
   - Memoize `calculateGridPositions` on view mode changes
   - Memoize `generateConnections` on segment changes

2. **Virtualization (Year View)**
   - Only render connections for visible weeks
   - Use windowing with 2-week buffer on each side
   - Intersection Observer for visibility detection

3. **Render Batching**
   - Group connections by week/row
   - Render each batch in separate frame
   - Use `requestAnimationFrame` for smooth scrolling

4. **Path Simplification**
   - For year view: use simple rectangles instead of rounded paths
   - Skip shimmer animations in year view
   - Reduce opacity calculation precision

### Memory Budget

- Target: < 5MB additional memory for year view
- Maximum connections: 365 days = 364 possible connections
- Each ChainConnection: ~200 bytes
- Total: ~73KB for connections
- Render overhead: ~2MB for SVG paths (acceptable)

## Integration Points

### CalendarGrid Integration

```typescript
// In CalendarGrid.tsx
interface CalendarGridProps {
  // ... existing props
  showChainConnections?: boolean;
  chainConnectionStrength?: 'none' | 'subtle' | 'full';
}

// Render chain overlay behind cells
<ChainConnectionOverlay
  segments={segments}
  positions={positions}
  habitColor={habitColor}
  reduceMotion={reduceMotion}
/>
```

### Hook API

```typescript
/**
 * Hook to manage streak chain visualization
 */
function useStreakChain(
  completedDates: Set<string>,
  viewMode: CalendarViewMode,
  habitCreatedAt?: number
): {
  segments: StreakSegment[];
  connections: ChainConnection[];
  activeStreak: StreakSegment | null;
  longestStreak: StreakSegment;
}
```

## Testing Strategy

### Unit Tests

1. `detectStreakSegments`
   - Empty completions → empty segments
   - Single day → single segment of length 1
   - Consecutive days → single segment
   - Gap detection → multiple segments
   - Habit creation boundary handling

2. `calculateGridPositions`
   - All view modes
   - Week wrap-around
   - Month boundary crossing

3. `generateConnections`
   - Strength tier mapping
   - Position pairing
   - Edge cases (empty segments, single-day segments)

### Visual Regression Tests

- Snapshot tests for each view mode
- Snapshot tests for each strength tier
- Animation sequence verification

### Performance Tests

- Year view render time < 100ms
- Scroll performance > 55fps
- Memory usage monitoring

## File Structure

```
src/components/CalendarHeatmap/
├── ChainConnection/
│   ├── index.ts
│   ├── ChainConnectionOverlay.tsx    # Main overlay component
│   ├── ConnectionPath.tsx            # Individual path renderer
│   ├── useStreakChain.ts             # State management hook
│   ├── utils.ts                      # Algorithm implementations
│   ├── types.ts                      # TypeScript interfaces
│   └── __tests__/
│       ├── detectStreakSegments.test.ts
│       ├── calculateGridPositions.test.ts
│       └── ChainConnectionOverlay.test.tsx
```

## Migration Path

1. **Phase 1:** Add algorithm utilities (no UI changes)
2. **Phase 2:** Implement ChainConnectionOverlay component
3. **Phase 3:** Integrate into CalendarGrid behind feature flag
4. **Phase 4:** Enable by default, add user preference toggle
5. **Phase 5:** Performance optimization for year view

---

*Design completed: 2025-12-28*
*Author: Maestro Agent (habit-progress-section)*
