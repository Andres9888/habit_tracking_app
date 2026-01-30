import { Text, View } from 'react-native';

interface StatCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  description: string;
  valueColor?: string;
}

export function StatCard({
  label,
  value,
  suffix,
  description,
  valueColor = '#48bb78',
}: StatCardProps) {
  return (
    <View className='rounded-2xl bg-stone-50 p-4'>
      <Text className='text-xs font-semibold uppercase tracking-[2px] text-stone-500'>
        {label}
      </Text>
      <View className='mt-2 flex-row items-baseline gap-2'>
        <Text className='text-3xl font-bold' style={{ color: valueColor }}>
          {value}
        </Text>
        {suffix && (
          <Text className='text-xl font-semibold text-stone-400'>{suffix}</Text>
        )}
      </View>
      <Text className='mt-1 text-sm text-stone-600'>{description}</Text>
    </View>
  );
}
