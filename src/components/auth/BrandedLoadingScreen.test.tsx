import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { ConvexAuthReadyContext } from '../../providers/ConvexAuthReady.context';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';

jest.mock('../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      background: '#fff',
      border: '#eee',
      card: '#fff',
      primary: { 600: '#0a0' },
      status: { success: '#0a0', successLight: '#afa', successText: '#050' },
      text: { inverse: '#fff', primary: '#000', secondary: '#666' },
    },
  }),
}));

function renderWithRetry(retryConvexAuth: () => void) {
  return render(
    <ConvexAuthReadyContext.Provider
      value={{ isConvexReady: false, retryConvexAuth }}
    >
      <BrandedLoadingScreen />
    </ConvexAuthReadyContext.Provider>
  );
}

describe('BrandedLoadingScreen', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows the timeout card only after the timeout elapses', () => {
    renderWithRetry(jest.fn());

    expect(screen.queryByText('Taking longer than expected')).toBeNull();

    act(() => jest.advanceTimersByTime(10_000));

    expect(screen.getByText('Taking longer than expected')).toBeTruthy();
  });

  it('actually retries the Convex connection on Try Again', () => {
    const retryConvexAuth = jest.fn();
    renderWithRetry(retryConvexAuth);

    act(() => jest.advanceTimersByTime(10_000));
    fireEvent.press(screen.getByLabelText('Try Again'));

    expect(retryConvexAuth).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Taking longer than expected')).toBeNull();
  });

  it('re-arms the timeout so a failed retry surfaces the card again', () => {
    renderWithRetry(jest.fn());

    act(() => jest.advanceTimersByTime(10_000));
    fireEvent.press(screen.getByLabelText('Try Again'));
    act(() => jest.advanceTimersByTime(10_000));

    expect(screen.getByText('Taking longer than expected')).toBeTruthy();
  });
});
