import React, { useState, useCallback } from 'react';
import { Text, Pressable, Modal } from 'react-native';
import { addMonths, subMonths } from 'date-fns';

import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing, borderRadius, shadows } from '@/theme/spacing';
import { MiniCalendarGrid } from './MiniCalendarGrid';
import { MiniCalendarNav } from './MiniCalendarNav';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

interface MiniCalendarPopupProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  completionByDay?: Record<string, { completed: number; total: number }>;
}

/** Modal overlay with a month calendar grid and completion dots */
export const MiniCalendarPopup: React.FC<MiniCalendarPopupProps> = ({
  visible,
  onClose,
  onSelectDate,
  completionByDay = {},
}) => {
  const { isDark, colors: themeColors } = useThemeColors();
  const [month, setMonth] = useState(new Date());
  const prev = useCallback(() => setMonth((m) => subMonths(m, 1)), []);
  const next = useCallback(() => setMonth((m) => addMonths(m, 1)), []);

  const handleSelect = useCallback(
    (date: Date) => {
      onSelectDate(date);
      onClose();
    },
    [onSelectDate, onClose]
  );

  const cardBg = isDark ? themeColors.card : themeColors.gray[50];
  const closeColor = themeColors.text.secondary;

  return (
    <Modal animationType='fade' transparent visible={visible} onRequestClose={onClose}>
      {/* Intentional rgba — standard backdrop overlay */}
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}
        onPress={onClose}
      >
        <Pressable
          style={{ backgroundColor: cardBg, borderRadius: borderRadius.card, padding: spacing.base, width: 300, ...shadows.modal }}
          onPress={(e) => e.stopPropagation()}
        >
          <MiniCalendarNav month={month} onNext={next} onPrev={prev} />
          <MiniCalendarGrid completionByDay={completionByDay} month={month} onSelectDate={handleSelect} />
          <Pressable
            style={{ alignSelf: 'center', marginTop: 8, paddingVertical: 4, paddingHorizontal: 12 }}
            onPress={onClose}
          >
            <Text style={{ fontFamily: fontFamilies.primary.text, fontSize: typography.caption.fontSize, fontWeight: fontWeights.semibold, color: closeColor }}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
