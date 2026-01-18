import { Animated, View, ActivityIndicator } from 'react-native';
import { Check } from 'lucide-react-native';

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
  if (isLoading) {
    return (
      <View className='h-6 w-6 items-center justify-center'>
        <ActivityIndicator color='#78716c' size='small' />
      </View>
    );
  }

  const checkboxStyle = isCompleted
    ? 'bg-emerald-500'
    : 'border-2 border-stone-300 bg-white';

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
      style={shadowStyle}
    >
      <Animated.View
        style={{
          opacity: checkScaleAnim,
          transform: [{ scale: checkScaleAnim }],
        }}
      >
        <Check color='#ffffff' size={14} strokeWidth={3} />
      </Animated.View>
    </View>
  );
}
