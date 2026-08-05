/**
 * GoalRecommendedBadge — fixed-height badge slot for a preset chip. The slot is
 * always reserved (even when not recommended) so every chip stays the same
 * height and the 3-up grid row never goes uneven. When recommended, it renders a
 * single-line accent pill that reads unmistakably as a badge — never wraps.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { fontWeights } from '../../../theme/typography';
import { useThemeColors } from '../../../theme';

const SLOT_HEIGHT = 18;
const SLOT_MARGIN_TOP = 7;
const PILL_PADDING_X = 7;
const PILL_PADDING_Y = 3;

interface GoalRecommendedBadgeProps {
  accent: string;
  recommended: boolean;
}

export function GoalRecommendedBadge({
  accent,
  recommended,
}: GoalRecommendedBadgeProps) {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        alignItems: 'center',
        height: SLOT_HEIGHT,
        justifyContent: 'center',
        marginTop: SLOT_MARGIN_TOP,
      }}
    >
      {recommended ? (
        <View
          style={{
            backgroundColor: accent,
            borderRadius: borderRadius.full,
            paddingHorizontal: PILL_PADDING_X,
            paddingVertical: PILL_PADDING_Y,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: colors.text.inverse,
              fontSize: 9,
              fontWeight: fontWeights.bold,
              letterSpacing: 0.4,
              lineHeight: 11,
              textTransform: 'uppercase',
            }}
          >
            Recommended
          </Text>
        </View>
      ) : null}
    </View>
  );
}
