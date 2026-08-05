/** SoundHapticsRows — "Completion sound" toggle + inline tone picker.
 *  No subtitle: the switch carries on/off, and whenever it is on the tone
 *  segments right below already show which tone is selected. */
import { Volume2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../../SettingsRow';
import { SoundPicker } from '../../SoundPicker';
import { rowMatchesQuery, useSettingsSearch } from '../../search';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { CompletionSoundType } from '../../../../../convex/settings/types';

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
