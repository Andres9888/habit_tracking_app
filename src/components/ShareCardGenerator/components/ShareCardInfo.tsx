/**
 * ShareCardInfo Component
 * Main info section with habit name, milestone, progress bar
 */

import React from 'react';
import { View, Text } from 'react-native';
import { shareCardContentStyles as styles } from '../styles';

interface ShareCardInfoProps {
  habitName: string;
  milestoneLabel: string;
  strengthPercentage: number;
  personalMessage?: string;
}

export function ShareCardInfo({
  habitName,
  milestoneLabel,
  strengthPercentage,
  personalMessage,
}: ShareCardInfoProps) {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.habitName}>{habitName}</Text>

      <View style={styles.milestoneRow}>
        <Text style={styles.milestoneLabel}>{milestoneLabel} Level</Text>
        <Text style={styles.strengthPercentage}>{strengthPercentage}%</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${strengthPercentage}%` },
            ]}
          />
        </View>
      </View>

      {personalMessage ? <Text style={styles.personalMessage}>{personalMessage}</Text> : null}
    </View>
  );
}
