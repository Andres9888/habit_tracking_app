/** Settled "Done for today" pill — light-green, per the StickyComplete spec. */
import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme';
import { fontWeights, typography } from '../../../theme/typography';
import { ABS_BOTTOM, BAR_ROW, wrapStyle } from './StickyCompleteBar.styles';

export function StickyDonePill({ insetBottom }: { insetBottom: number }) {
  const { colors } = useThemeColors();
  return (
    <View pointerEvents='box-none' style={ABS_BOTTOM}>
      <View
        style={[
          wrapStyle(insetBottom),
          BAR_ROW,
          {
            backgroundColor: colors.primary[100],
            borderColor: colors.primary[500],
            borderWidth: 1,
          },
        ]}
      >
        <Check color={colors.primary[700]} size={16} strokeWidth={2.5} />
        <Text
          style={{
            ...typography.body,
            color: colors.primary[700],
            fontSize: 15,
            fontWeight: fontWeights.semibold,
          }}
        >
          Done for today
        </Text>
      </View>
    </View>
  );
}
