/**
 * Styles for StreakMilestoneCelebration component
 * Uses design system: 34/22/17/13 typography, 16px border-radius, shadows
 */

import { StyleSheet } from 'react-native';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  
  // Content card
card: {
    alignItems: 'center',
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.large,
    maxWidth: 340,
    ...shadows.alert,
  },

  

container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  
  
emoji: {
    fontSize: 48,
  },

  
  
// Emoji badge
emojiBadge: {
    alignItems: 'center',
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 100,
    ...shadows.floatingActionButton,
  },

  


// Action buttons
actionsContainer: {
    gap: spacing.md,
    width: '100%',
  },

  
  





habitEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },

  
  







habitName: {
    ...typography.heading3,
    color: colors.text.primary,
  },

  
  





// Habit info row
habitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },

  




// Modal container
modalContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  




primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.base,
    ...shadows.card,
  },

  
  



primaryButtonText: {
    ...typography.button,
    color: '#FFFFFF',
  },

  


// Streak count badge
streakBadge: {
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    flexDirection: 'row',
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },

  


secondaryButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.gray[300],
    borderRadius: borderRadius.medium,
    borderWidth: 1.5,
    paddingVertical: spacing.base,
  },

  
  
// Subtitle (17pt - body)
subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.base,
    textAlign: 'center',
  },

  
secondaryButtonText: {
    ...typography.button,
    color: colors.text.secondary,
  },

  // Title (22pt - heading2)
title: {
    ...typography.heading2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  streakCount: {
    ...typography.displayLarge,
    fontWeight: '700',
    marginRight: spacing.xs,
  },

  streakLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
});

// Achievement card styles for shareable card
export const achievementCardStyles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    width: 320,
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    ...shadows.alert,
  },

  gradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },

=======
>>>>>>> origin/main
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: spacing.base,
    width: 80,
  },

  appBranding: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.lg,
  },

  badgeEmoji: {
    fontSize: 40,
  },

  container: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    width: 320,
    ...shadows.modal,
  },

  daysLabel: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.base,
    textAlign: 'center',
  },

  gradient: {
    alignItems: 'center',
    padding: spacing.xl,
  },

  habitContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },

  habitEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },

  habitName: {
    ...typography.heading3,
    color: '#FFFFFF',
  },

  streakText: {
    ...typography.displayLarge,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },

  title: {
    ...typography.heading1,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
