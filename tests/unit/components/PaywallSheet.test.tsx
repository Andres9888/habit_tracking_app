/**
 * PaywallSheet migration tests
 * Verifies the component uses the shared Modal with bottomSheet variant
 * and renders paywall content correctly.
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { PaywallSheet } from '../../../src/components/PaywallSheet';
import { PAYWALL_PERKS } from '../../../src/screens/TemplatesScreen/data/paywallPerks';

let lastModalProps: Record<string, unknown> = {};
const mockPurchasePackage = jest.fn(async () => true);

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, reject, resolve };
}

jest.mock('../../../src/hooks/usePremium', () => ({
  usePremium: () => ({
    monthlyPackage: { identifier: 'monthly' },
    priceString: '$6.99/month',
    purchasePackage: mockPurchasePackage,
  }),
}));

jest.mock('../../../src/components/Modal', () => {
  const { View } = require('react-native');
  function MockModal(props: Record<string, unknown>) {
    lastModalProps = props;
    return props.visible ? <View testID="shared-modal">{props.children as React.ReactNode}</View> : null;
  }
  MockModal.displayName = 'MockModal';
  return { __esModule: true, default: MockModal, Modal: MockModal };
});

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return { X: (props: Record<string, unknown>) => <View testID="x-icon" {...props} /> };
});

describe('PaywallSheet', () => {
  const defaultProps = {
    onClose: jest.fn(),
    onPurchaseSuccess: jest.fn(),
    visible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    lastModalProps = {};
  });

  it('uses the shared Modal with bottomSheet variant', () => {
    render(<PaywallSheet {...defaultProps} />);
    expect(lastModalProps.variant).toBe('bottomSheet');
  });

  it('passes visible and onClose to Modal', () => {
    render(<PaywallSheet {...defaultProps} />);
    expect(lastModalProps.visible).toBe(true);
    expect(lastModalProps.onClose).toBe(defaultProps.onClose);
  });

  it('renders headline and description', () => {
    const { getByText } = render(<PaywallSheet {...defaultProps} />);
    expect(getByText('Unlock Unlimited Habits')).toBeTruthy();
    expect(getByText('Take your habits to the next level with premium features')).toBeTruthy();
  });

  it('renders all paywall perks', () => {
    const { getByText } = render(<PaywallSheet {...defaultProps} />);
    for (const perk of PAYWALL_PERKS) {
      expect(getByText(perk.label)).toBeTruthy();
      expect(getByText(perk.emoji)).toBeTruthy();
    }
  });

  it('renders pricing text', () => {
    const { getByText } = render(<PaywallSheet {...defaultProps} />);
    expect(getByText('$6.99/month · Cancel anytime')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(<PaywallSheet {...defaultProps} />);
    fireEvent.press(getByTestId('templates-paywall-close'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onPurchaseSuccess and onClose when CTA is pressed', async () => {
    const { getByTestId } = render(<PaywallSheet {...defaultProps} />);
    fireEvent.press(getByTestId('templates-paywall-cta'));

    await waitFor(() => {
      expect(defaultProps.onPurchaseSuccess).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('shows Processing text when purchasing', async () => {
    const deferredPurchase = createDeferred<boolean>();
    mockPurchasePackage.mockImplementationOnce(() => deferredPurchase.promise);

    const { getByTestId, getByText, queryByText } = render(<PaywallSheet {...defaultProps} />);
    expect(getByText('Upgrade to Premium')).toBeTruthy();
    fireEvent.press(getByTestId('templates-paywall-cta'));

    expect(getByText('Processing...')).toBeTruthy();
    expect(queryByText('Upgrade to Premium')).toBeNull();

    await act(async () => {
      deferredPurchase.resolve(true);
      await deferredPurchase.promise;
    });
  });

  it('renders nothing when visible is false', () => {
    const { queryByTestId } = render(
      <PaywallSheet {...defaultProps} visible={false} />,
    );
    expect(queryByTestId('templates-paywall')).toBeNull();
  });

  it('does not import Modal from react-native directly', () => {
    const fs = require('fs');
    const source = fs.readFileSync(
      require.resolve('../../../src/components/PaywallSheet/PaywallSheet.tsx'),
      'utf8',
    );
    expect(source).not.toMatch(/import\s*\{[^}]*\bModal\b[^}]*\}\s*from\s*['"]react-native['"]/);
    expect(source).toMatch(/from ['"]\.\.\/Modal['"]/);
  });
});
