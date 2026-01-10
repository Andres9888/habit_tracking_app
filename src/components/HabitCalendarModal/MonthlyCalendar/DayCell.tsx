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
    <Pressable className='mb-2 w-[14.28%] items-center' onPress={onToggle}>
      <View className='relative items-center'>
        {isToday ? (
          <View className='h-8 w-8 items-center justify-center rounded-full bg-stone-900'>
            <Text className='text-base font-bold text-white'>{format(date, 'd')}</Text>
          </View>
        ) : (
          <View className='h-7 items-center justify-center'>
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
