/**
 * SharePromptManager Component
 * Manages smart, non-intrusive share prompts at milestone moments
 * 
 * Triggers proactive share prompts at:
 * - 7-day streak (first week!)
 * - 30-day streak (one month!)
 * - 100-day streak (legendary!)
 * - Weekly summaries (if available)
 * 
 * Respects user preferences and doesn't over-prompt
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from '../Modal';
import { Button } from '../Button/Button';
import { useSharePromptTracking } from './useSharePromptTracking';
import type { SharePromptManagerProps, MilestoneSharePrompt } from './SharePromptManager.types';

const MILESTONE_PROMPTS: Record<number, MilestoneSharePrompt> = {
  7: {
    days: 7,
    emoji: '🎉',
    message: 'You just completed your first week! Share your success and inspire others to start their journey.',
    title: 'Amazing! 7 Days Strong!',
  },
  30: {
    days: 30,
    emoji: '🏆',
    message: 'One month of consistency! That\'s a real achievement worth celebrating and sharing.',
    title: 'Incredible! 30 Days!',
  },
  100: {
    days: 100,
    emoji: '⚡',
    message: 'You\'re in the top 1%! Share your legendary streak and inspire the world.',
    title: 'Legendary! 100 Days!',
  },
  365: {
    days: 365,
    emoji: '👑',
    message: 'A full year! This is extraordinary. Your story could change someone\'s life.',
    title: 'Epic! One Full Year!',
  },
};

export function SharePromptManager({
  currentStreak,
  habitName,
  habitEmoji,
  userName,
  onShare,
}: SharePromptManagerProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<MilestoneSharePrompt | null>(null);
  const { shouldShowPrompt, markPromptShown } = useSharePromptTracking();

  useEffect(() => {
    // Check if current streak matches a milestone
    const milestonePrompt = MILESTONE_PROMPTS[currentStreak];
    
    if (milestonePrompt && shouldShowPrompt(currentStreak)) {
      // Small delay to not interrupt celebration
      const timer = setTimeout(() => {
        setCurrentPrompt(milestonePrompt);
        setShowPrompt(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentStreak, shouldShowPrompt]);

  const handleShare = () => {
    markPromptShown(currentStreak);
    setShowPrompt(false);
    onShare();
  };

  const handleDismiss = () => {
    markPromptShown(currentStreak);
    setShowPrompt(false);
  };

  if (!currentPrompt) return null;

  return (
    <Modal variant='standard' visible={showPrompt} onClose={handleDismiss}>
      <View style={styles.container}>
        <Text style={styles.emoji}>{currentPrompt.emoji}</Text>
        <Text style={styles.title}>{currentPrompt.title}</Text>
        <Text style={styles.message}>{currentPrompt.message}</Text>

        <View style={styles.habitInfo}>
          <Text style={styles.habitEmoji}>{habitEmoji}</Text>
          <Text style={styles.habitName}>{habitName}</Text>
        </View>

        <View style={styles.actions}>
          <Button
            fullWidth
            onPress={handleShare}
          >
            Share My Achievement
          </Button>
          <Button
            fullWidth
            variant='secondary'
            onPress={handleDismiss}
          >
            Maybe Later
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    marginTop: 24,
  },
  container: {
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  habitEmoji: {
    fontSize: 22,
  },
  habitInfo: {
    alignItems: 'center',
    backgroundColor: '#f5f5f4',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  habitName: {
    color: '#1c1917',
    fontSize: 17,
    fontWeight: '600',
  },
  message: {
    color: '#57534e',
    fontSize: 17,
    lineHeight: 24,
    marginTop: 12,
    textAlign: 'center',
  },
  title: {
    color: '#1c1917',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.35,
    lineHeight: 28,
  },
});

export default SharePromptManager;
