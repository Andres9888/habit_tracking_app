import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '@/theme';
import { spacing } from '@/theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionButtonProps {
  size: number;
  color: string;
  borderColor?: string;
  onPress: () => void;
  disabled?: boolean;
  label: string;
  shadow?: boolean;
  children: React.ReactNode;
}

export function ActionButton({
  size,
  color,
  borderColor,
  onPress,
  disabled,
  label,
  shadow,
  children,
}: ActionButtonProps) {
  const scale = useSharedValue(1);
  const { colors } = useThemeColors();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ alignItems: 'center', gap: spacing.xs }}>
      <AnimatedPressable
        accessibilityLabel={label}
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.9, { damping: 18, stiffness: 150 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 18, stiffness: 150 });
        }}
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            borderWidth: borderColor ? 2 : 0,
            borderColor,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: disabled ? 0.5 : 1,
            ...(shadow
              ? {
                  shadowColor: '#059669',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }
              : {}),
          },
        ]}
      >
        {children}
      </AnimatedPressable>
      <Text style={{ fontSize: 11, color: colors.text.tertiary }}>
        {label}
      </Text>
    </View>
  );
}
