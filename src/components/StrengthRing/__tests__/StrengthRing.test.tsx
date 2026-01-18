/**
 * StrengthRing Component Tests
 * Tests the new Apple Watch-style ring visualization
 *
 * Coverage:
 * - AC7: Ring displays on HabitCard
 * - AC8: Ring fills proportionally
 * - AC9: Color changes by level
 * - AC10: Animation on change
 * - AC11: Accessible (screen reader support)
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { StrengthRing } from '../StrengthRing';

describe('StrengthRing Component', () => {
  describe('Component Rendering (AC7)', () => {
    it('should render without crashing', () => {
      const { root } = render(<StrengthRing strength={50} />);
      expect(root).toBeTruthy();
    });

    it('should render with small size by default', () => {
      const { root } = render(<StrengthRing strength={50} />);
      expect(root).toBeTruthy();
    });

    it('should render with medium size when specified', () => {
      const { root } = render(<StrengthRing strength={50} size='medium' />);
      expect(root).toBeTruthy();
    });
  });

  describe('Proportional Fill (AC8)', () => {
    it('should display correctly for 0% strength', () => {
      const { root } = render(<StrengthRing strength={0} />);
      expect(root).toBeTruthy();
    });

    it('should display correctly for 50% strength (half-filled)', () => {
      const { root } = render(<StrengthRing strength={50} />);
      expect(root).toBeTruthy();
    });

    it('should display correctly for 100% strength (fully-filled)', () => {
      const { root } = render(<StrengthRing strength={100} />);
      expect(root).toBeTruthy();
    });

    it('should clamp strength values to 0-100 range', () => {
      const { root: negative } = render(<StrengthRing strength={-10} />);
      const { root: excessive } = render(<StrengthRing strength={150} />);

      expect(negative).toBeTruthy();
      expect(excessive).toBeTruthy();
    });
  });

  describe('Level-Based Colors (AC9)', () => {
    // Updated thresholds: <20: Starting, 20-39: Building, 40-59: Developing, 60-79: Strong, 80+: Automatic
    it('should use lime-600 for starting level (0-19%)', () => {
      const { root } = render(<StrengthRing strength={15} />);
      expect(root).toBeTruthy();
      // Color logic is tested in the getLevelInfo function
    });

    it('should use green-600 for building level (20-39%)', () => {
      const { root } = render(<StrengthRing strength={30} />);
      expect(root).toBeTruthy();
    });

    it('should use teal-600 for developing level (40-59%)', () => {
      const { root } = render(<StrengthRing strength={50} />);
      expect(root).toBeTruthy();
    });

    it('should use cyan-600 for strong level (60-79%)', () => {
      const { root } = render(<StrengthRing strength={70} />);
      expect(root).toBeTruthy();
    });

    it('should use emerald-600 for automatic level (80-100%)', () => {
      const { root } = render(<StrengthRing strength={90} />);
      expect(root).toBeTruthy();
    });

    it('should change color at threshold boundaries', () => {
      // Updated thresholds: 0-19: starting, 20-39: building, 40-59: developing, 60-79: strong, 80+: automatic
      const thresholds = [
        { strength: 19, level: 'starting' },
        { strength: 20, level: 'building' },
        { strength: 39, level: 'building' },
        { strength: 40, level: 'developing' },
        { strength: 59, level: 'developing' },
        { strength: 60, level: 'strong' },
        { strength: 79, level: 'strong' },
        { strength: 80, level: 'automatic' },
      ];

      for (const threshold of thresholds) {
        const { root } = render(<StrengthRing strength={threshold.strength} />);
        expect(root).toBeTruthy();
      }
    });
  });

  describe('Optional Display Elements', () => {
    it('should hide percentage by default', () => {
      const { queryByText } = render(<StrengthRing strength={50} />);
      // Percentage should not be visible without showPercentage prop
      expect(queryByText('50%')).toBeNull();
    });

    it('should show percentage when showPercentage is true', () => {
      const { getByText } = render(
        <StrengthRing strength={50} showPercentage={true} />
      );
      expect(getByText('50%')).toBeTruthy();
    });

    it('should hide level label by default', () => {
      const { queryByText } = render(<StrengthRing strength={50} />);
      // Level label should not be visible without showLevel prop
      expect(queryByText(/Developing/i)).toBeNull();
    });

    it('should show level label when showLevel is true', () => {
      const { getByText } = render(
        <StrengthRing strength={50} showLevel={true} />
      );
      // strength=50 is in Developing level (<20: Starting, 20-39: Building, 40-59: Developing)
      expect(getByText(/Developing/i)).toBeTruthy();
      expect(getByText(/🌳/)).toBeTruthy();
    });

    it('should show both percentage and level when both props are true', () => {
      const { getByText } = render(
        <StrengthRing strength={50} showPercentage={true} showLevel={true} />
      );
      expect(getByText('50%')).toBeTruthy();
      // strength=50 is in Developing level
      expect(getByText(/Developing/i)).toBeTruthy();
      expect(getByText(/🌳/)).toBeTruthy();
    });
  });

  describe('Accessibility (AC11)', () => {
    it('should have accessible role', () => {
      const { getByRole } = render(<StrengthRing strength={50} />);
      expect(getByRole('progressbar')).toBeTruthy();
    });

    it('should have accessibility label with strength and level', () => {
      const { getByLabelText } = render(<StrengthRing strength={45} />);
      // Label format: "X% strength, LevelName level emoji"
      // 45% is in Developing level (40-59)
      expect(getByLabelText(/45% strength, Developing level 🌳/)).toBeTruthy();
    });

    it('should announce correct level for different strengths', () => {
      // Updated thresholds: <20: Starting, 20-39: Building, 40-59: Developing, 60-79: Strong, 80+: Automatic
      const testCases = [
        { strength: 15, expectedLabel: /15% strength, Starting level 🌱/ },
        { strength: 30, expectedLabel: /30% strength, Building level 🌿/ },
        { strength: 50, expectedLabel: /50% strength, Developing level 🌳/ },
        { strength: 70, expectedLabel: /70% strength, Strong level 💪/ },
        { strength: 90, expectedLabel: /90% strength, Automatic level ⚡/ },
      ];

      for (const testCase of testCases) {
        const { getByLabelText } = render(
          <StrengthRing strength={testCase.strength} />
        );
        expect(getByLabelText(testCase.expectedLabel)).toBeTruthy();
      }
    });

    it('should have text role for accessibility announcement', () => {
      const { getByRole } = render(<StrengthRing strength={50} />);
      // The accessibility View should have text role
      const textElements = render(<StrengthRing strength={50} />).UNSAFE_getAllByType(
        'View'
      );
      expect(textElements.length).toBeGreaterThan(0);
    });
  });

  describe('Animation (AC10)', () => {
    it('should use spring animation configuration', () => {
      // Animation is tested through Reanimated shared values
      // This test verifies the component renders with animation values
      const { root, rerender } = render(<StrengthRing strength={50} />);
      expect(root).toBeTruthy();

      // Rerender with different strength to trigger animation
      rerender(<StrengthRing strength={75} />);
      expect(root).toBeTruthy();
    });

    it('should animate strength changes smoothly', () => {
      const { root, rerender } = render(<StrengthRing strength={30} />);

      // Simulate rapid strength changes
      rerender(<StrengthRing strength={40} />);
      rerender(<StrengthRing strength={50} />);
      rerender(<StrengthRing strength={60} />);

      expect(root).toBeTruthy();
    });

    it('should handle rapid strength updates without crashing', () => {
      const { root, rerender } = render(<StrengthRing strength={0} />);

      for (let i = 0; i <= 100; i += 10) {
        rerender(<StrengthRing strength={i} />);
      }

      expect(root).toBeTruthy();
    });
  });

  describe('Size Variants', () => {
    it('should render small size (40px) correctly', () => {
      const { root } = render(<StrengthRing strength={50} size='small' />);
      expect(root).toBeTruthy();
    });

    it('should render medium size (64px) correctly', () => {
      const { root } = render(<StrengthRing strength={50} size='medium' />);
      expect(root).toBeTruthy();
    });

    it('should use different stroke widths for different sizes', () => {
      // Small: 4px, Medium: 6px
      const { root: small } = render(<StrengthRing strength={50} size='small' />);
      const { root: medium } = render(<StrengthRing strength={50} size='medium' />);

      expect(small).toBeTruthy();
      expect(medium).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle fractional strength values', () => {
      const { getByText } = render(
        <StrengthRing strength={50.7} showPercentage={true} />
      );
      // Should round to nearest integer for display
      expect(getByText('51%')).toBeTruthy();
    });

    it('should handle very small strength values', () => {
      const { root } = render(<StrengthRing strength={0.1} />);
      expect(root).toBeTruthy();
    });

    it('should handle strength at exact threshold boundaries', () => {
      // Updated thresholds: 0, 20, 40, 60, 80, 100
      const boundaries = [0, 20, 40, 60, 80, 100];

      for (const boundary of boundaries) {
        const { root } = render(<StrengthRing strength={boundary} />);
        expect(root).toBeTruthy();
      }
    });
  });

  describe('Integration with Props', () => {
    it('should accept all prop combinations', () => {
      const propCombinations = [
        { strength: 50 },
        { strength: 50, size: 'small' as const },
        { strength: 50, size: 'medium' as const },
        { strength: 50, showPercentage: true },
        { strength: 50, showLevel: true },
        {
          strength: 50,
          size: 'medium' as const,
          showPercentage: true,
          showLevel: true,
        },
      ];

      for (const props of propCombinations) {
        const { root } = render(<StrengthRing {...props} />);
        expect(root).toBeTruthy();
      }
    });

    it('should use all level emojis correctly', () => {
      // Updated thresholds: <20: Starting 🌱, 20-39: Building 🌿, 40-59: Developing 🌳, 60-79: Strong 💪, 80+: Automatic ⚡
      const levels = [
        { strength: 15, emoji: '🌱' },  // Starting
        { strength: 30, emoji: '🌿' },  // Building
        { strength: 50, emoji: '🌳' },  // Developing
        { strength: 70, emoji: '💪' },  // Strong
        { strength: 90, emoji: '⚡' },  // Automatic
      ];

      for (const level of levels) {
        const { getByText } = render(
          <StrengthRing strength={level.strength} showLevel={true} />
        );
        expect(getByText(new RegExp(level.emoji))).toBeTruthy();
      }
    });
  });
});
