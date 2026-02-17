/* eslint-disable max-lines */
/**
 * MilestoneGallery — Trophy Room
 * Shows a 2-column grid of all streak milestones (7, 14, 30, 60, 100, 365).
 * Achieved milestones glow and animate; unachieved are greyed out.
 * Tap an achieved card to replay its celebration animation.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Trophy } from 'lucide-react-native';
import { Modal } from '../Modal';
import { StreakMilestoneCelebration } from '../StreakMilestoneCelebration';
import { useThemeColors } from '../../theme/ThemeContext';
import { useMilestoneGalleryData } from './useMilestoneGalleryData';
import { MilestoneCard } from './MilestoneCard';
import { GALLERY_ANIMATION, GALLERY_MILESTONES } from './constants';
import type { MilestoneGalleryProps, MilestoneCardData } from './types';
import type { StreakMilestone } from '../StreakMilestoneCelebration';

const STAGGER_BASE_DELAY = 80;
const HEADER_DELAY = 40;
const PROGRESS_DELAY = 160;

export function MilestoneGallery({ visible, onClose }: MilestoneGalleryProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const { cards, isLoading, achievedCount } = useMilestoneGalleryData();

  // Celebration replay state
  const [replayVisible, setReplayVisible] = useState(false);
  const [replayCard, setReplayCard] = useState<MilestoneCardData | null>(null);

  const handleReplay = useCallback((data: MilestoneCardData) => {
    setReplayCard(data);
    setReplayVisible(true);
  }, []);

  const handleReplayClose = useCallback(() => {
    setReplayVisible(false);
  }, []);

  // Convert gallery milestone to the StreakMilestone format expected by
  // StreakMilestoneCelebration (subset: color, days, emoji, title)
  function toStreakMilestone(data: MilestoneCardData): StreakMilestone {
    const { milestone } = data;
    // Find if this is one of the canonical 3 (7, 30, 100) or synthesize
    return {
      color: milestone.color,
      days: milestone.days,
      emoji: milestone.emoji,
      title: `${milestone.title} — ${milestone.days} Days!`,
    } as unknown as StreakMilestone;
  }

  const totalMilestones = GALLERY_MILESTONES.length;
  const progressPercent = Math.round((achievedCount / totalMilestones) * 100);

  return (
    <>
      <Modal variant="fullScreen" visible={visible} onClose={onClose}>
        <View
          style={{
            backgroundColor: colors.background,
            flex: 1,
            paddingTop: insets.top + 8,
          }}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(HEADER_DELAY).springify().damping(GALLERY_ANIMATION.SPRING_DAMPING)}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 12,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: '#ff8c0022',
                  borderRadius: 12,
                  height: 40,
                  justifyContent: 'center',
                  width: 40,
                }}
              >
                <Trophy color="#ff8c00" size={22} />
              </View>
              <View>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 22,
                    fontWeight: '700',
                    letterSpacing: -0.5,
                    lineHeight: 28,
                  }}
                >
                  Trophy Room
                </Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 13,
                    letterSpacing: -0.08,
                    lineHeight: 18,
                  }}
                >
                  {achievedCount}/{totalMilestones} milestones earned
                </Text>
              </View>
            </View>
            <Pressable
              accessible
              accessibilityLabel="Close trophy room"
              accessibilityRole="button"
              onPress={onClose}
              style={{
                alignItems: 'center',
                backgroundColor: colors.gray[200],
                borderRadius: 999,
                height: 36,
                justifyContent: 'center',
                width: 36,
              }}
            >
              <X color={colors.text.secondary} size={18} />
            </Pressable>
          </Animated.View>

          {/* Progress bar */}
          <Animated.View
            entering={FadeInDown.delay(PROGRESS_DELAY).springify().damping(GALLERY_ANIMATION.SPRING_DAMPING)}
            style={{ paddingBottom: 16, paddingHorizontal: 20 }}
          >
            <View
              style={{
                backgroundColor: colors.gray[200],
                borderRadius: 999,
                height: 8,
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <View
                style={{
                  backgroundColor: '#f59e0b',
                  borderRadius: 999,
                  height: '100%',
                  width: `${progressPercent}%`,
                }}
              />
            </View>
            <Text
              style={{
                color: colors.text.tertiary,
                fontSize: 11,
                lineHeight: 16,
                marginTop: 4,
              }}
            >
              {progressPercent}% complete
            </Text>
          </Animated.View>

          {/* Grid */}
          <ScrollView
            contentContainerStyle={{
              paddingBottom: insets.bottom + 32,
              paddingHorizontal: 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <View style={{ alignItems: 'center', paddingTop: 40 }}>
                <Text style={{ color: colors.text.tertiary, fontSize: 15 }}>Loading…</Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 12,
                  justifyContent: 'space-between',
                }}
              >
                {cards.map((card, index) => (
                  <View
                    key={card.milestone.days}
                    style={{ width: '47%' }}
                  >
                    <MilestoneCard
                      data={card}
                      delay={STAGGER_BASE_DELAY + GALLERY_ANIMATION.CARD_STAGGER * index}
                      onReplay={card.achieved ? handleReplay : undefined}
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Motivational footer */}
            {!isLoading && achievedCount === 0 && (
              <Animated.View
                entering={FadeInDown.delay(600).springify().damping(18)}
                style={{
                  alignItems: 'center',
                  marginTop: 24,
                  paddingHorizontal: 24,
                }}
              >
                <Text style={{ fontSize: 32, marginBottom: 10 }}>🌱</Text>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 15,
                    lineHeight: 22,
                    textAlign: 'center',
                  }}
                >
                  Complete a 7-day streak to earn your first trophy!
                </Text>
              </Animated.View>
            )}

            {!isLoading && achievedCount === totalMilestones && (
              <Animated.View
                entering={FadeInDown.delay(600).springify().damping(18)}
                style={{
                  alignItems: 'center',
                  marginTop: 24,
                  paddingHorizontal: 24,
                }}
              >
                <Text style={{ fontSize: 32, marginBottom: 10 }}>🎉</Text>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontSize: 17,
                    fontWeight: '600',
                    lineHeight: 24,
                    textAlign: 'center',
                  }}
                >
                  All trophies collected! You&apos;re legendary! 👑
                </Text>
              </Animated.View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Replay celebration overlay */}
      {replayCard?.achievement && (
        <StreakMilestoneCelebration
          habitEmoji={replayCard.achievement.habitEmoji}
          habitName={replayCard.achievement.habitName}
          milestone={toStreakMilestone(replayCard)}
          streakDays={replayCard.milestone.days}
          visible={replayVisible}
          onClose={handleReplayClose}
        />
      )}
    </>
  );
}
