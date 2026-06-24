/** ProSettingsCard — plan-aware conversion surface under the profile hero.
 *  Reads subscription state only; entitlement is granted server-side (webhook). */
import { usePremium } from '@/hooks/usePremium';
import { PremiumUpsellCard } from './PremiumUpsellCard';
import { TrialCard } from './TrialCard';

interface ProSettingsCardProps {
  isPremium: boolean;
  onUpgrade?: () => void;
}

function daysLeftUntil(expirationDate: Date | null): number {
  if (!expirationDate) return 0;
  return Math.max(
    0,
    Math.ceil((expirationDate.getTime() - Date.now()) / 86_400_000)
  );
}

export function ProSettingsCard({
  isPremium,
  onUpgrade,
}: ProSettingsCardProps) {
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
  // Active subscribers see their status on the Account sub-page (+ hero badge).
  if (isPremium) return null;
  return <PremiumUpsellCard onUpgrade={onUpgrade} />;
}
