/**
 * YearInReview — Spotify Wrapped-style annual habit review
 *
 * Features:
 * - Animated reveal sequence (tap to advance)
 * - Shareable summary card
 * - Fun statistics and comparisons
 */
import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  ZoomIn,
  SlideInRight,
} from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { useYearInReview } from './useYearInReview';
import type { YearInReviewProps, RevealSlide } from './YearInReview.types';

// ─── Slide Card ──────────────────────────────────────────────────────────────

function SlideCard({ slide, index }: { slide: RevealSlide; index: number }) {
  return (
    <Animated.View
      entering={SlideInRight.delay(index * 60).duration(400).springify().damping(18)}
      style={[styles.slideCard, { borderLeftColor: slide.color }]}
    >
      <Text style={styles.slideEmoji}>{slide.emoji}</Text>
      <View style={styles.slideContent}>
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={[styles.slideValue, { color: slide.color }]}>
          {slide.value}
        </Text>
        <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Reveal Mode (tap-through slides) ───────────────────────────────────────

function RevealMode({
  slides,
  onFinish,
}: {
  slides: RevealSlide[];
  onFinish: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = slides[currentIndex];

  const handleTap = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onFinish();
    }
  }, [currentIndex, slides.length, onFinish]);

  if (!slide) return null;

  return (
    <Pressable style={styles.revealContainer} onPress={handleTap}>
      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {slides.map((s, i) => (
          <View
            key={s.key}
            style={[
              styles.dot,
              i <= currentIndex ? { backgroundColor: slide.color } : undefined,
            ]}
          />
        ))}
      </View>

      <Animated.View
        key={slide.key}
        entering={ZoomIn.duration(500).springify().damping(14)}
        exiting={FadeOut.duration(200)}
        style={styles.revealCenter}
      >
        <Text style={styles.revealEmoji}>{slide.emoji}</Text>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.revealTitle}
        >
          {slide.title}
        </Animated.Text>
        <Animated.Text
          entering={FadeInUp.delay(400).duration(400)}
          style={[styles.revealValue, { color: slide.color }]}
        >
          {slide.value}
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.delay(600).duration(400)}
          style={styles.revealSubtitle}
        >
          {slide.subtitle}
        </Animated.Text>
      </Animated.View>

      <Animated.Text
        entering={FadeIn.delay(800).duration(300)}
        style={styles.tapHint}
      >
        {currentIndex < slides.length - 1 ? 'Tap to continue' : 'Tap to see summary'}
      </Animated.Text>
    </Pressable>
  );
}

// ─── Summary View (all stats + share) ───────────────────────────────────────

function SummaryView({
  slides,
  year,
  topHabits,
  onShare,
  onClose,
}: {
  slides: RevealSlide[];
  year: number;
  topHabits: Array<{ name: string; icon: string; count: number }>;
  onShare: () => void;
  onClose: () => void;
}) {
  const { colors } = useThemeColors();

  return (
    <ScrollView
      contentContainerStyle={styles.summaryContent}
      style={[styles.summaryScroll, { backgroundColor: colors.background }]}
    >
      <Animated.Text
        entering={FadeInDown.duration(400)}
        style={[styles.summaryTitle, { color: colors.text.primary }]}
      >
        Your {year} in Habits
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(100).duration(400)}
        style={[styles.summarySubtitle, { color: colors.text.secondary }]}
      >
        Here&apos;s everything you accomplished
      </Animated.Text>

      {slides.map((slide, index) => (
        <SlideCard key={slide.key} index={index} slide={slide} />
      ))}

      {topHabits.length > 0 && (
        <Animated.View
          entering={FadeInDown.delay(slides.length * 60 + 100).duration(400)}
          style={styles.topHabitsCard}
        >
          <Text style={[styles.topHabitsTitle, { color: colors.text.primary }]}>
            🏅 Top Habits
          </Text>
          {topHabits.map((habit, i) => (
            <View key={habit.name} style={styles.topHabitRow}>
              <Text style={styles.topHabitRank}>#{i + 1}</Text>
              <Text style={styles.topHabitIcon}>{habit.icon}</Text>
              <Text
                style={[styles.topHabitName, { color: colors.text.primary }]}
              >
                {habit.name}
              </Text>
              <Text
                style={[styles.topHabitCount, { color: colors.text.secondary }]}
              >
                {habit.count}×
              </Text>
            </View>
          ))}
        </Animated.View>
      )}

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.shareButton, { backgroundColor: '#059669' }]}
          onPress={onShare}
        >
          <Text style={styles.shareButtonText}>📤 Share Your Year</Text>
        </Pressable>
        <Pressable
          style={[styles.closeButton, { borderColor: colors.text.secondary }]}
          onPress={onClose}
        >
          <Text style={[styles.closeButtonText, { color: colors.text.primary }]}>
            Done
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

function YearInReviewContent({ onClose }: { onClose: () => void }) {
  const { data, slides, isLoading, year } = useYearInReview();
  const [showSummary, setShowSummary] = useState(false);
  const { colors } = useThemeColors();

  const handleShare = useCallback(async () => {
    if (!data) return;
    const message = [
      `🎉 My ${year} Year in Habits`,
      '',
      `🔥 ${data.totalCompletions} total completions`,
      `⚡ ${data.longestStreak}-day longest streak`,
      `📅 ${data.activeDays} active days`,
      `🏆 Best month: ${data.bestMonth}`,
      data.mostConsistentHabit
        ? `🎯 Most consistent: ${data.mostConsistentHabit.name}`
        : '',
      '',
      'Tracked with Chain Day 📱',
    ]
      .filter(Boolean)
      .join('\n');

    await Share.share({
      message,
      ...(Platform.OS === 'ios' ? { url: '' } : {}),
    });
  }, [data, year]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Animated.Text entering={FadeIn.duration(400)} style={styles.loadingText}>
          ✨ Crunching your year...
        </Animated.Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
          No habit data for {year} yet. Keep going! 💪
        </Text>
        <Pressable style={styles.emptyClose} onPress={onClose}>
          <Text style={[styles.closeButtonText, { color: colors.text.primary }]}>
            Close
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!showSummary) {
    return (
      <RevealMode
        slides={slides}
        onFinish={() => setShowSummary(true)}
      />
    );
  }

  return (
    <SummaryView
      slides={slides}
      topHabits={data.topHabits}
      year={year}
      onClose={onClose}
      onShare={handleShare}
    />
  );
}

export function YearInReview({ visible, onClose }: YearInReviewProps) {
  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={visible}
      onRequestClose={onClose}
    >
      <YearInReviewContent onClose={onClose} />
    </Modal>
  );
}

export default YearInReview;

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  buttonRow: {
    gap: 12,
    marginTop: 24,
    paddingBottom: 48,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  closeButtonText: {
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '600',
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    flex: 1,
    height: 4,
    marginHorizontal: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    left: 24,
    position: 'absolute',
    right: 24,
    top: 60,
  },
  emptyClose: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  emptyText: {
    fontFamily: 'System',
    fontSize: 17,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#059669',
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '600',
  },
  revealCenter: {
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  revealContainer: {
    alignItems: 'center',
    backgroundColor: '#1A1816',
    flex: 1,
    justifyContent: 'center',
  },
  revealEmoji: {
    fontSize: 64,
  },
  revealSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'System',
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  revealTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  revealValue: {
    fontFamily: 'System',
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
  },
  shareButton: {
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '600',
  },
  slideCard: {
    backgroundColor: '#FAF8F5',
    borderLeftWidth: 4,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    padding: 20,
  },
  slideContent: {
    flex: 1,
    gap: 4,
  },
  slideEmoji: {
    fontSize: 32,
  },
  slideSubtitle: {
    color: '#6B6560',
    fontFamily: 'System',
    fontSize: 13,
    lineHeight: 18,
  },
  slideTitle: {
    color: '#6B6560',
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  slideValue: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '700',
  },
  summaryContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  summaryScroll: {
    flex: 1,
  },
  summarySubtitle: {
    fontFamily: 'System',
    fontSize: 15,
    marginBottom: 32,
  },
  summaryTitle: {
    fontFamily: 'System',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  tapHint: {
    bottom: 60,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'System',
    fontSize: 15,
    position: 'absolute',
  },
  topHabitCount: {
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '600',
  },
  topHabitIcon: {
    fontSize: 20,
  },
  topHabitName: {
    flex: 1,
    fontFamily: 'System',
    fontSize: 17,
  },
  topHabitRank: {
    color: '#6B6560',
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '700',
    width: 28,
  },
  topHabitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  topHabitsCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: 16,
    gap: 4,
    marginTop: 8,
    padding: 20,
  },
  topHabitsTitle: {
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
});
