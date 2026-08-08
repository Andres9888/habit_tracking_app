/** ProSettingsCard — plan-aware conversion surface under the profile hero.
 *  Reads subscription state only; entitlement is granted server-side (webhook). */
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { usePremium } from '@/hooks/usePremium';
import { PremiumUpsellCard } from './PremiumUpsellCard';
import { TrialCard } from './TrialCard';
import { daysLeftUntil } from './trialDaysLeft';

interface ProSettingsCardProps {
  isPremium: boolean;
  onUpgrade?: () => void;
}

/** Matches the rendered banner height so the list below doesn't jump when the
 *  subscription query resolves. Both TrialCard and PremiumUpsellCard land here:
 *  42px tile + 14px vertical padding x2 + 1px border x2. */
const RESERVED_BANNER_HEIGHT = 72;

/** True when the banner occupies a slot — lets the caller keep its entrance
 *  stagger contiguous instead of burning an index on a card that never renders. */
export function usePremiumBannerVisible(isPremium: boolean): boolean {
  const { status } = usePremium();
  if (status === 'loading') return true; // reserved placeholder still takes space
  return status === 'trialing' || !isPremium;
}

export function ProSettingsCard({
  isPremium,
  onUpgrade,
}: ProSettingsCardProps) {
  const { status, expirationDate, priceString } = usePremium();

  // Hold the space while the plan resolves. Returning null here used to shift
  // Support and the footer up, then bump them back down a frame later.
  if (status === 'loading') {
    return <View style={{ height: RESERVED_BANNER_HEIGHT }} />;
  }

  // Active subscribers see their status on the Account sub-page (+ hero badge),
  // so the banner collapses for good — no reserved space once we know the plan.
  if (status !== 'trialing' && isPremium) return null;

  return (
    <Animated.View entering={FadeIn.duration(180)}>
      {status === 'trialing' ? (
        <TrialCard
          daysLeft={daysLeftUntil(expirationDate)}
          priceString={priceString}
          onUpgrade={onUpgrade}
        />
      ) : (
        <PremiumUpsellCard onUpgrade={onUpgrade} />
      )}
    </Animated.View>
  );
}
