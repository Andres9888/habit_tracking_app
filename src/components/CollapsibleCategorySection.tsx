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
            {
              backgroundColor: isExpanded ? colors.bg : 'transparent',
              borderLeftColor: isExpanded ? colors.bgSelected : 'transparent',
            },
            headerAnimatedStyle,
          ]}
        >
          {/* Icon with colored background */}
          <View style={[styles.iconBadge, { backgroundColor: `${colors.bgSelected}20` }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          {/* Label and count */}
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: isExpanded ? colors.bgSelected : '#374151' }]}>
              {label}
            </Text>
            <Text style={[styles.countText, { color: '#6b7280' }]}>
              {templates.length} {templates.length === 1 ? 'habit' : 'habits'}
            </Text>
          </View>

          {/* Chevron */}
          <Animated.View style={[styles.chevronContainer, chevronAnimatedStyle]}>
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
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={styles.content}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templatesScroll}
            decelerationRate="fast"
            snapToInterval={232}
            snapToAlignment="start"
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
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    borderRadius: 14,
    borderLeftWidth: 4,
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  countText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  chevronContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginTop: 8,
  },
  templatesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
});

export default CollapsibleCategorySection;
