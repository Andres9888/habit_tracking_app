/**
 * useTrialCountdown Hook Tests
 */

import { renderHook } from '@testing-library/react-hooks';
import { useTrialCountdown } from '../useTrialCountdown';
import { usePremium } from '../../../hooks/usePremium';

jest.mock('../../../hooks/usePremium');

const mockUsePremium = usePremium as jest.MockedFunction<typeof usePremium>;

describe('useTrialCountdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when not trialing', () => {
    mockUsePremium.mockReturnValue({
      status: 'free',
      isTrialActive: false,
      expirationDate: null,
      isLoading: false,
    } as unknown);

    const { result } = renderHook(() => useTrialCountdown());

    expect(result.current.daysRemaining).toBeNull();
    expect(result.current.shouldShowBanner).toBe(false);
  });

  it('calculates days remaining correctly', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    mockUsePremium.mockReturnValue({
      status: 'trialing',
      isTrialActive: true,
      expirationDate: futureDate,
      isLoading: false,
    } as unknown);

    const { result } = renderHook(() => useTrialCountdown());

    expect(result.current.daysRemaining).toBe(5);
    expect(result.current.shouldShowBanner).toBe(true);
  });
});
