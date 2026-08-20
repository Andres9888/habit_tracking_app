import { Text, View } from 'react-native';
import { CalendarOff, CheckCircle2 } from 'lucide-react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

type HeroState = 'completed' | 'off';

interface HeroStateCardProps {
  palette: InsightPalette;
  state: HeroState;
}

const COPY = {
  completed: {
    body: 'The record is saved. Add a private note only if it helps.',
    eyebrow: 'Today · complete',
    title: 'You showed up today.',
  },
  off: {
    body: 'No completion is required. Today stays neutral.',
    eyebrow: 'Today · not scheduled',
    title: 'Nothing is owed today.',
  },
} as const;

export function HeroStateCard({ palette, state }: HeroStateCardProps) {
  const copy = COPY[state];
  const isCompleted = state === 'completed';
  const Icon = isCompleted ? CheckCircle2 : CalendarOff;

  return (
    <View
      accessibilityRole='summary'
      style={{
        alignItems: 'flex-start',
        backgroundColor: isCompleted ? palette.greenWash : palette.cellFuture,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 15,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: isCompleted ? palette.greenTint : palette.card,
          borderRadius: 12,
          height: 40,
          justifyContent: 'center',
          width: 40,
        }}
      >
        <Icon
          color={isCompleted ? palette.green : palette.textTertiary}
          size={21}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: isCompleted ? palette.green : palette.textTertiary,
            fontSize: 11,
            fontWeight: fontWeights.bold,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {copy.eyebrow}
        </Text>
        <Text
          style={{
            color: palette.textPrimary,
            fontFamily: fontFamilies.primary.display,
            fontSize: 17,
            lineHeight: 22,
            marginTop: 4,
          }}
        >
          {copy.title}
        </Text>
        <Text
          style={{
            color: palette.textSecondary,
            fontSize: 12,
            lineHeight: 18,
            marginTop: 4,
          }}
        >
          {copy.body}
        </Text>
      </View>
    </View>
  );
}
