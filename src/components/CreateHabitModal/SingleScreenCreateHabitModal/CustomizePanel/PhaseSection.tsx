/* eslint-disable max-lines-per-function */
/**
 * PhaseSection - Day phase selector (AM/PM/Any) - 3-segment, 40px height
 */
import { memo, useCallback } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants';

export type DayPhase = 'morning' | 'evening' | 'anytime';

interface PhaseSectionProps {
  onSelect: (phase: DayPhase) => void;
  selectedPhase: DayPhase;
}

const PHASES: { label: string; value: DayPhase }[] = [
  { label: 'AM', value: 'morning' },
  { label: 'PM', value: 'evening' },
  { label: 'Any', value: 'anytime' },
];

function PhaseSectionComponent({ onSelect, selectedPhase }: PhaseSectionProps) {
  const { triggerSelection } = useHapticFeedback();

  const handlePress = useCallback(
    (phase: DayPhase) => {
      Keyboard.dismiss();
      triggerSelection();
      onSelect(phase);
    },
    [onSelect, triggerSelection]
  );

  return (
    <View>
      <Text
        style={{
          color: COLORS.mutedText,
          fontSize: TYPOGRAPHY.caption.fontSize,
          marginBottom: SPACING.sm,
        }}
      >
        Time of day
      </Text>

      {/* 3-segment toggle control */}
      <View
        className='flex-row'
        style={{
          backgroundColor: COLORS.cardBackground,
          borderRadius: 12,
          height: 40,
          overflow: 'hidden',
        }}
      >
        {PHASES.map((phase) => {
          const isSelected = selectedPhase === phase.value;
          return (
            <Pressable
              key={phase.value}
              accessibilityLabel={`${phase.label} phase`}
              accessibilityRole='button'
              accessibilityState={{ selected: isSelected }}
              className='flex-1 items-center justify-center'
              style={{
                backgroundColor: isSelected ? COLORS.accent : 'transparent',
                borderRadius: 12,
              }}
              onPress={() => handlePress(phase.value)}
            >
              <Text
                style={{
                  color: isSelected ? '#FFFFFF' : COLORS.mutedText,
                  fontSize: TYPOGRAPHY.body.fontSize,
                  fontWeight: isSelected ? '500' : '400',
                }}
              >
                {phase.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const PhaseSection = memo(PhaseSectionComponent);
