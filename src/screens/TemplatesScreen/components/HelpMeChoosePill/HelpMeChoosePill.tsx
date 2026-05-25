/**
 * Floating pill button that invites users to use the guided picker
 */

import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface HelpMeChoosePillProps {
  label: string;
  onPress: () => void;
}

export function HelpMeChoosePill({ label, onPress }: HelpMeChoosePillProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      3,
      false
    );
  }, [scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[s.wrapper, animStyle]}>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole='button'
        style={[s.pill, { backgroundColor: colors.primary[500] }]}
        onPress={onPress}
      >
        <Text style={s.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  label: { color: '#fff', fontSize: 14, fontWeight: '600' },
  pill: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  wrapper: {
    alignSelf: 'flex-end',
    bottom: 16,
    position: 'absolute',
    right: 16,
  },
});
