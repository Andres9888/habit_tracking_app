import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SubmitButton({
  label,
  loadingLabel,
  isLoading,
  disabled = false,
  onPress,
  testID,
}: SubmitButtonProps) {
  const { colors } = useThemeColors();
  const isDisabled = isLoading || disabled;
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) {
      scale.value = withSpring(0.97, { damping: 18, stiffness: 150 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      scale.value = withSpring(1, { damping: 18, stiffness: 150 });
    }
  };

  return (
    <AnimatedPressable
      accessibilityHint='Double tap to submit this form'
      accessibilityLabel={isLoading ? loadingLabel : label}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isDisabled }}
      className='mt-4'
      disabled={isDisabled}
      style={[
        animatedStyle,
        styles.button,
        { backgroundColor: colors.text.primary },
        isDisabled && styles.disabled,
      ]}
      testID={testID}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={[styles.label, { color: colors.text.inverse }]}>
        {isLoading ? loadingLabel : label}
      </Text>
      <View style={styles.iconContainer}>
        {isLoading ? (
          <ActivityIndicator color={colors.text.inverse} size='small' />
        ) : (
          <Text style={[styles.arrow, { color: colors.text.inverse }]}>
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
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  disabled: {
    opacity: 0.4,
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
