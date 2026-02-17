/**
 * Horizontal Section Component for Marketplace
 * Shows a horizontal scrollable list of templates
 */

import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import type { Doc } from '@/convex/_generated/dataModel';
import { MarketplaceTemplateCard } from './MarketplaceTemplateCard';

const AnimatedView = Animated.createAnimatedComponent(View);

interface HorizontalSectionProps {
  title: string;
  templates: Doc<'templates'>[];
  onTemplatePress: (template: Doc<'templates'>) => void;
  onSeeAllPress?: () => void;
}

export function HorizontalSection({
  title,
  templates,
  onTemplatePress,
  onSeeAllPress,
}: HorizontalSectionProps) {
  const colors = useThemeColors();

  if (!templates || templates.length === 0) {
    return null;
  }

  return (
    <AnimatedView entering={FadeInDown.delay(100).duration(280)} style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
        {onSeeAllPress && (
          <Pressable
            onPress={onSeeAllPress}
            style={styles.seeAllButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.seeAllText, { color: colors.primary[600] }]}>
              See all
            </Text>
            <ChevronRight size={16} color={colors.primary[600]} />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={280}
      >
        {templates.map((template, index) => (
          <View key={template._id} style={styles.cardWrapper}>
            <MarketplaceTemplateCard
              template={template}
              onPress={() => onTemplatePress(template)}
            />
          </View>
        ))}
      </ScrollView>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  cardWrapper: {
    width: 260,
  },
});
