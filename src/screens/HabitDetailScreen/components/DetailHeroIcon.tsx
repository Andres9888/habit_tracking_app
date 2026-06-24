/** DetailHeroIcon - Large icon tile with a soft tonal halo + completed badge. */
import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { colors as palette, withAlpha } from '../../../theme/colors';
import { springs } from '../../../theme/animations';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { iconShadow } from './DetailHeader.constants';

/** Hero-only dimensions with no shared token equivalent. */
const ICON_TILE = 80;
const ICON_EMOJI = 38;
const CHECK_BADGE = 24;
const HALO_OUTER = 116;
const HALO_INNER = 98;

const BADGE_ENTER = ZoomIn.springify()
  .damping(springs.celebration.damping)
  .stiffness(springs.celebration.stiffness);

interface DetailHeroIconProps {
  color?: string;
  icon: string;
  isCompletedToday?: boolean;
}

export function DetailHeroIcon({
  color,
  icon,
  isCompletedToday,
}: DetailHeroIconProps) {
  const { colors, isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const tint = color || colors.primary[500];
  const surface = isDark ? colors.card : palette.light.surfaceMuted;

  return (
    <View
      className='items-center justify-center'
      style={{ height: HALO_OUTER, width: HALO_OUTER }}
    >
      <Halo size={HALO_OUTER} color={withAlpha(tint, 0.06)} />
      <Halo size={HALO_INNER} color={withAlpha(tint, 0.11)} />
      <View
        accessibilityLabel={`Habit icon: ${icon}${isCompletedToday ? ', completed today' : ''}`}
        className='items-center justify-center'
        style={{
          ...iconShadow,
          backgroundColor: color || colors.primary[100],
          borderRadius: 26,
          height: ICON_TILE,
          width: ICON_TILE,
        }}
      >
        <Text style={{ color: colors.text.primary, fontSize: ICON_EMOJI }}>
          {icon}
        </Text>
        {isCompletedToday ? (
          <Animated.View
            entering={reduceMotion ? undefined : BADGE_ENTER}
            className='absolute -bottom-1 -right-1 items-center justify-center rounded-full'
            style={{
              backgroundColor: colors.status.success,
              borderColor: surface,
              borderWidth: 2,
              height: CHECK_BADGE,
              width: CHECK_BADGE,
            }}
          >
            <Check color={colors.text.inverse} size={13} strokeWidth={3} />
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

function Halo({ color, size }: { color: string; size: number }) {
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: size / 2,
        height: size,
        position: 'absolute',
        width: size,
      }}
    />
  );
}
