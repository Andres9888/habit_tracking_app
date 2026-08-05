/** Section header — quiet "Advanced options" label + expand control. */
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import {
  AdvancedOptionsCollapsedChips,
  type AdvancedOptionChip,
} from './AdvancedOptionsCollapsedChips';
import { usePressed } from './usePressed';

interface Props {
  expanded: boolean;
  chips: AdvancedOptionChip[];
  chevronAnimatedStyle: object;
  onToggle: () => void;
}

export function AdvancedOptionsHeader({
  expanded,
  chips,
  chevronAnimatedStyle,
  onToggle,
}: Props) {
  const { colors } = useThemeColors();
  const { pressed, pressProps } = usePressed();

  return (
    <Pressable
      accessibilityLabel='Advanced options, 3 options'
      accessibilityRole='button'
      accessibilityState={{ expanded }}
      {...pressProps}
      style={{
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: expanded ? 8 : 14,
        opacity: pressed ? 0.75 : 1,
      }}
      onPress={onToggle}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            ...typography.caption,
            fontSize: 12,
            fontWeight: fontWeights.bold,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: colors.text.secondary,
          }}
        >
          Advanced options
        </Text>
        <Animated.View style={chevronAnimatedStyle}>
          <ChevronDown
            color={colors.text.secondary}
            size={iconSizes.small}
            strokeWidth={2.5}
          />
        </Animated.View>
      </View>
      {expanded ? null : <AdvancedOptionsCollapsedChips chips={chips} />}
    </Pressable>
  );
}
