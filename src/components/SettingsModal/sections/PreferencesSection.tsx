/** PreferencesSection — sort order + completion sound */
import { Volume2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SettingsSection } from '../SettingsSection';
import { SortSettingsRow } from '../SortSettingsRow';
import { SoundPicker } from '../SoundPicker';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { HabitSortMode } from '../../../features/habits/types';
import type { SettingsContentProps } from '../SettingsContent.types';

interface Props {
  habitSortMode: string;
  onChangeHabitSortMode: (mode: HabitSortMode) => void;
  completionSoundEnabled: boolean;
  completionSoundType: SettingsContentProps['completionSoundType'];
  onChangeCompletionSoundEnabled: SettingsContentProps['onChangeCompletionSoundEnabled'];
  onChangeCompletionSoundType: SettingsContentProps['onChangeCompletionSoundType'];
}

const SOUND_LABELS = { chime: 'Ding', pop: 'Pop', success: 'Rise' } as const;

export function PreferencesSection(p: Props) {
  const { settings: icons } = useThemeColors();
  const iconSize = iconSizes.small;
  const mode = p.habitSortMode as HabitSortMode;
  const soundSub = p.completionSoundEnabled
    ? `${SOUND_LABELS[p.completionSoundType]} · plays on complete`
    : 'Off · quiet success';

  return (
    <SettingsSection title='Preferences'>
      <SortSettingsRow selected={mode} onSelect={p.onChangeHabitSortMode} />
      <SettingsRow
        icon={<Volume2 color={icons.sound.icon} size={iconSize} />}
        iconBackgroundColor={icons.sound.bg}
        label='Completion sound'
        subtitle={soundSub}
        type='selection'
        value={
          p.completionSoundEnabled ? SOUND_LABELS[p.completionSoundType] : 'Off'
        }
        onPress={() =>
          void p.onChangeCompletionSoundEnabled(!p.completionSoundEnabled)
        }
      />
      <SoundPicker
        selected={p.completionSoundType}
        visible={p.completionSoundEnabled}
        onSelect={(v) => void p.onChangeCompletionSoundType(v)}
      />
    </SettingsSection>
  );
}
