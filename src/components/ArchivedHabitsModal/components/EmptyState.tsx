import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function EmptyState() {
  return (
    <View className='items-center justify-center px-6 py-16'>
      {/* Illustration - using plant/growth metaphor for warmth */}
      <View className='mb-6 items-center'>
        <View className='relative'>
          <View className='h-28 w-32 items-center justify-center rounded-2xl'>
            <LinearGradient
              colors={['#ecfdf5', '#ccfbf1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className='absolute inset-0 rounded-2xl'
            />
            <Text className='mt-2 text-5xl'>🌱</Text>
          </View>
          {/* Sparkles - repositioned for balance */}
          <Text className='absolute -right-3 -top-3 text-xl'>🌟</Text>
          <Text className='absolute -bottom-2 -left-3 text-lg'>✨</Text>
        </View>
      </View>

      {/* Text Content - warmer, more encouraging copy */}
      <Text className='mb-2 text-center text-2xl font-bold tracking-tight text-stone-900'>
        Your Habits Are Thriving!
      </Text>
      <Text className='mb-1 text-center text-base text-stone-500'>
        All your habits are active and growing.
      </Text>
      <Text className='mb-6 max-w-xs text-center text-sm text-stone-500'>
        When you need a break from a habit, swipe left to archive it here for
        safekeeping.
      </Text>

      {/* Pro Tip Card - warmer color scheme */}
      <View className='w-full max-w-xs rounded-2xl border border-emerald-100 bg-emerald-50 p-4'>
        <View className='flex-row items-start gap-3'>
          <Text className='text-2xl'>💚</Text>
          <View className='flex-1'>
            <Text className='mb-1 text-sm font-medium text-emerald-800'>
              Good to Know
            </Text>
            <Text className='text-xs leading-5 text-emerald-700'>
              Archiving preserves all your progress and streaks. You can restore
              habits anytime and pick up right where you left off!
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
