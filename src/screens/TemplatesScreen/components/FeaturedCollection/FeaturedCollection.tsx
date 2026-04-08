/**
 * FeaturedCollection - Hero card spotlighting a curated template pack
 */

import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { s } from './FeaturedCollection.styles';
import { HeroChips } from './HeroChips';
import { HeroFooter } from './HeroFooter';
import { getTimeAwareFeatured } from './featuredCollections';

interface FeaturedCollectionProps {
  habitCount: number;
  onPress: (categoryId: string) => void;
}

export function FeaturedCollection({ habitCount, onPress }: FeaturedCollectionProps) {
  const featured = getTimeAwareFeatured();

  return (
    <Pressable
      testID='templates-featured-collection'
      accessibilityLabel={`Featured collection: ${featured.title}`}
      accessibilityRole='button'
      style={s.pressable}
      onPress={() => onPress(featured.categoryId)}
    >
      <LinearGradient
        colors={[...featured.gradientColors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.gradient}
      >
        <View style={s.circleOne} />
        <View style={s.circleTwo} />
        <View style={s.badge}>
          <Text style={s.badgeText}>{featured.badge}</Text>
        </View>
        <Text style={s.title}>{featured.title}</Text>
        <Text style={s.description}>{featured.description}</Text>
        <HeroChips chips={featured.chips} />
        <HeroFooter habitCount={habitCount} />
      </LinearGradient>
    </Pressable>
  );
}
