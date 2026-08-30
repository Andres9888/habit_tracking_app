/** PremiumStatus — premium state router: trial card, active status card,
 *  or neutral free-plan card.
 *
 *  Branches on subscription `status`, not just `isPremium`: a trialing user was
 *  previously shown the same generic upsell as a free user, hiding the single
 *  highest-intent conversion moment there is (trial about to expire).
 *  Free users get neutral status + management — no conversion treatment. */
import { usePremium } from '@/hooks/usePremium';
import { FreePlanCard } from './FreePlanCard';
import { PremiumActiveCard } from './PremiumActiveCard';
import { TrialCard } from './TrialCard';
import { daysLeftUntil } from './trialDaysLeft';

interface Props {
  isPremium: boolean;
  onUpgrade?: () => void;
}

export function PremiumStatus({ isPremium, onUpgrade }: Props) {
  const { status, expirationDate, priceString } = usePremium();

  if (status === 'loading') return null;

  if (status === 'trialing') {
    return (
      <TrialCard
        daysLeft={daysLeftUntil(expirationDate)}
        priceString={priceString}
        onUpgrade={onUpgrade}
      />
    );
  }

  if (isPremium) return <PremiumActiveCard onUpgrade={onUpgrade} />;

  return <FreePlanCard />;
}
