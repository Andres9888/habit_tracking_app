/** Outside-panel "Advanced options" label + chevron toggle. */
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { fontFamilies } from '@/theme/typography';
import { iconSizes } from '@/theme/iconSizes';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  expanded: boolean;
  chevronAnimatedStyle: object;
  onToggle: () => void;
}

export function AdvancedOptionsSectionLabel({
  expanded,
  chevronAnimatedStyle,
  onToggle,
}: Props) {
  const t = useAdvancedTokens();
  return (
    <Pressable
      accessibilityLabel='Advanced options'
      accessibilityRole='button'
      accessibilityState={{ expanded }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 9,
        marginHorizontal: 10,
      }}
      onPress={() => {
        void triggerHaptic('selection');
        onToggle();
      }}
    >
      <Text
        style={{
          fontFamily: fontFamilies.primary.text,
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: t.muted,
        }}
      >
        Advanced options
      </Text>
      <Animated.View style={chevronAnimatedStyle}>
        <ChevronDown color={t.muted} size={iconSizes.small} strokeWidth={2.5} />
      </Animated.View>
    </Pressable>
  );
}
