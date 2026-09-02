/** HabitsSortRows — sort-order row plus its collapsible two-tier picker.
 *  The picker used to render permanently expanded — the tallest block on the
 *  page for a preference most people set once. It opens on tap now, matching
 *  Calendar look and Theme. */
import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SortOrderPicker } from '../SortOrderPicker';
import {
  getSortDirectionLabel,
  getSortFamily,
  SORT_FAMILIES,
} from '../SortOrderPicker.constants';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { HabitSortMode } from '../../../features/habits/types';

interface HabitsSortRowsProps {
  habitSortMode: string;
  onChangeHabitSortMode: (mode: HabitSortMode) => void;
}

export function getSortSummary(mode: HabitSortMode) {
  const family = getSortFamily(mode);
  const label = SORT_FAMILIES.find((item) => item.key === family)?.label;
  return getSortDirectionLabel(family, mode.endsWith('_asc')) ?? label ?? mode;
}

export function HabitsSortRows(p: HabitsSortRowsProps) {
  const { settings: icons } = useThemeColors();
  const [sortExpanded, setSortExpanded] = useState(false);

  return (
    <>
      <SettingsRow
        icon={<ArrowUpDown color={icons.sort.icon} size={iconSizes.small} />}
        iconBackgroundColor={icons.sort.bg}
        label='Sort order'
        type='selection'
        value={getSortSummary(p.habitSortMode as HabitSortMode)}
        expanded={sortExpanded}
        onPress={() => setSortExpanded((open) => !open)}
      />
      {sortExpanded ? (
        <SortOrderPicker
          selected={p.habitSortMode as HabitSortMode}
          onSelect={p.onChangeHabitSortMode}
        />
      ) : null}
    </>
  );
}
