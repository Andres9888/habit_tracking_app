import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function EmptyState() {
  return (
    <View className='items-center justify-center px-6 py-16'>
      <View className='mb-6 items-center'>
        <View className='relative'>
          <View className='h-28 w-32 items-center justify-center rounded-2xl'>
            <LinearGradient
              colors={['#fef2f2', '#fce7f3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className='absolute inset-0 rounded-2xl'
            />
            <Text className='mt-2 text-5xl'>🗑️</Text>
          </View>
          <Text className='absolute -right-3 -top-3 text-xl'>✨</Text>
          <Text className='absolute -bottom-2 -left-3 text-lg'>🌟</Text>
        </View>
      </View>

      <Text className='mb-2 text-center text-2xl font-bold tracking-tight text-stone-900'>
        Nothing Here!
      </Text>
      <Text className='mb-1 text-center text-base text-stone-500'>
        No recently deleted habits.
      </Text>
      <Text className='mb-6 max-w-xs text-center text-sm text-stone-500'>
        When you delete a habit, it'll appear here for 30 days before being
        permanently removed.
      </Text>

      <View className='w-full max-w-xs rounded-2xl border border-amber-100 bg-amber-50 p-4'>
        <View className='flex-row items-start gap-3'>
          <Text className='text-2xl'>💡</Text>
          <View className='flex-1'>
            <Text className='mb-1 text-sm font-medium text-amber-800'>
              Safety Net
            </Text>
            <Text className='text-xs leading-5 text-amber-700'>
              Deleted habits are kept for 30 days. You can restore them anytime
              during this period with all your progress intact!
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
