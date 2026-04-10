/**
 * Sort picker options and section groupings for the Settings modal.
 * Icon colors match settingsColors.ts patterns (flat bg + colored icon per theme).
 */

import type { LucideIcon } from 'lucide-react-native';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Flame,
  GripVertical,
  Zap,
} from 'lucide-react-native';
import type { HabitSortMode } from '../../features/habits/types';

interface IconStyle { icon: string; bg: string }

export interface SortPickerOption {
  value: HabitSortMode;
  label: string;
  description: string;
  Icon: LucideIcon;
  iconStyle: { dark: IconStyle; light: IconStyle };
}

export interface SortSection {
  key: string;
  title: string;
  subtitle: string;
  options: SortPickerOption[];
}

// Matches settingsColors.ts patterns
const STONE = { dark: { icon: '#d6d3d1', bg: '#2c2824' }, light: { icon: '#78716c', bg: '#e7e5e4' } };
const GREEN = { dark: { icon: '#6ee7b7', bg: '#0f3b31' }, light: { icon: '#047857', bg: '#d1fae5' } };
const FIRE = { dark: { icon: '#fdba74', bg: '#4a2410' }, light: { icon: '#c2410c', bg: '#ffedd5' } };

export const SORT_SECTIONS: SortSection[] = [
  {
    key: 'custom',
    title: 'Custom',
    subtitle: 'Drag to reorder your habits manually',
    options: [
      { value: 'manual', label: 'Custom Order', description: 'Drag to reorder manually', Icon: GripVertical, iconStyle: STONE },
    ],
  },
  {
    key: 'alphabetical',
    title: 'Alphabetical',
    subtitle: 'Sort habits by name',
    options: [
      { value: 'name_asc', label: 'Name (A–Z)', description: 'Alphabetical order', Icon: ArrowDownAZ, iconStyle: STONE },
      { value: 'name_desc', label: 'Name (Z–A)', description: 'Reverse alphabetical', Icon: ArrowUpAZ, iconStyle: STONE },
    ],
  },
  {
    key: 'strength',
    title: 'Strength',
    subtitle: 'Order by habit strength score',
    options: [
      { value: 'strength_asc', label: 'Strength (Low → High)', description: 'Focus on habits needing attention', Icon: Zap, iconStyle: GREEN },
      { value: 'strength_desc', label: 'Strength (High → Low)', description: 'See strongest habits first', Icon: Zap, iconStyle: GREEN },
    ],
  },
  {
    key: 'streak',
    title: 'Streak',
    subtitle: 'Order by current streak count',
    options: [
      { value: 'streak_asc', label: 'Streak (Low → High)', description: 'Protect habits at risk', Icon: Flame, iconStyle: FIRE },
      { value: 'streak_desc', label: 'Streak (High → Low)', description: 'Celebrate your best streaks', Icon: Flame, iconStyle: FIRE },
    ],
  },
];

export const SORT_LABEL_MAP: Record<HabitSortMode, string> = {
  manual: 'Custom',
  name_asc: 'A–Z',
  name_desc: 'Z–A',
  streak_asc: 'Streak ↑',
  streak_desc: 'Streak ↓',
  strength_asc: 'Strength ↑',
  strength_desc: 'Strength ↓',
};
