/**
 * CueChips — selectable implementation-intention anchors
 * ("After I pour my morning coffee" …) for the new habit.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { triggerHaptic } from '@/utils/haptics';

interface CueChipsProps {
  cues: string[];
  onSelect: (cue: string) => void;
  selected: string;
}

export function CueChips({ cues, onSelect, selected }: CueChipsProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.cueWrap}>
      {cues.map((cue) => {
        const isSelected = cue === selected;
        return (
          <Pressable
            key={cue}
            accessibilityRole='button'
            accessibilityState={{ selected: isSelected }}
            style={[
              s.cueChip,
              isSelected
                ? {
                    backgroundColor: colors.primary[100],
                    borderColor: colors.primary[700],
                  }
                : {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
            ]}
            onPress={() => {
              void triggerHaptic('selection');
              onSelect(cue);
            }}
          >
            <Text
              style={[
                s.cueChipText,
                {
                  color: isSelected
                    ? colors.primary[700]
                    : colors.text.secondary,
                },
              ]}
            >
              {cue}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  cueChip: {
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cueChipText: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
  cueWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
  },
});
