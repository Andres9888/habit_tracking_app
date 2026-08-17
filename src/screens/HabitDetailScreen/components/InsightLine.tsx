import { Pressable, Text } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
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
      style={{
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 6,
        paddingTop: 4,
      }}
      onPress={() => onPress(line.id)}
    >
      <TrendingUp
        color={palette.green}
        size={15}
        strokeWidth={2}
        style={{ marginTop: 2 }}
      />
      <Text
        style={{
          color: palette.textTertiary,
          flex: 1,
          fontSize: 13,
          lineHeight: 20,
        }}
      >
        {line.text}
      </Text>
    </Pressable>
  );
}
