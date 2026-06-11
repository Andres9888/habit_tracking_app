/** DetailHeroIcon - Large centered icon tile with completed-today check badge. */
import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { iconShadow } from './DetailHeader.constants';

/** Hero-only dimensions with no shared token equivalent. */
const ICON_TILE = 72;
const ICON_EMOJI = 36;
const CHECK_BADGE = 22;

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
        <View
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
        </View>
      ) : null}
    </View>
  );
}
