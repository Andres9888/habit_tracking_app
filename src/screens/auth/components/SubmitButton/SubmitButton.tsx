import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SubmitButton({
  label,
  loadingLabel,
  isLoading,
  disabled = false,
  onPress,
}: SubmitButtonProps) {
  const isDisabled = isLoading || disabled;
  const { isDark } = useThemeColors();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(0.97, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  return (
    <AnimatedPressable
      accessibilityLabel={isLoading ? loadingLabel : label}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isDisabled }}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          backgroundColor: isDark ? '#E5E7EB' : '#1c1917',
          opacity: isDisabled ? 0.4 : 1,
          shadowColor: isDark ? '#000000' : '#1c1917',
        },
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        style={[
          styles.label,
          { color: isDark ? '#111827' : '#ffffff' },
        ]}
      >
        {isLoading ? loadingLabel : label}
      </Text>
      <View style={styles.iconContainer}>
        {isLoading ? (
          <ActivityIndicator
            color={isDark ? '#111827' : '#FFFFFF'}
            size='small'
          />
        ) : (
          <Text
            style={[
              styles.arrow,
              { color: isDark ? '#111827' : '#ffffff' },
            ]}
          >
            →
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  arrow: {
    fontSize: 18,
  },
  button: {
    alignItems: 'center',
    borderRadius: 16,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 16,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    width: 20,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
  },
});
