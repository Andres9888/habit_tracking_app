/**
 * CollapsibleCategorySection Component
 * Expandable category section with header and template previews
 */

import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  Layout,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import type { Doc } from '../../convex/_generated/dataModel';
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLORS,
} from '../screens/templates/constants';
import MiniTemplateCard from './MiniTemplateCard';
import { useReduceMotion } from '../hooks/useReduceMotion';

export interface CollapsibleCategorySectionProps {
  /** Category ID */
  categoryId: string;
  /** Category label */
  label: string;
  /** Category icon emoji */
  icon: string;
  /** Templates in this category */
  templates: Doc<'templates'>[];
  /** Number of science-backed templates in this category */
  scienceCount?: number;
  /** Is section expanded */
  isExpanded: boolean;
  /** Toggle expand callback */
  onToggle: () => void;
  /** Template tap callback */
  onTemplatePress: (template: Doc<'templates'>) => void;
  /** Import template callback */
  onImport: (template: Doc<'templates'>) => void;
  /** Currently importing template ID */
  importingTemplateId?: string | null;
}

const AnimatedView = Animated.createAnimatedComponent(View);

/** Stagger delay between each card animation in ms */
const CARD_STAGGER_DELAY = 50;
/** Maximum stagger delay to prevent long wait times for large categories */
const MAX_STAGGER_DELAY = 400;

export function CollapsibleCategorySection({
  categoryId,
  label,
  icon,
  templates,
  scienceCount = 0,
  isExpanded,
  onToggle,
  onTemplatePress,
  onImport,
  importingTemplateId,
}: CollapsibleCategorySectionProps) {
  const colors = CATEGORY_COLORS[categoryId] || DEFAULT_CATEGORY_COLORS;
  const headerScale = useSharedValue(1);
  const iconBounce = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const reducedMotion = useReduceMotion();

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: withTiming(isExpanded ? '0deg' : '-90deg', { duration: 200 }) },
    ],
  }));

  // Icon bounce animation when expanding
  const iconAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateY: iconBounce.value }, { scale: iconScale.value }],
    };
  });

  const handleHeaderPressIn = () => {
    headerScale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  };

  const handleHeaderPressOut = () => {
    headerScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handleHeaderPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Trigger icon bounce when expanding (not collapsing)
    if (!isExpanded && !reducedMotion) {
      // Bounce up and settle
      iconBounce.value = withSequence(
        withSpring(-4, { damping: 8, stiffness: 300 }),
        withSpring(0, { damping: 12, stiffness: 200 })
      );
      // Scale up slightly and settle
      iconScale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );
    }

    onToggle();
  };

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
        accessibilityLabel={`${label} category, ${templates.length} ${templates.length === 1 ? 'habit' : 'habits'}${scienceCount > 0 ? `, ${scienceCount} science-backed` : ''}, ${isExpanded ? 'expanded' : 'collapsed'}`}
        accessibilityRole='button'
        accessibilityState={{ expanded: isExpanded }}
        onPress={handleHeaderPress}
        onPressIn={handleHeaderPressIn}
        onPressOut={handleHeaderPressOut}
      >
        <Animated.View
          style={[
            styles.header,
            {
              backgroundColor: isExpanded ? colors.bg : '#fff',
              borderLeftColor: isExpanded ? colors.bgSelected : 'transparent',
            },
            headerAnimatedStyle,
          ]}
        >
          {/* Icon with colored background and bounce animation */}
          <Animated.View
            style={[
              styles.iconBadge,
              { backgroundColor: `${colors.bgSelected}20` },
              iconAnimatedStyle,
            ]}
          >
            <Text style={styles.icon}>{icon}</Text>
          </Animated.View>

          {/* Label and count */}
          <View style={styles.labelContainer}>
            <Text
              style={[
                styles.label,
                { color: isExpanded ? colors.bgSelected : '#374151' },
              ]}
            >
              {label}
            </Text>
            <Text style={styles.countText}>
              <Text style={styles.countTextHabits}>
                {templates.length} {templates.length === 1 ? 'habit' : 'habits'}
              </Text>
              {scienceCount > 0 && (
                <>
                  <Text style={styles.countTextHabits}> · </Text>
                  <Text style={styles.countTextScience}>
                    {scienceCount} science-backed
                  </Text>
                </>
              )}
            </Text>
          </View>

          {/* Chevron */}
          <Animated.View
            style={[styles.chevronContainer, chevronAnimatedStyle]}
          >
            <ChevronDown
              color={isExpanded ? colors.bgSelected : '#9ca3af'}
              size={20}
              strokeWidth={2.5}
            />
          </Animated.View>
        </Animated.View>
      </Pressable>

      {/* Expandable content - horizontal scrolling list */}
      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(100)}
          style={styles.content}
        >
          <ScrollView
            directionalLockEnabled
            horizontal
            nestedScrollEnabled
            contentContainerStyle={styles.templatesScroll}
            decelerationRate='fast'
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          >
            {templates.map((template, index) => {
              // Calculate stagger delay with a cap for large categories
              const staggerDelay = Math.min(
                index * CARD_STAGGER_DELAY,
                MAX_STAGGER_DELAY
              );

              // Create appropriate entering animation based on reduced motion preference
              const enteringAnimation = reducedMotion
                ? FadeIn.duration(0)
                : SlideInRight.delay(staggerDelay)
                    .springify()
                    .damping(18)
                    .stiffness(120);

              // Create appropriate exiting animation
              const exitingAnimation = reducedMotion
                ? FadeOut.duration(0)
                : SlideOutLeft.delay(Math.min(index * 30, 200)).duration(150);

              return (
                <Animated.View
                  key={template._id}
                  entering={enteringAnimation}
                  exiting={exitingAnimation}
                >
                  <MiniTemplateCard
                    description={template.description}
                    hasResearch={Boolean(template.scientificLink)}
                    icon={template.icon}
                    iconColor={template.iconColor}
                    isImporting={importingTemplateId === template._id}
                    name={template.name}
                    scientificReference={template.scientificReference}
                    subtitle={
                      frequencyLabels[template.frequency] || template.frequency
                    }
                    onImport={() => onImport(template)}
                    onPress={() => onTemplatePress(template)}
                  />
                </Animated.View>
              );
            })}
          </ScrollView>
        </Animated.View>
      )}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginBottom: 8,
  },
  content: {
    marginTop: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  countTextHabits: {
    color: '#78716c',
  },
  countTextScience: {
    color: '#059669',
  },
  header: {
    alignItems: 'center',
    borderRadius: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    paddingVertical: 14,
  },
  icon: {
    fontSize: 22,
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  labelContainer: {
    flex: 1,
  },
  templatesScroll: {
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 8,
  },
});

export default CollapsibleCategorySection;
