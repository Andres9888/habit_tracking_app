/**
 * SentimentButtons — positive/negative button pair for ReviewSentimentPrompt.
 * Extracted to keep ReviewSentimentPrompt.tsx under the max-lines limit.
 */

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from './ReviewSentimentPrompt.styles';

interface SentimentButtonsProps {
  onPositive: () => void;
  onNegative: () => void;
}

export function SentimentButtons({ onPositive, onNegative }: SentimentButtonsProps) {
  return (
    <>
      <TouchableOpacity
        accessibilityLabel="Not really, open feedback"
        accessibilityRole="button"
        onPress={onNegative}
        style={[styles.negativeButton, { borderColor: '#d1d5db' }]}
      >
        <Text style={[styles.negativeLabel, { color: '#6b7280' }]}>
          Not really
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityLabel="Yes I love it, rate the app"
        accessibilityRole="button"
        onPress={onPositive}
        style={[styles.positiveButton, { backgroundColor: '#059669' }]}
      >
        <Text style={[styles.positiveLabel, { color: '#ffffff' }]}>
          Yes, I love it!
        </Text>
      </TouchableOpacity>
    </>
  );
}
