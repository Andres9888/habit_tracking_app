/**
 * Scenario S13: Premium monetization gate (subscriptions).
 *
 * A non-premium user opening Analytics is shown the premium paywall with the
 * value proposition and a trial CTA.
 * PASS when the paywall heading, a benefit row, and the "Start Free Trial"
 * action (testID paywall-start-trial-button) render, and the trial button is
 * pressable without error.
 */
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import AnalyticsScreen from '../../src/screens/AnalyticsScreen';
import { renderScreen, resetConvex, seedCommonQueries } from './harness';

describe('S13 Premium paywall (free user → Analytics)', () => {
  beforeEach(() => {
    resetConvex();
    seedCommonQueries();
  });

  it('shows the premium upsell with a trial CTA', async () => {
    renderScreen(<AnalyticsScreen />);
    expect(await screen.findByText('Unlock Premium Analytics')).toBeTruthy();
    expect(screen.getByText('Habit Strength Insights')).toBeTruthy();
    expect(screen.getByTestId('paywall-start-trial-button')).toBeTruthy();
  });

  it('lets the user tap Start Free Trial without crashing', async () => {
    renderScreen(<AnalyticsScreen />);
    const cta = await screen.findByTestId('paywall-start-trial-button');
    fireEvent.press(cta);
    await waitFor(() =>
      expect(screen.queryByText('Something went wrong')).toBeNull()
    );
  });
});
