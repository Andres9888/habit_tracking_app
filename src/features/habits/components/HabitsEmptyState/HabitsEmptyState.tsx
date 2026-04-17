/**
 * HabitsEmptyState — first-run flow for the habits list.
 * Chain-circle hero + time-aware starter chips + dynamic CTA input.
 * Rendered as FlatList's ListEmptyComponent when the user has no habits.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { HabitsEmptyStateChips } from './HabitsEmptyStateChips';
import { HabitsEmptyStateCTA } from './HabitsEmptyStateCTA';
import { HabitsEmptyStateHero } from './HabitsEmptyStateHero';
import { styles } from './HabitsEmptyState.styles';
import type {
  HabitsEmptyStateProps,
  StarterChip,
} from './HabitsEmptyState.types';
import { chipsFor } from './starterChips';
import { useTimeBucket } from './useTimeBucket';

export function HabitsEmptyState({ onCreate }: HabitsEmptyStateProps) {
  const [value, setValue] = useState('');
  const { bucket, label } = useTimeBucket();
  const chips = useMemo(() => chipsFor(bucket), [bucket]);

  const handleSelectChip = useCallback((chip: StarterChip) => {
    setValue(chip.name);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onCreate(trimmed);
  }, [onCreate, value]);

  return (
    <View style={styles.container}>
      <HabitsEmptyStateHero />
      <HabitsEmptyStateChips
        chips={chips}
        label={label}
        onSelect={handleSelectChip}
      />
      <View style={styles.spacer} />
      <HabitsEmptyStateCTA
        value={value}
        onChangeText={setValue}
        onSubmit={handleSubmit}
      />
    </View>
  );
}
