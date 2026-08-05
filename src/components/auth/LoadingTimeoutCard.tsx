/**
 * LoadingTimeoutCard Component
 * Error card shown when auth loading exceeds timeout.
 */

import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { shadows } from '../../theme/spacing';

interface LoadingTimeoutCardProps {
  onRetry: () => void;
}

export function LoadingTimeoutCard({ onRetry }: LoadingTimeoutCardProps) {
  const { colors } = useThemeColors();

  return (
    <View
      className='mx-6 mt-2 items-center rounded-2xl border p-6'
      style={[{ backgroundColor: colors.card, borderColor: colors.border }, shadows.floatingActionButton]}
    >
      <Text
        className="mb-2 text-center font-['DMSans'] text-base font-semibold"
        style={{ color: colors.text.primary }}
      >
        Taking longer than expected
      </Text>
      <Text
        className="mb-5 text-center font-['DMSans'] text-sm leading-5"
        style={{ color: colors.text.secondary }}
      >
        We&apos;re having trouble connecting. Check your internet connection and
        try again.
      </Text>
      <Pressable
        accessibilityLabel='Try Again'
        accessibilityRole='button'
        className='rounded-xl px-8 py-3'
        style={{ backgroundColor: colors.primary[600] }}
        onPress={onRetry}
      >
        <Text
          className="font-['DMSans'] text-base font-semibold"
          style={{ color: colors.text.inverse }}
        >
          Try Again
        </Text>
      </Pressable>
    </View>
  );
}
