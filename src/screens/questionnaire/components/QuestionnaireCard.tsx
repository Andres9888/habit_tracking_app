/**
 * QuestionnaireCard - Selectable option card for goal and pain-point screens.
 *
 * Shows an emoji, label, and a check indicator (radio or checkbox style).
 * Animates scale on press via spring physics.
 */

import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface QuestionnaireCardProps {
  emoji: string;
  label: string;
  multiSelect?: boolean;
  onPress: () => void;
  selected: boolean;
}

export function QuestionnaireCard({
  emoji,
  label,
  onPress,
  selected,
}: QuestionnaireCardProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, springs.button);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springs.button);
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className="flex-row items-center rounded-2xl px-4 py-3.5"
      style={[
        animatedStyle,
        {
          backgroundColor: selected ? colors.primary[100] : colors.card,
          borderColor: selected ? colors.primary[600] : colors.border,
          borderWidth: 2,
        },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text className="text-2xl">{emoji}</Text>
      <Text
        className="ml-3 flex-1 text-base font-medium"
        style={{ color: colors.text.primary }}
      >
        {label}
      </Text>
      <CheckCircle colors={colors} selected={selected} />
    </AnimatedPressable>
  );
}

function CheckCircle({
  colors,
  selected,
}: {
  colors: ReturnType<typeof useThemeColors>['colors'];
  selected: boolean;
}) {
  return (
    <View
      className="h-6 w-6 items-center justify-center rounded-full"
      style={{
        backgroundColor: selected ? colors.primary[600] : 'transparent',
        borderColor: selected ? colors.primary[600] : colors.gray[300],
        borderWidth: 2,
      }}
    >
      {selected ? (
        <Text className="text-xs font-bold" style={{ color: '#FFFFFF' }}>
          ✓
        </Text>
      ) : null}
    </View>
  );
}
