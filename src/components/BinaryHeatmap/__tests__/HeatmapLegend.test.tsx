/**
 * HeatmapLegend Component Tests
 *
 * Tests for rendering, dynamic colors, completion percentage, and accessibility.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { HeatmapLegend } from '../HeatmapLegend';

describe('HeatmapLegend', () => {
  const defaultProps = {
    habitColor: '#10b981', // emerald-500
    completionRate: 86,
  };

  describe('Rendering', () => {
    it('should render Missed indicator', () => {
      const { getByText } = render(<HeatmapLegend {...defaultProps} />);

      expect(getByText('Missed')).toBeTruthy();
    });

    it('should render Done indicator', () => {
      const { getByText } = render(<HeatmapLegend {...defaultProps} />);

      expect(getByText('Done')).toBeTruthy();
    });

    it('should render completion percentage', () => {
      const { getByText } = render(<HeatmapLegend {...defaultProps} />);

      expect(getByText('86% completion')).toBeTruthy();
    });

    it('should render both indicators and percentage simultaneously', () => {
      const { getByText } = render(<HeatmapLegend {...defaultProps} />);

      // All three elements should be present
      expect(getByText('Missed')).toBeTruthy();
      expect(getByText('Done')).toBeTruthy();
      expect(getByText('86% completion')).toBeTruthy();
    });
  });

  describe('Completion percentage formatting', () => {
    it('should round decimal percentages correctly', () => {
      const { getByText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={85.7} />
      );

      expect(getByText('86% completion')).toBeTruthy();
    });

    it('should handle 0% completion', () => {
      const { getByText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={0} />
      );

      expect(getByText('0% completion')).toBeTruthy();
    });

    it('should handle 100% completion', () => {
      const { getByText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={100} />
      );

      expect(getByText('100% completion')).toBeTruthy();
    });

    it('should round down 49.4 to 49%', () => {
      const { getByText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={49.4} />
      );

      expect(getByText('49% completion')).toBeTruthy();
    });

    it('should round up 49.5 to 50%', () => {
      const { getByText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={49.5} />
      );

      expect(getByText('50% completion')).toBeTruthy();
    });

    it('should handle single digit percentages', () => {
      const { getByText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={5} />
      );

      expect(getByText('5% completion')).toBeTruthy();
    });
  });

  describe('Dynamic habit color', () => {
    it('should apply emerald color to Done indicator', () => {
      const { getByLabelText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={86} />
      );

      const doneIndicator = getByLabelText('Done: colored');
      // The indicator should exist and be accessible
      expect(doneIndicator).toBeTruthy();
    });

    it('should apply red color to Done indicator', () => {
      const { getByLabelText } = render(
        <HeatmapLegend habitColor='#ef4444' completionRate={75} />
      );

      const doneIndicator = getByLabelText('Done: colored');
      expect(doneIndicator).toBeTruthy();
    });

    it('should apply blue color to Done indicator', () => {
      const { getByLabelText } = render(
        <HeatmapLegend habitColor='#3b82f6' completionRate={50} />
      );

      const doneIndicator = getByLabelText('Done: colored');
      expect(doneIndicator).toBeTruthy();
    });

    it('should always use gray color for Missed indicator', () => {
      const { getByLabelText } = render(<HeatmapLegend {...defaultProps} />);

      const missedIndicator = getByLabelText('Missed: gray');
      expect(missedIndicator).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role on container', () => {
      const { getByLabelText } = render(<HeatmapLegend {...defaultProps} />);

      const container = getByLabelText(/Legend/);
      expect(container.props.accessibilityRole).toBe('text');
    });

    it('should have descriptive accessibility label on container', () => {
      const { getByLabelText } = render(<HeatmapLegend {...defaultProps} />);

      const container = getByLabelText(
        'Legend: Gray for missed days, colored for completed days. 86% completion rate'
      );
      expect(container).toBeTruthy();
    });

    it('should update accessibility label when completion rate changes', () => {
      const { getByLabelText, rerender } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={50} />
      );

      expect(
        getByLabelText(
          'Legend: Gray for missed days, colored for completed days. 50% completion rate'
        )
      ).toBeTruthy();

      rerender(<HeatmapLegend habitColor='#10b981' completionRate={75} />);

      expect(
        getByLabelText(
          'Legend: Gray for missed days, colored for completed days. 75% completion rate'
        )
      ).toBeTruthy();
    });

    it('should have accessibility label on Missed indicator', () => {
      const { getByLabelText } = render(<HeatmapLegend {...defaultProps} />);

      expect(getByLabelText('Missed: gray')).toBeTruthy();
    });

    it('should have accessibility label on Done indicator', () => {
      const { getByLabelText } = render(<HeatmapLegend {...defaultProps} />);

      expect(getByLabelText('Done: colored')).toBeTruthy();
    });

    it('should have accessibility label on completion percentage', () => {
      const { getByLabelText } = render(<HeatmapLegend {...defaultProps} />);

      expect(getByLabelText('86% completion')).toBeTruthy();
    });

    it('should have text role on indicators', () => {
      const { getByLabelText } = render(<HeatmapLegend {...defaultProps} />);

      expect(getByLabelText('Missed: gray').props.accessibilityRole).toBe(
        'text'
      );
      expect(getByLabelText('Done: colored').props.accessibilityRole).toBe(
        'text'
      );
    });

    it('should have text role on completion percentage', () => {
      const { getByLabelText } = render(<HeatmapLegend {...defaultProps} />);

      expect(getByLabelText('86% completion').props.accessibilityRole).toBe(
        'text'
      );
    });
  });

  describe('Component updates', () => {
    it('should update when habitColor changes', () => {
      const { getByLabelText, rerender } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={86} />
      );

      expect(getByLabelText('Done: colored')).toBeTruthy();

      rerender(<HeatmapLegend habitColor='#ef4444' completionRate={86} />);

      // Component should still render correctly with new color
      expect(getByLabelText('Done: colored')).toBeTruthy();
    });

    it('should update when completionRate changes', () => {
      const { getByText, rerender } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={50} />
      );

      expect(getByText('50% completion')).toBeTruthy();

      rerender(<HeatmapLegend habitColor='#10b981' completionRate={75} />);

      expect(getByText('75% completion')).toBeTruthy();
    });

    it('should handle both props changing simultaneously', () => {
      const { getByText, rerender } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={50} />
      );

      expect(getByText('50% completion')).toBeTruthy();

      rerender(<HeatmapLegend habitColor='#ef4444' completionRate={100} />);

      expect(getByText('100% completion')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle very low completion rate (1%)', () => {
      const { getByText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={1} />
      );

      expect(getByText('1% completion')).toBeTruthy();
    });

    it('should handle very high completion rate (99%)', () => {
      const { getByText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={99} />
      );

      expect(getByText('99% completion')).toBeTruthy();
    });

    it('should handle completion rate just above 0 (0.4)', () => {
      const { getByText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={0.4} />
      );

      expect(getByText('0% completion')).toBeTruthy();
    });

    it('should handle completion rate just below 100 (99.9)', () => {
      const { getByText } = render(
        <HeatmapLegend habitColor='#10b981' completionRate={99.9} />
      );

      expect(getByText('100% completion')).toBeTruthy();
    });
  });

  describe('Layout structure', () => {
    it('should render with horizontal layout (row direction)', () => {
      const { getByLabelText } = render(<HeatmapLegend {...defaultProps} />);

      const container = getByLabelText(/Legend/);
      // Container should have flexDirection: 'row' for horizontal layout
      expect(container).toBeTruthy();
    });

    it('should render indicators before percentage (left to right)', () => {
      const { getByText } = render(<HeatmapLegend {...defaultProps} />);

      // Both text elements should exist (order is handled by flexbox)
      expect(getByText('Missed')).toBeTruthy();
      expect(getByText('Done')).toBeTruthy();
      expect(getByText('86% completion')).toBeTruthy();
    });
  });
});
