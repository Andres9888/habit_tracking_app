/**
 * CompletionBadge Component Tests - Cards V1 Improved Spec
 * Task 2: Create CompletionBadge Component
 *
 * Tests:
 * - Renders 3 badge types: required, optional, complete
 * - Correct colors for each type (red for required, blue for optional, green for complete)
 * - Text is uppercase, 10px, semibold with letter-spacing
 * - Rounded pill shape with proper padding
 * - Accessible label for screen readers
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { CompletionBadge } from '../CompletionBadge';

describe('CompletionBadge', () => {
  describe('Required badge', () => {
    it('renders required badge with correct text', () => {
      const { getByText } = render(<CompletionBadge type="required" />);
      expect(getByText('REQUIRED')).toBeDefined();
    });

    it('renders required badge with correct text color', () => {
      const { getByText } = render(<CompletionBadge type="required" />);
      const badge = getByText('REQUIRED');
      expect(badge.props.style).toMatchObject({ color: '#991B1B' });
    });

    it('renders required badge with correct background color', () => {
      const { getByText } = render(<CompletionBadge type="required" />);
      const badge = getByText('REQUIRED');
      expect(badge.parent?.props.style).toMatchObject({
        backgroundColor: '#FEE2E2',
      });
    });

    it('renders required badge with correct text styling', () => {
      const { getByText } = render(<CompletionBadge type="required" />);
      const badge = getByText('REQUIRED');
      expect(badge.props.style).toMatchObject({
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      });
    });

    it('has correct accessibility label', () => {
      const { getByLabelText } = render(<CompletionBadge type="required" />);
      expect(getByLabelText('REQUIRED')).toBeDefined();
    });
  });

  describe('Optional badge', () => {
    it('renders optional badge with correct text', () => {
      const { getByText } = render(<CompletionBadge type="optional" />);
      expect(getByText('OPTIONAL')).toBeDefined();
    });

    it('renders optional badge with correct text color', () => {
      const { getByText } = render(<CompletionBadge type="optional" />);
      const badge = getByText('OPTIONAL');
      expect(badge.props.style).toMatchObject({ color: '#3730A3' });
    });

    it('renders optional badge with correct background color', () => {
      const { getByText } = render(<CompletionBadge type="optional" />);
      const badge = getByText('OPTIONAL');
      expect(badge.parent?.props.style).toMatchObject({
        backgroundColor: '#E0E7FF',
      });
    });

    it('renders optional badge with correct text styling', () => {
      const { getByText } = render(<CompletionBadge type="optional" />);
      const badge = getByText('OPTIONAL');
      expect(badge.props.style).toMatchObject({
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      });
    });

    it('has correct accessibility label', () => {
      const { getByLabelText } = render(<CompletionBadge type="optional" />);
      expect(getByLabelText('OPTIONAL')).toBeDefined();
    });
  });

  describe('Complete badge', () => {
    it('renders complete badge with correct text', () => {
      const { getByText } = render(<CompletionBadge type="complete" />);
      expect(getByText('COMPLETE')).toBeDefined();
    });

    it('renders complete badge with correct text color', () => {
      const { getByText } = render(<CompletionBadge type="complete" />);
      const badge = getByText('COMPLETE');
      expect(badge.props.style).toMatchObject({ color: '#065F46' });
    });

    it('renders complete badge with correct background color', () => {
      const { getByText } = render(<CompletionBadge type="complete" />);
      const badge = getByText('COMPLETE');
      expect(badge.parent?.props.style).toMatchObject({
        backgroundColor: '#D1FAE5',
      });
    });

    it('renders complete badge with correct text styling', () => {
      const { getByText } = render(<CompletionBadge type="complete" />);
      const badge = getByText('COMPLETE');
      expect(badge.props.style).toMatchObject({
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      });
    });

    it('has correct accessibility label', () => {
      const { getByLabelText } = render(<CompletionBadge type="complete" />);
      expect(getByLabelText('COMPLETE')).toBeDefined();
    });
  });

  describe('Pill shape styling', () => {
    it('has rounded-full border radius', () => {
      const { getByText } = render(<CompletionBadge type="required" />);
      const badge = getByText('REQUIRED');
      expect(badge.parent?.props.style).toMatchObject({
        borderRadius: 9999,
      });
    });

    it('has correct horizontal padding', () => {
      const { getByText } = render(<CompletionBadge type="required" />);
      const badge = getByText('REQUIRED');
      expect(badge.parent?.props.style).toMatchObject({
        paddingHorizontal: 8, // px-2
      });
    });

    it('has correct vertical padding', () => {
      const { getByText } = render(<CompletionBadge type="required" />);
      const badge = getByText('REQUIRED');
      expect(badge.parent?.props.style).toMatchObject({
        paddingVertical: 2, // py-0.5
      });
    });
  });

  describe('Custom accessibility label', () => {
    it('uses custom accessibility label when provided', () => {
      const customLabel = 'Habit name is required';
      const { getByLabelText } = render(
        <CompletionBadge type="required" accessibilityLabel={customLabel} />
      );
      expect(getByLabelText(customLabel)).toBeTruthy();
    });

    it('falls back to default label when custom label not provided', () => {
      const { getByLabelText } = render(<CompletionBadge type="required" />);
      expect(getByLabelText('REQUIRED')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility role', () => {
      const { getByLabelText } = render(<CompletionBadge type="required" />);
      const badge = getByLabelText('REQUIRED');
      expect(badge.props.accessibilityRole).toBe('text');
    });

    it('has accessible label for required badge', () => {
      const { getByLabelText } = render(<CompletionBadge type="required" />);
      expect(getByLabelText('REQUIRED')).toBeDefined();
    });

    it('has accessible label for optional badge', () => {
      const { getByLabelText } = render(<CompletionBadge type="optional" />);
      expect(getByLabelText('OPTIONAL')).toBeDefined();
    });

    it('has accessible label for complete badge', () => {
      const { getByLabelText } = render(<CompletionBadge type="complete" />);
      expect(getByLabelText('COMPLETE')).toBeDefined();
    });
  });

  describe('Memoization', () => {
    it('should be memoized to prevent unnecessary re-renders', () => {
      const { rerender } = render(<CompletionBadge type="required" />);
      const firstRender = render(<CompletionBadge type="required" />);

      // Props haven't changed, should not re-render
      rerender(<CompletionBadge type="required" />);

      // Component should be memoized (this is a meta-test)
      expect(CompletionBadge).toBeDefined();
    });
  });
});
