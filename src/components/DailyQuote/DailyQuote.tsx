/**
 * DailyQuote Component
 * Shows a motivational quote that changes daily
 * Supports dismissal that persists per day in AsyncStorage
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Quote, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUOTES } from './quotes';
import { useThemeColors } from '../../theme/ThemeContext';

const DAILY_QUOTE_DISMISSED_KEY = 'daily_quote_dismissed';

/** Get today's date as a string (YYYY-MM-DD) */
function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/** Get day of year for quote selection */
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/** Check if quote was dismissed today */
async function isDismissedToday(): Promise<boolean> {
  try {
    const today = getTodayDateString();
    const dismissedDate = await AsyncStorage.getItem(DAILY_QUOTE_DISMISSED_KEY);
    return dismissedDate === today;
  } catch {
    return false;
  }
}

/** Mark quote as dismissed today */
async function dismissToday(): Promise<void> {
  try {
    const today = getTodayDateString();
    await AsyncStorage.setItem(DAILY_QUOTE_DISMISSED_KEY, today);
  } catch {
    // Silently fail - dismissal is best effort
  }
}

export function DailyQuote() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Get quote based on day of year
  const quote = QUOTES[getDayOfYear() % QUOTES.length];

  // Check dismissal status on mount
  useEffect(() => {
    async function checkDismissal() {
      const dismissed = await isDismissedToday();
      setIsVisible(!dismissed);
      setIsLoading(false);
    }
    checkDismissal();
  }, []);

  const handleDismiss = useCallback(async () => {
    await dismissToday();
    setIsVisible(false);
  }, []);

  // Don't render if dismissed or still loading
  if (!isVisible || isLoading) {
    return null;
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        author: {
          color: colors.gray[500],
          fontSize: 13,
          fontWeight: '500',
        },
        container: {
          backgroundColor: colors.gray[50],
          borderLeftColor: colors.gray[400],
          borderLeftWidth: 3,
          borderRadius: 16,
          marginHorizontal: 16,
          marginVertical: 8,
          padding: 16,
        },
        footer: {
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        },
        iconContainer: {
          marginBottom: 8,
        },
        quoteText: {
          color: colors.gray[600],
          fontSize: 13,
          fontStyle: 'italic',
          lineHeight: 22,
        },
        refreshButton: {
          alignItems: 'center' as const,
          height: 44,
          justifyContent: 'center' as const,
          width: 44,
        },
      }),
    [colors]
  );

  return (
    <Animated.View
      entering={FadeIn.delay(100).duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <Pressable style={styles.dismissButton} onPress={handleDismiss} hitSlop={8}>
        <X color="#a8a29e" size={16} />
      </Pressable>
      
      <View style={styles.iconContainer}>
        <Quote color={colors.gray[400]} size={16} />
      </View>

      <Text style={styles.quoteText}>"{quote.text}"</Text>

      <View style={styles.footer}>
        <Text style={styles.author}>— {quote.author}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  author: {
    color: '#78716c',
    fontSize: 13,
    fontWeight: '500',
  },
  container: {
    backgroundColor: '#fafaf9',
    borderLeftColor: '#a8a29e',
    borderLeftWidth: 3,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  dismissButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconContainer: {
    marginBottom: 8,
  },
  quoteText: {
    color: '#57534e',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
});

export default DailyQuote;
