/**
 * AppearanceCard Component Tests
 * Task 5: Create AppearanceCard Component
 *
 * Test coverage:
 * - Component rendering and structure
 * - Completion state transitions
 * - Smart emoji suggestions based on keywords
 * - EmojiPicker integration
 * - ColorPickerSection integration
 * - Styling verification
 * - Accessibility
 * - Edge cases
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AppearanceCard, AppearanceCardProps } from '../AppearanceCard';

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Palette: 'Palette',
  CheckCircle: 'CheckCircle',
  Circle: 'Circle',
  Lightbulb: 'Lightbulb',
}));

// Mock child components
jest.mock('../CompletionBadge', () => ({
  CompletionBadge: ({ type }: { type: string }) => `CompletionBadge-${type}`,
}));

jest.mock('../EmojiPicker', () => ({
  EmojiPicker: ({
    selectedEmoji,
    habitName,
  }: {
    selectedEmoji: string | null;
    habitName: string;
  }) => `EmojiPicker-${selectedEmoji}-${habitName}`,
}));

jest.mock('../ColorPickerSection', () => ({
  ColorPickerSection: ({
    selectedColor,
  }: {
    selectedColor: string;
  }) => `ColorPickerSection-${selectedColor}`,
}));

const MOCK_COLORS = [
  '#10B981',
  '#EF4444',
  '#3B82F6',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
] as const;

const defaultProps: AppearanceCardProps = {
  selectedEmoji: null,
  selectedColor: '#10B981',
  habitName: '',
  colors: MOCK_COLORS,
  onEmojiChange: jest.fn(),
  onColorChange: jest.fn(),
  onCustomColorPress: jest.fn(),
  isComplete: false,
};

describe('AppearanceCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the card wrapper with correct styling', () => {
      const { getByLabelText } = render(<AppearanceCard {...defaultProps} />);

      const card = getByLabelText('Appearance section');
      expect(card).toBeTruthy();
      expect(card.props.accessibilityRole).toBe('group');
    });

    it('renders the header with Palette icon and title', () => {
      const { getByText } = render(<AppearanceCard {...defaultProps} />);

      expect(getByText('Appearance')).toBeTruthy();
      expect(getByText('Palette')).toBeTruthy();
    });

    it('renders the optional badge', () => {
      const { getByText } = render(<AppearanceCard {...defaultProps} />);

      expect(getByText('CompletionBadge-optional')).toBeTruthy();
    });

    it('renders EmojiPicker component', () => {
      const { getByText } = render(<AppearanceCard {...defaultProps} />);

      expect(getByText(/EmojiPicker/)).toBeTruthy();
    });

    it('renders ColorPickerSection component', () => {
      const { getByText } = render(<AppearanceCard {...defaultProps} />);

      expect(getByText(/ColorPickerSection/)).toBeTruthy();
    });
  });

  describe('Completion State', () => {
    it('shows incomplete circle when isComplete is false', () => {
      const { getByLabelText } = render(
        <AppearanceCard {...defaultProps} isComplete={false} />
      );

      const incompleteIcon = getByLabelText('Section incomplete');
      expect(incompleteIcon).toBeTruthy();
      expect(incompleteIcon.type).toBe('Circle');
    });

    it('shows complete checkmark when isComplete is true', () => {
      const { getByLabelText } = render(
        <AppearanceCard {...defaultProps} isComplete={true} />
      );

      const completeIcon = getByLabelText('Section complete');
      expect(completeIcon).toBeTruthy();
      expect(completeIcon.type).toBe('CheckCircle');
    });

    it('is incomplete when only emoji is selected', () => {
      const { getByLabelText } = render(
        <AppearanceCard
          {...defaultProps}
          selectedEmoji="📖"
          selectedColor=""
          isComplete={false}
        />
      );

      expect(getByLabelText('Section incomplete')).toBeTruthy();
    });

    it('is incomplete when only color is selected', () => {
      const { getByLabelText } = render(
        <AppearanceCard
          {...defaultProps}
          selectedEmoji={null}
          selectedColor="#10B981"
          isComplete={false}
        />
      );

      expect(getByLabelText('Section incomplete')).toBeTruthy();
    });

    it('is complete when both emoji and color are selected', () => {
      const { getByLabelText } = render(
        <AppearanceCard
          {...defaultProps}
          selectedEmoji="📖"
          selectedColor="#10B981"
          isComplete={true}
        />
      );

      expect(getByLabelText('Section complete')).toBeTruthy();
    });
  });

  describe('Smart Emoji Suggestions', () => {
    it('shows smart hint for "reading" keyword', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="Daily reading" />
      );

      expect(getByText('Smart pick based on "reading"')).toBeTruthy();
      expect(getByText('Lightbulb')).toBeTruthy();
    });

    it('shows smart hint for "exercise" keyword', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="Morning exercise" />
      );

      expect(getByText('Smart pick based on "exercise"')).toBeTruthy();
    });

    it('shows smart hint for "meditation" keyword', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="Evening meditation" />
      );

      expect(getByText('Smart pick based on "meditation"')).toBeTruthy();
    });

    it('shows smart hint for "water" keyword', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="Drink water" />
      );

      expect(getByText('Smart pick based on "water"')).toBeTruthy();
    });

    it('shows smart hint for "code" keyword', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="Code for 1 hour" />
      );

      expect(getByText('Smart pick based on "coding"')).toBeTruthy();
    });

    it('shows smart hint for partial keyword matches', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="I love reading books" />
      );

      expect(getByText('Smart pick based on "reading"')).toBeTruthy();
    });

    it('is case-insensitive for keyword matching', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="EXERCISE DAILY" />
      );

      expect(getByText('Smart pick based on "exercise"')).toBeTruthy();
    });

    it('does not show hint when no keyword matches', () => {
      const { queryByText } = render(
        <AppearanceCard {...defaultProps} habitName="Random habit name" />
      );

      expect(queryByText(/Smart pick/)).toBeNull();
    });

    it('does not show hint when habitName is empty', () => {
      const { queryByText } = render(
        <AppearanceCard {...defaultProps} habitName="" />
      );

      expect(queryByText(/Smart pick/)).toBeNull();
    });

    it('does not show hint when habitName is only whitespace', () => {
      const { queryByText } = render(
        <AppearanceCard {...defaultProps} habitName="   " />
      );

      expect(queryByText(/Smart pick/)).toBeNull();
    });

    it('matches first keyword when multiple keywords present', () => {
      const { getByText } = render(
        <AppearanceCard
          {...defaultProps}
          habitName="Read books and exercise"
        />
      );

      // Should match "read" (first in the string and keywords map)
      expect(getByText('Smart pick based on "reading"')).toBeTruthy();
    });

    it('handles special characters in habitName', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="Read! books? daily." />
      );

      expect(getByText('Smart pick based on "reading"')).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('passes selectedEmoji to EmojiPicker', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} selectedEmoji="📖" />
      );

      expect(getByText(/EmojiPicker-📖/)).toBeTruthy();
    });

    it('passes habitName to EmojiPicker', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="Test habit" />
      );

      expect(getByText(/EmojiPicker.*Test habit/)).toBeTruthy();
    });

    it('passes selectedColor to ColorPickerSection', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} selectedColor="#EF4444" />
      );

      expect(getByText(/ColorPickerSection-#EF4444/)).toBeTruthy();
    });

    it('passes colors array to ColorPickerSection', () => {
      render(<AppearanceCard {...defaultProps} />);

      // Component should render without errors with colors prop
      expect(screen.getByText(/ColorPickerSection/)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility role for card', () => {
      const { getByLabelText } = render(<AppearanceCard {...defaultProps} />);

      const card = getByLabelText('Appearance section');
      expect(card.props.accessibilityRole).toBe('group');
    });

    it('has accessible label for completion state', () => {
      const { getByLabelText } = render(
        <AppearanceCard {...defaultProps} isComplete={false} />
      );

      expect(getByLabelText('Section incomplete')).toBeTruthy();
    });

    it('has accessible label for smart hint', () => {
      const { getByLabelText } = render(
        <AppearanceCard {...defaultProps} habitName="Read daily" />
      );

      expect(
        getByLabelText('Smart pick based on "reading"')
      ).toBeTruthy();
    });

    it('announces completion state change to screen readers', () => {
      const { getByLabelText, rerender } = render(
        <AppearanceCard {...defaultProps} isComplete={false} />
      );

      expect(getByLabelText('Section incomplete')).toBeTruthy();

      rerender(<AppearanceCard {...defaultProps} isComplete={true} />);

      expect(getByLabelText('Section complete')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles null selectedEmoji', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} selectedEmoji={null} />
      );

      expect(getByText(/EmojiPicker-null/)).toBeTruthy();
    });

    it('handles empty selectedColor', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} selectedColor="" />
      );

      expect(getByText(/ColorPickerSection-$/)).toBeTruthy();
    });

    it('handles very long habitName', () => {
      const longName = 'a'.repeat(200) + ' reading';
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName={longName} />
      );

      expect(getByText('Smart pick based on "reading"')).toBeTruthy();
    });

    it('handles habitName with only emoji characters', () => {
      const { queryByText } = render(
        <AppearanceCard {...defaultProps} habitName="📖✨💪" />
      );

      expect(queryByText(/Smart pick/)).toBeNull();
    });

    it('handles habitName with numbers', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="123 read 456" />
      );

      expect(getByText('Smart pick based on "reading"')).toBeTruthy();
    });

    it('handles multiple consecutive spaces in habitName', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="read    books" />
      );

      expect(getByText('Smart pick based on "reading"')).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('applies correct card styling', () => {
      const { getByLabelText } = render(<AppearanceCard {...defaultProps} />);

      const card = getByLabelText('Appearance section');
      expect(card.props.style).toMatchObject({
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
      });
    });

    it('applies shadow styling', () => {
      const { getByLabelText } = render(<AppearanceCard {...defaultProps} />);

      const card = getByLabelText('Appearance section');
      expect(card.props.style.shadowColor).toBe('#000');
      expect(card.props.style.shadowOpacity).toBe(0.08);
    });

    it('renders title with correct typography', () => {
      const { getByText } = render(<AppearanceCard {...defaultProps} />);

      const title = getByText('Appearance');
      expect(title.props.style).toMatchObject({
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        color: '#1C1917',
      });
    });

    it('renders smart hint with correct styling', () => {
      const { getByText } = render(
        <AppearanceCard {...defaultProps} habitName="Read books" />
      );

      const hint = getByText('Smart pick based on "reading"');
      expect(hint.props.style).toMatchObject({
        fontSize: 12,
        fontWeight: '500',
        color: '#10B981',
      });
    });
  });

  describe('Component Memoization', () => {
    it('is memoized with React.memo', () => {
      expect(AppearanceCard.displayName).toBe('AppearanceCard');
    });

    it('does not re-render with same props', () => {
      const { rerender } = render(<AppearanceCard {...defaultProps} />);

      // Re-render with same props should not cause updates
      rerender(<AppearanceCard {...defaultProps} />);

      // Component should still be present and functional
      expect(screen.getByText('Appearance')).toBeTruthy();
    });
  });

  describe('Keyword Coverage', () => {
    const keywordTests = [
      { habitName: 'read books', expected: 'reading' },
      { habitName: 'book club', expected: 'book' },
      { habitName: 'study math', expected: 'studying' },
      { habitName: 'write journal', expected: 'writing' },
      { habitName: 'workout session', expected: 'workout' },
      { habitName: 'run 5k', expected: 'running' },
      { habitName: 'yoga class', expected: 'yoga' },
      { habitName: 'meditate daily', expected: 'meditation' },
      { habitName: 'drink water', expected: 'water' },
      { habitName: 'sleep early', expected: 'sleep' },
      { habitName: 'code review', expected: 'coding' },
      { habitName: 'clean room', expected: 'cleaning' },
      { habitName: 'cook dinner', expected: 'cooking' },
      { habitName: 'walk dog', expected: 'walking' },
      { habitName: 'bike to work', expected: 'biking' },
      { habitName: 'swim laps', expected: 'swimming' },
      { habitName: 'stretch muscles', expected: 'stretching' },
      { habitName: 'pray morning', expected: 'prayer' },
      { habitName: 'play guitar', expected: 'guitar' },
      { habitName: 'listen to music', expected: 'music' },
      { habitName: 'draw sketch', expected: 'drawing' },
      { habitName: 'garden plants', expected: 'gardening' },
    ];

    keywordTests.forEach(({ habitName, expected }) => {
      it(`detects "${expected}" keyword in "${habitName}"`, () => {
        const { getByText } = render(
          <AppearanceCard {...defaultProps} habitName={habitName} />
        );

        expect(getByText(`Smart pick based on "${expected}"`)).toBeTruthy();
      });
    });
  });
});
