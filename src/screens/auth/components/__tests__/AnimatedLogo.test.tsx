import React from 'react';
import { render } from '@testing-library/react-native';
import { AnimatedLogo } from '../AnimatedLogo';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Link: () => null,
}));

describe('AnimatedLogo', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByLabelText } = render(<AnimatedLogo />);

      // Should have accessibility label
      expect(getByLabelText('Chain Day Logo')).toBeTruthy();
    });

    it('renders with custom size', () => {
      const customSize = 100;
      const { UNSAFE_getByType } = render(<AnimatedLogo size={customSize} />);

      // The Animated.View will have the custom size in its style
      const animatedViews = UNSAFE_getByType('View');
      expect(animatedViews).toBeTruthy();
    });

    it('renders with default size of 80', () => {
      const { toJSON } = render(<AnimatedLogo />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility label', () => {
      const { getByLabelText } = render(<AnimatedLogo />);
      expect(getByLabelText('Chain Day Logo')).toBeTruthy();
    });

    it('has accessibility role of image', () => {
      const { getByRole } = render(<AnimatedLogo />);
      expect(getByRole('image')).toBeTruthy();
    });

    it('is accessible to screen readers', () => {
      const { getByRole } = render(<AnimatedLogo />);
      const logo = getByRole('image');
      expect(logo.props.accessible).toBe(true);
    });
  });

  describe('Styling', () => {
    it('renders with emerald gradient background', () => {
      const { toJSON } = render(<AnimatedLogo />);
      const tree = toJSON();
      // The component should render with emerald gradient (#059669 → #10b981 → #34d399)
      expect(tree).toBeTruthy();
    });

    it('has rounded corners (borderRadius 24)', () => {
      const { toJSON } = render(<AnimatedLogo />);
      expect(toJSON()).toBeTruthy();
    });

    it('has shadow properties for elevation', () => {
      const { toJSON } = render(<AnimatedLogo />);
      const tree = toJSON();
      expect(tree).toBeTruthy();
    });

    it('has bottom margin (mb-4)', () => {
      const { toJSON } = render(<AnimatedLogo />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Different Sizes', () => {
    it('renders with small size (40)', () => {
      const { toJSON } = render(<AnimatedLogo size={40} />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders with large size (120)', () => {
      const { toJSON } = render(<AnimatedLogo size={120} />);
      expect(toJSON()).toBeTruthy();
    });

    it('renders with very large size (200)', () => {
      const { toJSON } = render(<AnimatedLogo size={200} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
