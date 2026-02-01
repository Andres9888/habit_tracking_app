/**
 * Loading skeleton state for templates screen
 * Uses animated shimmer effect for better loading UX
 */

import { Text, View } from 'react-native';
import { useAppTheme } from '../../../theme';
import { ShimmerSkeleton } from '../../../features/habits/components/HabitsEmptyStateMinimal/LoadingSkeleton/ShimmerSkeleton';

export function TemplatesLoadingState() {
  const theme = useAppTheme();

  return (
    <View className='flex-1 bg-[#faf9f7] px-4 pt-4'>
      {/* Header */}
      <View className='mb-6'>
        <Text
          style={[
            theme.custom.typography.heading1,
            { color: '#1c1917', fontWeight: '700' },
          ]}
        >
          Import Habits
        </Text>
        <Text
          style={[
            theme.custom.typography.bodySmall,
            { color: '#78716c', marginTop: 4 },
          ]}
        >
          Science-backed habits to get you started
        </Text>
      </View>

      {/* Search bar skeleton */}
      <ShimmerSkeleton
        borderRadius={12}
        height={44}
        style={{ marginBottom: 20 }}
        width='100%'
      />

      {/* Template card skeletons */}
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          className='mb-4 rounded-2xl bg-white p-4'
          style={{
            shadowColor: '#000',
            shadowOffset: { height: 1, width: 0 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
          }}
        >
          {/* Icon */}
          <ShimmerSkeleton
            borderRadius={12}
            height={48}
            style={{ marginBottom: 12 }}
            width={48}
          />

          {/* Title */}
          <ShimmerSkeleton
            borderRadius={6}
            height={20}
            style={{ marginBottom: 8 }}
            width='70%'
          />

          {/* Description */}
          <ShimmerSkeleton
            borderRadius={6}
            height={14}
            style={{ marginBottom: 12 }}
            width='90%'
          />

          {/* Badges row */}
          <View className='flex-row gap-2'>
            <ShimmerSkeleton borderRadius={16} height={24} width={60} />
            <ShimmerSkeleton borderRadius={16} height={24} width={80} />
            <ShimmerSkeleton borderRadius={16} height={24} width={50} />
          </View>
        </View>
      ))}
    </View>
  );
}
