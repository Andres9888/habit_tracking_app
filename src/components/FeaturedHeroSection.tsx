/**
 * FeaturedHeroSection Component
 * Hero section showcasing featured templates or starter pack
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import type { Doc } from '../../convex/_generated/dataModel';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface FeaturedHeroSectionProps {
  /** Featured templates to display */
  templates: Doc<'templates'>[];
  /** Title for the hero section */
  title?: string;
  /** Subtitle description */
  subtitle?: string;
  /** Action button handler */
  onAction: () => void;
  /** Template tap handler */
  onTemplatePress: (template: Doc<'templates'>) => void;
}

export function FeaturedHeroSection({
  templates,
  title = 'Starter Pack',
  subtitle = 'Science-backed habits to kickstart your journey',
  onAction,
  onTemplatePress,
}: FeaturedHeroSectionProps) {
  const containerScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  const handlePressIn = () => {
    containerScale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    containerScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAction();
  };

  // Calculate total time estimate (rough estimate based on templates)
  const totalMinutes = templates.reduce((sum, t) => {
    // Rough estimates based on common habit durations
    const minuteMap: Record<string, number> = {
      meditation: 5,
      hydrate: 1,
      sunlight: 10,
      read: 10,
      exercise: 15,
      default: 5,
    };
    const key = Object.keys(minuteMap).find(k =>
      t.name.toLowerCase().includes(k)
    ) || 'default';
    return sum + minuteMap[key];
  }, 0);

  if (templates.length === 0) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={styles.wrapper}
    >
      <AnimatedPressable
        accessible
        accessibilityLabel={`${title}. ${templates.length} habits. Tap to view`}
        accessibilityRole="button"
        style={[styles.container, animatedStyle]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Sparkles color="#fff" size={20} strokeWidth={2.5} />
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.actionButton}>
              <Text style={styles.actionText}>Try it</Text>
              <ArrowRight color="#059669" size={14} strokeWidth={2.5} />
            </View>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Template icons row */}
          <View style={styles.templatesRow}>
            {templates.slice(0, 5).map((template, index) => (
              <Pressable
                key={template._id}
                accessible
                accessibilityLabel={`${template.name}`}
                accessibilityRole="button"
                style={[
                  styles.templateIcon,
                  {
                    backgroundColor: `${template.iconColor}30`,
                    marginLeft: index > 0 ? -8 : 0,
                    zIndex: templates.length - index,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onTemplatePress(template);
                }}
              >
                <Text style={styles.templateEmoji}>{template.icon}</Text>
              </Pressable>
            ))}

            {/* Stats */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {templates.length} habits
              </Text>
              {totalMinutes > 0 && (
                <Text style={styles.statsSubtext}>
                  ~{totalMinutes} min total
                </Text>
              )}
            </View>
          </View>

          {/* Decorative elements */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 16,
  },
  templatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  templateEmoji: {
    fontSize: 22,
  },
  statsContainer: {
    marginLeft: 16,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  statsSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 1,
  },
  // Decorative circles
  decorCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});

export default FeaturedHeroSection;
