/**
 * MiniTemplateCard Component
 * Compact template card for horizontal scrolling previews within category sections
 */

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface MiniTemplateCardProps {
  /** Template icon/emoji */
  icon: string;
  /** Template icon background color */
  iconColor: string;
  /** Template name */
  name: string;
  /** Template description */
  description?: string;
  /** Short description or frequency */
  subtitle?: string;
  /** Has scientific backing */
  hasResearch?: boolean;
  /** Scientific reference text */
  scientificReference?: string;
  /** Tap handler for preview */
  onPress: () => void;
  /** Import handler */
  onImport?: () => void;
  /** Is currently importing */
  isImporting?: boolean;
}

export function MiniTemplateCard({
  icon,
  iconColor,
  name,
  description,
  subtitle,
  hasResearch,
  scientificReference,
  onPress,
  onImport,
  isImporting,
}: MiniTemplateCardProps) {
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleImport = () => {
    if (isImporting || !onImport) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onImport();
  };

  return (
    <AnimatedPressable
      accessible
      accessibilityLabel={`${name} template`}
      accessibilityRole="button"
      style={[styles.card, { backgroundColor: `${iconColor}08` }, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Left accent */}
      <View style={[styles.accent, { backgroundColor: iconColor }]} />

      {/* Header row with icon and name */}
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          {subtitle && (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
        {/* Import button */}
        {onImport && (
          <Pressable
            accessible
            accessibilityLabel={`Add ${name} habit`}
            accessibilityRole="button"
            disabled={isImporting}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[styles.importButton, { backgroundColor: iconColor }]}
            onPress={handleImport}
          >
            {isImporting ? (
              <ActivityIndicator color="#fff" size={12} />
            ) : (
              <>
                <Plus color="#fff" size={14} strokeWidth={3} />
                <Text style={styles.importButtonText}>Add</Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {/* Description */}
      {description && (
        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>
      )}

      {/* Research badge */}
      {hasResearch && (
        <View style={[styles.researchBadge, { backgroundColor: `${iconColor}15` }]}>
          <Text style={styles.researchIcon}>🔬</Text>
          <Text numberOfLines={1} style={[styles.researchText, { color: iconColor }]}>
            {scientificReference ? scientificReference.split(' ').slice(0, 3).join(' ') + '...' : 'Research-backed'}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingHorizontal: 14,
    paddingLeft: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  headerContent: {
    flex: 1,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#101727',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6b7280',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    color: '#4b5563',
    marginBottom: 10,
  },
  researchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  researchIcon: {
    fontSize: 10,
  },
  researchText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default MiniTemplateCard;
