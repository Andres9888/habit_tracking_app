/**
 * useTrialCountdown Hook Tests
 */

import { renderHook } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import { useTrialCountdown } from '../useTrialCountdown';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('useTrialCountdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when not trialing', () => {
    mockUseQuery.mockReturnValue({
      status: 'free',
    } as unknown);

    const { result } = renderHook(() => useTrialCountdown());

    expect(result.current.daysRemaining).toBeNull();
    expect(result.current.shouldShowBanner).toBe(false);
  });

  it('calculates days remaining correctly', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    mockUseQuery.mockReturnValue({
      status: 'trialing',
      trialEndsAt: futureDate.getTime(),
    } as unknown);

    const { result } = renderHook(() => useTrialCountdown());

    expect(result.current.daysRemaining).toBe(5);
    expect(result.current.shouldShowBanner).toBe(true);
  });

  it('reports loading until the Convex subscription resolves', () => {
    mockUseQuery.mockReturnValue(undefined);

    const { result } = renderHook(() => useTrialCountdown());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.shouldShowBanner).toBe(false);
  });
});
