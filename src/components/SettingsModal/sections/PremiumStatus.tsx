/** PremiumStatus — premium state router: active status card or upsell card */
import { PremiumActiveCard } from './PremiumActiveCard';
import { PremiumUpsellCard } from './PremiumUpsellCard';

interface Props {
  isPremium: boolean;
  onUpgrade?: () => void;
}

export function PremiumStatus({ isPremium, onUpgrade }: Props) {
  if (isPremium) {
    return <PremiumActiveCard />;
  }
  return <PremiumUpsellCard onUpgrade={onUpgrade} />;
}
