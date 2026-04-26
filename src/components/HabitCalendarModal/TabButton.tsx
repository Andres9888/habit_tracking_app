import { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';

type CalendarView = 'month' | 'year';

interface TabButtonProps {
  view: CalendarView;
  label: string;
  activeView: CalendarView;
  onPress: (view: CalendarView) => void;
}

export function TabButton({
  view,
  label,
  activeView,
  onPress,
}: TabButtonProps) {
  const isActive = activeView === view;

  const handlePress = useCallback(() => {
    if (view !== activeView) {
      triggerHaptic('tap');
      onPress(view);
    }
  }, [view, activeView, onPress]);

  return (
    <Pressable
      accessibilityLabel={`${label} view`}
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      className='z-10 flex-1 items-center py-2'
      onPress={handlePress}
    >
      <Text
        style={{
          color: isActive ? '#059669' : '#78716c',
          fontFamily: fontFamilies.primary.text,
          fontSize: typography.caption.fontSize,
          fontWeight: fontWeights.semibold,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
