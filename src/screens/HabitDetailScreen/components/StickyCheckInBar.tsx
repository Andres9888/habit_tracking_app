/**
 * StickyCheckInBar — the hero's own check-in toggle, pinned to the bottom of
 * the page once the hero has scrolled away. Same component, same state, same
 * undo. It only mounts after the hero toggle's bottom edge leaves the viewport,
 * so there is never a second affordance on screen at once.
 *
 * The gradient is `box-none` so the list keeps scrolling under the fade; only
 * the solid block that holds the toggle swallows touches.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { withAlpha } from '../../../theme/colors';
import { HeroCheckInToggle } from './DetailHeroBanner/HeroCheckInToggle';
import { durations } from '@/theme/animations';

/** Height of the transparent → surface fade above the solid block. */
const FADE_HEIGHT = 24;

interface StickyCheckInBarProps {
  checked: boolean;
  disabled: boolean;
  /** The page background the bar sits on — the hero wash's last stop. */
  surface: string;
  onPress: () => void;
}

export function StickyCheckInBar({
  checked,
  disabled,
  surface,
  onPress,
}: StickyCheckInBarProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();

  return (
    <Animated.View
      accessibilityViewIsModal={false}
      entering={reduceMotion ? undefined : FadeIn.duration(durations.reveal)}
      exiting={reduceMotion ? undefined : FadeOut.duration(durations.quick)}
      pointerEvents='box-none'
      style={{ bottom: 0, left: 0, position: 'absolute', right: 0 }}
      testID='sticky-check-in-bar'
    >
      <LinearGradient
        colors={[withAlpha(surface, 0), surface]}
        pointerEvents='box-none'
        style={{ height: FADE_HEIGHT }}
      />
      <View
        style={{
          backgroundColor: surface,
          paddingBottom: insets.bottom + 12,
          paddingHorizontal: 16,
        }}
      >
        <HeroCheckInToggle
          checked={checked}
          disabled={disabled}
          onPress={onPress}
        />
      </View>
    </Animated.View>
  );
}
