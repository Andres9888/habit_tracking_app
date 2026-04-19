/**
 * Settings row for choosing the global default growth-icon set.
 * Writes directly to userSettings.progressEmojis via a Convex mutation.
 */
import { Sparkles } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useMutation, useQuery } from 'convex/react';

import { iconSizes } from '@/theme/iconSizes';

import { api } from '../../../convex/_generated/api';
import { useThemeColors } from '../../theme/ThemeContext';
import {
  DEFAULT_PROGRESS_EMOJIS,
  STRENGTH_LEVEL_KEYS,
  type ProgressEmojiSet,
} from '../../utils/progressEmojis';
import { ProgressEmojiPicker } from '../ProgressEmojiPicker';

import { SettingsRow } from './SettingsRow';

interface Props {
  highContrastMode: boolean;
}

export function GrowthIconsSettingsRow({ highContrastMode }: Props) {
  const { settings: settingsIcons } = useThemeColors();
  const settings = useQuery(api.settings.get);
  const currentValue = settings?.progressEmojis;
  const updateSettings = useMutation(api.settings.update);

  // Treat a stored value that matches DEFAULT as "unset" so the picker's
  // Reset affordance hides after a reset.
  const pickerValue = useMemo(() => {
    if (!currentValue) return undefined;
    const matchesDefault = STRENGTH_LEVEL_KEYS.every(
      (k) => currentValue[k] === DEFAULT_PROGRESS_EMOJIS[k]
    );
    return matchesDefault ? undefined : currentValue;
  }, [currentValue]);

  const handleChange = useCallback(
    (next: ProgressEmojiSet | undefined) => {
      // Convex patch doesn't reliably unset optional fields when passed
      // `undefined`, so write DEFAULT explicitly on clear.
      void updateSettings({ progressEmojis: next ?? DEFAULT_PROGRESS_EMOJIS });
    },
    [updateSettings]
  );

  return (
    <View>
      <SettingsRow
        highContrastMode={highContrastMode}
        icon={
          <Sparkles
            color={settingsIcons.gradient.icon}
            size={iconSizes.small}
          />
        }
        iconBackgroundColor={settingsIcons.gradient.bg}
        label='Default growth icons'
        subtitle='Pick the 5 emojis used for every habit by default'
        type='info'
      />
      <ProgressEmojiPicker
        expandedPanelStyle={{ paddingLeft: 16, paddingRight: 16 }}
        fallback={DEFAULT_PROGRESS_EMOJIS}
        toggleRowStyle={{ paddingLeft: 72, paddingRight: 16 }}
        value={pickerValue}
        onChange={handleChange}
      />
    </View>
  );
}
