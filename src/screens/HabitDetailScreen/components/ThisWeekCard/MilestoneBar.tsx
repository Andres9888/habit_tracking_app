/**
 * MilestoneBar — near-term streak milestone hook on the Progress card.
 * Purely informational: no premium chip, upsell, or paywall.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import type { InsightPalette } from '../../insightPalette';
import { milestoneCaption, nextMilestoneProgress } from './milestoneTarget';

interface MilestoneBarProps {
  currentStreak: number;
  palette: InsightPalette;
}

export function MilestoneBar({ currentStreak, palette }: MilestoneBarProps) {
  const progress = nextMilestoneProgress(currentStreak);
  if (!progress) return null;

  const caption = milestoneCaption(progress);

  return (
    <View
      accessibilityLabel={caption}
      accessibilityRole='progressbar'
      style={{ marginTop: 4 }}
    >
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 13,
          marginBottom: 6,
        }}
      >
        {caption}
      </Text>
      <View
        style={{
          backgroundColor: palette.cellEmpty,
          borderRadius: borderRadius.full,
          height: 6,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            backgroundColor: palette.green,
            borderRadius: borderRadius.full,
            height: '100%',
            width: `${progress.fillPct}%`,
          }}
        />
      </View>
    </View>
  );
}
