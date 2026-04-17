/** AlgorithmLegendDisclosure — Tap-to-expand wrapper around AlgorithmLegend reference cards. */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ChevronDown, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { AlgorithmLegend } from '../AlgorithmPicker';
import { useThemeColors } from '../../theme/ThemeContext';

interface Props {
  activeMode: string | undefined;
}

export function AlgorithmLegendDisclosure({ activeMode }: Props) {
  const { colors } = useThemeColors();
  const [expanded, setExpanded] = useState(false);
  const chevron = useSharedValue(0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevron.value}deg` }],
  }));

  const toggle = () => {
    void Haptics.selectionAsync();
    const next = !expanded;
    setExpanded(next);
    chevron.value = withTiming(next ? 180 : 0, { duration: 180 });
  };

  return (
    <View>
      <Pressable
        accessibilityHint='Shows a description of each strength algorithm mode'
        accessibilityRole='button'
        accessibilityState={{ expanded }}
        className='flex-row items-center gap-1.5 px-4 py-2.5'
        onPress={toggle}
      >
        <Info color={colors.text.tertiary} size={iconSizes.micro} strokeWidth={2} />
        <Text
          style={{
            ...typography.caption,
            fontWeight: fontWeights.medium,
            color: colors.text.tertiary,
            flex: 1,
          }}
        >
          What do these mean?
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown color={colors.text.tertiary} size={iconSizes.micro} strokeWidth={2} />
        </Animated.View>
      </Pressable>
      {expanded ? (
        <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
          <AlgorithmLegend activeMode={activeMode} />
        </Animated.View>
      ) : null}
    </View>
  );
}
