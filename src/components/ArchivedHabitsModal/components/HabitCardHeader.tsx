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
  const { colors, isDark } = useThemeColors();

  return (
    <View className='mb-3 flex-row items-start'>
      <View className='flex-row items-center gap-3'>
        <View className='relative'>
          <View
            className='absolute bottom-0 left-0 top-0 w-1 rounded-full'
            style={{ backgroundColor: accentColor }}
          />
          <Text className='pl-3 text-2xl'>{icon || '📝'}</Text>
        </View>
        <View className='flex-1'>
          <Text
            className='text-base font-semibold'
            style={{ color: colors.text.primary }}
          >
            {name}
          </Text>
          <View className='mt-0.5 flex-row items-center gap-1'>
            <Text
              className='text-xs'
              style={{ color: colors.text.secondary }}
            >
              Archived{' '}
              {new Date(archiveDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
              })}
            </Text>
            <Text
              className='text-xs'
              style={{ color: isDark ? '#4b5563' : '#d6d3d1' }}
            >
              •
            </Text>
            <Text
              className='text-xs'
              style={{ color: colors.text.secondary }}
            >
              {getRelativeTime(archiveDate)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
