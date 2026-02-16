/**
 * NPS Survey Modal
 *
 * Net Promoter Score survey that appears after user engagement milestones:
 * - 14 days of app usage OR 30 habit completions
 * - Only shows once every 90 days
 *
 * Flow:
 * 1. Show 0-10 scale: "How likely are you to recommend Chain Day?"
 * 2. Based on score, show follow-up:
 *    - Promoters (9-10): "What do you love most?"
 *    - Detractors (0-6): "How can we improve?"
 *    - Passives (7-8): No follow-up, just thank you
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type { NPSSurveyModalProps } from './types';

export default function NPSSurveyModal({
  visible,
  onClose,
}: NPSSurveyModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const reducedMotion = useReduceMotion();
  const submitNPSResponse = useMutation(api.nps.submitNPSResponse);

  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Determine user category based on score
  const getUserCategory = (score: number | null) => {
    if (score === null) return null;
    if (score >= 9) return 'promoter';
    if (score >= 7) return 'passive';
    return 'detractor';
  };

  const category = getUserCategory(selectedScore);

  const getFollowUpQuestion = () => {
    if (category === 'promoter') return 'What do you love most?';
    if (category === 'detractor') return 'How can we improve?';
    return null;
  };

  const handleSubmit = async () => {
    if (selectedScore === null) return;

    setIsSubmitting(true);
    try {
      await submitNPSResponse({
        feedback: feedback.trim() || undefined,
        score: selectedScore,
      });
      setHasSubmitted(true);
      // Close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit NPS response:', error);
      setIsSubmitting(false);
    }
  };

  const handleScoreSelect = (score: number) => {
    setSelectedScore(score);
  };

  const handleSkip = () => {
    onClose();
  };

  // Thank you screen
  if (hasSubmitted) {
    return (
      <Modal
        animationType='fade'
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View
          className='flex-1 items-center justify-center px-6'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <Animated.View
            className='w-full max-w-md rounded-2xl p-6'
            entering={
              reducedMotion
                ? undefined
                : FadeInDown.delay(60).springify().damping(18)
            }
            style={[
              { backgroundColor: colors.card },
              shadows.card,
              { maxWidth: 400 },
            ]}
          >
            <View className='items-center py-4'>
              <Text className='mb-2 text-5xl'>🙏</Text>
              <Text
                className='text-center'
                style={[
                  typography.title,
                  { color: colors.text.primary, marginBottom: spacing.sm },
                ]}
              >
                Thank you!
              </Text>
              <Text
                className='text-center'
                style={[typography.body, { color: colors.text.secondary }]}
              >
                Your feedback helps us build a better Chain Day.
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType='fade'
      transparent
      visible={visible}
      onRequestClose={handleSkip}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.lg,
          paddingTop: insets.top + spacing.xl,
        }}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <Animated.View
          className='w-full rounded-2xl p-6'
          entering={
            reducedMotion
              ? undefined
              : FadeInDown.delay(60).springify().damping(18)
          }
          style={[
            { backgroundColor: colors.card, maxWidth: 500 },
            shadows.card,
            { alignSelf: 'center', width: '100%' },
          ]}
        >
          {/* Header */}
          <View className='mb-6'>
            <Text
              className='mb-2 text-center'
              style={[typography.title, { color: colors.text.primary }]}
            >
              How likely are you to recommend Chain Day?
            </Text>
            <Text
              className='text-center'
              style={[typography.body, { color: colors.text.secondary }]}
            >
              Your feedback helps us improve the app
            </Text>
          </View>

          {/* 0-10 Scale */}
          <View className='mb-6'>
            <View className='mb-4 flex-row flex-wrap justify-center gap-2'>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                const isSelected = selectedScore === score;
                const isPromoter = score >= 9;
                const isDetractor = score <= 6;

                return (
                  <TouchableOpacity
                    key={score}
                    accessibilityHint={`Rate ${score} out of 10`}
                    accessibilityLabel={`Score ${score}`}
                    accessibilityRole='button'
                    activeOpacity={0.7}
                    style={{
                      alignItems: 'center',
                      backgroundColor: isSelected
                        ? isPromoter
                          ? '#047857'
                          : isDetractor
                            ? '#dc2626'
                            : '#6b7280'
                        : isDark
                          ? '#374151'
                          : '#f3f4f6',
                      borderColor: isSelected
                        ? 'transparent'
                        : isDark
                          ? '#4b5563'
                          : '#e5e7eb',
                      borderRadius: 12,
                      borderWidth: 1,
                      height: 52,
                      justifyContent: 'center',
                      minWidth: 52,
                      paddingHorizontal: 12,
                    }}
                    onPress={() => handleScoreSelect(score)}
                  >
                    <Text
                      style={{
                        color: isSelected
                          ? '#ffffff'
                          : isDark
                            ? '#d1d5db'
                            : '#374151',
                        fontSize: 17,
                        fontWeight: isSelected ? '600' : '500',
                      }}
                    >
                      {score}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Labels */}
            <View className='flex-row justify-between px-1'>
              <Text style={[typography.caption, { color: colors.text.tertiary }]}>
                Not likely
              </Text>
              <Text style={[typography.caption, { color: colors.text.tertiary }]}>
                Very likely
              </Text>
            </View>
          </View>

          {/* Follow-up Question (Promoters & Detractors only) */}
          {selectedScore !== null && getFollowUpQuestion() && (
            <Animated.View
              className='mb-6'
              entering={
                reducedMotion
                  ? undefined
                  : FadeInDown.delay(120).springify().damping(18)
              }
            >
              <Text
                className='mb-3'
                style={[typography.body, { color: colors.text.primary }]}
              >
                {getFollowUpQuestion()}
              </Text>
              <TextInput
                accessibilityHint='Enter your feedback'
                accessibilityLabel='Feedback input'
                multiline
                numberOfLines={4}
                placeholder='Share your thoughts... (optional)'
                placeholderTextColor={colors.text.tertiary}
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                  borderRadius: 12,
                  borderWidth: 1,
                  color: colors.text.primary,
                  fontSize: 17,
                  minHeight: 100,
                  padding: 12,
                  textAlignVertical: 'top',
                }}
                value={feedback}
                onChangeText={setFeedback}
              />
            </Animated.View>
          )}

          {/* Action Buttons */}
          <View className='flex-row gap-3'>
            <TouchableOpacity
              accessibilityLabel='Skip survey'
              accessibilityRole='button'
              activeOpacity={0.7}
              className='flex-1 items-center justify-center rounded-xl py-4'
              style={{
                backgroundColor: isDark ? '#374151' : '#f3f4f6',
              }}
              onPress={handleSkip}
            >
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 17,
                  fontWeight: '600',
                }}
              >
                Skip
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityLabel='Submit feedback'
              accessibilityRole='button'
              activeOpacity={0.7}
              className='flex-1 items-center justify-center rounded-xl py-4'
              disabled={selectedScore === null || isSubmitting}
              style={{
                backgroundColor:
                  selectedScore === null || isSubmitting
                    ? isDark
                      ? '#374151'
                      : '#d1d5db'
                    : '#059669',
                opacity: selectedScore === null || isSubmitting ? 0.5 : 1,
              }}
              onPress={() => void handleSubmit()}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 17,
                  fontWeight: '600',
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </Modal>
  );
}
