/**
 * HabitDetailTabs Constants
 */

import { springs } from '@/theme/animations';
import type { TabConfig } from './HabitDetailTabs.types';

export const TABS: TabConfig[] = [
  { id: 'progress', label: 'Progress' },
  { id: 'motivation', label: 'Motivation' },
  { id: 'manage', label: 'Manage' },
];

/** Spring config for smooth pill animation */
export const PILL_SPRING_CONFIG = springs.standard;

/** Padding inside the container */
export const CONTAINER_PADDING = 4;

/** Gap between tabs */
export const TAB_GAP = 4;
