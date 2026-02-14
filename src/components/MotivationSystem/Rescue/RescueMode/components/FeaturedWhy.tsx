import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';

interface FeaturedWhyProps {
  why: string;
}

/**
 * FeaturedWhy - Larger, more prominent "Your Why" display for rescue
 */
export function FeaturedWhy({ why }: FeaturedWhyProps) {
  return (
    <View className='rounded-2xl border-l-4 border-l-rose-400 p-5'>
      <LinearGradient
        colors={['#fff1f2', '#fffbeb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className='absolute inset-0 rounded-2xl'
      />
      <View className='mb-3 flex-row items-center gap-2'>
        <View className='h-10 w-10 items-center justify-center rounded-xl bg-rose-100'>
          <Heart className='text-rose-500' fill='#f43f5e' size={20} />
        </View>
        <Text className='text-lg font-bold text-rose-800'>
          Remember Your Why
        </Text>
      </View>
      <Text className='text-lg font-medium italic leading-7 text-rose-700'>
        "{why}"
      </Text>
      <Text className='mt-3 text-sm text-rose-500'>
        This is why you started. Don't let today break your momentum.
      </Text>
    </View>
  );
}
