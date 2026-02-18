import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { colors } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AnimatedPressable } from '../../ui';

interface ActionButtonsProps {
  habitName: string;
  isRestoring: boolean;
  showSuccess: boolean;
  successIconStyle: AnimatedStyle;
  onRestorePress: () => void;
  onDeletePress: () => void;
}

export function ActionButtons({
  habitName,
  isRestoring,
  showSuccess,
  successIconStyle,
  onRestorePress,
  onDeletePress,
}: ActionButtonsProps) {
  const { isDark } = useThemeColors();

  const restoreButtonStyle = showSuccess
    ? {
        backgroundColor: isDark ? '#064e3b' : '#ecfdf5',
        borderColor: isDark ? '#059669' : '#10b981',
      }
    : isRestoring
      ? {
          borderColor: isDark ? '#60a5fa' : '#93c5fd',
          opacity: 0.7,
        }
      : {
          borderColor: isDark ? '#3b82f6' : '#2563eb',
        };

  const restoreTextColor = showSuccess
    ? isDark
      ? 'text-emerald-300'
      : 'text-emerald-600'
    : isRestoring
      ? 'text-blue-300'
      : isDark
        ? 'text-blue-400'
        : 'text-blue-500';

  return (
    <View className='flex-row gap-2'>
      <AnimatedPressable
        accessibilityLabel={`Restore ${habitName}`}
        accessibilityRole='button'
        className='flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 py-2.5'
        disabled={isRestoring}
        style={restoreButtonStyle}
        onPress={onRestorePress}
      >
        {showSuccess ? (
          <Animated.View
            className='flex-row items-center gap-2'
            style={successIconStyle}
          >
            <View
              className='h-5 w-5 items-center justify-center rounded-full'
              style={{ backgroundColor: isDark ? '#059669' : '#10b981' }}
            >
              <Check color={colors.text.inverse} size={14} strokeWidth={3} />
            </View>
            <Text className={`text-xs font-bold tracking-wide ${restoreTextColor}`}>
              RESTORED!
            </Text>
          </Animated.View>
        ) : (
          <>
            <Text className={restoreTextColor}>↩</Text>
            <Text className={`text-xs font-bold tracking-wide ${restoreTextColor}`}>
              {isRestoring ? 'RESTORING...' : 'RESTORE'}
            </Text>
          </>
        )}
      </AnimatedPressable>
      <AnimatedPressable
        accessibilityLabel={`Permanently delete ${habitName}`}
        accessibilityRole='button'
        className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 py-2.5 ${
          isRestoring ? 'opacity-50' : ''
        }`}
        disabled={isRestoring}
        style={{ borderColor: '#f87171' }}
        onPress={onDeletePress}
      >
        <Text className='text-red-400'>🗑</Text>
        <Text className='text-xs font-bold tracking-wide text-red-400'>
          DELETE
        </Text>
      </AnimatedPressable>
    </View>
  );
}
