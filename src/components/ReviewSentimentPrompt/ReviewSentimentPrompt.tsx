/**
 * ReviewSentimentPrompt Component
 *
 * A sentiment pre-filter shown before the native App Store review dialog.
 * Asks "Enjoying Chain Day?" with two outcomes:
 *   - "Yes, I love it!" → triggers native SKStoreReviewController
 *   - "Not really" → opens the feedback form so unhappy users
 *     can share concerns instead of leaving a bad review.
 *
 * This pattern is recommended by Apple and dramatically improves
 * average App Store rating by filtering out negative sentiment.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Modal } from '../Modal';
import type { ReviewSentimentPromptProps } from './ReviewSentimentPrompt.types';
import { styles } from './ReviewSentimentPrompt.styles';

export function ReviewSentimentPrompt({
  visible,
  onClose,
  onPositive,
  onNegative,
}: ReviewSentimentPromptProps) {
  return (
    <Modal variant='centerAlert' visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.emoji}>😊</Text>
        <Text style={styles.title}>Enjoying Chain Day?</Text>
        <Text style={styles.subtitle}>
          Your feedback helps us build better habits — and a better app.
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.negativeButton]}
            onPress={onNegative}
            activeOpacity={0.7}
          >
            <Text style={styles.negativeText}>Not really</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.positiveButton]}
            onPress={onPositive}
            activeOpacity={0.7}
          >
            <Text style={styles.positiveText}>Yes, I love it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
