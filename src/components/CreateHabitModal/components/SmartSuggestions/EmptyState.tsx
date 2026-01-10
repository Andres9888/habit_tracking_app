import { Text, View } from 'react-native';

interface EmptyStateProps {
  label: string;
}

export function EmptyState({ label }: EmptyStateProps) {
  return (
    <View className='mb-6'>
      <Text className='mb-3 text-sm font-semibold text-stone-500'>{label}</Text>
      <View className='items-center rounded-2xl bg-stone-50 py-6'>
        <Text className='text-3xl'>🎯</Text>
        <Text className='mt-2 text-sm text-stone-500'>
          Create your own unique habit!
        </Text>
      </View>
    </View>
  );
}
