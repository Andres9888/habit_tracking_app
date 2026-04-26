import { Animated, View, ActivityIndicator } from 'react-native';
import { Check } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../../theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';

interface CheckboxProps {
  isCompleted: boolean;
  isLoading: boolean;
  checkScaleAnim: Animated.Value;
}

/**
 * Animated checkbox component with loading state
 */
export function Checkbox({
  isCompleted,
  isLoading,
  checkScaleAnim,
}: CheckboxProps) {
  const { colors: themeColors } = useThemeColors();

  if (isLoading) {
    return (
      <View className='h-6 w-6 items-center justify-center'>
        <ActivityIndicator color='#78716c' size='small' />
      </View>
    );
  }

  const checkboxStyle = isCompleted
    ? ''
    : 'border-2 bg-white';

  const shadowStyle = isCompleted
    ? {
        elevation: 2,
        shadowColor: '#10b981',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      }
    : undefined;

  return (
    <View
      className={`h-6 w-6 items-center justify-center rounded-lg ${checkboxStyle}`}
      style={[shadowStyle, isCompleted ? { backgroundColor: themeColors.status.success } : { borderColor: themeColors.border }]}
    >
      <Animated.View
        style={{
          opacity: checkScaleAnim,
          transform: [{ scale: checkScaleAnim }],
        }}
      >
        <Check color={colors.text.inverse} size={iconSizes.small} strokeWidth={3} />
      </Animated.View>
    </View>
  );
}
