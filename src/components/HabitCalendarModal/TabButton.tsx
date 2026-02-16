import { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          fontSize: 13,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
