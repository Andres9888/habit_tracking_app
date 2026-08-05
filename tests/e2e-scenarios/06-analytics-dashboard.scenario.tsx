/**
 * Scenario S12: Analytics dashboard for a premium user.
 *
 * With an active entitlement the paywall is bypassed and the analytics
 * dashboard renders the computed insights from api.analytics.getAnalyticsDashboard.
 * PASS when the paywall is absent and the dashboard's overview content renders.
 */
import { screen } from '@testing-library/react-native';

// Premium entitlement → skip the paywall, show the dashboard.
jest.mock('../../src/hooks/usePremium/usePremium', () => ({
  usePremium: () => ({ isPremium: true, isLoading: false }),
}));

import AnalyticsScreen from '../../src/screens/AnalyticsScreen';
import {
  makeAnalyticsDashboard,
  renderScreen,
  resetConvex,
  seedCommonQueries,
  setQuery,
} from './harness';

describe('S12 Analytics dashboard (premium user)', () => {
  beforeEach(() => {
    resetConvex();
    seedCommonQueries();
    setQuery('analytics:getAnalyticsDashboard', makeAnalyticsDashboard());
  });

  it('renders the dashboard instead of the paywall', async () => {
    renderScreen(<AnalyticsScreen />);
    // The strength distribution donut proves the dashboard (not the paywall) rendered.
    expect(await screen.findByTestId('pie-chart')).toBeTruthy();
    expect(screen.queryByText('Unlock Premium Analytics')).toBeNull();
    expect(screen.queryByTestId('paywall-start-trial-button')).toBeNull();
    expect(screen.queryByText('Something went wrong')).toBeNull();
  });
});
