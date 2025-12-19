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
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
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
  /** Import template callback */
  onImport: (template: Doc<'templates'>) => void;
  /** Currently importing template ID */
  importingTemplateId?: string | null;
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
  onImport,
  importingTemplateId,
}: CollapsibleCategorySectionProps) {
  const colors = CATEGORY_COLORS[categoryId] || DEFAULT_CATEGORY_COLORS;
  const headerScale = useSharedValue(1);

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
        </Animated.View>
      </Pressable>

      {/* Expandable content - horizontal scrolling list */}
      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={styles.content}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templatesScroll}
          >
            {templates.map((template) => (
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
                onImport={() => onImport(template)}
                isImporting={importingTemplateId === template._id}
              />
            ))}
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
    flex: 1,
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
  content: {
    marginTop: 8,
  },
  templatesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
});

export default CollapsibleCategorySection;
