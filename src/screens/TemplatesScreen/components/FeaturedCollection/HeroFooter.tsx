/**
 * HeroFooter - Habit count + Explore CTA for the hero featured card
 */

import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { HERO, s } from './FeaturedCollection.styles';
import { iconSizes } from '@/theme/iconSizes';

interface HeroFooterProps {
  habitCount: number;
}

export function HeroFooter({ habitCount }: HeroFooterProps) {
  return (
    <View style={s.footer}>
      <Text style={s.habitCount}>
        {habitCount} {habitCount === 1 ? 'habit' : 'habits'}
      </Text>
      <View style={s.cta}>
        <Text style={s.ctaText}>Explore</Text>
        <ChevronRight size={iconSizes.small} color={HERO.text} strokeWidth={2} />
      </View>
    </View>
  );
}
