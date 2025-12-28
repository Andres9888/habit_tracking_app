/**
 * ThemePickerSheet Component Tests
 *
 * Tests for the grid theme picker modal including:
 * - Rendering and visibility
 * - Theme selection behavior
 * - Accessibility features
 * - Haptic feedback
 * - Animation behavior with reduce motion
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { ThemePickerSheet } from '../ThemePickerSheet';
import { GRID_THEMES, type GridThemeName } from '../types';

// Mock haptics
jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerSelection: jest.fn(),
    triggerLightImpact: jest.fn(),
  }),
}));

// Mock reduce motion hook
let mockReduceMotion = false;
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => mockReduceMotion,
}));

// Mock AccessibilityInfo
jest.spyOn(AccessibilityInfo, 'announceForAccessibility');

// Mock reanimated for tests
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.FadeIn = {
    duration: () => ({
      springify: () => ({}),
    }),
  };
  Reanimated.FadeInDown = {
    delay: () => ({
      springify: () => ({}),
    }),
  };
  return Reanimated;
});

describe('ThemePickerSheet', () => {
  const mockOnSelectTheme = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    visible: true,
    selectedTheme: 'github' as GridThemeName,
    onSelectTheme: mockOnSelectTheme,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion = false;
  });

  describe('Rendering', () => {
    it('should render null when not visible', () => {
      const { queryByText } = render(
        <ThemePickerSheet {...defaultProps} visible={false} />
      );

      expect(queryByText('Choose Theme')).toBeNull();
    });

    it('should render modal when visible', () => {
      const { getByText } = render(<ThemePickerSheet {...defaultProps} />);

      expect(getByText('Choose Theme')).toBeTruthy();
    });

    it('should render all available themes', () => {
      const { getByText } = render(<ThemePickerSheet {...defaultProps} />);

      // Check all theme names are rendered
      Object.values(GRID_THEMES).forEach((theme) => {
        expect(getByText(theme.name)).toBeTruthy();
      });
    });

    it('should render theme descriptions', () => {
      const { getByText } = render(<ThemePickerSheet {...defaultProps} />);

      // Check theme descriptions
      Object.values(GRID_THEMES).forEach((theme) => {
        expect(getByText(theme.description)).toBeTruthy();
      });
    });

    it('should render footer hint text', () => {
      const { getByText } = render(<ThemePickerSheet {...defaultProps} />);

      expect(
        getByText('Theme is applied instantly to your calendar')
      ).toBeTruthy();
    });

    it('should show selected indicator on current theme', () => {
      const { getByRole } = render(
        <ThemePickerSheet {...defaultProps} selectedTheme='tiles' />
      );

      // Find the Tiles theme option
      const tilesOption = getByRole('radio', {
        name: /Tiles theme/i,
      });

      // Check it has selected state
      expect(tilesOption.props.accessibilityState.selected).toBe(true);
    });

    it('should render close button', () => {
      const { getByLabelText } = render(<ThemePickerSheet {...defaultProps} />);

      expect(getByLabelText('Close theme picker')).toBeTruthy();
    });
  });

  describe('Theme Selection', () => {
    it('should call onSelectTheme when a different theme is selected', () => {
      const { getByRole } = render(<ThemePickerSheet {...defaultProps} />);

      // Select the Tiles theme
      const tilesOption = getByRole('radio', { name: /Tiles theme/i });
      fireEvent.press(tilesOption);

      expect(mockOnSelectTheme).toHaveBeenCalledWith('tiles');
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close without calling onSelectTheme when current theme is tapped', () => {
      const { getByRole } = render(
        <ThemePickerSheet {...defaultProps} selectedTheme='github' />
      );

      // Tap the already selected GitHub theme
      const githubOption = getByRole('radio', { name: /GitHub theme/i });
      fireEvent.press(githubOption);

      expect(mockOnSelectTheme).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should announce theme selection for accessibility', async () => {
      const { getByRole } = render(<ThemePickerSheet {...defaultProps} />);

      // Select the Dots theme
      const dotsOption = getByRole('radio', { name: /Dots theme/i });
      fireEvent.press(dotsOption);

      await waitFor(() => {
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
          'Dots theme selected'
        );
      });
    });

    it('should allow selecting Pixels theme', () => {
      const { getByRole } = render(<ThemePickerSheet {...defaultProps} />);

      const pixelsOption = getByRole('radio', { name: /Pixels theme/i });
      fireEvent.press(pixelsOption);

      expect(mockOnSelectTheme).toHaveBeenCalledWith('pixels');
    });
  });

  describe('Close Behavior', () => {
    it('should call onClose when close button is pressed', () => {
      const { getByLabelText } = render(<ThemePickerSheet {...defaultProps} />);

      const closeButton = getByLabelText('Close theme picker');
      fireEvent.press(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close modal after theme selection', () => {
      const { getByRole } = render(<ThemePickerSheet {...defaultProps} />);

      const tilesOption = getByRole('radio', { name: /Tiles theme/i });
      fireEvent.press(tilesOption);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible modal', () => {
      const { getByLabelText } = render(<ThemePickerSheet {...defaultProps} />);

      // Modal should be accessible
      expect(getByLabelText('Theme picker')).toBeTruthy();
    });

    it('should have header with accessibility role', () => {
      const { getByRole } = render(<ThemePickerSheet {...defaultProps} />);

      expect(getByRole('header')).toBeTruthy();
    });

    it('should have radiogroup for theme options', () => {
      const { getByLabelText } = render(<ThemePickerSheet {...defaultProps} />);

      // React Native Testing Library doesn't fully support radiogroup role query,
      // but the element exists with proper accessibility props
      const radioGroup = getByLabelText('Theme options');
      expect(radioGroup).toBeTruthy();
      expect(radioGroup.props.accessibilityRole).toBe('radiogroup');
    });

    it('should have radio role for each theme option', () => {
      const { getAllByRole } = render(<ThemePickerSheet {...defaultProps} />);

      const radioOptions = getAllByRole('radio');
      expect(radioOptions.length).toBe(Object.keys(GRID_THEMES).length);
    });

    it('should have correct accessibility labels for themes', () => {
      const { getByRole } = render(<ThemePickerSheet {...defaultProps} />);

      const githubOption = getByRole('radio', { name: /GitHub theme/i });
      expect(githubOption.props.accessibilityLabel).toContain(
        GRID_THEMES.github.description
      );
    });

    it('should have accessibility hint for unselected themes', () => {
      const { getByRole } = render(
        <ThemePickerSheet {...defaultProps} selectedTheme='github' />
      );

      const tilesOption = getByRole('radio', { name: /Tiles theme/i });
      expect(tilesOption.props.accessibilityHint).toContain(
        'Double tap to select'
      );
    });

    it('should have accessibility hint for selected theme', () => {
      const { getByRole } = render(
        <ThemePickerSheet {...defaultProps} selectedTheme='github' />
      );

      const githubOption = getByRole('radio', { name: /GitHub theme/i });
      expect(githubOption.props.accessibilityHint).toContain(
        'Currently selected'
      );
    });

    it('should have close button with accessibility hint', () => {
      const { getByLabelText } = render(<ThemePickerSheet {...defaultProps} />);

      const closeButton = getByLabelText('Close theme picker');
      expect(closeButton.props.accessibilityHint).toBe(
        'Closes the theme selection modal'
      );
    });
  });

  describe('Theme Preview Grid', () => {
    it('should render preview grids for all themes', () => {
      const { getAllByRole } = render(<ThemePickerSheet {...defaultProps} />);

      // Each theme should have a preview grid (hidden from accessibility)
      const radioOptions = getAllByRole('radio');
      expect(radioOptions.length).toBe(4); // GitHub, Tiles, Dots, Pixels
    });
  });

  describe('Reduce Motion', () => {
    it('should respect reduce motion for animations', () => {
      mockReduceMotion = true;

      const { getByText } = render(<ThemePickerSheet {...defaultProps} />);

      // Component should still render without animations
      expect(getByText('Choose Theme')).toBeTruthy();
    });
  });

  describe('Theme Order', () => {
    it('should display GitHub theme first', () => {
      const { getAllByRole } = render(<ThemePickerSheet {...defaultProps} />);

      const radioOptions = getAllByRole('radio');

      // First option should be GitHub
      expect(radioOptions[0].props.accessibilityLabel).toContain('GitHub');
    });
  });

  describe('Selected Theme States', () => {
    it('should show github as selected when selectedTheme is github', () => {
      const { getByRole } = render(
        <ThemePickerSheet {...defaultProps} selectedTheme='github' />
      );

      const githubOption = getByRole('radio', { name: /GitHub theme/i });
      expect(githubOption.props.accessibilityState.selected).toBe(true);

      const tilesOption = getByRole('radio', { name: /Tiles theme/i });
      expect(tilesOption.props.accessibilityState.selected).toBe(false);
    });

    it('should show dots as selected when selectedTheme is dots', () => {
      const { getByRole } = render(
        <ThemePickerSheet {...defaultProps} selectedTheme='dots' />
      );

      const dotsOption = getByRole('radio', { name: /Dots theme/i });
      expect(dotsOption.props.accessibilityState.selected).toBe(true);

      const githubOption = getByRole('radio', { name: /GitHub theme/i });
      expect(githubOption.props.accessibilityState.selected).toBe(false);
    });

    it('should show pixels as selected when selectedTheme is pixels', () => {
      const { getByRole } = render(
        <ThemePickerSheet {...defaultProps} selectedTheme='pixels' />
      );

      const pixelsOption = getByRole('radio', { name: /Pixels theme/i });
      expect(pixelsOption.props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid theme selection', () => {
      const { getByRole } = render(<ThemePickerSheet {...defaultProps} />);

      // Rapidly select multiple themes
      const tilesOption = getByRole('radio', { name: /Tiles theme/i });
      const dotsOption = getByRole('radio', { name: /Dots theme/i });

      fireEvent.press(tilesOption);
      fireEvent.press(dotsOption);

      // First selection should have triggered callback
      expect(mockOnSelectTheme).toHaveBeenCalledWith('tiles');
    });

    it('should handle modal open/close transitions', () => {
      const { rerender, queryByText, getByText } = render(
        <ThemePickerSheet {...defaultProps} visible={false} />
      );

      expect(queryByText('Choose Theme')).toBeNull();

      rerender(<ThemePickerSheet {...defaultProps} visible={true} />);

      expect(getByText('Choose Theme')).toBeTruthy();

      rerender(<ThemePickerSheet {...defaultProps} visible={false} />);

      expect(queryByText('Choose Theme')).toBeNull();
    });

    it('should preserve selected theme after rerender', () => {
      const { rerender, getByRole } = render(
        <ThemePickerSheet {...defaultProps} selectedTheme='tiles' />
      );

      let tilesOption = getByRole('radio', { name: /Tiles theme/i });
      expect(tilesOption.props.accessibilityState.selected).toBe(true);

      // Rerender with same selected theme
      rerender(<ThemePickerSheet {...defaultProps} selectedTheme='tiles' />);

      tilesOption = getByRole('radio', { name: /Tiles theme/i });
      expect(tilesOption.props.accessibilityState.selected).toBe(true);
    });

    it('should update selected theme when prop changes', () => {
      const { rerender, getByRole } = render(
        <ThemePickerSheet {...defaultProps} selectedTheme='github' />
      );

      let githubOption = getByRole('radio', { name: /GitHub theme/i });
      expect(githubOption.props.accessibilityState.selected).toBe(true);

      // Change selected theme prop
      rerender(<ThemePickerSheet {...defaultProps} selectedTheme='pixels' />);

      githubOption = getByRole('radio', { name: /GitHub theme/i });
      expect(githubOption.props.accessibilityState.selected).toBe(false);

      const pixelsOption = getByRole('radio', { name: /Pixels theme/i });
      expect(pixelsOption.props.accessibilityState.selected).toBe(true);
    });
  });
});
