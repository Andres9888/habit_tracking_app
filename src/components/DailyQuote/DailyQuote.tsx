/**
 * DailyQuote Component
 * Shows a motivational quote that changes daily
 * Theme-aware with dark mode support
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Quote, RefreshCw } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { QUOTES } from './quotes';
import { useThemeColors } from '../../theme/ThemeContext';

interface DailyQuoteProps {
  /** Override the quote (optional) */
  quote?: { text: string; author: string };
  /** Show refresh button */
  showRefresh?: boolean;
  /** Callback when refresh is pressed */
  onRefresh?: () => void;
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function DailyQuote({ quote: overrideQuote, showRefresh, onRefresh }: DailyQuoteProps) {
  const { colors } = useThemeColors();
  
  const quote = useMemo(() => {
    if (overrideQuote) return overrideQuote;
    const dayOfYear = getDayOfYear();
    return QUOTES[dayOfYear % QUOTES.length];
  }, [overrideQuote]);

  const styles = useMemo(() => StyleSheet.create({
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
      fontSize: 15,
      fontStyle: 'italic',
      lineHeight: 22,
    },
    refreshButton: {
      alignItems: 'center' as const,
      height: 44,
      justifyContent: 'center' as const,
      width: 44,
    },
  }), [colors]);

  return (
    <Animated.View
      entering={FadeIn.delay(100)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderLeftColor: colors.gray[400],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Quote color={colors.gray[400]} size={16} />
      </View>
      
      <Text style={[styles.quoteText, { color: colors.text.secondary }]}>
        &ldquo;{quote.text}&rdquo;
      </Text>
      
      <View style={styles.footer}>
        <Text style={[styles.author, { color: colors.text.tertiary }]}>
          — {quote.author}
        </Text>
        {showRefresh && onRefresh && (
          <Pressable style={styles.refreshButton} onPress={onRefresh}>
            <RefreshCw color={colors.gray[400]} size={14} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  author: {
    fontSize: 13,
    fontWeight: '500',
  },
  container: {
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
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  refreshButton: {
    padding: 4,
  },
});

export default DailyQuote;
