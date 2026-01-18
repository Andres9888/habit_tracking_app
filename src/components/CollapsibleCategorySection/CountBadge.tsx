/**
 * CountBadge Component
 * Displays habit count and optional science-backed count
 */

import React from 'react';
import { Text } from 'react-native';

import { styles } from './styles';

interface CountBadgeProps {
  templateCount: number;
  scienceCount: number;
}

export function CountBadge({ templateCount, scienceCount }: CountBadgeProps) {
  const habitsText = templateCount === 1 ? 'habit' : 'habits';

  return (
    <Text style={styles.countText}>
      <Text style={styles.countTextHabits}>
        {templateCount} {habitsText}
      </Text>
      {scienceCount > 0 && (
        <>
          <Text style={styles.countTextHabits}> · </Text>
          <Text style={styles.countTextScience}>
            {scienceCount} science-backed
          </Text>
        </>
      )}
    </Text>
  );
}
