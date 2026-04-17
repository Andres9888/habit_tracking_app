/** AdvancedAlgorithmDisclosure — Collapsible card wrapping the algorithm picker for per-habit screens. */
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ChevronDown, SlidersHorizontal } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { AdvancedAlgorithmBody } from './AdvancedAlgorithmBody';
import {
  ALGORITHM_COPY,
  type AlgorithmMode,
} from './algorithmCopy';

interface Props {
  selected: AlgorithmMode;
  onSelect: (mode: AlgorithmMode) => void;
}

export function AdvancedAlgorithmDisclosure({ selected, onSelect }: Props) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const [expanded, setExpanded] = useState(false);
  const chevron = useSharedValue(0);
  const duration = reduceMotion ? 0 : 200;

  useEffect(() => {
    chevron.value = withTiming(expanded ? 180 : 0, { duration });
  }, [expanded, duration, chevron]);

  const activeMode: AlgorithmMode = selected;
  const subtitle = `Using ${ALGORITHM_COPY[activeMode].name} (${ALGORITHM_COPY[activeMode].complexity})`;

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevron.value}deg` }],
  }));

  const toggle = () => {
    void Haptics.selectionAsync();
    const next = !expanded;
    setExpanded(next);
    chevron.value = withTiming(next ? 180 : 0, { duration });
  };

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl'
      layout={reduceMotion ? undefined : LinearTransition.duration(220)}
      style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}
    >
      <Pressable
        accessibilityRole='button'
        accessibilityState={{ expanded }}
        className='flex-row items-center justify-between p-4'
        onPress={toggle}
      >
        <View className='flex-row items-center gap-2.5'>
          <SlidersHorizontal color={colors.text.secondary} size={iconSizes.small} strokeWidth={2} />
          <View>
            <Text className='text-[15px] font-semibold' style={{ color: colors.text.primary }}>
              Advanced
            </Text>
            <Text className='mt-0.5 text-[12px]' style={{ color: colors.text.tertiary }}>
              {subtitle}
            </Text>
          </View>
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronDown color={colors.text.tertiary} size={iconSizes.small} strokeWidth={2} />
        </Animated.View>
      </Pressable>
      {expanded ? (
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.duration(160)}
          exiting={reduceMotion ? undefined : FadeOut.duration(120)}
        >
          <AdvancedAlgorithmBody
            activeMode={activeMode}
            onSelect={onSelect}
          />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
