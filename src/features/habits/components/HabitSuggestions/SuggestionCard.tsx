/**
 * Suggestion Card Component
 * 
 * Compact horizontal card for suggested habit templates
 * Design system: 16px border radius, green primary, shadows
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme';
import { typography } from '../../../../theme/typography';
import type { Doc } from '../../../../../convex/_generated/dataModel';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Design system constants (from TOOLS.md)
const SPRING_CONFIG = {
  damping: 18,
  stiffness: 400,
};

export interface SuggestionCardProps {
  template: Doc<'templates'>;
  index: number;
  isImporting: boolean;
  isDark: boolean;
  onImport: () => void;
}

export function SuggestionCard({
  template,
  index,
  isImporting,
  isDark,
  onImport,
}: SuggestionCardProps) {
  const { colors } = useThemeColors();
  
  // Entrance animation with stagger
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    const delay = index * 60; // 60ms stagger from design system
    scale.value = withDelay(delay, withSpring(1, SPRING_CONFIG));
    opacity.value = withDelay(delay, withSpring(1, SPRING_CONFIG));
  }, [index, scale, opacity]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  // Get icon background color
  const iconBg = template.iconColor || (isDark ? colors.primary[100] : '#D1FAE5');
  const iconColor = isDark ? colors.primary[100] : colors.primary[700];
  
  return (
    <AnimatedTouchable
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isDark ? colors.border : 'rgba(0,0,0,0.06)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
        animatedStyle,
      ]}
      activeOpacity={0.7}
      disabled={isImporting}
      onPress={onImport}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBg,
          },
        ]}
      >
        <Text style={[styles.icon, { color: iconColor }]}>
          {template.icon || '✨'}
        </Text>
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            typography.body,
            { color: colors.text.primary },
            styles.name,
          ]}
          numberOfLines={2}
        >
          {template.name}
        </Text>
        
        {template.frequency && (
          <Text
            style={[
              typography.caption,
              { color: colors.text.secondary },
              styles.frequency,
            ]}
            numberOfLines={1}
          >
            {template.frequency}
          </Text>
        )}
      </View>
      
      {/* Import indicator */}
      {isImporting ? (
        <View style={styles.importIndicator}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
        </View>
      ) : (
        <View
          style={[
            styles.addButton,
            { backgroundColor: colors.primary[600] },
          ]}
        >
          <Text style={styles.addIcon}>+</Text>
        </View>
      )}
      
      {/* Science badge */}
      {template.scientificLink && (
        <View
          style={[
            styles.scienceBadge,
            {
              backgroundColor: isDark
                ? 'rgba(59, 130, 246, 0.15)'
                : 'rgba(59, 130, 246, 0.1)',
            },
          ]}
        >
          <Text style={styles.scienceIcon}>🔬</Text>
        </View>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: 12,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  addIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 4,
    flexDirection: 'row',
    marginRight: 12,
    padding: 12,
    width: 280,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  frequency: {
    marginTop: 2,
  },
  icon: {
    fontSize: 24,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  importIndicator: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  name: {
    fontWeight: '600',
  },
  scienceBadge: {
    borderRadius: 8,
    height: 20,
    left: 8,
    paddingHorizontal: 4,
    position: 'absolute',
    top: 8,
  },
  scienceIcon: {
    fontSize: 12,
    lineHeight: 20,
  },
});
