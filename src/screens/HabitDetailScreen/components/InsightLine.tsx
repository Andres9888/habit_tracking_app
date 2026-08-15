import { Pressable, Text, View } from 'react-native';
import { fontFamilies } from '../../../theme/typography';
import type { HabitInsights } from '../insights';
import { insightLineCopy } from '../insightLineCopy';
import { useInsightPalette } from '../insightPalette';

interface InsightLineProps {
  insights: HabitInsights;
  onPress: (id: NonNullable<ReturnType<typeof insightLineCopy>>['id']) => void;
}

export function InsightLine({ insights, onPress }: InsightLineProps) {
  const palette = useInsightPalette();
  const line = insightLineCopy(insights);
  if (line === null) return null;

  return (
    <Pressable
      accessibilityHint='Opens the evidence for this pattern'
      accessibilityLabel={line.text}
      accessibilityRole='button'
      style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 4 }}
      onPress={() => onPress(line.id)}
    >
      <View
        style={{
          backgroundColor: palette.greenTint,
          borderRadius: 8,
          height: 22,
          marginTop: 1,
          width: 22,
        }}
      />
      <Text
        style={{
          color: palette.textSecondary,
          flex: 1,
          fontFamily: fontFamilies.primary.display,
          fontSize: 14,
          lineHeight: 21,
        }}
      >
        {line.text}
      </Text>
    </Pressable>
  );
}
