/**
 * SkeletonLoader Component
 * Reusable shimmer skeleton loaders for loading states.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, ViewStyle } from 'react-native';

type SkeletonWidth = number | 'auto' | `${number}%`;

interface SkeletonLoaderProps {
  width?: SkeletonWidth;
  height?: number;
  borderRadius?: number;
  reduceMotion?: boolean;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  reduceMotion = false,
  style,
}: SkeletonLoaderProps) {
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (reduceMotion) {
      shimmerAnim.setValue(0.6);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [reduceMotion, shimmerAnim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#e7e5e4',
          opacity: shimmerAnim,
        },
        style,
      ]}
    />
  );
}

export function HabitCardSkeleton({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <View
      className='mb-5 overflow-hidden rounded-3xl p-5'
      style={{
        backgroundColor: '#fafaf9',
        shadowColor: '#44403c',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      <View className='mb-4 flex-row items-center gap-3'>
        <SkeletonLoader borderRadius={12} height={44} reduceMotion={reduceMotion} width={44} />
        <View className='flex-1 gap-2'>
          <SkeletonLoader borderRadius={6} height={18} reduceMotion={reduceMotion} width='70%' />
          <SkeletonLoader borderRadius={4} height={12} reduceMotion={reduceMotion} width='40%' />
        </View>
        <SkeletonLoader borderRadius={20} height={28} reduceMotion={reduceMotion} width={60} />
      </View>
      <View className='mb-4 h-[1px]' style={{ backgroundColor: '#e7e5e4' }} />
      <View className='flex-row items-center justify-between'>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonLoader key={i} borderRadius={9} height={36} reduceMotion={reduceMotion} width={36} />
        ))}
      </View>
    </View>
  );
}

export function CalendarTimelineSkeleton({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <View className='rounded-2xl pb-3 pt-1' style={{ backgroundColor: '#fafaf9' }}>
      <View className='mb-3 flex-row items-center justify-between px-2'>
        <SkeletonLoader borderRadius={12} height={24} reduceMotion={reduceMotion} width={24} />
        <SkeletonLoader borderRadius={6} height={20} reduceMotion={reduceMotion} width={120} />
        <SkeletonLoader borderRadius={12} height={24} reduceMotion={reduceMotion} width={24} />
      </View>
      <View className='flex-row items-start justify-between'>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} className='flex-1 items-center gap-1'>
            <SkeletonLoader borderRadius={4} height={14} reduceMotion={reduceMotion} width={28} />
            <SkeletonLoader borderRadius={11} height={36} reduceMotion={reduceMotion} width={36} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function MomentumMeterSkeleton({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <View className='flex-row items-center gap-4 rounded-2xl px-4 py-3' style={{ backgroundColor: '#f5f5f4' }}>
      <SkeletonLoader borderRadius={28} height={56} reduceMotion={reduceMotion} width={56} />
      <View className='flex-1 gap-2'>
        <SkeletonLoader borderRadius={6} height={18} reduceMotion={reduceMotion} width='60%' />
        <SkeletonLoader borderRadius={4} height={14} reduceMotion={reduceMotion} width='80%' />
        <SkeletonLoader borderRadius={4} height={6} reduceMotion={reduceMotion} width='100%' />
      </View>
    </View>
  );
}

export function HabitsPageSkeleton({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <View className='flex-1 gap-3 px-4 pt-16'>
      <View className='gap-3'>
        <View className='flex-row items-center justify-between'>
          <SkeletonLoader borderRadius={24} height={48} reduceMotion={reduceMotion} width={130} />
          <View className='flex-row gap-3'>
            <SkeletonLoader borderRadius={18} height={36} reduceMotion={reduceMotion} width={100} />
            <SkeletonLoader borderRadius={18} height={36} reduceMotion={reduceMotion} width={36} />
          </View>
        </View>
        <MomentumMeterSkeleton reduceMotion={reduceMotion} />
      </View>
      <CalendarTimelineSkeleton reduceMotion={reduceMotion} />
      <View className='mt-2 gap-0'>
        <HabitCardSkeleton reduceMotion={reduceMotion} />
        <HabitCardSkeleton reduceMotion={reduceMotion} />
        <HabitCardSkeleton reduceMotion={reduceMotion} />
      </View>
    </View>
  );
}

export default SkeletonLoader;
