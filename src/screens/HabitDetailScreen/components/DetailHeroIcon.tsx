/** DetailHeroIcon - Large centered icon tile with completed-today check badge. */
import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { springs } from '../../../theme/animations';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { iconShadow } from './DetailHeader.constants';

/** Hero-only dimensions with no shared token equivalent. */
const ICON_TILE = 72;
const ICON_EMOJI = 36;
const CHECK_BADGE = 22;

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
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();

  return (
    <View
      accessibilityLabel={`Habit icon: ${icon}${isCompletedToday ? ', completed today' : ''}`}
      className='items-center justify-center rounded-3xl'
      style={{
        ...iconShadow,
        backgroundColor: color || colors.primary[100],
        height: ICON_TILE,
        shadowColor: color || colors.primary[500],
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
            borderColor: colors.background,
            borderWidth: 2,
            height: CHECK_BADGE,
            width: CHECK_BADGE,
          }}
        >
          <Check color={colors.text.inverse} size={12} strokeWidth={3} />
        </Animated.View>
      ) : null}
    </View>
  );
}
