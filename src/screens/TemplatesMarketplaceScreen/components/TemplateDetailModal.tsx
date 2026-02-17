/**
 * Template Detail Modal Component
 * Shows full template details and allows rating and import
 */

import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Star, Clock, Flame, Check } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import type { Doc, Id } from '@/convex/_generated/dataModel';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface TemplateDetailModalProps {
  template: Doc<'templates'> | null;
  visible: boolean;
  onClose: () => void;
  onImport: () => Promise<void>;
  isImporting: boolean;
  userRating: number | null;
  onRate: (rating: number) => void;
  isRating: boolean;
}

export function TemplateDetailModal({
  template,
  visible,
  onClose,
  onImport,
  isImporting,
  userRating,
  onRate,
  isRating,
}: TemplateDetailModalProps) {
  const colors = useThemeColors();

  if (!template) return null;

  const getDifficultyColor = () => {
    switch (template.difficulty) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderStars = (interactive = false) => {
    const stars = [];
    const rating = template.averageRating || 0;
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.round(rating);
      const isUserFilled = interactive && userRating && i <= userRating;
      
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => interactive && onRate(i)}
          disabled={!interactive || isRating}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Star
            size={interactive ? 32 : 18}
            fill={isFilled || isUserFilled ? '#F59E0B' : 'transparent'}
            color={isFilled || isUserFilled ? '#F59E0B' : '#D1D5DB'}
            strokeWidth={interactive ? 2 : 1.5}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <AnimatedView
          entering={SlideInDown.springify().damping(18)}
          style={[styles.container, { backgroundColor: colors.card }]}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={[template.iconColor, `${template.iconColor}99`]}
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.icon}>{template.icon}</Text>
            </LinearGradient>
            
            <Pressable onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={24} color={colors.text.secondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Title and badges */}
            <Animated.View entering={FadeIn.delay(100).duration(280)}>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                {template.name}
              </Text>
              
              <View style={styles.badges}>
                {template.difficulty && (
                  <View style={[styles.badge, { backgroundColor: getDifficultyColor() }]}>
                    <Text style={styles.badgeText}>
                      {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                    </Text>
                  </View>
                )}
                
                {template.estimatedTime && (
                  <View style={[styles.badge, { backgroundColor: colors.primary[500] }]}>
                    <Clock size={14} color="#FFFFFF" />
                    <Text style={styles.badgeText}>{template.estimatedTime}m</Text>
                  </View>
                )}
                
                {template.habits && template.habits.length > 0 && (
                  <View style={[styles.badge, { backgroundColor: '#8B5CF6' }]}>
                    <Flame size={14} color="#FFFFFF" />
                    <Text style={styles.badgeText}>{template.habits.length} habits</Text>
                  </View>
                )}
              </View>

              {/* Description */}
              <Text style={[styles.description, { color: colors.text.secondary }]}>
                {template.description}
              </Text>

              {/* Rating */}
              <View style={styles.ratingSection}>
                <View style={styles.stars}>{renderStars()}</View>
                <Text style={[styles.ratingCount, { color: colors.text.secondary }]}>
                  {template.averageRating?.toFixed(1) || 0} ({template.ratingCount || 0} reviews)
                </Text>
              </View>

              {/* User Rating */}
              <View style={styles.userRatingSection}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Rate this template
                </Text>
                <View style={styles.stars}>{renderStars(true)}</View>
                {userRating && (
                  <Text style={[styles.userRatingText, { color: colors.primary[600] }]}>
                    Your rating: {userRating} star{userRating !== 1 ? 's' : ''}
                  </Text>
                )}
              </View>

              {/* Habits List */}
              {template.habits && template.habits.length > 0 && (
                <View style={styles.habitsSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                    Habits included
                  </Text>
                  {template.habits.map((habit, index) => (
                    <View
                      key={index}
                      style={[styles.habitItem, { borderColor: colors.border }]}
                    >
                      <Text style={styles.habitIcon}>{habit.icon}</Text>
                      <View style={styles.habitContent}>
                        <Text style={[styles.habitName, { color: colors.text.primary }]}>
                          {habit.name}
                        </Text>
                        {habit.description && (
                          <Text style={[styles.habitDesc, { color: colors.text.secondary }]}>
                            {habit.description}
                          </Text>
                        )}
                      </View>
                      <Check size={18} color={colors.primary[600]} />
                    </View>
                  ))}
                </View>
              )}

              {/* Tips */}
              {template.tips && template.tips.length > 0 && (
                <View style={styles.tipsSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                    Tips for success
                  </Text>
                  {template.tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                      <View style={[styles.bullet, { backgroundColor: colors.primary[500]}]} />
                      <Text style={[styles.tipText, { color: colors.text.secondary }]}>
                        {tip}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Animated.View>
          </ScrollView>

          {/* Import Button */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <AnimatedTouchableOpacity
              entering={FadeIn.delay(200).duration(280)}
              onPress={onImport}
              disabled={isImporting}
              style={[
                styles.importButton,
                { backgroundColor: colors.primary[600] },
                isImporting && styles.importButtonDisabled,
              ]}
            >
              {isImporting ? (
                <Text style={styles.importButtonText}>Importing...</Text>
              ) : (
                <>
                  <Check size={20} color="#FFFFFF" />
                  <Text style={styles.importButtonText}>
                    Try Template - {template.habits?.length || 1} habit{template.habits?.length !== 1 ? 's' : ''}
                  </Text>
                </>
              )}
            </AnimatedTouchableOpacity>
          </View>
        </AnimatedView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  userRatingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  userRatingText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  habitsSection: {
    marginBottom: 24,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  habitIcon: {
    fontSize: 24,
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  habitDesc: {
    fontSize: 14,
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  importButtonDisabled: {
    opacity: 0.6,
  },
  importButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
