import { View, Text } from 'react-native';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DayNamesRow() {
  return (
    <View className='flex-row px-1'>
      {DAY_NAMES.map((day) => (
        <View key={day} className='flex-1 items-center py-2'>
          <Text className='text-[10px] font-semibold tracking-widest text-slate-500'>{day}</Text>
        </View>
      ))}
    </View>
  );
}
