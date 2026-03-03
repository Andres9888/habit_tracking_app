/**
 * TrendingCard — tall narrow card for trending/popular template carousel.
 *
 * Two press targets: card body → preview, add button → direct import.
 */

import { Pressable, Text, View } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { colors } from '../../../../theme/colors';
import { AddButton } from './AddButton';
import { formatPopularity } from './formatPopularity';
import { s } from './TrendingCard.styles';
import type { TrendingCardProps } from './TrendingCard.types';

export function TrendingCard({
  frequency,
  hasResearch,
  icon,
  iconColor,
  isImported,
  isImporting,
  name,
  onImport,
  onPress,
  popularityScore,
}: TrendingCardProps) {
  return (
    <Pressable accessibilityRole='button' style={s.card} onPress={onPress}>
      <View style={[s.iconBox, { backgroundColor: `${iconColor}25` }]}>
        <Text style={s.iconEmoji}>{icon}</Text>
      </View>

      <Text numberOfLines={2} style={s.name}>
        {name}
      </Text>

      <View style={s.metaRow}>
        <Text style={s.frequency}>{frequency}</Text>
        {hasResearch && (
          <View style={s.scienceBadge}>
            <Text style={s.scienceText}>🔬 Science</Text>
          </View>
        )}
      </View>

      <View style={s.bottomRow}>
        <View style={s.popularityWrap}>
          <TrendingUp color={colors.primary[600]} size={12} />
          <Text style={s.popularityText}>
            {formatPopularity(popularityScore)}
          </Text>
        </View>
        <AddButton
          isImported={isImported}
          isImporting={isImporting}
          name={name}
          onImport={onImport}
        />
      </View>
    </Pressable>
  );
}
