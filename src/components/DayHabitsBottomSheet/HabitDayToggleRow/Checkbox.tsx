import { View, ActivityIndicator } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../../theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';

interface CheckboxProps {
  isCompleted: boolean;
  isLoading: boolean;
  checkScaleAnim: SharedValue<number>;
}

/**
 * Animated checkbox component with loading state
 */
export function Checkbox({
  isCompleted,
  isLoading,
  checkScaleAnim,
}: CheckboxProps) {
  const { colors: themeColors, isDark } = useThemeColors();

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkScaleAnim.value,
    transform: [{ scale: checkScaleAnim.value }],
  }));

  if (isLoading) {
    return (
      <View className='h-6 w-6 items-center justify-center'>
        <ActivityIndicator color={themeColors.text.secondary} size='small' />
      </View>
    );
  }

  const checkboxStyle = isCompleted ? '' : 'border-2';

  const shadowStyle = isCompleted
    ? {
        elevation: 2,
        shadowColor: themeColors.status.success,
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      }
    : undefined;

  return (
    <View
      className={`h-6 w-6 items-center justify-center rounded-lg ${checkboxStyle}`}
      style={[
        shadowStyle,
        isCompleted
          ? { backgroundColor: themeColors.status.success }
          : {
              backgroundColor: isDark ? themeColors.card : '#FFFFFF',
              borderColor: themeColors.border,
            },
      ]}
    >
      <Animated.View style={checkStyle}>
        <Check color={colors.text.inverse} size={iconSizes.small} strokeWidth={3} />
      </Animated.View>
    </View>
  );
}
