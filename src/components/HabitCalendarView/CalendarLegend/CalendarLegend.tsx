import { Text, View } from 'react-native';

const LEGEND_ITEMS = [
  {
    indicatorClassName: 'bg-emerald-500',
    label: 'Completed',
    textClassName: 'text-emerald-700',
  },
  {
    indicatorClassName: 'bg-rose-400',
    label: 'Missed',
    textClassName: 'text-rose-500',
  },
  {
    indicatorClassName: 'bg-blue-500',
    label: 'Today',
    textClassName: 'text-blue-600',
  },
  {
    indicatorClassName: 'bg-stone-300',
    label: 'Upcoming',
    textClassName: 'text-stone-400',
  },
];

export function CalendarLegend() {
  return (
    <View className='flex-row flex-wrap items-center justify-center gap-4 pb-1 pt-2'>
      {LEGEND_ITEMS.map(({ indicatorClassName, label, textClassName }) => (
        <View key={label} className='flex-row items-center gap-1.5'>
          <View className={`h-2.5 w-2.5 rounded-full ${indicatorClassName}`} />
          <Text className={`text-[10px] font-medium ${textClassName}`}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}
