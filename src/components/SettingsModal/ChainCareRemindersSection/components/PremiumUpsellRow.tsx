import { Text, View } from 'react-native';
import { Pressable } from 'react-native';
import { typography, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '@/theme/ThemeContext';

interface PremiumUpsellRowProps {
  insetBorder: string;
  onPremiumUpsell?: () => void;
}

export function PremiumUpsellRow({
  insetBorder,
  onPremiumUpsell,
}: PremiumUpsellRowProps) {
  const { colors: themeColors } = useThemeColors();

  const handlePress = () => {
    void triggerHaptic('selection');
    onPremiumUpsell?.();
  };

  return (
    <Pressable
      accessibilityLabel='Custom times and quiet windows are in Premium. See Premium'
      accessibilityRole='button'
      onPress={handlePress}
    >
      <View
        className='px-3.5 py-3'
        style={{ borderTopColor: insetBorder, borderTopWidth: 1 }}
      >
        <Text
          style={{ ...typography.caption, color: themeColors.text.secondary }}
        >
          Custom times and quiet windows are in Premium.{' '}
          <Text
            style={{
              color: themeColors.status.successText,
              fontWeight: fontWeights.semibold,
            }}
          >
            See Premium
          </Text>
        </Text>
      </View>
    </Pressable>
  );
}
