/**
 * DailyQuote Component
 * Shows a motivational quote that changes daily
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Quote, RefreshCw } from 'lucide-react-native';
import { QUOTES } from './quotes';
import { useThemeColors } from '../../theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

<<<<<<< HEAD
export function DailyQuote({
  quote: overrideQuote,
  showRefresh,
  onRefresh,
}: DailyQuoteProps) {
  const { colors } = useThemeColors();
=======
export function DailyQuote({ quote: overrideQuote, showRefresh, onRefresh }: DailyQuoteProps) {
  const { colors, isDark } = useThemeColors();
  const scale = useSharedValue(1);
>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)

  const quote = useMemo(() => {
    if (overrideQuote) return overrideQuote;
    const dayOfYear = getDayOfYear();
    return QUOTES[dayOfYear % QUOTES.length];
  }, [overrideQuote]);

<<<<<<< HEAD
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
    <Animated.View entering={FadeIn.delay(100)} style={styles.container}>
      <View style={styles.iconContainer}>
        <Quote color={colors.gray[400]} size={16} />
      </View>

      <Text style={styles.quoteText}>"{quote.text}"</Text>

      <View style={styles.footer}>
        <Text style={styles.author}>— {quote.author}</Text>
        {showRefresh && onRefresh && (
          <Pressable
            accessibilityLabel='Refresh quote'
            accessibilityRole='button'
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            style={styles.refreshButton}
            onPress={onRefresh}
          >
            <RefreshCw color={colors.gray[400]} size={14} />
          </Pressable>
        )}
      </View>
=======
  const handlePressIn = () => {
    if (onRefresh) scale.value = withSpring(0.98, { damping: 18 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18 });
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const styles = useMemo(() => StyleSheet.create({
    author: {
      color: colors.text.tertiary,
      fontSize: 13,
      fontWeight: '500',
    },
    container: {
      backgroundColor: colors.card,
      borderLeftColor: isDark ? colors.gray[400] : colors.gray[300],
      borderLeftWidth: 3,
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 3,
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
      color: colors.text.secondary,
      fontSize: 15,
      fontStyle: 'italic',
      lineHeight: 22,
    },
    refreshButton: {
      padding: 8,
    },
  }), [colors, isDark]);

  return (
    <Animated.View entering={FadeInDown.delay(60).duration(280).springify().damping(18)}>
      <AnimatedPressable
        style={[styles.container, cardAnimatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onRefresh}
        disabled={!onRefresh}
      >
        <View style={styles.iconContainer}>
          <Quote color={colors.text.tertiary} size={16} />
        </View>

        <Text style={styles.quoteText}>"{quote.text}"</Text>

        <View style={styles.footer}>
          <Text style={styles.author}>— {quote.author}</Text>
          {showRefresh && onRefresh && (
            <View style={styles.refreshButton}>
              <RefreshCw color={colors.text.tertiary} size={14} />
            </View>
          )}
        </View>
      </AnimatedPressable>
>>>>>>> 618ea1d3 (ui: polish home screen widgets — dark mode, consistent cards, animations)
    </Animated.View>
  );
}

export default DailyQuote;
