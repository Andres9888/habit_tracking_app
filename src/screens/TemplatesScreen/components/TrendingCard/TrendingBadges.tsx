/**
 * TrendingBadges — behavioral science badge overlays for trending cards.
 *
 * Renders rank badge, momentum indicator, stick rate, and NEW badge
 * based on behavioral science principles (Von Restorff, Bandwagon, Anchoring).
 */

import { Text, View } from 'react-native';
import { deriveMomentum, deriveStickRate } from './badgeUtils';
import { badgeStyles as bs } from './TrendingBadges.styles';

interface TrendingBadgesProps {
  hasResearch: boolean;
  isNew?: boolean;
  popularityScore: number;
  rank?: number;
}

export function RankBadge({ rank }: { rank: number }) {
  return (
    <View style={bs.rankBadge}>
      <Text style={bs.rankText}>{rank}</Text>
    </View>
  );
}

export function MomentumBadge({ score }: { score: number }) {
  return (
    <View style={bs.momentumBadge}>
      <Text style={bs.momentumText}>↑{deriveMomentum(score)}%</Text>
    </View>
  );
}

export function StickRateBadge({ score }: { score: number }) {
  return (
    <View style={bs.stickRate}>
      <Text style={bs.stickRateText}>✓ {deriveStickRate(score)}% stick rate</Text>
    </View>
  );
}

export function NewBadge() {
  return (
    <View style={bs.newBadge}>
      <Text style={bs.newText}>NEW</Text>
    </View>
  );
}

export function TrendingBadges({
  hasResearch,
  isNew,
  popularityScore,
  rank,
}: TrendingBadgesProps) {
  return (
    <>
      {rank !== undefined && <RankBadge rank={rank} />}
      {isNew && <NewBadge />}
      {hasResearch && <StickRateBadge score={popularityScore} />}
      <MomentumBadge score={popularityScore} />
    </>
  );
}
