/** Collapsed Strength Curve trigger — icon · kicker/title/value/hint · chevron. */
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { StrengthCurveToggleText } from './StrengthCurveToggleText';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  icon: ReactNode;
  collapsedValue: string;
  /** Full value string for the a11y label (collapsedValue may be shortened for display). */
  announceValue?: string;
  expanded: boolean;
  chevronAnimatedStyle: object;
  onToggle: () => void;
}

export function StrengthCurveToggleRow({
  icon,
  collapsedValue,
  announceValue,
  expanded,
  chevronAnimatedStyle,
  onToggle,
}: Props) {
  const t = useAdvancedTokens();
  return (
    <AnimatedPressable
      animationConfig={{ hapticStyle: 'selection' }}
      accessibilityHint={
        expanded
          ? 'Collapses strength curve options'
          : 'Expands strength curve options'
      }
      accessibilityLabel={`Strength Curve, Growth rate, ${
        announceValue ?? collapsedValue
      }`}
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
        onToggle();
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
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
