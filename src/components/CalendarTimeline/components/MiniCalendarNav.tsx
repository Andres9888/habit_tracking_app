import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';

import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '@/theme/typography';

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
}) => {
  const { isDark } = useThemeColors();
  const iconColor = isDark ? '#D1D5DB' : '#57534e';
  const titleColor = isDark ? '#F9FAFB' : '#1c1917';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}
    >
      <Pressable hitSlop={8} onPress={onPrev}>
        <ChevronLeft color={iconColor} size={20} />
      </Pressable>
      <Text style={{ fontFamily: fontFamilies.primary.text, fontSize: 15, fontWeight: '700', color: titleColor }}>
        {format(month, 'MMMM yyyy')}
      </Text>
      <Pressable hitSlop={8} onPress={onNext}>
        <ChevronRight color={iconColor} size={20} />
      </Pressable>
    </View>
  );
};
