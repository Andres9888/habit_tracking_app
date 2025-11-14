/**
 * Premium CTA Component
 * Reusable premium upgrade call-to-action component
 */

import { Crown, Sparkles } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePremium } from '../hooks/usePremium';
import { useAppTheme } from '../theme';

interface PremiumCTAProps {
  compact?: boolean;
  onUpgrade?: () => void;
  title?: string;
  variant?: 'default' | 'subtle' | 'prominent';
}

export default function PremiumCTA({
  compact = false,
  onUpgrade,
  title = 'Upgrade to Premium',
  variant = 'default',
}: PremiumCTAProps) {
  const { isPremium } = usePremium();
  const theme = useAppTheme();

  const handlePress = useCallback(() => {
    if (!isPremium) {
      onUpgrade?.();
    }
  }, [isPremium, onUpgrade]);

  if (isPremium) {
    return null;
  }

  const colors = {
    accent: '#FFD700',
    gradientEnd: '#FFA500',
    gradientStart: '#FFD700',
    textPrimary: theme.custom.colors.text.primary,
    textSecondary: theme.custom.colors.text.secondary,
  };

  if (variant === 'subtle') {
    return (
      <Pressable
        accessibilityLabel={title}
        accessibilityRole='button'
        onPress={handlePress}
        style={styles.subtleContainer}
      >
        <View style={styles.subtleContent}>
          <Sparkles color={colors.accent} size={16} strokeWidth={2} />
          <Text style={[styles.subtleText, { color: colors.textSecondary }]}>
            {title}
          </Text>
        </View>
      </Pressable>
    );
  }

  if (variant === 'prominent') {
    return (
      <Pressable
        accessibilityLabel={title}
        accessibilityRole='button'
        onPress={handlePress}
        style={styles.prominentContainer}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={styles.prominentGradient}
        >
          <Crown color='#6b4500' size={18} strokeWidth={2.5} />
          <Text style={styles.prominentText}>{title}</Text>
          <Sparkles color='#6b4500' size={18} strokeWidth={2.5} />
        </LinearGradient>
      </Pressable>
    );
  }

  // Default variant
  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole='button'
      onPress={handlePress}
      style={[
        styles.defaultContainer,
        compact && styles.compactContainer,
        { backgroundColor: colors.accent + '15' },
      ]}
    >
      <View style={styles.defaultContent}>
        <Crown color={colors.accent} size={compact ? 16 : 20} strokeWidth={2.5} />
        <Text
          style={[
            styles.defaultText,
            compact && styles.compactText,
            { color: colors.textPrimary },
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  compactText: {
    fontSize: 13,
  },
  defaultContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  defaultContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  defaultText: {
    fontSize: 15,
    fontWeight: '600',
  },
  prominentContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  prominentGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  prominentText: {
    color: '#6b4500',
    fontSize: 17,
    fontWeight: '700',
  },
  subtleContainer: {
    paddingVertical: 8,
  },
  subtleContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  subtleText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
