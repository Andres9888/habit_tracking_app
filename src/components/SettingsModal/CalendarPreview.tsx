/**
 * CalendarPreview — live preview of how the habit calendar renders, reflecting
 * the Appearance settings (day shape, completion icon, streak connections, and
 * the gradient strength fill). Reuses the real ChainDayItem + StrengthFillBackground
 * so the preview is pixel-identical to a habit card on the list.
 */
import { Text, View } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { fontWeights, typography } from '@/theme/typography';
import { StrengthFillBackground } from '../HabitCard/components/StrengthFillBackground';
import type { CompletionIcon, DayShape } from '../HabitChainVisualizer/types';
import { CalendarPreviewWeek } from './CalendarPreviewWeek';
import { useThemeColors } from '../../theme/ThemeContext';
import { getSettingsRowColors } from './SettingsRow.colors';

const LABEL_STYLE = {
  ...typography.caption,
  fontWeight: fontWeights.semibold,
  letterSpacing: 0.5,
  textTransform: 'uppercase' as const,
  marginBottom: 12,
  marginHorizontal: 16,
};

const CARD_STYLE = {
  position: 'relative' as const,
  overflow: 'hidden' as const,
  borderRadius: 16,
  borderWidth: 1,
  marginHorizontal: 8,
  paddingHorizontal: 6,
};

interface Props {
  dayShape: DayShape;
  completionIcon: CompletionIcon;
  showGradientFill: boolean;
  showStreakConnections: boolean;
  highContrastMode: boolean;
  compact: boolean;
}

export function CalendarPreview(p: Props) {
  const { colors, isDark } = useThemeColors();
  const border = getSettingsRowColors(p.highContrastMode, isDark).border;
  const accent = colors.primary[500];
  const fillStyle = useAnimatedStyle(() => ({ width: '78%' }));

  return (
    <View
      accessibilityLabel='Preview of how your habit calendar looks with the current appearance settings'
      accessibilityRole='image'
      pointerEvents='none'
      style={{
        paddingTop: 14,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderColor: border,
      }}
    >
      <Text style={[LABEL_STYLE, { color: accent }]}>Preview</Text>
      <View
        style={[
          CARD_STYLE,
          {
            backgroundColor: colors.card,
            borderColor: border,
            paddingVertical: p.compact ? 9 : 14,
          },
        ]}
      >
        {p.showGradientFill ? (
          <StrengthFillBackground
            isDark={isDark}
            strengthColor={accent}
            strengthFillStyle={fillStyle}
          />
        ) : null}
        <CalendarPreviewWeek
          accentColor={accent}
          completionIcon={p.completionIcon}
          dayShape={p.dayShape}
          highContrastMode={p.highContrastMode}
          showStreakConnections={p.showStreakConnections}
        />
      </View>
    </View>
  );
}
