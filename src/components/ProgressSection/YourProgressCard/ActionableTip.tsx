import React from 'react';
import { View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface ActionableTipProps {
  tip: string;
}

export function ActionableTip({ tip }: ActionableTipProps) {
  return (
    <View
      accessibilityLabel={`Tip: ${tip}`}
      className='flex-row items-center gap-2 rounded-xl p-3'
      style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
    >
      <Text className='text-base'>💡</Text>
      <Text className='flex-1 text-sm text-teal-700'>{tip}</Text>
      <ChevronRight className='text-teal-400' size={16} />
    </View>
  );
}
