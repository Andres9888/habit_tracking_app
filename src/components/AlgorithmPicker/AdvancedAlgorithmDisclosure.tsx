/** AdvancedAlgorithmDisclosure — Collapsible card wrapping the algorithm picker for per-habit screens. */
import { useCallback, useState } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronDown, SlidersHorizontal } from 'lucide-react-native';
import { triggerHaptic } from '@/utils/haptics';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AdvancedAlgorithmBody } from './AdvancedAlgorithmBody';
import { ALGORITHM_COPY, type AlgorithmMode } from './algorithmCopy';

interface Props {
  selected: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
}

export function AdvancedAlgorithmDisclosure({ selected, onSelect }: Props) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);

  const { chevronAnimatedStyle, contentAnimatedStyle } = useExpandAnimation({
    contentHeight,
    defaultExpanded: expanded,
    hasContentMeasured,
    reduceMotion,
  });

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;
      if (hasContentMeasured && !expanded) return;
      setContentHeight((prev) => (prev === height ? prev : height));
      setHasContentMeasured(true);
    },
    [expanded, hasContentMeasured]
  );

  const activeMode: AlgorithmMode = selected;
  const subtitle = `Using ${ALGORITHM_COPY[activeMode].name}`;

  const toggle = () => {
    void triggerHaptic('selection');
    setExpanded((prev) => !prev);
  };

  return (
    <View
      className='overflow-hidden rounded-2xl'
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
      }}
    >
      <AnimatedPressable
        accessibilityRole='button'
        accessibilityState={{ expanded }}
        className='flex-row items-center justify-between p-4'
        onPress={toggle}
      >
        <View className='flex-row items-center gap-2.5'>
          <SlidersHorizontal
            color={colors.text.secondary}
            size={iconSizes.small}
            strokeWidth={2}
          />
          <View>
            <Text
              className='text-base font-semibold'
              style={{ color: colors.text.primary }}
            >
              Advanced
            </Text>
            <Text
              className='mt-0.5 text-xs'
              style={{ color: colors.text.tertiary }}
            >
              {subtitle}
            </Text>
          </View>
        </View>
        <Animated.View style={chevronAnimatedStyle}>
          <ChevronDown
            color={colors.text.tertiary}
            size={iconSizes.small}
            strokeWidth={2}
          />
        </Animated.View>
      </AnimatedPressable>
      <Animated.View
        accessibilityElementsHidden={!expanded}
        importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
        pointerEvents={expanded ? 'auto' : 'none'}
        style={contentAnimatedStyle}
      >
        <View onLayout={handleContentLayout}>
          <AdvancedAlgorithmBody activeMode={activeMode} onSelect={onSelect} />
        </View>
      </Animated.View>
    </View>
  );
}
