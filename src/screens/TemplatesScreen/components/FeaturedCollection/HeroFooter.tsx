/**
 * HeroFooter - User count + Explore CTA for the hero featured card
 */

import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { s } from './FeaturedCollection.styles';

export function HeroFooter() {
  return (
    <View style={s.footer}>
      <Text style={s.userCount}>2.4k users</Text>
      <View style={s.cta}>
        <Text style={s.ctaText}>Explore</Text>
        <ChevronRight size={16} color='#FFFFFF' strokeWidth={2} />
      </View>
    </View>
  );
}
