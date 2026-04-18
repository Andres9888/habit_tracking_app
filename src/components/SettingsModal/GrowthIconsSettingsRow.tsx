/**
 * Settings row for choosing the global default growth-icon set.
 * Writes directly to userSettings.progressEmojis via a Convex mutation.
 */
import { Sparkles } from 'lucide-react-native';
import { useCallback } from 'react';
import { View } from 'react-native';
import { useMutation, useQuery } from 'convex/react';

import { iconSizes } from '@/theme/iconSizes';

import { api } from '../../../convex/_generated/api';
import { useThemeColors } from '../../theme/ThemeContext';
import {
  resolveProgressEmojis,
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
  const fallback = resolveProgressEmojis(undefined, currentValue);
  const updateSettings = useMutation(api.settings.update);

  const handleChange = useCallback(
    (next: ProgressEmojiSet | undefined) => {
      void updateSettings({ progressEmojis: next });
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
        fallback={fallback}
        toggleRowStyle={{ paddingLeft: 72, paddingRight: 16 }}
        value={currentValue}
        onChange={handleChange}
      />
    </View>
  );
}
