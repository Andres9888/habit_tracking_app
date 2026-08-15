import { RevenueCatPaywall } from '../../components/RevenueCatPaywall';

function noop() {
  // Standalone Analytics (e2e / deep link) has no parent to pop.
}

interface AnalyticsPaywallProps {
  onBack?: () => void;
}

/** Hard-gate: free users never see the dashboard, even after dismiss. */
export function AnalyticsPaywall({ onBack }: AnalyticsPaywallProps) {
  return (
    <RevenueCatPaywall
      dismissible={!!onBack}
      visible
      onClose={onBack ?? noop}
    />
  );
}
