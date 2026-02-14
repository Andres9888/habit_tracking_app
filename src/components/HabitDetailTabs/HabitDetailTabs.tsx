/**
 * HabitDetailTabs Component
 *
 * Tab bar navigation for the Habit Detail screen.
 * Now delegates to the shared SegmentedControl for consistent styling
 * and dark mode support.
 */

import React, { useMemo } from 'react';
import { SegmentedControl, type Segment } from '../SegmentedControl';
import type { TabType, HabitDetailTabsProps } from './HabitDetailTabs.types';

const SEGMENTS: Segment<TabType>[] = [
  { id: 'progress', label: 'Progress' },
  { id: 'motivation', label: 'Motivation' },
  { id: 'manage', label: 'Manage' },
];

export function HabitDetailTabs({
  activeTab,
  onTabChange,
}: HabitDetailTabsProps) {
  const style = useMemo(
    () => ({ marginHorizontal: 16, marginVertical: 12 }),
    [],
  );

  return (
    <SegmentedControl<TabType>
      segments={SEGMENTS}
      activeId={activeTab}
      onChange={onTabChange}
      variant="filled"
      style={style}
    />
  );
}

export default HabitDetailTabs;
