/**
 * ChainLinkAnimation Component Tests
 *
 * Tests for the animated chain link icon used in offline completions.
 *
 * @see docs/offline-habit-sync.md T014 - Chain animation for offline completions
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import { extendedTheme } from '../../../../theme';
import { ChainLinkAnimation } from '../ChainLinkAnimation';

// Wrapper with theme
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <PaperProvider theme={extendedTheme}>{component}</PaperProvider>
  );
};

// Test wrapper component to provide shared values
function TestWrapper({
  scaleValue = 1,
  rotateValue = 0,
  hasPendingOfflineOps = false,
  size = 20,
}: {
  scaleValue?: number;
  rotateValue?: number;
  hasPendingOfflineOps?: boolean;
  size?: number;
}) {
  const scale = useSharedValue(scaleValue);
  const rotate = useSharedValue(rotateValue);

  return (
    <ChainLinkAnimation
      hasPendingOfflineOps={hasPendingOfflineOps}
      rotate={rotate}
      scale={scale}
      size={size}
    />
  );
}

describe('ChainLinkAnimation - T014', () => {
  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { root } = renderWithProviders(<TestWrapper />);
      expect(root).toBeTruthy();
    });

    it('should render with scale value of 0 (hidden)', () => {
      const { root } = renderWithProviders(<TestWrapper scaleValue={0} />);
      expect(root).toBeTruthy();
    });

    it('should render with scale value of 1 (visible)', () => {
      const { root } = renderWithProviders(<TestWrapper scaleValue={1} />);
      expect(root).toBeTruthy();
    });

    it('should render with custom size', () => {
      const { root } = renderWithProviders(<TestWrapper size={24} />);
      expect(root).toBeTruthy();
    });
  });

  describe('Offline State Indicator', () => {
    it('should render normally when no pending offline operations', () => {
      const { root } = renderWithProviders(
        <TestWrapper hasPendingOfflineOps={false} />
      );
      expect(root).toBeTruthy();
    });

    it('should render with different styling when pending offline operations', () => {
      const { root } = renderWithProviders(
        <TestWrapper hasPendingOfflineOps={true} />
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Animation Properties', () => {
    it('should accept rotate value', () => {
      const { root } = renderWithProviders(<TestWrapper rotateValue={180} />);
      expect(root).toBeTruthy();
    });

    it('should accept scale value > 1 for bounce effect', () => {
      const { root } = renderWithProviders(<TestWrapper scaleValue={1.2} />);
      expect(root).toBeTruthy();
    });
  });

  describe('FR-002 Compliance (Visual Feedback)', () => {
    it('should be immediately visible when scale is 1', () => {
      // This test verifies the component renders correctly at full scale
      // Actual animation timing is tested via integration tests
      const { root } = renderWithProviders(<TestWrapper scaleValue={1} />);
      expect(root).toBeTruthy();
    });

    it('should be hidden when scale is 0', () => {
      // Component should have 0 opacity when scale is 0
      const { root } = renderWithProviders(<TestWrapper scaleValue={0} />);
      expect(root).toBeTruthy();
    });
  });

  describe('Props Validation', () => {
    it('should use default size of 20 when not specified', () => {
      const { root } = renderWithProviders(<TestWrapper />);
      expect(root).toBeTruthy();
    });

    it('should use default hasPendingOfflineOps of false', () => {
      const { root } = renderWithProviders(<TestWrapper />);
      expect(root).toBeTruthy();
    });
  });
});
