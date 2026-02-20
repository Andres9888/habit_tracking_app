import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';

interface MiniCalendarNavProps {
  month: Date;
  onPrev: () => void;
  onNext: () => void;
}

/** Month/year header with left/right navigation arrows */
export const MiniCalendarNav: React.FC<MiniCalendarNavProps> = ({
  month,
  onPrev,
  onNext,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    }}
  >
    <Pressable hitSlop={8} onPress={onPrev}>
      <ChevronLeft color='#57534e' size={20} />
    </Pressable>
    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1c1917' }}>
      {format(month, 'MMMM yyyy')}
    </Text>
    <Pressable hitSlop={8} onPress={onNext}>
      <ChevronRight color='#57534e' size={20} />
    </Pressable>
  </View>
);
