/**
 * Marketplace Template Card Component
 */

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Clock, Flame } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import type { MarketplaceTemplateCardProps } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MarketplaceTemplateCard({
  template,
  onPress,
  onRate,
  userRating,
}: MarketplaceTemplateCardProps) {
  const colors = useThemeColors();
  
  const getDifficultyColor = () => {
    switch (template.difficulty) {
      case 'easy':
        return '#10B981'; // green
      case 'medium':
        return '#F59E0B'; // amber
      case 'hard':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const getDifficultyLabel = () => {
    switch (template.difficulty) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      default:
        return '';
    }
  };

  const renderStars = () => {
    const stars = [];
    const rating = template.averageRating || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          fill={i <= Math.round(rating) ? '#F59E0B' : 'transparent'}
          color={i <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
        />
      );
    }
    return stars;
  };

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(50).duration(280)}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      {/* Header with icon and category badge */}
      <View style={styles.header}>
        <LinearGradient
          colors={[template.iconColor, `${template.iconColor}99`]}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.icon}>{template.icon}</Text>
        </LinearGradient>
        
        {template.difficulty && (
          <View style={[styles.badge, { backgroundColor: getDifficultyColor() }]}>
            <Text style={styles.badgeText}>{getDifficultyLabel()}</Text>
          </View>
        )}
      </View>

      {/* Title and description */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={2}>
          {template.name}
        </Text>
        <Text
          style={[styles.description, { color: colors.text.secondary }]}
          numberOfLines={2}
        >
          {template.description}
        </Text>
      </View>

      {/* Footer with stats */}
      <View style={styles.footer}>
        {/* Time estimate */}
        {template.estimatedTime && (
          <View style={styles.stat}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={[styles.statText, { color: colors.text.secondary }]}>
              {template.estimatedTime}m
            </Text>
          </View>
        )}

        {/* Habits count */}
        {template.habits && template.habits.length > 0 && (
          <View style={styles.stat}>
            <Flame size={14} color={colors.text.secondary} />
            <Text style={[styles.statText, { color: colors.text.secondary }]}>
              {template.habits.length} habits
            </Text>
          </View>
        )}

        {/* Rating */}
        <View style={styles.rating}>
          <View style={styles.stars}>{renderStars()}</View>
          <Text style={[styles.ratingText, { color: colors.text.secondary }]}>
            ({template.ratingCount || 0})
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '500',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
