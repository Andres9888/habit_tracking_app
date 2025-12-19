/**
 * CollapsibleCategorySection Component
 * Expandable category section with header and template previews
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import type { Doc } from '../../convex/_generated/dataModel';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLORS } from '../screens/templates/constants';
import MiniTemplateCard from './MiniTemplateCard';

export interface CollapsibleCategorySectionProps {
  /** Category ID */
  categoryId: string;
  /** Category label */
  label: string;
  /** Category icon emoji */
  icon: string;
  /** Templates in this category */
  templates: Doc<'templates'>[];
  /** Is section expanded */
  isExpanded: boolean;
  /** Toggle expand callback */
  onToggle: () => void;
  /** Template tap callback */
  onTemplatePress: (template: Doc<'templates'>) => void;
  /** See all callback */
  onSeeAll: () => void;
  /** Max templates to show in preview */
  previewCount?: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function CollapsibleCategorySection({
  categoryId,
  label,
  icon,
  templates,
  isExpanded,
  onToggle,
  onTemplatePress,
  onSeeAll,
  previewCount = 4,
}: CollapsibleCategorySectionProps) {
  const colors = CATEGORY_COLORS[categoryId] || DEFAULT_CATEGORY_COLORS;
  const headerScale = useSharedValue(1);

  const previewTemplates = templates.slice(0, previewCount);
  const hasMore = templates.length > previewCount;

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isExpanded ? '0deg' : '-90deg', { duration: 200 }) }],
  }));

  const handleHeaderPressIn = () => {
    headerScale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  };

  const handleHeaderPressOut = () => {
    headerScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handleHeaderPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  const handleSeeAllPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSeeAll();
  }, [onSeeAll]);

  const frequencyLabels: Record<string, string> = {
    custom: 'Custom',
    daily: 'Daily',
    weekly: 'Weekly',
  };

  return (
    <AnimatedView layout={Layout.springify()} style={styles.container}>
      {/* Header */}
      <Pressable
        accessible
        accessibilityLabel={`${label} category, ${templates.length} templates, ${isExpanded ? 'expanded' : 'collapsed'}`}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={handleHeaderPress}
        onPressIn={handleHeaderPressIn}
        onPressOut={handleHeaderPressOut}
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: isExpanded ? colors.bg : 'transparent' },
            headerAnimatedStyle,
          ]}
        >
          {/* Chevron */}
          <Animated.View style={chevronAnimatedStyle}>
            <ChevronDown
              color={colors.text}
              size={20}
              strokeWidth={2.5}
            />
          </Animated.View>

          {/* Icon */}
          <View style={[styles.iconBadge, { backgroundColor: `${colors.bgSelected}15` }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          {/* Label */}
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
          </Text>

          {/* Count */}
          <View style={[styles.countBadge, { backgroundColor: `${colors.bgSelected}20` }]}>
            <Text style={[styles.countText, { color: colors.text }]}>
              {templates.length}
            </Text>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* See all button (always visible for quick access) */}
          {templates.length > 0 && (
            <Pressable
              accessible
              accessibilityLabel={`See all ${templates.length} ${label} templates`}
              accessibilityRole="button"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.seeAllButton}
              onPress={handleSeeAllPress}
            >
              <Text style={[styles.seeAllText, { color: colors.bgSelected }]}>
                See all
              </Text>
              <ChevronRight color={colors.bgSelected} size={14} strokeWidth={2.5} />
            </Pressable>
          )}
        </Animated.View>
      </Pressable>

      {/* Expandable content */}
      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={styles.content}
        >
          <ScrollView
            horizontal
            contentContainerStyle={styles.templatesScroll}
            showsHorizontalScrollIndicator={false}
          >
            {previewTemplates.map((template) => (
              <MiniTemplateCard
                key={template._id}
                icon={template.icon}
                iconColor={template.iconColor}
                name={template.name}
                description={template.description}
                subtitle={frequencyLabels[template.frequency] || template.frequency}
                hasResearch={Boolean(template.scientificLink)}
                scientificReference={template.scientificReference}
                onPress={() => onTemplatePress(template)}
              />
            ))}

            {/* "More" card if there are additional templates */}
            {hasMore && (
              <Pressable
                accessible
                accessibilityLabel={`See ${templates.length - previewCount} more ${label} templates`}
                accessibilityRole="button"
                style={[styles.moreCard, { backgroundColor: colors.bg, borderColor: colors.border }]}
                onPress={handleSeeAllPress}
              >
                <Text style={[styles.moreCount, { color: colors.bgSelected }]}>
                  +{templates.length - previewCount}
                </Text>
                <Text style={[styles.moreText, { color: colors.text }]}>
                  more
                </Text>
              </Pressable>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    borderRadius: 12,
    gap: 10,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
  },
  spacer: {
    flex: 1,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    marginTop: 4,
  },
  templatesScroll: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  moreCard: {
    width: 80,
    minHeight: 120,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  moreCount: {
    fontSize: 20,
    fontWeight: '700',
  },
  moreText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default CollapsibleCategorySection;
