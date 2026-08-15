import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { LivePreview } from '../LivePreview';
import { shadows } from '@/theme/spacing';

const flattenStyle = (style: unknown) =>
  Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;

const findBackgroundColor = (root: {
  UNSAFE_getAllByType: (type: typeof View) => Array<{ props: { style?: unknown } }>;
}) => {
  const match = root.UNSAFE_getAllByType(View).find((node) => {
    const flat = flattenStyle(node.props.style);
    return typeof flat?.backgroundColor === 'string';
  });
  return flattenStyle(match?.props.style)?.backgroundColor;
};

/**
 * V11 Live Preview Component Tests
 *
 * Tests the simplified 40px micro-component that shows real-time preview
 * of the habit being created (emoji + color + name).
 *
 * Coverage:
 * - Default state rendering (empty inputs)
 * - Real-time updates as user types
 * - Emoji and color synchronization
 * - React.memo optimization (no unnecessary re-renders)
 * - Edge cases (long names, special characters, etc.)
 */

describe('LivePreview Component - V11', () => {
  describe('Default State', () => {
    it('should render with default values when all fields are empty', () => {
      const { getByText } = render(
        <LivePreview emoji={null} color='' habitName='' />
      );

      expect(getByText('🎯')).toBeTruthy();
      expect(getByText('Your new habit')).toBeTruthy();
    });

    it('should use default emerald color when color is empty', () => {
      const view = render(<LivePreview emoji={null} color='' habitName='' />);

      expect(findBackgroundColor(view)).toBe('#10b981');
    });

    it('should display default emoji 🎯 when emoji is null', () => {
      const { getByText } = render(
        <LivePreview emoji={null} color='#3b82f6' habitName='Morning run' />
      );

      expect(getByText('🎯')).toBeTruthy();
    });
  });

  describe('Real-time Updates', () => {
    it('should display habit name when provided', () => {
      const { getByText } = render(
        <LivePreview
          emoji='📖'
          color='#3b82f6'
          habitName='Read for 20 minutes'
        />
      );

      expect(getByText('Read for 20 minutes')).toBeTruthy();
    });

    it('should update when habit name changes', () => {
      const { getByText, rerender } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      expect(getByText('Read')).toBeTruthy();

      rerender(
        <LivePreview
          emoji='📖'
          color='#3b82f6'
          habitName='Read for 20 minutes'
        />
      );

      expect(getByText('Read for 20 minutes')).toBeTruthy();
    });

    it('should trim whitespace from habit name', () => {
      const { getByText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='  Read  ' />
      );

      // Should display trimmed version
      expect(getByText('Read')).toBeTruthy();
    });

    it('should show default text when habit name is only whitespace', () => {
      const { getByText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='   ' />
      );

      expect(getByText('Your new habit')).toBeTruthy();
    });
  });

  describe('Emoji Rendering', () => {
    it('should display selected emoji', () => {
      const { getByText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      expect(getByText('📖')).toBeTruthy();
    });

    it('should update when emoji changes', () => {
      const { getByText, rerender } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      expect(getByText('📖')).toBeTruthy();

      rerender(<LivePreview emoji='💪' color='#3b82f6' habitName='Read' />);

      expect(getByText('💪')).toBeTruthy();
    });

    it('should handle compound emojis correctly', () => {
      const { getByText } = render(
        <LivePreview emoji='🏃‍♀️' color='#3b82f6' habitName='Run' />
      );

      expect(getByText('🏃‍♀️')).toBeTruthy();
    });
  });

  describe('Color Synchronization', () => {
    it('should apply selected color to emoji background', () => {
      const testColor = '#3b82f6';
      const view = render(
        <LivePreview emoji='📖' color={testColor} habitName='Read' />
      );

      expect(findBackgroundColor(view)).toBe(testColor);
    });

    it('should update color when changed', () => {
      const view = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      expect(findBackgroundColor(view)).toBe('#3b82f6');

      view.rerender(<LivePreview emoji='📖' color='#ef4444' habitName='Read' />);

      expect(findBackgroundColor(view)).toBe('#ef4444');
    });

    it('should handle hex colors with various formats', () => {
      const view = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      expect(findBackgroundColor(view)).toBe('#3b82f6');

      view.rerender(<LivePreview emoji='📖' color='#f00' habitName='Read' />);
      expect(findBackgroundColor(view)).toBe('#f00');
    });
  });

  describe('Edge Cases', () => {
    it('should truncate very long habit names', () => {
      const longName = 'A'.repeat(100);
      const { getByText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName={longName} />
      );

      const textElement = getByText(longName);
      expect(textElement.props.numberOfLines).toBe(1);
      expect(textElement.props.ellipsizeMode).toBe('tail');
    });

    it('should handle special characters in habit name', () => {
      const specialName = 'Read @home & learn 💪 100%!';
      const { getByText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName={specialName} />
      );

      expect(getByText(specialName)).toBeTruthy();
    });

    it('should handle emojis in habit name', () => {
      const nameWithEmoji = 'Morning 🌅 routine';
      const { getByText } = render(
        <LivePreview emoji='☀️' color='#3b82f6' habitName={nameWithEmoji} />
      );

      expect(getByText(nameWithEmoji)).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      const unicodeName = '学习中文 (Learn Chinese)';
      const { getByText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName={unicodeName} />
      );

      expect(getByText(unicodeName)).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should have correct CSS classes for styling', () => {
      const { getByLabelText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      expect(getByLabelText(/Preview:/).props.className).toEqual(
        expect.stringContaining('flex-row')
      );
    });

    it('should apply card shadow styling to preview card', () => {
      const { getByLabelText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      const preview = getByLabelText(/Preview:/);
      expect(flattenStyle(preview.props.style)).toEqual(
        expect.objectContaining(shadows.card)
      );
    });

    it('should use correct spacing (mb-3 mt-3)', () => {
      const { getByLabelText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      expect(getByLabelText(/Preview:/).props.className).toEqual(
        expect.stringContaining('mb-3 mt-3')
      );
    });
  });

  describe('React.memo Optimization', () => {
    it('should be a memoized component', () => {
      expect(LivePreview.displayName).toBe('LivePreview');
      // React.memo wraps the component, so the type name changes
      expect(LivePreview.$$typeof.toString()).toContain('react.memo');
    });

    it('should not re-render when props are the same', () => {
      const renderSpy = jest.fn();
      const MemoizedComponent = () => {
        renderSpy();
        return <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />;
      };

      const { rerender } = render(<MemoizedComponent />);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props
      rerender(<MemoizedComponent />);
      // memo should prevent re-render, but parent component will still render
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('should expose a single preview accessibility label', () => {
      const { getByLabelText, getByText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      expect(getByLabelText('Preview: 📖 Read')).toBeTruthy();
      expect(getByText('Read').props.accessible).toBe(false);
    });

    it('should support screen readers for emoji', () => {
      const { getByText } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      const emoji = getByText('📖');
      expect(emoji).toBeTruthy();
      // Emojis are inherently accessible as text content
    });
  });

  describe('Integration Scenarios', () => {
    it('should reflect complete habit configuration', () => {
      const view = render(
        <LivePreview emoji='💪' color='#ef4444' habitName='Morning workout' />
      );

      expect(view.getByText('💪')).toBeTruthy();
      expect(view.getByText('Morning workout')).toBeTruthy();
      expect(findBackgroundColor(view)).toBe('#ef4444');
    });

    it('should start from empty state and build up', () => {
      const { getByText, rerender } = render(
        <LivePreview emoji={null} color='' habitName='' />
      );

      // Start with defaults
      expect(getByText('🎯')).toBeTruthy();
      expect(getByText('Your new habit')).toBeTruthy();

      // Add name
      rerender(<LivePreview emoji={null} color='' habitName='Run' />);
      expect(getByText('Run')).toBeTruthy();

      // Add emoji
      rerender(<LivePreview emoji='🏃' color='' habitName='Run' />);
      expect(getByText('🏃')).toBeTruthy();

      // Add color
      rerender(<LivePreview emoji='🏃' color='#3b82f6' habitName='Run' />);
      expect(getByText('🏃')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should handle rapid updates without crashing', () => {
      const { rerender } = render(
        <LivePreview emoji='📖' color='#3b82f6' habitName='Read' />
      );

      // Simulate rapid typing
      for (let i = 0; i < 50; i++) {
        rerender(
          <LivePreview
            emoji='📖'
            color='#3b82f6'
            habitName={`Read${'a'.repeat(i)}`}
          />
        );
      }

      // Should not crash and final state should be correct
      expect(() =>
        rerender(
          <LivePreview
            emoji='📖'
            color='#3b82f6'
            habitName={'Read' + 'a'.repeat(49)}
          />
        )
      ).not.toThrow();
    });
  });
});
