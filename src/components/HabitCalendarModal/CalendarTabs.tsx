/* eslint-disable max-lines */
/**
 * CalendarTabs Component
 * Tab switcher for Month vs Year (Heatmap) calendar views.
 *
 * Now delegates to the shared SegmentedControl for consistent styling
 * and dark mode support.
 */

import { useMemo } from 'react';
import { SegmentedControl, type Segment } from '../SegmentedControl';

type CalendarView = 'month' | 'year';

interface CalendarTabsProps {
  activeView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const SEGMENTS: Segment<CalendarView>[] = [
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];

export function CalendarTabs({ activeView, onViewChange }: CalendarTabsProps) {
  const style = useMemo(() => ({ marginBottom: 16 }), []);

  return (
    <SegmentedControl<CalendarView>
      segments={SEGMENTS}
      activeId={activeView}
      onChange={onViewChange}
      variant="surface"
      style={style}
    />
  );
}
