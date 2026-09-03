/**
 * FlowHeader — header for the nested Detail flows (History, Day).
 *
 * The habit name rides ABOVE the flow title as a green letterspaced eyebrow.
 * It used to sit below as a gray caption, which read as a detached subtitle of
 * "History" rather than as the thing the history belongs to.
 */
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { airy } from '../../../theme/airyScale';
import { spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { useInsightPalette } from '../insightPalette';
import { FlowBack } from './FlowBack';

interface FlowHeaderProps {
  backLabel: string;
  /** Habit name, drawn above the title. */
  eyebrow?: string;
  title: string;
  onBack: () => void;
}

export function FlowHeader({
  backLabel,
  eyebrow,
  onBack,
  title,
}: FlowHeaderProps) {
  const insets = useSafeAreaInsets();
  const palette = useInsightPalette();

  return (
    <View
      style={{
        backgroundColor: palette.bandGradient[2],
        paddingBottom: spacing.sm,
        paddingHorizontal: spacing.base,
        paddingTop: Math.max(insets.top + 8, 16),
      }}
    >
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ minWidth: 44 }}>
          <FlowBack label={backLabel} onPress={onBack} />
        </View>
        <View style={{ flex: 1 }}>
          {eyebrow ? (
            <Text
              numberOfLines={1}
              style={{
                color: palette.ctaGreen,
                fontSize: 11,
                fontWeight: fontWeights.bold,
                letterSpacing: 1.5,
                marginBottom: 2,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              {eyebrow}
            </Text>
          ) : null}
          <Text
            accessibilityRole='header'
            numberOfLines={1}
            style={{
              ...typography.heading1,
              color: palette.textPrimary,
              fontSize: airy.titleSize,
              textAlign: 'center',
            }}
          >
            {title}
          </Text>
        </View>
        <View style={{ minWidth: 44 }} />
      </View>
    </View>
  );
}
