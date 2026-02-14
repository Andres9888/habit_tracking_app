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
  valueColor,
}: StatCardProps) {
  const { colors: themeColors } = useThemeColors();
  const resolvedValueColor = valueColor ?? themeColors.primary[500];

  return (
    <View
      className='rounded-2xl p-4'
      style={{ backgroundColor: themeColors.surface }}
    >
      <Text
        className='text-xs font-semibold uppercase tracking-[2px]'
        style={{ color: themeColors.text.secondary }}
      >
        {label}
      </Text>
      <View className='mt-2 flex-row items-baseline gap-2'>
        <Text className='text-3xl font-bold' style={{ color: resolvedValueColor }}>
          {value}
        </Text>
        {suffix && (
          <Text
            className='text-xl font-semibold'
            style={{ color: themeColors.text.secondary }}
          >
            {suffix}
          </Text>
        )}
      </View>
      <Text
        className='mt-1 text-sm'
        style={{ color: themeColors.text.tertiary }}
      >
        {description}
      </Text>
    </View>
  );
}
