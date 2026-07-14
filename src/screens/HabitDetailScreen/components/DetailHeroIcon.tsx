/** DetailHeroIcon — 48px tile with soft border (Open Design habit-details). */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { colors as palette } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';

const ICON_TILE = 48;
const ICON_EMOJI = 22;
/** Matches OD mock: 14px corner on habit icon */
const ICON_RADIUS = 14;

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
  const fill = color || colors.primary[100];
  const borderColor = isCompletedToday
    ? colors.primary[300]
    : isDark
      ? colors.border
      : palette.primary[300];

  return (
    <View
      accessibilityLabel={`Habit icon: ${icon}${isCompletedToday ? ', completed today' : ''}`}
      className='items-center justify-center'
      style={{
        backgroundColor: fill,
        borderColor,
        borderRadius: ICON_RADIUS,
        borderWidth: 1,
        height: ICON_TILE,
        width: ICON_TILE,
      }}
    >
      <Text style={{ color: colors.text.primary, fontSize: ICON_EMOJI }}>
        {icon}
      </Text>
    </View>
  );
}
