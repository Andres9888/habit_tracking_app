import { View, Text } from 'react-native';

interface StreakHighlightProps {
  streak: number;
}

export function StreakHighlight({ streak }: StreakHighlightProps) {
  if (streak < 3) return null;

  return (
    <View
      className='mt-3 flex-row items-center justify-center gap-2 rounded-full py-2'
      style={{ backgroundColor: '#fef3c7' }}
    >
      <Text className='text-[15px]'>🔥</Text>
      <Text className='text-[13px] font-bold' style={{ color: '#b45309' }}>
        {streak} day streak! Keep it going!
      </Text>
    </View>
  );
}
