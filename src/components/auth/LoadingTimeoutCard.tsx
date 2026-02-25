/**
 * LoadingTimeoutCard Component
 * Error card shown when auth loading exceeds timeout.
 */

import { Pressable, Text, View } from 'react-native';

interface LoadingTimeoutCardProps {
  onRetry: () => void;
}

export function LoadingTimeoutCard({ onRetry }: LoadingTimeoutCardProps) {
  return (
    <View className='mx-6 mt-2 items-center rounded-2xl border border-[#DDD8D2] bg-[#EDEAE5] p-6 shadow-md'>
      <Text className="mb-2 text-center font-['DMSans'] text-[17px] font-semibold text-[#2D2A26]">
        Taking longer than expected
      </Text>
      <Text className="mb-5 text-center font-['DMSans'] text-[13px] leading-5 text-[#6B6560]">
        We&apos;re having trouble connecting. Check your internet connection and
        try again.
      </Text>
      <Pressable
        accessibilityLabel='Try Again'
        accessibilityRole='button'
        className='rounded-xl bg-emerald-600 px-8 py-3'
        onPress={onRetry}
      >
        <Text className="font-['DMSans'] text-[17px] font-semibold text-white">
          Try Again
        </Text>
      </Pressable>
    </View>
  );
}
