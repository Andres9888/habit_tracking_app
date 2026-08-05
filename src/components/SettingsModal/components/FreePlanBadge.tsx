/** FreePlanBadge — muted "Free" pill shown when no subscription is active */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';

export function FreePlanBadge() {
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      className='rounded-md px-1.5 py-0.5'
      style={{
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border,
        borderWidth: 1,
      }}
    >
      <Text
        style={{
          ...typography.tabBar,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          color: themeColors.text.secondary,
        }}
      >
        Free
      </Text>
    </View>
  );
}
