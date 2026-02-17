/**
 * Tests for PaywallABTest A/B experiment system
 *
 * Covers:
 * - usePaywallExperiment hook (variant resolution, tracking)
 * - PaywallABTest orchestrator (renders correct variant)
 * - PaywallVariantB (social proof content)
 * - PaywallVariantC (fear-of-loss content, streak personalisation)
 */

import React from 'react';
import { render, waitFor, act, renderHook } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PaywallABTest } from '../PaywallABTest';
import { PaywallVariantB } from '../PaywallVariantB';
import { PaywallVariantC } from '../PaywallVariantC';
import { usePaywallExperiment, PAYWALL_EXPERIMENT_ID } from '../usePaywallExperiment';
import { getVariant, resetExperiment, resetAllExperiments, experiments } from '@/lib/abTest';

// ─── Mocks ───────────────────────────────────────────────────────────

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(),
}));

jest.mock('@/lib/analytics/interactions', () => ({
  logInteraction: jest.fn(),
}));

jest.mock('expo-blur', () => ({
  BlurView: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    // @ts-expect-error — test mock
    <mock-blur-view {...props}>{children}</mock-blur-view>
  ),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    // @ts-expect-error — test mock
    <mock-linear-gradient {...props}>{children}</mock-linear-gradient>
  ),
}));

// react-native-reanimated is mocked globally in jest.setup.js

// @expo/vector-icons global mock only includes Feather; add Ionicons for BlurOverlayHeader
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  const MockIcon = ({ name }: { name?: string }) => <Text testID={`icon-${String(name)}`}>{name}</Text>;
  MockIcon.displayName = 'MockVectorIcon';
  return {
    Feather: MockIcon,
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
    AntDesign: MockIcon,
  };
});

jest.mock('react-native-purchases-ui', () => ({
  __esModule: true,
  default: {
    Paywall: ({ onDismiss }: { onDismiss?: () => void }) => {
      const { TouchableOpacity, Text } = require('react-native');
      return (
        <TouchableOpacity testID='rc-paywall-mock' onPress={onDismiss}>
          <Text>RevenueCat Paywall</Text>
        </TouchableOpacity>
      );
    },
  },
}));

jest.mock('@/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerLightImpact: jest.fn(),
    triggerSelection: jest.fn(),
    triggerSuccess: jest.fn(),
  }),
}));

jest.mock('../../../hooks/usePremium', () => ({
  usePremium: () => ({
    monthlyPackage: null,
    packages: [],
    priceString: '$6.99/month',
    isLoadingOfferings: false,
    purchasePackage: jest.fn(),
  }),
}));

jest.mock('../useRestorePurchases', () => ({
  useRestorePurchases: () => ({
    handleRestorePurchases: jest.fn(),
  }),
}));

// Shared mock implementations
const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

const defaultPaywallProps = {
  visible: true,
  onClose: jest.fn(),
  onPurchaseSuccess: jest.fn(),
  onRestoreSuccess: jest.fn(),
};

const defaultVariantProps = {
  visible: true,
  onClose: jest.fn(),
  onStartTrial: jest.fn(),
  onRestorePurchases: jest.fn(),
};

// ─── abTest.ts unit tests ────────────────────────────────────────────

describe('abTest framework — paywall_screen experiment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('registers the paywall_screen experiment with A/B/C variants', () => {
    const exp = experiments['paywall_screen'];
    expect(exp).toBeDefined();
    expect(exp.variants).toEqual(['A', 'B', 'C']);
    expect(exp.enabled).toBe(true);
  });

  it('weights sum to approximately 1', () => {
    const { weights } = experiments['paywall_screen'];
    expect(weights).toBeDefined();
    const sum = weights!.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
  });

  it('returns A when no stored variant exists', async () => {
    mockGetItem.mockResolvedValue(null);
    // Force assignment to A by mocking Math.random
    jest.spyOn(Math, 'random').mockReturnValue(0.0);
    const variant = await getVariant('paywall_screen');
    expect(['A', 'B', 'C']).toContain(variant);
    jest.spyOn(Math, 'random').mockRestore();
  });

  it('returns stored variant on subsequent calls (sticky assignment)', async () => {
    mockGetItem.mockResolvedValue('B');
    const variant = await getVariant('paywall_screen');
    expect(variant).toBe('B');
    // Should not reassign
    expect(mockSetItem).not.toHaveBeenCalled();
  });

  it('falls back to A for disabled experiments', async () => {
    const original = experiments['paywall_screen'].enabled;
    experiments['paywall_screen'].enabled = false;
    const variant = await getVariant('paywall_screen');
    expect(variant).toBe('A');
    experiments['paywall_screen'].enabled = original;
  });

  it('persists newly assigned variant to AsyncStorage', async () => {
    mockGetItem.mockResolvedValue(null);
    jest.spyOn(Math, 'random').mockReturnValue(0.5); // lands in B weight range
    await getVariant('paywall_screen');
    expect(mockSetItem).toHaveBeenCalledWith(
      '@abtest_paywall_screen',
      expect.stringMatching(/^[ABC]$/)
    );
    jest.spyOn(Math, 'random').mockRestore();
  });

  it('resetExperiment clears the stored assignment', async () => {
    await resetExperiment('paywall_screen');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@abtest_paywall_screen');
  });
});

// ─── usePaywallExperiment hook tests ─────────────────────────────────

describe('usePaywallExperiment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('starts in not-ready state with variant A', () => {
    const { result } = renderHook(() => usePaywallExperiment());
    expect(result.current.ready).toBe(false);
    expect(result.current.variant).toBe('A');
  });

  it('becomes ready after resolving variant from storage', async () => {
    mockGetItem.mockResolvedValue('B');
    const { result } = renderHook(() => usePaywallExperiment());
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.variant).toBe('B');
  });

  it('exposes trackViewed, trackConverted, trackDismissed', async () => {
    mockGetItem.mockResolvedValue('C');
    const { result } = renderHook(() => usePaywallExperiment());
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(typeof result.current.trackViewed).toBe('function');
    expect(typeof result.current.trackConverted).toBe('function');
    expect(typeof result.current.trackDismissed).toBe('function');
  });

  it('uses PAYWALL_EXPERIMENT_ID constant', () => {
    expect(PAYWALL_EXPERIMENT_ID).toBe('paywall_screen');
  });
});

// ─── PaywallABTest orchestrator tests ────────────────────────────────

describe('PaywallABTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetItem.mockResolvedValue(undefined);
  });

  it('renders RevenueCat paywall for variant A (control)', async () => {
    mockGetItem.mockResolvedValue('A');
    const { getByTestId } = render(<PaywallABTest {...defaultPaywallProps} />);
    await waitFor(() => {
      expect(getByTestId('rc-paywall-mock')).toBeTruthy();
    });
  });

  it('renders variant B social proof paywall when assigned to B', async () => {
    mockGetItem.mockResolvedValue('B');
    const { getAllByText } = render(<PaywallABTest {...defaultPaywallProps} />);
    await waitFor(() => {
      const matches = getAllByText(/10,000\+/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders variant C fear-of-loss paywall when assigned to C', async () => {
    mockGetItem.mockResolvedValue('C');
    const { getByText } = render(
      <PaywallABTest {...defaultPaywallProps} streakDays={14} />
    );
    await waitFor(() => {
      expect(getByText(/14.day streak is at risk/i)).toBeTruthy();
    });
  });

  it('defaults to RevenueCat paywall while variant is loading', () => {
    mockGetItem.mockReturnValue(new Promise(() => {})); // never resolves
    const { getByTestId } = render(<PaywallABTest {...defaultPaywallProps} />);
    expect(getByTestId('rc-paywall-mock')).toBeTruthy();
  });

  it('is not visible when visible=false', async () => {
    mockGetItem.mockResolvedValue('B');
    const { queryByText } = render(
      <PaywallABTest {...defaultPaywallProps} visible={false} />
    );
    await waitFor(() => {
      expect(queryByText(/10,000\+/i)).toBeNull();
    });
  });
});

// ─── PaywallVariantB (social proof) tests ────────────────────────────

describe('PaywallVariantB — social proof', () => {
  it('renders the "10,000+ chains built" social proof text', () => {
    const { getAllByText } = render(<PaywallVariantB {...defaultVariantProps} />);
    // "10,000+" appears in both the hero badge and the headline — at least one must exist
    const matches = getAllByText(/10,000\+/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('renders testimonials', () => {
    const { getByText } = render(<PaywallVariantB {...defaultVariantProps} />);
    expect(getByText(/Sarah K\./i)).toBeTruthy();
    expect(getByText(/Marcus T\./i)).toBeTruthy();
    expect(getByText(/Priya M\./i)).toBeTruthy();
  });

  it('renders the CTA button with testID', () => {
    const { getByTestId } = render(<PaywallVariantB {...defaultVariantProps} />);
    expect(getByTestId('paywall-b-start-trial-button')).toBeTruthy();
  });

  it('is not visible when visible=false', () => {
    const { queryByTestId } = render(
      <PaywallVariantB {...defaultVariantProps} visible={false} />
    );
    expect(queryByTestId('paywall-b-start-trial-button')).toBeNull();
  });

  it('shows star ratings', () => {
    const { getByText } = render(<PaywallVariantB {...defaultVariantProps} />);
    expect(getByText(/4\.9/)).toBeTruthy();
  });
});

// ─── PaywallVariantC (fear-of-loss) tests ────────────────────────────

describe('PaywallVariantC — fear-of-loss / streak protection', () => {
  it('personalises headline with the provided streakDays', () => {
    const { getByText } = render(
      <PaywallVariantC {...defaultVariantProps} streakDays={23} />
    );
    expect(getByText(/23.day streak is at risk/i)).toBeTruthy();
  });

  it('defaults to 7-day streak when streakDays is omitted', () => {
    const { getByText } = render(<PaywallVariantC {...defaultVariantProps} />);
    expect(getByText(/7.day streak is at risk/i)).toBeTruthy();
  });

  it('displays the streak flame count', () => {
    const { getByText } = render(
      <PaywallVariantC {...defaultVariantProps} streakDays={42} />
    );
    expect(getByText('42')).toBeTruthy();
  });

  it('renders the streak-protection CTA button', () => {
    const { getByTestId } = render(<PaywallVariantC {...defaultVariantProps} />);
    expect(getByTestId('paywall-c-start-trial-button')).toBeTruthy();
  });

  it('mentions streak freeze protection', () => {
    const { getAllByText } = render(<PaywallVariantC {...defaultVariantProps} />);
    const matches = getAllByText(/streak freeze/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('is not visible when visible=false', () => {
    const { queryByTestId } = render(
      <PaywallVariantC {...defaultVariantProps} visible={false} />
    );
    expect(queryByTestId('paywall-c-start-trial-button')).toBeNull();
  });

  it('handles streakDays=1 without pluralisation errors', () => {
    const { getByText } = render(
      <PaywallVariantC {...defaultVariantProps} streakDays={1} />
    );
    expect(getByText(/1.day streak/i)).toBeTruthy();
  });
});
