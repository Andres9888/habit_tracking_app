/** BehaviorSection — Habits: sort order + archive + export.
 *  Completion sound lives under Reminders; export folded back in here per the
 *  mock's 3B grouping (6 cards, not 7). */
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { SortOrderPicker } from '../SortOrderPicker';
import {
  getSortDirectionLabel,
  getSortFamily,
  SORT_FAMILIES,
} from '../SortOrderPicker.constants';
import { HabitDataRows } from './HabitDataRows';
import { useThemeColors } from '../../../theme/ThemeContext';
import { rowMatchesQuery, useSettingsSearch } from '../search';
import type { HabitSortMode } from '../../../features/habits/types';

interface BehaviorSectionProps {
  sectionIconColor: string;
  habitSortMode: string;
  onChangeHabitSortMode: (mode: HabitSortMode) => void;
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: (format: 'csv' | 'json') => void | Promise<void>;
}

function getSortSummary(mode: HabitSortMode) {
  const family = getSortFamily(mode);
  const label = SORT_FAMILIES.find((item) => item.key === family)?.label;
  return getSortDirectionLabel(family, mode.endsWith('_asc')) ?? label ?? mode;
}

export function BehaviorSection(p: BehaviorSectionProps) {
  const { settings: icons } = useThemeColors();
  const iconSize = iconSizes.small;
  const { query } = useSettingsSearch();

  return (
    <SettingsSection
      icon={<SlidersHorizontal color={p.sectionIconColor} size={iconSize} />}
      title='Your habits & data'
    >
      <SettingsRow
        icon={<ArrowUpDown color={icons.sort.icon} size={iconSize} />}
        iconBackgroundColor={icons.sort.bg}
        label='Sort order'
        subtitle='How habits are ordered'
        type='selection'
        value={getSortSummary(p.habitSortMode as HabitSortMode)}
      />
      {rowMatchesQuery(query, 'Sort order') ? (
        <SortOrderPicker
          selected={p.habitSortMode as HabitSortMode}
          onSelect={p.onChangeHabitSortMode}
        />
      ) : null}
      <HabitDataRows
        archivedHabitsCount={p.archivedHabitsCount}
        onExportHabitsData={p.onExportHabitsData}
        onOpenArchivedHabits={p.onOpenArchivedHabits}
      />
    </SettingsSection>
  );
}
