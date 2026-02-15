
import { Text, TouchableOpacity, View } from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import { colors } from '../../../theme/colors';

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
  return (
    <View className='flex-row gap-2'>
      <TouchableOpacity
        accessibilityLabel={`Restore ${habitName}`}
        accessibilityRole='button'
        className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 py-2.5 ${
          showSuccess
            ? 'border-emerald-500 bg-emerald-50'
            : isRestoring
              ? 'border-blue-300 opacity-70'
              : 'border-blue-500'
        }`}
        disabled={isRestoring}
        onPress={onRestorePress}
      >
        {showSuccess ? (
          <Animated.View
            className='flex-row items-center gap-2'
            style={successIconStyle}
          >
            <View className='h-5 w-5 items-center justify-center rounded-full bg-emerald-500'>
              <Check color={colors.text.inverse} size={14} strokeWidth={3} />
            </View>
            <Text className='text-xs font-bold tracking-wide text-emerald-600'>
              RESTORED!
            </Text>
          </Animated.View>
        ) : (
          <>
            <Text className={isRestoring ? 'text-blue-300' : 'text-blue-500'}>
              ↩
            </Text>
            <Text
              className={`text-xs font-bold tracking-wide ${isRestoring ? 'text-blue-300' : 'text-blue-500'}`}
            >
              {isRestoring ? 'RESTORING...' : 'RESTORE'}
            </Text>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityLabel={`Permanently delete ${habitName}`}
        accessibilityRole='button'
        className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 border-red-400 py-2.5 ${
          isRestoring ? 'opacity-50' : ''
        }`}
        disabled={isRestoring}
        onPress={onDeletePress}
      >
        <Text className='text-red-400'>🗑</Text>
        <Text className='text-xs font-bold tracking-wide text-red-400'>
          DELETE
        </Text>
      </TouchableOpacity>
    </View>
  );
}
