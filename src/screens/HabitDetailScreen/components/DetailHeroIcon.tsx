/** DetailHeroIcon - Compact flat icon tile for the fused hero row. */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { borderRadius } from '../../../theme/spacing';

/** Hero-only dimensions with no shared token equivalent. */
const ICON_TILE = 46;
const ICON_EMOJI = 23;

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
      className='items-center justify-center'
      style={{
        backgroundColor: color || colors.primary[100],
        borderRadius: borderRadius.medium,
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
