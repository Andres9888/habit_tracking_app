/**
 * DailyQuote Component
 * Shows a motivational quote that changes daily
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Quote, RefreshCw } from 'lucide-react-native';
import { QUOTES } from './quotes';

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
  const quote = useMemo(() => {
    if (overrideQuote) return overrideQuote;
    // Use day of year to select quote (consistent per day)
    const dayOfYear = getDayOfYear();
    return QUOTES[dayOfYear % QUOTES.length];
  }, [overrideQuote]);

  return (
    <Animated.View entering={FadeIn.delay(100)} style={styles.container}>
      <View style={styles.iconContainer}>
        <Quote size={16} color="#a8a29e" />
      </View>
      
      <Text style={styles.quoteText}>"{quote.text}"</Text>
      
      <View style={styles.footer}>
        <Text style={styles.author}>— {quote.author}</Text>
        {showRefresh && onRefresh && (
          <Pressable onPress={onRefresh} style={styles.refreshButton}>
            <RefreshCw size={14} color="#a8a29e" />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fafaf9',
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#a8a29e',
  },
  iconContainer: {
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#57534e',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  author: {
    fontSize: 13,
    color: '#78716c',
    fontWeight: '500',
  },
  refreshButton: {
    padding: 4,
  },
});

export default DailyQuote;
