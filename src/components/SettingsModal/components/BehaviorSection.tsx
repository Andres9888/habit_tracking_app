import {
  ArrowUpDown,
  Calendar,
  SlidersHorizontal,
  Volume2,
} from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { SortOrderPicker } from '../SortOrderPicker';
import { SortDirectionChip } from './SortDirectionChip';
import { SoundPicker } from '../SoundPicker';
import { useThemeColors } from '../../../theme/ThemeContext';
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
  stickyCalendarHeader: boolean;
  onChangeStickyCalendarHeader: SettingsContentProps['onChangeStickyCalendarHeader'];
}

export function BehaviorSection(p: BehaviorSectionProps) {
  const { settings: icons } = useThemeColors();
  const iconSize = iconSizes.small;
  const mode = p.habitSortMode as HabitSortMode;

  return (
    <SettingsSection
      icon={<SlidersHorizontal color={p.sectionIconColor} size={iconSize} />}
      title='Habits'
    >
      <SettingsRow
        icon={<ArrowUpDown color={icons.sort.icon} size={iconSize} />}
        iconBackgroundColor={icons.sort.bg}
        label='Sort order'
        rightAccessory={
          <SortDirectionChip mode={mode} onSelect={p.onChangeHabitSortMode} />
        }
        showBorder={false}
        subtitle='How habits are ordered'
        type='info'
      />
      <SortOrderPicker selected={mode} onSelect={p.onChangeHabitSortMode} />
      <SettingsRow
        icon={<Volume2 color={icons.sound.icon} size={iconSize} />}
        iconBackgroundColor={icons.sound.bg}
        label='Completion sound'
        subtitle='Play sound when checking off'
        showBorder={!p.completionSoundEnabled}
        type='toggle'
        value={p.completionSoundEnabled}
        onToggle={(v) => void p.onChangeCompletionSoundEnabled(v)}
      />
      <SoundPicker
        selected={p.completionSoundType}
        visible={p.completionSoundEnabled}
        onSelect={(v) => void p.onChangeCompletionSoundType(v)}
      />
      <SettingsRow
        icon={<Calendar color={icons.calendarHeader.icon} size={iconSize} />}
        iconBackgroundColor={icons.calendarHeader.bg}
        label='Sticky month header'
        showBorder={false}
        subtitle='Month stays visible while scrolling'
        type='toggle'
        value={p.stickyCalendarHeader}
        onToggle={(v) => void p.onChangeStickyCalendarHeader(v)}
      />
    </SettingsSection>
  );
}
