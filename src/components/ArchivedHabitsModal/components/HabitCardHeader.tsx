import { Text, View } from 'react-native';
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
  return (
    <View className='mb-3 flex-row items-start'>
      <View className='flex-row items-center gap-3'>
        <View className='relative'>
          <View
            className='absolute bottom-0 left-0 top-0 w-1 rounded-full'
            style={{ backgroundColor: iconColor || '#6366F1' }}
          />
          <Text className='pl-3 text-2xl'>{icon || '📝'}</Text>
        </View>
        <View className='flex-1'>
          <Text className='text-base font-semibold text-stone-900'>{name}</Text>
          <View className='mt-0.5 flex-row items-center gap-1'>
            <Text className='text-xs text-stone-500'>
              Archived{' '}
              {new Date(archiveDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
              })}
            </Text>
            <Text className='text-stone-300'>•</Text>
            <Text className='text-xs text-stone-500'>
              {getRelativeTime(archiveDate)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
