/** SoundHapticsRows — completion-sound toggle; tone picker expands on tap. */
import { useState } from 'react';
import { Volume2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../../SettingsRow';
import { SoundPicker } from '../../SoundPicker';
import { COMPLETION_SOUND_LABELS } from '../../components/SoundPickerOptions';
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
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <SettingsRow
        icon={<Volume2 color={settings.sound.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.sound.bg}
        label='Completion sound'
        subtitle={p.enabled ? COMPLETION_SOUND_LABELS[p.soundType] : undefined}
        type='toggle'
        value={p.enabled}
        onPress={() => {
          if (p.enabled) setExpanded((open) => !open);
        }}
        onToggle={(v) => {
          setExpanded(v);
          void p.onChangeEnabled(v);
        }}
      />
      {rowMatchesQuery(query, 'Completion sound') ? (
        <SoundPicker
          selected={p.soundType}
          visible={p.enabled && expanded}
          onSelect={(v) => void p.onChangeType(v)}
        />
      ) : null}
    </>
  );
}
