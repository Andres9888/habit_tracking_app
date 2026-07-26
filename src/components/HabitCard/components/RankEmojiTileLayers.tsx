import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
import type { RankTier } from '../rankTier';
import { baseStyles } from './RankEmojiTile.styles';

export function getRankGlow(tier: RankTier, scale: number) {
  return Platform.OS === 'android'
    ? { elevation: Math.max(1, Math.round((tier.glowRadius * scale) / 2)) }
    : {
        shadowColor: tier.glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: tier.glowOpacity,
        shadowRadius: tier.glowRadius * scale,
      };
}

export function RankGradient({
  tier,
  radius,
}: {
  tier: RankTier;
  radius: number;
}) {
  return (
    <LinearGradient
      colors={tier.gradient as unknown as [string, string]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[baseStyles.gradientLayer, { borderRadius: radius }]}
    />
  );
}
