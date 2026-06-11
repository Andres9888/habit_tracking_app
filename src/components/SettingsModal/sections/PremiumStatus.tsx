/** PremiumStatus — premium state router: active status card or upsell card */
import { PremiumActiveCard } from './PremiumActiveCard';
import { PremiumUpsellCard } from './PremiumUpsellCard';

interface Props {
  highContrast: boolean;
  isPremium: boolean;
  onUpgrade?: () => void;
}

export function PremiumStatus({ highContrast, isPremium, onUpgrade }: Props) {
  if (isPremium) {
    return <PremiumActiveCard highContrast={highContrast} />;
  }
  return <PremiumUpsellCard onUpgrade={onUpgrade} />;
}
