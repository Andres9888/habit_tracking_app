import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';

interface DayCellProps {
  date: Date;
  isToday: boolean;
  hasCompletion: boolean;
  onToggle: () => void;
}

export function DayCell({ date, isToday, hasCompletion, onToggle }: DayCellProps) {
  return (
    <Pressable
      accessibilityHint={`Double tap to toggle completion for ${format(date, 'MMMM d')}`}
      accessibilityLabel={`${format(date, 'MMMM d')}${hasCompletion ? ', completed' : ''}`}
      accessibilityRole='button'
      accessibilityState={{ checked: hasCompletion }}
      className='mb-2 w-[14.28%] items-center'
      hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      onPress={onToggle}
    >
      <View className='relative items-center'>
        {isToday ? (
          <View className='h-11 w-11 items-center justify-center rounded-full bg-stone-900'>
            <Text className='text-base font-bold text-white'>{format(date, 'd')}</Text>
          </View>
        ) : (
          <View className='h-11 items-center justify-center'>
            <Text className='text-base font-semibold text-stone-900'>
              {format(date, 'd')}
            </Text>
          </View>
        )}

        {hasCompletion && (
          <View className='absolute -bottom-1 h-1 w-1 rounded-full bg-blue-500' />
        )}
      </View>
    </Pressable>
  );
}
