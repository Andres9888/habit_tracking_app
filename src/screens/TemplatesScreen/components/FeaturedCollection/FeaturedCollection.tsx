/**
 * FeaturedCollection - Hero card spotlighting a curated template pack
 */

import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HERO_GRADIENT_COLORS, s } from './FeaturedCollection.styles';
import { HeroChips } from './HeroChips';
import { HeroFooter } from './HeroFooter';

interface FeaturedCollectionProps {
  onPress: () => void;
}

export function FeaturedCollection({ onPress }: FeaturedCollectionProps) {
  return (
    <Pressable
      testID='templates-featured-collection'
      accessibilityLabel='Featured collection: Morning Mastery'
      accessibilityRole='button'
      style={s.pressable}
      onPress={onPress}
    >
      <LinearGradient
        colors={[...HERO_GRADIENT_COLORS]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.gradient}
      >
        <View style={s.circleOne} />
        <View style={s.circleTwo} />
        <View style={s.badge}>
          <Text style={s.badgeText}>⭐ FEATURED</Text>
        </View>
        <Text style={s.title}>Morning Mastery</Text>
        <Text style={s.description}>
          Start your day with science-backed habits for energy and focus
        </Text>
        <HeroChips />
        <HeroFooter />
      </LinearGradient>
    </Pressable>
  );
}
