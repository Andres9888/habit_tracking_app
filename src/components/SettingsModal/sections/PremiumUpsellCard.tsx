/** PremiumUpsellCard — spec 4a premium banner: the one dark card on the screen.
 *  No section label above it; it sits between Privacy & Security and the footer. */
import { LinearGradient } from 'expo-linear-gradient';
import { shadows } from '@/theme';
import { airy } from '@/theme/airyScale';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { premiumHero } from '../theme/premiumHero';
import { PremiumUpsellContent } from './PremiumUpsellContent';

interface PremiumUpsellCardProps {
  onUpgrade?: () => void;
}

export function PremiumUpsellCard({ onUpgrade }: PremiumUpsellCardProps) {
  return (
    <AnimatedPressable
      accessibilityHint='Opens premium upgrade screen'
      accessibilityLabel='Chain Day Premium — upgrade'
      accessibilityRole='button'
      onPress={onUpgrade}
    >
      {/* Layout lives in `style`, not `className`: NativeWind only maps
       *  className on components registered with cssInterop, and
       *  LinearGradient is not — a className here is silently dropped, which
       *  previously left the banner with zero padding (tile and pill flush to
       *  the card edges). */}
      <LinearGradient
        colors={premiumHero.gradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          borderColor: premiumHero.border,
          borderRadius: airy.cardRadius,
          borderWidth: 1,
          overflow: 'hidden',
          paddingHorizontal: 16,
          paddingVertical: 14,
          ...shadows.card,
        }}
      >
        <PremiumUpsellContent />
      </LinearGradient>
    </AnimatedPressable>
  );
}
