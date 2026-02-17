/**
 * ReviewSentimentPrompt
 *
 * Sentiment pre-filter before triggering the native App Store review dialog.
 * "Yes, I love it!" → caller triggers native review
 * "Not really"      → caller opens private feedback form
 *
 * Animation and button layout extracted to sibling files to stay under
 * the max-lines ESLint limit.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { SentimentButtons } from './SentimentButtons';
import { styles } from './ReviewSentimentPrompt.styles';
import type { ReviewSentimentPromptProps } from './ReviewSentimentPrompt.types';

export function ReviewSentimentPrompt({
  visible,
  onPositive,
  onNegative,
  onDismiss,
  contextMessage,
}: ReviewSentimentPromptProps) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          damping: 18,
          stiffness: 180,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          duration: 220,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacityAnim, {
        duration: 150,
        toValue: 0,
        useNativeDriver: true,
      }).start();
      scaleAnim.setValue(0.85);
    }
  }, [visible, scaleAnim, opacityAnim]);

  return (
    <Modal
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <Pressable onPress={onDismiss} style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: '#ffffff', opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.emoji}>⭐️</Text>

          <Text style={[styles.title, { color: '#111827' }]}>
            Enjoying Chain Day?
          </Text>

          {contextMessage ? (
            <Text style={[styles.contextMessage, { color: '#374151' }]}>
              {contextMessage}
            </Text>
          ) : null}

          <Text style={[styles.subtitle, { color: '#374151' }]}>
            Your feedback helps us build a better app for everyone.
          </Text>

          <View style={styles.buttonRow}>
            <SentimentButtons onNegative={onNegative} onPositive={onPositive} />
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export default ReviewSentimentPrompt;
