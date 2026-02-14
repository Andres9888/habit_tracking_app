import React from 'react';
import { Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp } from 'lucide-react-native';

interface NewRecordBadgeProps {
  newRecordOpacity: Animated.Value;
  newRecordScale: Animated.Value;
}

export function NewRecordBadge({
  newRecordOpacity,
  newRecordScale,
}: NewRecordBadgeProps) {
  return (
    <Animated.View
      className='mx-3 mb-3 flex-row items-center justify-center gap-1.5 rounded-full py-2'
      style={{
        borderColor: '#fcd34d', // amber-300
        borderWidth: 1,
        opacity: newRecordOpacity,
        transform: [{ scale: newRecordScale }],
      }}
    >
      <LinearGradient
        className='absolute inset-0 rounded-full'
        colors={['#fef3c7', '#fffbeb']}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
      />
      <TrendingUp color='#d97706' size={16} strokeWidth={2.5} />
      <Text
        className='text-[13px] font-bold uppercase tracking-wide'
        style={{ color: '#b45309' }}
      >
        New Personal Record! 🎉
      </Text>
    </Animated.View>
  );
}
