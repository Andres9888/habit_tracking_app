import { View, Text } from 'react-native';
import type { ColorScheme } from '../types';

interface CompletionRateDisplayProps {
  completionRate: number;
  messageText: string;
  colors: ColorScheme;
}

export function CompletionRateDisplay({
  completionRate,
  messageText,
  colors,
}: CompletionRateDisplayProps) {
  return (
    <>
      <View className='mb-4 flex-row items-end gap-2'>
        <Text
          className='text-[48px] font-extrabold leading-[52px]'
          style={{ color: colors.text }}
        >
          {completionRate}%
        </Text>
        <Text
          className='mb-2 text-[15px] font-medium'
          style={{ color: colors.accent }}
        >
          completion
        </Text>
      </View>
      <Text
        className='mb-4 text-[17px] font-semibold'
        style={{ color: colors.text }}
      >
        {messageText}
      </Text>
    </>
  );
}
