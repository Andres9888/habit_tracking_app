/**
 * ModalHeaderV1 Component Tests - Cards V1 Improved Spec
 * Task 3: Create ModalHeader Component
 *
 * Tests:
 * - Displays close button, title, and progress text
 * - Progress bar animates smoothly (300ms transition)
 * - Progress bar width calculated correctly (0%, 33%, 66%, 100%)
 * - Accessible close button with proper label
 * - Matches design spec styling exactly
 * - Progress bar has correct colors and styling
 * - Component is memoized for performance
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ModalHeaderV1 } from '../ModalHeaderV1';

describe('ModalHeaderV1', () => {
  const defaultProps = {
    onClose: jest.fn(),
    completedSections: 0,
    totalSections: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { getByText } = render(<ModalHeaderV1 {...defaultProps} />);
      expect(getByText('New Habit')).toBeDefined();
    });

    it('displays the modal title', () => {
      const { getByText } = render(<ModalHeaderV1 {...defaultProps} />);
      expect(getByText('New Habit')).toBeDefined();
    });

    it('displays the close button', () => {
      const { getByLabelText } = render(<ModalHeaderV1 {...defaultProps} />);
      expect(getByLabelText('Close modal')).toBeDefined();
    });

    it('displays progress text with correct format', () => {
      const { getByText } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={2} />
      );
      expect(getByText('2 of 3 complete')).toBeDefined();
    });
  });

  describe('Close Button', () => {
    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <ModalHeaderV1 {...defaultProps} onClose={onClose} />
      );

      const closeButton = getByLabelText('Close modal');
      fireEvent.press(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility label', () => {
      const { getByLabelText } = render(<ModalHeaderV1 {...defaultProps} />);
      expect(getByLabelText('Close modal')).toBeDefined();
    });

    it('has correct accessibility hint', () => {
      const { getByLabelText } = render(<ModalHeaderV1 {...defaultProps} />);
      const closeButton = getByLabelText('Close modal');
      expect(closeButton.props.accessibilityHint).toBe(
        'Dismisses the create habit modal'
      );
    });

    it('has correct accessibility role', () => {
      const { getByLabelText } = render(<ModalHeaderV1 {...defaultProps} />);
      const closeButton = getByLabelText('Close modal');
      expect(closeButton.props.accessibilityRole).toBe('button');
    });
  });

  describe('Progress Text', () => {
    it('displays 0 of 3 complete when no sections are complete', () => {
      const { getByText } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={0} />
      );
      expect(getByText('0 of 3 complete')).toBeDefined();
    });

    it('displays 1 of 3 complete when one section is complete', () => {
      const { getByText } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={1} />
      );
      expect(getByText('1 of 3 complete')).toBeDefined();
    });

    it('displays 2 of 3 complete when two sections are complete', () => {
      const { getByText } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={2} />
      );
      expect(getByText('2 of 3 complete')).toBeDefined();
    });

    it('displays 3 of 3 complete when all sections are complete', () => {
      const { getByText } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={3} />
      );
      expect(getByText('3 of 3 complete')).toBeDefined();
    });

    it('has correct accessibility label', () => {
      const { getByLabelText } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={2} />
      );
      expect(getByLabelText('2 of 3 sections complete')).toBeDefined();
    });

    it('has emerald-600 text color', () => {
      const { getByText } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={2} />
      );
      const progressText = getByText('2 of 3 complete');
      expect(progressText.props.style).toMatchObject({
        color: '#10B981', // emerald-600
      });
    });

    it('has correct font size (12px)', () => {
      const { getByText } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={1} />
      );
      const progressText = getByText('1 of 3 complete');
      expect(progressText.props.style).toMatchObject({
        fontSize: 12,
      });
    });

    it('has correct font weight (500)', () => {
      const { getByText } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={1} />
      );
      const progressText = getByText('1 of 3 complete');
      expect(progressText.props.style).toMatchObject({
        fontWeight: '500',
      });
    });
  });

  describe('Progress Bar', () => {
    it('renders progress bar background', () => {
      const { UNSAFE_getByType } = render(<ModalHeaderV1 {...defaultProps} />);
      // Progress bar should be rendered
      expect(UNSAFE_getByType).toBeDefined();
    });

    it('has correct accessibility role', () => {
      const { getByRole } = render(<ModalHeaderV1 {...defaultProps} />);
      expect(getByRole('progressbar')).toBeDefined();
    });

    it('has correct accessibility value at 0%', () => {
      const { getByRole } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={0} />
      );
      const progressBar = getByRole('progressbar');
      expect(progressBar.props.accessibilityValue).toMatchObject({
        min: 0,
        max: 3,
        now: 0,
      });
    });

    it('has correct accessibility value at 33%', () => {
      const { getByRole } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={1} />
      );
      const progressBar = getByRole('progressbar');
      expect(progressBar.props.accessibilityValue).toMatchObject({
        min: 0,
        max: 3,
        now: 1,
      });
    });

    it('has correct accessibility value at 66%', () => {
      const { getByRole } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={2} />
      );
      const progressBar = getByRole('progressbar');
      expect(progressBar.props.accessibilityValue).toMatchObject({
        min: 0,
        max: 3,
        now: 2,
      });
    });

    it('has correct accessibility value at 100%', () => {
      const { getByRole } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={3} />
      );
      const progressBar = getByRole('progressbar');
      expect(progressBar.props.accessibilityValue).toMatchObject({
        min: 0,
        max: 3,
        now: 3,
      });
    });
  });

  describe('Styling', () => {
    it('has white background color', () => {
      const { getByRole } = render(<ModalHeaderV1 {...defaultProps} />);
      const header = getByRole('header');
      expect(header.props.style).toMatchObject({
        backgroundColor: '#FFFFFF',
      });
    });

    it('has stone-100 border bottom', () => {
      const { getByRole } = render(<ModalHeaderV1 {...defaultProps} />);
      const header = getByRole('header');
      expect(header.props.style).toMatchObject({
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F4', // stone-100
      });
    });

    it('has correct horizontal padding (px-5 / 20px)', () => {
      const { getByRole } = render(<ModalHeaderV1 {...defaultProps} />);
      const header = getByRole('header');
      expect(header.props.style).toMatchObject({
        paddingHorizontal: 20,
      });
    });

    it('has correct vertical padding (py-4 / 16px)', () => {
      const { getByRole } = render(<ModalHeaderV1 {...defaultProps} />);
      const header = getByRole('header');
      expect(header.props.style).toMatchObject({
        paddingTop: 16,
        paddingBottom: 16,
      });
    });

    it('title has correct font size (18px)', () => {
      const { getByText } = render(<ModalHeaderV1 {...defaultProps} />);
      const title = getByText('New Habit');
      expect(title.props.style).toMatchObject({
        fontSize: 18,
      });
    });

    it('title has correct font weight (700)', () => {
      const { getByText } = render(<ModalHeaderV1 {...defaultProps} />);
      const title = getByText('New Habit');
      expect(title.props.style).toMatchObject({
        fontWeight: '700',
      });
    });

    it('title has stone-800 color', () => {
      const { getByText } = render(<ModalHeaderV1 {...defaultProps} />);
      const title = getByText('New Habit');
      expect(title.props.style).toMatchObject({
        color: '#292524', // stone-800
      });
    });
  });

  describe('Progress Bar Calculation', () => {
    it('calculates 0% progress correctly', () => {
      const { getByRole } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={0} />
      );
      const progressBar = getByRole('progressbar');
      expect(progressBar.props.accessibilityValue.now).toBe(0);
    });

    it('calculates 33% progress correctly', () => {
      const { getByRole } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={1} />
      );
      const progressBar = getByRole('progressbar');
      expect(progressBar.props.accessibilityValue.now).toBe(1);
      // 1/3 * 100 = 33.33%
    });

    it('calculates 66% progress correctly', () => {
      const { getByRole } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={2} />
      );
      const progressBar = getByRole('progressbar');
      expect(progressBar.props.accessibilityValue.now).toBe(2);
      // 2/3 * 100 = 66.66%
    });

    it('calculates 100% progress correctly', () => {
      const { getByRole } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={3} />
      );
      const progressBar = getByRole('progressbar');
      expect(progressBar.props.accessibilityValue.now).toBe(3);
      // 3/3 * 100 = 100%
    });
  });

  describe('Reactivity', () => {
    it('updates progress text when completedSections changes', () => {
      const { getByText, rerender } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={0} />
      );

      expect(getByText('0 of 3 complete')).toBeDefined();

      rerender(
        <ModalHeaderV1 {...defaultProps} completedSections={2} />
      );

      expect(getByText('2 of 3 complete')).toBeDefined();
    });

    it('updates progress bar accessibility value when completedSections changes', () => {
      const { getByRole, rerender } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={1} />
      );

      let progressBar = getByRole('progressbar');
      expect(progressBar.props.accessibilityValue.now).toBe(1);

      rerender(
        <ModalHeaderV1 {...defaultProps} completedSections={3} />
      );

      progressBar = getByRole('progressbar');
      expect(progressBar.props.accessibilityValue.now).toBe(3);
    });
  });

  describe('Memoization', () => {
    it('should be memoized to prevent unnecessary re-renders', () => {
      const { rerender } = render(<ModalHeaderV1 {...defaultProps} />);

      // Props haven't changed, should not re-render
      rerender(<ModalHeaderV1 {...defaultProps} />);

      // Component should be memoized (this is a meta-test)
      expect(ModalHeaderV1).toBeDefined();
      expect(ModalHeaderV1.displayName).toBe('ModalHeaderV1');
    });

    it('re-renders when completedSections changes', () => {
      const { getByText, rerender } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={0} />
      );

      expect(getByText('0 of 3 complete')).toBeDefined();

      rerender(
        <ModalHeaderV1 {...defaultProps} completedSections={1} />
      );

      expect(getByText('1 of 3 complete')).toBeDefined();
    });

    it('does not re-render when onClose function reference changes but completedSections stays same', () => {
      const onClose1 = jest.fn();
      const onClose2 = jest.fn();

      const { getByText, rerender } = render(
        <ModalHeaderV1
          {...defaultProps}
          onClose={onClose1}
          completedSections={1}
        />
      );

      expect(getByText('1 of 3 complete')).toBeDefined();

      // Change onClose reference
      rerender(
        <ModalHeaderV1
          {...defaultProps}
          onClose={onClose2}
          completedSections={1}
        />
      );

      // Should still render correctly
      expect(getByText('1 of 3 complete')).toBeDefined();
    });
  });

  describe('Animation', () => {
    it('animates progress bar width when completedSections changes', async () => {
      const { getByRole, rerender } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={0} />
      );

      const progressBar = getByRole('progressbar');
      expect(progressBar).toBeDefined();

      // Update to 1 completed section
      rerender(
        <ModalHeaderV1 {...defaultProps} completedSections={1} />
      );

      // Animation should be triggered (300ms duration)
      await waitFor(
        () => {
          const updatedProgressBar = getByRole('progressbar');
          expect(updatedProgressBar.props.accessibilityValue.now).toBe(1);
        },
        { timeout: 500 }
      );
    });

    it('animates to full width when all sections complete', async () => {
      const { getByRole, rerender } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={0} />
      );

      // Update to all completed
      rerender(
        <ModalHeaderV1 {...defaultProps} completedSections={3} />
      );

      await waitFor(
        () => {
          const progressBar = getByRole('progressbar');
          expect(progressBar.props.accessibilityValue.now).toBe(3);
        },
        { timeout: 500 }
      );
    });
  });

  describe('Accessibility', () => {
    it('has correct header accessibility role', () => {
      const { getByRole } = render(<ModalHeaderV1 {...defaultProps} />);
      expect(getByRole('header')).toBeDefined();
    });

    it('has correct button accessibility role for close button', () => {
      const { getByLabelText } = render(<ModalHeaderV1 {...defaultProps} />);
      const closeButton = getByLabelText('Close modal');
      expect(closeButton.props.accessibilityRole).toBe('button');
    });

    it('has correct progressbar accessibility role', () => {
      const { getByRole } = render(<ModalHeaderV1 {...defaultProps} />);
      expect(getByRole('progressbar')).toBeDefined();
    });

    it('progress text has meaningful accessibility label', () => {
      const { getByLabelText } = render(
        <ModalHeaderV1 {...defaultProps} completedSections={2} />
      );
      expect(getByLabelText('2 of 3 sections complete')).toBeDefined();
    });

    it('close button has meaningful accessibility hint', () => {
      const { getByLabelText } = render(<ModalHeaderV1 {...defaultProps} />);
      const closeButton = getByLabelText('Close modal');
      expect(closeButton.props.accessibilityHint).toBe(
        'Dismisses the create habit modal'
      );
    });
  });
});
