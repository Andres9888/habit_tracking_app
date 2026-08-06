/** SortSettingsRow — collapsible Sort order row: value + chevron → family/direction picker */
import { ArrowUpDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { DisclosureRow } from './components/DisclosureRow';
import { SortOrderPicker } from './SortOrderPicker';
import {
  getSortDirectionLabel,
  getSortFamily,
  SORT_FAMILIES,
} from './SortOrderPicker.constants';
import { useThemeColors } from '../../theme/ThemeContext';
import type { HabitSortMode } from '../../features/habits/types';

interface Props {
  selected: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

function sortSummary(mode: HabitSortMode) {
  const family = getSortFamily(mode);
  const label = SORT_FAMILIES.find((item) => item.key === family)?.label;
  return getSortDirectionLabel(family, mode.endsWith('_asc')) ?? label ?? mode;
}

function sortSubtitle(mode: HabitSortMode) {
  const family = getSortFamily(mode);
  const hint = family === 'manual' ? 'drag to arrange' : 'auto-sorted';
  return `${sortSummary(mode)} · ${hint}`;
}

export function SortSettingsRow({ selected, onSelect }: Props) {
  const { settings: icons } = useThemeColors();

  return (
    <DisclosureRow
      icon={<ArrowUpDown color={icons.sort.icon} size={iconSizes.small} />}
      iconBackgroundColor={icons.sort.bg}
      label='Sort order'
      subtitle={sortSubtitle(selected)}
      valueLabel={sortSummary(selected)}
    >
      <SortOrderPicker selected={selected} onSelect={onSelect} />
    </DisclosureRow>
  );
}
