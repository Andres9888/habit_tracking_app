/**
 * DetailViewTabButton - Individual tab button with horizontal layout.
 * Icon + label side-by-side, no hint.
 */

import { Pressable, Text } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useThemeColors } from '@/theme';
import { typography, fontWeights } from '@/theme/typography';
import { iconSizes } from '@/theme/iconSizes';

export type DetailView = 'calendar' | 'strength' | 'goal';

interface DetailViewTabButtonProps {
  accentColor: string;
  activeView: DetailView;
  icon: LucideIcon;
  label: string;
  view: DetailView;
  onPress: (view: DetailView) => void;
}

export function DetailViewTabButton({
  accentColor,
  activeView,
  icon: Icon,
  label,
  view,
  onPress,
}: DetailViewTabButtonProps) {
  const { colors } = useThemeColors();
  const isActive = activeView === view;
  const foreground = isActive ? accentColor : colors.text.tertiary;

  return (
    <Pressable
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      className='flex-1 flex-row items-center justify-center gap-1.5 py-2'
      onPress={() => onPress(view)}
    >
      <Icon
        color={foreground}
        size={iconSizes.small}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <Text
        style={{
          ...typography.caption,
          color: foreground,
          fontSize: 13,
          fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
