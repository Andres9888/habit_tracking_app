/** DangerZoneNotice — recessed well under the destructive rows, carrying the
 *  micro-label + the consequence in plain words.
 *
 *  Colour alone says "careful"; it can't say WHAT you lose. Borrowing the Habit
 *  Browser's recessed "START SMALL" box puts the stakes on screen at the moment
 *  of the decision, instead of leaving them to a confirm dialog. */
import { Text, View } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';

export function DangerZoneNotice() {
  const { colors: themeColors, settings } = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: themeColors.background,
        borderRadius: borderRadius.medium,
        marginHorizontal: 16,
        marginBottom: 16,
        marginTop: 4,
        padding: 14,
      }}
    >
      <Text
        style={{
          color: settings.deleteAccount.icon,
          fontSize: 12,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.9,
          textTransform: 'uppercase',
        }}
      >
        Danger zone
      </Text>
      <Text
        style={{
          ...typography.bodySmall,
          color: themeColors.text.secondary,
          marginTop: 4,
        }}
      >
        Deleting your account removes every habit, streak, and backup. This
        can&apos;t be undone.
      </Text>
    </View>
  );
}
