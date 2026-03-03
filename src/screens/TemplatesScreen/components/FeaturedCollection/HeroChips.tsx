/**
 * HeroChips - Horizontal chip list for the hero featured card
 */

import { Text, View } from 'react-native';
import { s } from './FeaturedCollection.styles';

const CHIPS = ['🌅 Wake Early', '💧 Hydrate', '📝 Journal', '🧘 Meditate'];

export function HeroChips() {
  return (
    <View style={s.chips}>
      {CHIPS.map((chip) => (
        <View key={chip} style={s.chip}>
          <Text style={s.chipText}>{chip}</Text>
        </View>
      ))}
    </View>
  );
}
