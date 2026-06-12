/**
 * DetailViewTabButton - Icon + label button for the pill-segmented tab row.
 * Equal-width (flex: 1), weight- and color-driven active state.
 */

import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  Activity,
  CalendarDays,
  Target,
  type LucideIcon,
} from 'lucide-react-native';
import { useThemeColors } from '@/theme';
import { useDetailPressAnimation } from '@/hooks/useDetailPressAnimation';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';

export type DetailView = 'calendar' | 'strength' | 'goal';

/** Off-grid tab metrics tuned for the compact segmented control. */
const ICON_LABEL_GAP = 6;
const TAB_PADDING_V = 9;

const ICONS: Record<DetailView, LucideIcon> = {
  calendar: CalendarDays,
  goal: Target,
  strength: Activity,
};

interface DetailViewTabButtonProps {
  activeView: DetailView;
  label: string;
  view: DetailView;
  onPress: (view: DetailView) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DetailViewTabButton({
  activeView,
  label,
  view,
  onPress,
}: DetailViewTabButtonProps) {
  const { colors } = useThemeColors();
  const { animatedStyle, pressHandlers } = useDetailPressAnimation();
  const isActive = activeView === view;
  const Icon = ICONS[view];
  const color = isActive ? colors.text.primary : colors.text.tertiary;

  return (
    <AnimatedPressable
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      hitSlop={4}
      style={[
        animatedStyle,
        {
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
          gap: ICON_LABEL_GAP,
          justifyContent: 'center',
          paddingVertical: TAB_PADDING_V,
          zIndex: 1,
        },
      ]}
      onPress={() => onPress(view)}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <Icon color={color} size={iconSizes.small} strokeWidth={2.1} />
      <Text
        style={{
          color,
          fontSize: typography.caption.fontSize,
          fontWeight: isActive ? fontWeights.semibold : fontWeights.medium,
          letterSpacing: 0.1,
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
