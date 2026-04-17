import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { styles } from './HabitsEmptyState.styles';
import type { StarterChip } from './HabitsEmptyState.types';

interface Props {
  label: string;
  chips: StarterChip[];
  onSelect: (chip: StarterChip) => void;
}

export function HabitsEmptyStateChips({ label, chips, onSelect }: Props) {
  const { colors } = useThemeColors();
  return (
    <View style={styles.chipSection}>
      <Text
        style={[styles.chipSectionLabel, { color: colors.text.secondary }]}
      >
        {label}
      </Text>
      <View style={styles.chipRow}>
        {chips.map((chip) => (
          <Pressable
            accessibilityLabel={`${chip.name} starter habit`}
            accessibilityRole='button'
            key={chip.name}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: pressed ? colors.primary[100] : colors.card,
                borderColor: pressed ? colors.primary[500] : colors.border,
              },
            ]}
            onPress={() => onSelect(chip)}
          >
            <Text style={[styles.chipText, { color: colors.text.primary }]}>
              {chip.emoji} {chip.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
