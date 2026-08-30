/** BehaviorSection — Quiet Configuration Index §3: sort order + completion
 *  sound (moved out of Reminders). Archive/export moved to Data & Privacy. */
import { useState } from 'react';
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
import { SoundHapticsRows } from './SoundHapticsRows';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { HabitSortMode } from '../../../features/habits/types';
import type { CompletionSoundType } from '../../../../convex/settings/types';

interface BehaviorSectionProps {
  sectionIconColor: string;
  habitSortMode: string;
  onChangeHabitSortMode: (mode: HabitSortMode) => void;
  completionSoundEnabled: boolean;
  completionSoundType: CompletionSoundType;
  onChangeCompletionSoundEnabled: (value: boolean) => void | Promise<void>;
  onChangeCompletionSoundType: (
    value: CompletionSoundType
  ) => void | Promise<void>;
}

function getSortSummary(mode: HabitSortMode) {
  const family = getSortFamily(mode);
  const label = SORT_FAMILIES.find((item) => item.key === family)?.label;
  return getSortDirectionLabel(family, mode.endsWith('_asc')) ?? label ?? mode;
}

export function BehaviorSection(p: BehaviorSectionProps) {
  const { settings: icons } = useThemeColors();
  const iconSize = iconSizes.small;
  // The two-tier picker used to render permanently expanded — the tallest block
  // on the page for a preference most people set once. Now it opens on tap,
  // matching Calendar look and Theme.
  const [sortExpanded, setSortExpanded] = useState(false);

  return (
    <SettingsSection
      icon={<SlidersHorizontal color={p.sectionIconColor} size={iconSize} />}
      title='Behavior'
    >
      <SettingsRow
        icon={<ArrowUpDown color={icons.sort.icon} size={iconSize} />}
        iconBackgroundColor={icons.sort.bg}
        label='Sort order'
        subtitle='How habits are ordered'
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
      <SoundHapticsRows
        enabled={p.completionSoundEnabled}
        soundType={p.completionSoundType}
        onChangeEnabled={p.onChangeCompletionSoundEnabled}
        onChangeType={p.onChangeCompletionSoundType}
      />
    </SettingsSection>
  );
}
