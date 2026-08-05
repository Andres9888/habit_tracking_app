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
      <LinearGradient
        className='overflow-hidden rounded-2xl px-4 py-3.5'
        colors={premiumHero.gradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          borderColor: premiumHero.border,
          borderRadius: airy.cardRadius,
          borderWidth: 1,
          ...shadows.card,
        }}
      >
        <PremiumUpsellContent />
      </LinearGradient>
    </AnimatedPressable>
  );
}
