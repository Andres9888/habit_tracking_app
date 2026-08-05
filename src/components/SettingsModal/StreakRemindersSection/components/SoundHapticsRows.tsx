/** SoundHapticsRows — "Completion sound" toggle + inline tone picker.
 *  The switch reads as on/off at a glance (the old value row hid that behind a
 *  "Chime"/"Off" string), and the tone segments open beneath it. */
import { Volume2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../../SettingsRow';
import { SoundPicker } from '../../SoundPicker';
import { rowMatchesQuery, useSettingsSearch } from '../../search';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { CompletionSoundType } from '../../../../../convex/settings/types';

const SOUND_LABELS: Record<CompletionSoundType, string> = {
  chime: 'Chime',
  pop: 'Pop',
  success: 'Rise',
};

interface SoundHapticsRowsProps {
  enabled: boolean;
  soundType: CompletionSoundType;
  onChangeEnabled: (value: boolean) => void | Promise<void>;
  onChangeType: (value: CompletionSoundType) => void | Promise<void>;
}

export function SoundHapticsRows(p: SoundHapticsRowsProps) {
  const { settings } = useThemeColors();
  const { query } = useSettingsSearch();

  return (
    <>
      <SettingsRow
        icon={<Volume2 color={settings.sound.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.sound.bg}
        label='Completion sound'
        subtitle={p.enabled ? SOUND_LABELS[p.soundType] : 'Off'}
        type='toggle'
        value={p.enabled}
        onToggle={(v) => void p.onChangeEnabled(v)}
      />
      {rowMatchesQuery(query, 'Completion sound') ? (
        <SoundPicker
          selected={p.soundType}
          visible={p.enabled}
          onSelect={(v) => void p.onChangeType(v)}
        />
      ) : null}
    </>
  );
}
