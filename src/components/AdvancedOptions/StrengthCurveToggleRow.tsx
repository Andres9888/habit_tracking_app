/** Collapsed Strength Curve trigger — icon · kicker/title/value/hint · chevron. */
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { iconSizes } from '@/theme/iconSizes';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { StrengthCurveToggleText } from './StrengthCurveToggleText';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  icon: ReactNode;
  collapsedValue: string;
  expanded: boolean;
  chevronAnimatedStyle: object;
  onToggle: () => void;
}

export function StrengthCurveToggleRow({
  icon,
  collapsedValue,
  expanded,
  chevronAnimatedStyle,
  onToggle,
}: Props) {
  const t = useAdvancedTokens();
  return (
    <AnimatedPressable
      accessibilityHint={
        expanded
          ? 'Collapses strength curve options'
          : 'Expands strength curve options'
      }
      accessibilityLabel={`Strength Curve, Growth rate, ${collapsedValue}`}
      accessibilityRole='button'
      accessibilityState={{ expanded }}
      style={{
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
      }}
      onPress={() => {
        void triggerHaptic('selection');
        onToggle();
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          backgroundColor: t.accentTile,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <StrengthCurveToggleText collapsedValue={collapsedValue} />
      <Animated.View
        style={[
          {
            width: 28,
            height: 28,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: t.border,
            backgroundColor: t.card,
            alignItems: 'center',
            justifyContent: 'center',
          },
          chevronAnimatedStyle,
        ]}
      >
        <ChevronDown color={t.muted} size={iconSizes.small} strokeWidth={2.2} />
      </Animated.View>
    </AnimatedPressable>
  );
}
