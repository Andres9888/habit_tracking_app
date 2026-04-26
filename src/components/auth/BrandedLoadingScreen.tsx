/**
 * BrandedLoadingScreen Component
 * Shows Chain Day branding during auth loading with a 10-second timeout.
 * Supports dark mode via useThemeColors.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { SkeletonLoader } from '../SkeletonLoader';
import { LoadingTimeoutCard } from './LoadingTimeoutCard';

const LOADING_TIMEOUT_MS = 10_000;

function ChainIcon({ statusColors }: { statusColors: { success: string; successLight: string; successText: string } }) {
  return (
    <View
      className='mb-4 h-16 w-16 items-center justify-center rounded-3xl'
      style={{ backgroundColor: statusColors.successLight }}
    >
      <Text className='text-[28px]'>🔗</Text>
    </View>
  );
}

export function BrandedLoadingScreen() {
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { colors } = useThemeColors();

  useEffect(() => {
    timerRef.current = setTimeout(() => setTimedOut(true), LOADING_TIMEOUT_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setTimedOut(false);
    timerRef.current = setTimeout(() => setTimedOut(true), LOADING_TIMEOUT_MS);
  }, []);

  return (
    <View
      className='flex-1 items-center justify-center'
      style={{ backgroundColor: colors.background }}
    >
      <View className='items-center'>
        <ChainIcon statusColors={colors.status} />
        <Text
          className="mb-8 font-['DMSans'] text-2xl font-bold tracking-wide"
          style={{ color: colors.text.primary }}
        >
          Chain Day
        </Text>
        {timedOut ? (
          <LoadingTimeoutCard onRetry={handleRetry} />
        ) : (
          <View className='mt-3'>
            <SkeletonLoader borderRadius={4} height={4} width={120} />
          </View>
        )}
      </View>
    </View>
  );
}
