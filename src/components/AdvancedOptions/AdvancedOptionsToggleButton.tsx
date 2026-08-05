/** Green "Customize / Hide options" pill with the accordion chevron. */
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';

interface Props {
  expanded: boolean;
  chevronAnimatedStyle: object;
}

export function AdvancedOptionsToggleButton({
  expanded,
  chevronAnimatedStyle,
}: Props) {
  const { colors } = useThemeColors();
  return (
    <View
      className='mt-4 flex-row items-center justify-center gap-1.5 rounded-xl py-3'
      style={{ backgroundColor: colors.primary[600] }}
    >
      <Text
        className='uppercase'
        style={{
          ...typography.caption,
          fontSize: 13,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.5,
          color: '#FFFFFF',
        }}
      >
        {expanded ? 'Hide options' : 'Customize'}
      </Text>
      <Animated.View style={chevronAnimatedStyle}>
        <ChevronDown color='#FFFFFF' size={iconSizes.small} strokeWidth={2.5} />
      </Animated.View>
    </View>
  );
}
