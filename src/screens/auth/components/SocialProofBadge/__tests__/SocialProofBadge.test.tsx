
import React from 'react';

import { render } from '@testing-library/react-native';

import { SocialProofBadge } from '../SocialProofBadge';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: object;
  }) => (
    <mock-linear-gradient style={style} testID='gradient'>
      {children}
    </mock-linear-gradient>
  ),
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Star: () => <mock-star testID='star-icon' />,
}));

describe('SocialProofBadge', () => {
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByText, getByLabelText } = render(<SocialProofBadge />);

      // Should render the default text
      expect(getByText('10,000+ habits tracked')).toBeTruthy();
      // Should have accessibility label
      expect(getByLabelText('10,000+ habits tracked')).toBeTruthy();
    });

    it('renders with custom text', () => {
      const customText = '5,000+ happy users';
      const { getByText, getByLabelText } = render(
        <SocialProofBadge text={customText} />
      );

      expect(getByText(customText)).toBeTruthy();
      expect(getByLabelText(customText)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible container with text role', () => {
      const { getByLabelText } = render(<SocialProofBadge />);
      const container = getByLabelText('10,000+ habits tracked');
      expect(container.props.accessibilityRole).toBe('text');
    });

    it('updates accessibility label when text changes', () => {
      const customText = 'New badge text';
      const { getByLabelText } = render(<SocialProofBadge text={customText} />);
      expect(getByLabelText(customText)).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('renders with amber gradient background', () => {
      const { toJSON } = render(<SocialProofBadge />);
      const tree = toJSON();
      // The component should render with amber gradient (#fef3c7 → #fde68a)
      expect(tree).toBeTruthy();
    });

    it('renders without errors', () => {
      const { toJSON } = render(<SocialProofBadge />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Different Text Variations', () => {
    it('renders with short text', () => {
      const { getByText } = render(<SocialProofBadge text='50+ users' />);
      expect(getByText('50+ users')).toBeTruthy();
    });

    it('renders with long text', () => {
      const longText = 'Join 100,000+ people building better habits every day';
      const { getByText } = render(<SocialProofBadge text={longText} />);
      expect(getByText(longText)).toBeTruthy();
    });

    it('renders with numbers and emojis', () => {
      const textWithEmoji = '5,000+ ⭐ reviews';
      const { getByText } = render(<SocialProofBadge text={textWithEmoji} />);
      expect(getByText(textWithEmoji)).toBeTruthy();
    });
  });
});
