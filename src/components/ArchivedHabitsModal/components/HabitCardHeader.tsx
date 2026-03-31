import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getRelativeTime } from '../utils';

interface HabitCardHeaderProps {
  name: string;
  icon?: string;
  iconColor?: string;
  archiveDate: number;
  accentColor: string;
}

export function HabitCardHeader({
  name,
  icon,
  accentColor,
  archiveDate,
}: HabitCardHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-4 flex-row items-start gap-4'>
      <View className='h-12 w-12 items-center justify-center'>
        <View
          className='absolute h-14 w-14 rounded-full'
          style={{ backgroundColor: accentColor, opacity: 0.08 }}
        />
        <Text style={{ fontSize: 32, lineHeight: 40 }}>{icon || '📝'}</Text>
      </View>
      <View className='flex-1 pt-0.5'>
        <Text
          className='text-lg font-semibold leading-snug'
          style={{ color: colors.text.primary }}
        >
          {name}
        </Text>
        <Text
          className='mt-0.5 text-[13px]'
          style={{ color: colors.text.tertiary }}
        >
          {getRelativeTime(archiveDate)}
        </Text>
      </View>
    </View>
  );
}
