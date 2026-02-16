import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getRelativeTime } from '../utils';

interface HabitCardHeaderProps {
  name: string;
  icon?: string;
  iconColor?: string;
  archiveDate: number;
}

export function HabitCardHeader({
  name,
  icon,
  iconColor,
  archiveDate,
}: HabitCardHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-3 flex-row items-start'>
      <View className='flex-row items-center gap-3'>
        <View className='relative'>
          <View
            className='absolute bottom-0 left-0 top-0 w-1 rounded-full'
            style={{ backgroundColor: iconColor || colors.purple.text }}
          />
          <Text className='pl-3 text-2xl'>{icon || '📝'}</Text>
        </View>
        <View className='flex-1'>
          <Text style={{ color: colors.text.primary }} className='text-base font-semibold'>{name}</Text>
          <View className='mt-0.5 flex-row items-center gap-1'>
            <Text style={{ color: colors.text.secondary }} className='text-xs'>
              Archived{' '}
              {new Date(archiveDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
              })}
            </Text>
            <Text style={{ color: colors.gray[300] }}>•</Text>
            <Text style={{ color: colors.text.secondary }} className='text-xs'>
              {getRelativeTime(archiveDate)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
