/**
 * DailyQuote Component
 * 
 * Displays a motivational quote that rotates daily based on the day of the year.
 * Features:
 * - Subtle design below the header
 * - Share functionality
 * - Dark mode support
 * - Design system compliant (typography, colors, shadows, animations)
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '../../theme/typography';
import { getTodayQuote } from '../../data/dailyQuotes';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DailyQuoteProps {
  /**
   * Whether to reduce motion for accessibility
   */
  reduceMotion?: boolean;
}

export function DailyQuote({ reduceMotion = false }: DailyQuoteProps) {
  const { colors } = useThemeColors();
  const quote = getTodayQuote();

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `"${quote}"\n\n— Daily motivation from Chain Day`,
        // iOS only: title, url
        ...(Platform.OS === 'ios' && {
          title: 'Daily Motivation',
        }),
      });
    } catch (error) {
      // User cancelled or error occurred
      console.error('Error sharing quote:', error);
    }
  }, [quote]);

  const dynamicStyles = {
    container: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    quoteText: {
      color: colors.text.secondary,
    },
    shareButton: {
      backgroundColor: colors.background,
    },
    shareIcon: {
      color: colors.primary[600],
    },
  };

  return (
    <AnimatedPressable
      entering={reduceMotion ? undefined : FadeInDown.duration(280).delay(60).springify().damping(18)}
      style={[styles.container, dynamicStyles.container]}
      onPress={handleShare}
      accessibilityLabel={`Daily quote: ${quote}. Tap to share.`}
      accessibilityRole="button"
      accessibilityHint="Double tap to share this quote"
    >
      <View style={styles.content}>
        {/* Quote Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.quoteIcon}>💭</Text>
        </View>

        {/* Quote Text */}
        <Text 
          style={[styles.quoteText, typography.caption, dynamicStyles.quoteText]}
          numberOfLines={3}
        >
          {quote}
        </Text>

        {/* Share Button */}
        <Pressable
          style={[styles.shareButton, dynamicStyles.shareButton]}
          onPress={handleShare}
          hitSlop={8}
          accessibilityLabel="Share quote"
          accessibilityRole="button"
        >
          <Ionicons 
            name="share-outline" 
            size={16} 
            color={dynamicStyles.shareIcon.color}
          />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    // Design system shadow: 4px offset, 16px blur, 0.08 opacity
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4, // Android
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  quoteIcon: {
    fontSize: 20,
  },
  quoteText: {
    flex: 1,
    lineHeight: 18,
  },
  shareButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    // Subtle shadow on button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default DailyQuote;
