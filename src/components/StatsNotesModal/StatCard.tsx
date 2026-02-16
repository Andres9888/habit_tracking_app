import { Text, View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';

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
  const { colors } = useThemeColors();
  return (
    <View className='rounded-2xl p-4' style={{ backgroundColor: colors.gray[50] }}>
      <Text className='text-xs font-semibold uppercase tracking-[2px]' style={{ color: colors.text.tertiary }}>
        {label}
      </Text>
      <View className='mt-2 flex-row items-baseline gap-2'>
        <Text className='text-3xl font-bold' style={{ color: valueColor }}>
          {value}
        </Text>
        {suffix && (
          <Text className='text-xl font-semibold' style={{ color: colors.text.tertiary }}>{suffix}</Text>
        )}
      </View>
      <Text className='mt-1 text-sm' style={{ color: colors.text.secondary }}>{description}</Text>
    </View>
  );
}
