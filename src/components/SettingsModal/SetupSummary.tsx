/** SetupSummary — "your setup, in a sentence" preference recap under identity */
import { Text, View } from 'react-native';
import { typography, fontWeights } from '../../theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import { buildSetupSummary } from './SetupSummary.helpers';
import type { SettingsContentProps } from './SettingsContent.types';

type Props = Pick<
  SettingsContentProps,
  | 'darkModePreference'
  | 'habitSortMode'
  | 'streakRemindersEnabled'
  | 'streakReminderTime'
  | 'completionSoundEnabled'
  | 'completionSoundType'
>;

export function SetupSummary(p: Props) {
  const { colors: themeColors } = useThemeColors();
  const sentence = buildSetupSummary(p);

  return (
    <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
      <Text
        className='mb-1.5'
        style={{
          ...typography.caption,
          fontWeight: fontWeights.semibold,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          color: themeColors.text.secondary,
        }}
      >
        Your setup, in a sentence
      </Text>
      <View
        className='rounded-xl border px-3 py-2.5'
        style={{
          backgroundColor: themeColors.status.successLight,
          borderColor: themeColors.border,
        }}
      >
        <Text
          style={{ ...typography.bodySmall, color: themeColors.text.primary }}
        >
          {sentence}
        </Text>
      </View>
    </View>
  );
}
