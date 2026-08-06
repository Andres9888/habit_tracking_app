/**
 * Settings row for choosing the global default growth-icon set.
 * Writes directly to userSettings.progressEmojis via a Convex mutation.
 */
import { Sparkles } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useMutation } from 'convex/react';

import { iconSizes } from '@/theme/iconSizes';

import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';
import { useThemeColors } from '../../theme/ThemeContext';
import {
  CUSTOM_PRESET_ID,
  DEFAULT_PROGRESS_EMOJIS,
  matchPresetId,
  STRENGTH_LEVEL_KEYS,
  type ProgressEmojiPreset,
  type ProgressEmojiSet,
} from '../../utils/progressEmojis';
import { ProgressEmojiPicker } from '../ProgressEmojiPicker';

import { GrowthIconsCustomizeAction } from './GrowthIconsCustomizeAction';
import { SettingsRow } from './SettingsRow';

export function GrowthIconsSettingsRow() {
  const { settings: settingsIcons } = useThemeColors();
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => setExpanded((v) => !v), []);
  const settings = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  const currentValue = settings?.progressEmojis;
  const savedCustom = settings?.customProgressEmojis;
  const updateSettings = useMutation(api.settings.update);

  // Treat a stored value that matches DEFAULT as "unset" so the picker's
  // Reset affordance hides after a reset.
  const pickerValue = useMemo(() => {
    if (!currentValue) return;
    const matchesDefault = STRENGTH_LEVEL_KEYS.every(
      (k) => currentValue[k] === DEFAULT_PROGRESS_EMOJIS[k]
    );
    return matchesDefault ? undefined : currentValue;
  }, [currentValue]);

  const customPreset = useMemo<ProgressEmojiPreset | null>(
    () =>
      savedCustom
        ? { id: CUSTOM_PRESET_ID, label: 'Custom', emojis: savedCustom }
        : null,
    [savedCustom]
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

  return (
    <View>
      <SettingsRow
        icon={
          <Sparkles
            color={settingsIcons.gradient.icon}
            size={iconSizes.small}
          />
        }
        iconBackgroundColor={settingsIcons.gradient.bg}
        label='Default growth icons'
        rightAccessory={
          <GrowthIconsCustomizeAction
            expanded={expanded}
            onToggle={toggleExpanded}
          />
        }
        subtitle='Used for every new habit'
        type='info'
      />
      <ProgressEmojiPicker
        customPreset={customPreset}
        expanded={expanded}
        expandedPanelStyle={{ paddingLeft: 16, paddingRight: 16 }}
        fallback={DEFAULT_PROGRESS_EMOJIS}
        toggleRowStyle={{ paddingLeft: 16, paddingRight: 16 }}
        value={pickerValue}
        onChange={handleChange}
        onToggleExpanded={toggleExpanded}
      />
    </View>
  );
}
