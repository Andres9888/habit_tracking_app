import { View, Text } from 'react-native';

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DayNamesRow() {
  return (
    <View className='mb-3 flex-row'>
      {DAY_NAMES.map((day) => (
        <View key={day} className='w-[14.28%] items-center'>
          <Text className='text-sm font-medium text-stone-500'>{day}</Text>
        </View>
      ))}
    </View>
  );
}
