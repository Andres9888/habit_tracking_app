import { ArrowUpDown, SlidersHorizontal, Volume2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { SortOrderPicker } from '../SortOrderPicker';
import {
  getSortDirectionLabel,
  getSortFamily,
  SORT_FAMILIES,
} from '../SortOrderPicker.constants';
import { SoundPicker } from '../SoundPicker';
import { HabitDataRows } from './HabitDataRows';
import { useThemeColors } from '../../../theme/ThemeContext';
import { rowMatchesQuery, useSettingsSearch } from '../search';
import type { HabitSortMode } from '../../../features/habits/types';
import type { SettingsContentProps } from '../SettingsContent.types';

interface BehaviorSectionProps {
  sectionIconColor: string;
  habitSortMode: string;
  onChangeHabitSortMode: (mode: HabitSortMode) => void;
  completionSoundEnabled: boolean;
  completionSoundType: SettingsContentProps['completionSoundType'];
  onChangeCompletionSoundEnabled: SettingsContentProps['onChangeCompletionSoundEnabled'];
  onChangeCompletionSoundType: SettingsContentProps['onChangeCompletionSoundType'];
  archivedHabitsCount?: number;
  onOpenArchivedHabits: () => void;
  onExportHabitsData?: SettingsContentProps['onExportHabitsData'];
}

const SOUND_LABELS = {
  chime: 'Ding',
  pop: 'Pop',
  success: 'Rise',
} as const;

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
      title='Habits'
    >
      <SettingsRow
        icon={<ArrowUpDown color={icons.sort.icon} size={iconSize} />}
        iconBackgroundColor={icons.sort.bg}
        label='Sort order'
        showChevron
        subtitle='How habits are ordered'
        type='info'
        value={getSortSummary(p.habitSortMode as HabitSortMode)}
      />
      {rowMatchesQuery(query, 'Sort order') ? (
        <SortOrderPicker
          selected={p.habitSortMode as HabitSortMode}
          onSelect={p.onChangeHabitSortMode}
        />
      ) : null}
      <SettingsRow
        icon={<Volume2 color={icons.sound.icon} size={iconSize} />}
        iconBackgroundColor={icons.sound.bg}
        label='Completion sound'
        subtitle='Play sound when checking off'
        type='selection'
        value={
          p.completionSoundEnabled ? SOUND_LABELS[p.completionSoundType] : 'Off'
        }
        onPress={() =>
          void p.onChangeCompletionSoundEnabled(!p.completionSoundEnabled)
        }
      />
      {rowMatchesQuery(query, 'Completion sound') ? (
        <SoundPicker
          selected={p.completionSoundType}
          visible={p.completionSoundEnabled}
          onSelect={(v) => void p.onChangeCompletionSoundType(v)}
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
