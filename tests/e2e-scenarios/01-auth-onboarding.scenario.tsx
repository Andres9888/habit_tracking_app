/**
 * Scenarios S01–S02: Authentication entry + Onboarding.
 *
 * S01 (Auth): An unauthenticated user sees the welcome screen with the brand
 *   promise and both OAuth sign-in options, and can tap a provider button.
 *   PASS when: tagline + "Continue with Apple"/"Continue with Google" render
 *   and the Apple button is pressable without error.
 * S02 (Onboarding): A first-time user sees the first onboarding step with a
 *   begin affordance. PASS when the "Tap to begin" control renders and responds.
 */
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import WelcomeScreen from '../../src/screens/auth/WelcomeScreen';
import { OnboardingFlowV2 } from '../../src/screens/onboarding-v2';
import { renderScreen, resetConvex, seedCommonQueries } from './harness';

describe('S01 Authentication entry (WelcomeScreen)', () => {
  beforeEach(() => {
    resetConvex();
    seedCommonQueries();
  });

  it('shows the brand promise and both OAuth options', async () => {
    renderScreen(<WelcomeScreen />);
    expect(await screen.findByText('Miss a day. Keep the chain.')).toBeTruthy();
    expect(screen.getByLabelText('Continue with Apple')).toBeTruthy();
    expect(screen.getByLabelText('Continue with Google')).toBeTruthy();
    expect(screen.getByTestId('auth-apple-button')).toBeTruthy();
    expect(screen.getByTestId('auth-google-button')).toBeTruthy();
  });

  it('lets the user tap Continue with Apple without crashing', async () => {
    renderScreen(<WelcomeScreen />);
    const apple = await screen.findByTestId('auth-apple-button');
    fireEvent.press(apple);
    await waitFor(() =>
      expect(screen.getByTestId('auth-google-button')).toBeTruthy()
    );
  });
});

describe('S02 Onboarding first step (OnboardingFlowV2)', () => {
  beforeEach(() => {
    resetConvex();
    seedCommonQueries();
  });

  it('renders the opening step with a begin affordance and responds to tap', async () => {
    const onComplete = jest.fn();
    renderScreen(<OnboardingFlowV2 onComplete={onComplete} />);
    const begin = await screen.findByLabelText('Tap to begin');
    expect(begin).toBeTruthy();
    fireEvent.press(begin);
    // Advancing must not crash; the begin control is consumed or the step moves.
    await waitFor(() =>
      expect(screen.queryByText('Something went wrong')).toBeNull()
    );
  });
});
