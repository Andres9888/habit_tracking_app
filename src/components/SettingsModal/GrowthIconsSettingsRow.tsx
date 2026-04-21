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
  CUSTOM_PRESET_ID,
  DEFAULT_PROGRESS_EMOJIS,
  matchPresetId,
  resolveProgressEmojis,
  STRENGTH_LEVEL_KEYS,
  type ProgressEmojiPreset,
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
  const savedCustom = settings?.customProgressEmojis;
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

  const resolvedSet = useMemo(
    () => resolveProgressEmojis(pickerValue, DEFAULT_PROGRESS_EMOJIS),
    [pickerValue]
  );

  // Custom chip ALWAYS visible. When empty, preview the user's current
  // resolved set so the chip is useful as a "bookmark this combo" action.
  const customPreset = useMemo<ProgressEmojiPreset>(
    () => ({
      id: CUSTOM_PRESET_ID,
      label: 'Custom',
      emojis: savedCustom ?? resolvedSet,
    }),
    [savedCustom, resolvedSet]
  );

  const handleChange = useCallback(
    (next: ProgressEmojiSet | undefined) => {
      // Convex patch doesn't reliably unset optional fields when passed
      // `undefined`, so write DEFAULT explicitly on clear.
      const resolvedNext = next ?? DEFAULT_PROGRESS_EMOJIS;
      // If the incoming set doesn't match any built-in preset or the existing
      // saved custom, it's a slot edit — snapshot it as the user's new Custom.
      const presetId = matchPresetId(resolvedNext, savedCustom);
      const isFreshCustom = next !== undefined && presetId === null;
      void updateSettings({
        progressEmojis: resolvedNext,
        ...(isFreshCustom ? { customProgressEmojis: resolvedNext } : {}),
      });
    },
    [updateSettings, savedCustom]
  );

  const handleTapCustom = useCallback(() => {
    if (!savedCustom) {
      // Seed: save current resolved set as the user's Custom. No change
      // to progressEmojis — they already see this set.
      void updateSettings({ customProgressEmojis: resolvedSet });
      return;
    }
    // Apply saved Custom to the active set.
    void updateSettings({ progressEmojis: savedCustom });
  }, [savedCustom, resolvedSet, updateSettings]);

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
        customPreset={customPreset}
        expandedPanelStyle={{ paddingLeft: 16, paddingRight: 16 }}
        fallback={DEFAULT_PROGRESS_EMOJIS}
        toggleRowStyle={{ paddingLeft: 72, paddingRight: 16 }}
        value={pickerValue}
        onChange={handleChange}
        onTapCustom={handleTapCustom}
      />
    </View>
  );
}
