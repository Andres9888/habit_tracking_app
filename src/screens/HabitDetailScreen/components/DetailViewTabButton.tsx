/**
 * DetailViewTabButton - Centered text button for the pill-segmented tab row.
 * Equal-width (flex: 1), no icon, weight-driven active state.
 */

import { Pressable, Text } from 'react-native';
import { useThemeColors } from '@/theme';
import { typography, fontWeights } from '@/theme/typography';

export type DetailView = 'calendar' | 'strength' | 'time' | 'goals' | 'why';

interface DetailViewTabButtonProps {
  accentColor: string;
  activeView: DetailView;
  label: string;
  view: DetailView;
  onPress: (view: DetailView) => void;
}

export function DetailViewTabButton({
  accentColor,
  activeView,
  label,
  view,
  onPress,
}: DetailViewTabButtonProps) {
  const { colors } = useThemeColors();
  const isActive = activeView === view;

  return (
    <Pressable
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      hitSlop={4}
      style={{ alignItems: 'center', flex: 1, justifyContent: 'center', paddingVertical: 9, zIndex: 1 }}
      onPress={() => onPress(view)}
    >
      <Text
        style={{
          color: isActive ? accentColor : colors.text.tertiary,
          fontSize: typography.caption.fontSize,
          fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
          letterSpacing: 0.1,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
