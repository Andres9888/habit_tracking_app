/**
 * TOP PICK badge for drill-list habit cards.
 */

import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../../theme/typography';
import { styles as s } from './HabitTemplateCard.styles';

export function HabitTemplateCardTopPick() {
  const { colors, isDark } = useThemeColors();
  const badgeBg = isDark ? colors.status.warningLight : colors.status.warning;
  const badgeBorder = isDark
    ? colors.status.warningText
    : colors.status.warning;
  const badgeText = colors.status.warningText;

  return (
    <View
      style={[
        s.topPickBadge,
        { backgroundColor: badgeBg, borderColor: badgeBorder },
      ]}
    >
      <Text
        style={{
          ...typography.caption,
          color: badgeText,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.3,
        }}
      >
        ⭐ TOP PICK
      </Text>
    </View>
  );
}
