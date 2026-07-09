/**
 * CalendarPreview — live preview of how the habit calendar renders, reflecting
 * the Appearance settings (day shape, completion icon, streak connections, and
 * the gradient strength fill). Reuses the real ChainDayItem + StrengthFillBackground
 * so the preview is pixel-identical to a habit card on the list. The chain sits
 * full-bleed on a soft green wash (no framing white box).
 */
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAnimatedStyle } from 'react-native-reanimated';
import { fontWeights, typography } from '@/theme/typography';
import { StrengthFillBackground } from '../HabitCard/components/StrengthFillBackground';
import type { CompletionIcon, DayShape } from '../HabitChainVisualizer/types';
import {
  CalendarPreviewWeek,
  PREVIEW_STRENGTH_PERCENT,
} from './CalendarPreviewWeek';
import { useThemeColors } from '../../theme/ThemeContext';
import { getSettingsRowColors } from './SettingsRow';

const LABEL_STYLE = {
  ...typography.caption,
  fontWeight: fontWeights.semibold,
  letterSpacing: 0.5,
  textTransform: 'uppercase' as const,
  marginBottom: 11,
  marginHorizontal: 16,
};

const WASH_LIGHT = ['#E4F2EB', '#F1F8F4', '#E8F4EE'] as const;
const WASH_DARK = [
  'rgba(52,211,153,0.16)',
  'rgba(52,211,153,0.06)',
  'rgba(52,211,153,0.05)',
] as const;

interface Props {
  dayShape: DayShape;
  completionIcon: CompletionIcon;
  showGradientFill: boolean;
  connectorStyle: 'none' | 'small' | 'full';
  compact: boolean;
}

export function CalendarPreview(p: Props) {
  const { colors, isDark } = useThemeColors();
  const border = getSettingsRowColors(isDark).border;
  const accent = colors.primary[500];
  const fillStyle = useAnimatedStyle(() => ({
    // StrengthFillBackground requires an animated style prop — value derived from preview data
    width: `${PREVIEW_STRENGTH_PERCENT}%`,
  }));

  return (
    <LinearGradient
      accessibilityLabel='Preview of how your habit calendar looks with the current appearance settings'
      accessibilityRole='image'
      colors={isDark ? WASH_DARK : WASH_LIGHT}
      end={{ x: 1, y: 1 }}
      pointerEvents='none'
      start={{ x: 0, y: 0 }}
      style={{
        paddingTop: 12,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderColor: border,
        overflow: 'hidden',
      }}
    >
      <Text style={[LABEL_STYLE, { color: colors.primary[700] }]}>Preview</Text>
      <View
        style={{
          marginHorizontal: 8,
          paddingHorizontal: 6,
          paddingVertical: p.compact ? 6 : 10,
          position: 'relative',
          overflow: 'hidden',
        }}
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
          connectorStyle={p.connectorStyle}
          dayShape={p.dayShape}
        />
      </View>
    </LinearGradient>
  );
}
