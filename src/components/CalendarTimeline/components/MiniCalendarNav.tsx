import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { format } from 'date-fns';

import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

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
        <ChevronLeft color={iconColor} size={iconSizes.medium} />
      </Pressable>
      <Text style={{ fontFamily: fontFamilies.primary.text, fontSize: typography.bodySmall.fontSize, fontWeight: fontWeights.bold, color: titleColor }}>
        {format(month, 'MMMM yyyy')}
      </Text>
      <Pressable hitSlop={8} onPress={onNext}>
        <ChevronRight color={iconColor} size={iconSizes.medium} />
      </Pressable>
    </View>
  );
};
