import { Text, View } from 'react-native';
import { fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';
import { InsightCard } from '../InsightCard';
import { InsightPill } from '../NoticingSection/InsightPill';

interface NextStepCardProps {
  label: string;
  onPress?: () => void;
  text: string;
}

/** Optional suggestion. Never completes the habit. */
export function NextStepCard({ label, onPress, text }: NextStepCardProps) {
  const palette = useInsightPalette();

  return (
    <InsightCard palette={palette}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text
            style={{
              color: palette.ctaGreen,
              fontSize: 12,
              fontWeight: fontWeights.bold,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
            }}
          >
            If you want
          </Text>
          <Text
            style={{
              color: palette.textSecondary,
              fontSize: 14,
              lineHeight: 21,
              marginTop: 6,
            }}
          >
            {text}
          </Text>
        </View>
        {onPress ? (
          <InsightPill
            accessibilityHint='Opens Edit. Does not complete today.'
            borderColor={palette.cardBorder}
            label={label}
            tint={palette.ctaGreen}
            onPress={onPress}
          />
        ) : null}
      </View>
    </InsightCard>
  );
}
