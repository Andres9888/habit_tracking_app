import { View, Text } from 'react-native';
import { CheckCircle2, FastForward } from 'lucide-react-native';
import {
  formatActivityDate,
  formatActivityTime,
} from '../../utils/habitCalculations';
import { useThemeColors } from '../../theme/ThemeContext';

interface ActivityEntry {
  _creationTime: number;
  date: string;
  completed: boolean;
}

interface ActivityLogProps {
  tracking: ActivityEntry[];
}

export function ActivityLog({ tracking }: ActivityLogProps) {
  const { colors, isDark } = useThemeColors();

  // Sort by date descending (most recent first) and limit to 20 entries
  const sortedActivities = [...tracking]
    .sort((a, b) => {
      // Sort by date first
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      // If same date, sort by creation time
      return b._creationTime - a._creationTime;
    })
    .slice(0, 20);

  if (sortedActivities.length === 0) {
    return (
      <View className='mt-6'>
        <Text
          className='mb-4 text-lg font-bold'
          style={{ color: colors.text.primary }}
        >
          Activity Log
        </Text>
        <View
          className='rounded-xl p-6'
          style={{ backgroundColor: colors.surface }}
        >
          <Text
            className='text-center text-sm'
            style={{ color: colors.text.secondary }}
          >
            No activity logged yet
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className='mt-6'>
      <Text
        className='mb-4 text-lg font-bold'
        style={{ color: colors.text.primary }}
      >
        Activity Log
      </Text>
      <View className='gap-3'>
        {sortedActivities.map((activity) => (
          <View
            key={`${activity.date}-${activity._creationTime}`}
            className='flex-row items-center justify-between rounded-xl p-4'
            style={{
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              borderWidth: isDark ? 1 : 0,
            }}
          >
            {/* Left side - Status and Date */}
            <View className='flex-1'>
              <Text
                className='text-base font-semibold'
                style={{ color: colors.text.primary }}
              >
                {activity.completed ? 'Completed' : 'Skipped'}
              </Text>
              <Text
                className='mt-0.5 text-sm'
                style={{ color: colors.text.secondary }}
              >
                {formatActivityDate(activity.date)}
              </Text>
            </View>

            {/* Right side - Time with Icon */}
            <View className='flex-row items-center gap-2'>
              {activity.completed ? (
                <CheckCircle2 color={isDark ? '#34D399' : '#10b981'} fill={isDark ? '#34D399' : '#10b981'} size={18} />
              ) : (
                <FastForward color={colors.text.tertiary} size={18} />
              )}
              <Text
                className='text-sm font-semibold'
                style={{
                  color: activity.completed
                    ? isDark ? '#34D399' : '#047857'
                    : colors.text.secondary,
                }}
              >
                {formatActivityTime(activity._creationTime)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
