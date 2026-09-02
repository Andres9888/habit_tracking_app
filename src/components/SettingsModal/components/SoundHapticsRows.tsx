/** SoundHapticsRows — completion-sound switch, plus a separate Tone row.
 *
 *  These used to be ONE row carrying both `onToggle` and `onPress`, which made
 *  SettingsRow wrap an accessibilityRole='switch' inside an
 *  accessibilityRole='button': two conflicting VoiceOver nodes for one row, and
 *  no visible seam telling sighted users that the left of the row did something
 *  different from the right. Splitting gives each action one control and one
 *  announcement. */
import { useState } from 'react';
import { Volume2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { SoundPicker } from '../SoundPicker';
import { COMPLETION_SOUND_LABELS } from './SoundPickerOptions';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { CompletionSoundType } from '../../../../convex/settings/types';

interface SoundHapticsRowsProps {
  enabled: boolean;
  soundType: CompletionSoundType;
  onChangeEnabled: (value: boolean) => void | Promise<void>;
  onChangeType: (value: CompletionSoundType) => void | Promise<void>;
}

export function SoundHapticsRows(p: SoundHapticsRowsProps) {
  const { settings } = useThemeColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <SettingsRow
        icon={<Volume2 color={settings.sound.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.sound.bg}
        label='Completion sound'
        type='toggle'
        value={p.enabled}
        onToggle={(v) => {
          if (!v) setExpanded(false);
          void p.onChangeEnabled(v);
        }}
      />
      {p.enabled ? (
        <SettingsRow
          icon={null}
          iconBackgroundColor='transparent'
          label='Tone'
          type='selection'
          value={COMPLETION_SOUND_LABELS[p.soundType]}
          expanded={expanded}
          onPress={() => setExpanded((open) => !open)}
        />
      ) : null}
      <SoundPicker
        selected={p.soundType}
        visible={p.enabled && expanded}
        onSelect={(v) => void p.onChangeType(v)}
      />
    </>
  );
}
