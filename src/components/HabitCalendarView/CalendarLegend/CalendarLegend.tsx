import { View, Text } from 'react-native';

export function CalendarLegend() {
  return (
    <View className='flex-row justify-center gap-6 pb-1 pt-2'>
      <View className='flex-row items-center gap-1.5'>
        <View className='h-3 w-3 rounded-md border-2 border-emerald-500 bg-emerald-50' />
        <Text className='text-[11px] font-medium text-slate-500'>Completed</Text>
      </View>
      <View className='flex-row items-center gap-1.5'>
        <View className='h-3 w-3 rounded-md border border-dashed border-slate-200 bg-gray-50 opacity-70' />
        <Text className='text-[11px] font-medium text-slate-500'>Missed</Text>
      </View>
      <View className='flex-row items-center gap-1.5'>
        <View className='h-3 w-3 rounded-md border-2 border-blue-500 bg-blue-50' />
        <Text className='text-[11px] font-medium text-slate-500'>Today</Text>
      </View>
    </View>
  );
}
