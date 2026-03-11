/**
 * HeroChips - Horizontal chip list for the hero featured card
 */

import { Text, View } from 'react-native';
import { s } from './FeaturedCollection.styles';

interface HeroChipsProps {
  chips: string[];
}

export function HeroChips({ chips }: HeroChipsProps) {
  return (
    <View style={s.chips}>
      {chips.map((chip) => (
        <View key={chip} style={s.chip}>
          <Text style={s.chipText}>{chip}</Text>
        </View>
      ))}
    </View>
  );
}
