import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { fontWeights } from '../../../../theme/typography';
import { useInsightPalette } from '../../insightPalette';
import { formatDayShort } from './dayCopy';

interface DayStepperProps {
  nextDate: string | null;
  prevDate: string | null;
  onStep: (date: string) => void;
}

function StepButton({
  date,
  kind,
  onStep,
}: {
  date: string | null;
  kind: 'next' | 'prev';
  onStep: (date: string) => void;
}) {
  const palette = useInsightPalette();
  const Icon = kind === 'prev' ? ChevronLeft : ChevronRight;
  const label = kind === 'prev' ? 'Previous' : 'Next';

  return (
    <Pressable
      accessibilityLabel={date ? `${label}, ${formatDayShort(date)}` : label}
      accessibilityRole='button'
      disabled={!date}
      style={{
        alignItems: 'center',
        flex: 1,
        flexDirection: kind === 'next' ? 'row-reverse' : 'row',
        gap: 6,
        minHeight: 48,
        opacity: date ? 1 : 0.4,
      }}
      onPress={() => date && onStep(date)}
    >
      <Icon color={palette.textSecondary} size={17} strokeWidth={2.1} />
      <View>
        <Text style={{ color: palette.textTertiary, fontSize: 11 }}>
          {label}
        </Text>
        <Text
          style={{
            color: palette.textPrimary,
            fontSize: 13,
            fontWeight: fontWeights.semibold,
          }}
        >
          {date
            ? formatDayShort(date)
            : kind === 'prev'
              ? 'Start of record'
              : 'Today'}
        </Text>
      </View>
    </Pressable>
  );
}

export function DayStepper({ nextDate, onStep, prevDate }: DayStepperProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <StepButton date={prevDate} kind='prev' onStep={onStep} />
      <StepButton date={nextDate} kind='next' onStep={onStep} />
    </View>
  );
}
