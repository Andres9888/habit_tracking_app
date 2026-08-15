/**
 * EmojiGrid Component Tests
 * V2 Redesign - Virtualized Grid Implementation
 *
 * Tests cover:
 * - T5.1: 6-column grid layout
 * - T5.2: Virtualized FlatList scrolling
 * - T5.3: Press animations and selection state
 * - T5.4: Category header labels
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmojiGrid } from '../EmojiGrid';

const mockOnEmojiSelect = jest.fn();

const sampleEmojis = ['💪', '🏃', '🚴', '🏊', '⚽', '🏀', '🎾', '🥊', '🧘', '🎿', '🏋️', '🤸'];

const defaultProps = {
  emojis: sampleEmojis,
  selectedEmoji: null,
  onEmojiSelect: mockOnEmojiSelect,
  categoryName: '💪 FITNESS',
  showCategoryHeader: true,
};

describe('EmojiGrid - V2 Virtualized Grid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T5.1: 6-Column Grid Layout', () => {
    it('should render emojis in a grid', () => {
      const { getByLabelText } = render(<EmojiGrid {...defaultProps} />);

      // Should find emojis rendered in the grid
      expect(getByLabelText('Select 💪 emoji')).toBeDefined();
      expect(getByLabelText('Select 🏃 emoji')).toBeDefined();
      expect(getByLabelText('Select 🚴 emoji')).toBeDefined();
    });

    it('should render multiple rows for more than 6 emojis', () => {
      const { getByLabelText } = render(<EmojiGrid {...defaultProps} />);

      // First row (6 emojis)
      expect(getByLabelText('Select 💪 emoji')).toBeDefined();
      expect(getByLabelText('Select 🏀 emoji')).toBeDefined();

      // Second row
      expect(getByLabelText('Select 🎾 emoji')).toBeDefined();
      expect(getByLabelText('Select 🤸 emoji')).toBeDefined();
    });

    it('should handle empty emoji array', () => {
      const { getByText } = render(
        <EmojiGrid {...defaultProps} emojis={[]} />
      );

      expect(getByText('No emojis found')).toBeDefined();
      expect(getByText('Try a different search term')).toBeDefined();
    });

    it('should handle fewer than 6 emojis in last row', () => {
      const fiveEmojis = ['💪', '🏃', '🚴', '🏊', '⚽'];
      const { getByLabelText, queryByLabelText } = render(
        <EmojiGrid {...defaultProps} emojis={fiveEmojis} />
      );

      // Should render all 5 emojis
      expect(getByLabelText('Select 💪 emoji')).toBeDefined();
      expect(getByLabelText('Select ⚽ emoji')).toBeDefined();

      // Should not find a 6th emoji
      expect(queryByLabelText('Select 🏀 emoji')).toBeNull();
    });
  });

  describe('T5.2: Virtualized FlatList Scrolling', () => {
    it('should render grid content with proper container', () => {
      const { getByLabelText } = render(<EmojiGrid {...defaultProps} />);

      // The grid should render successfully with emojis
      expect(getByLabelText('Select 💪 emoji')).toBeDefined();
    });

    it('should handle large number of emojis efficiently', () => {
      // Create a large array of emojis
      const largeEmojiSet = Array.from({ length: 100 }, (_, i) =>
        String.fromCodePoint(0x1F600 + i)
      );

      const { getByLabelText } = render(
        <EmojiGrid {...defaultProps} emojis={largeEmojiSet} />
      );

      // Should render first emoji
      expect(getByLabelText(`Select ${largeEmojiSet[0]} emoji`)).toBeDefined();
    });
  });

  describe('T5.3: Press Animations and Selection State', () => {
    it('should call onEmojiSelect when emoji is pressed', () => {
      const { getByLabelText } = render(<EmojiGrid {...defaultProps} />);

      const emojiButton = getByLabelText('Select 💪 emoji');
      fireEvent.press(emojiButton);

      expect(mockOnEmojiSelect).toHaveBeenCalledWith('💪');
    });

    it('should highlight selected emoji', () => {
      const { getByLabelText } = render(
        <EmojiGrid {...defaultProps} selectedEmoji="💪" />
      );

      const emojiButton = getByLabelText('Select 💪 emoji');
      expect(emojiButton.props.accessibilityState?.selected).toBe(true);
    });

    it('should not highlight non-selected emojis', () => {
      const { getByLabelText } = render(
        <EmojiGrid {...defaultProps} selectedEmoji="💪" />
      );

      const otherEmoji = getByLabelText('Select 🏃 emoji');
      expect(otherEmoji.props.accessibilityState?.selected).toBe(false);
    });

    it('should trigger onPressIn animation callback', () => {
      const { getByLabelText } = render(<EmojiGrid {...defaultProps} />);

      const emojiButton = getByLabelText('Select 💪 emoji');

      // Should not throw when triggering press animations
      fireEvent(emojiButton, 'pressIn');
      fireEvent(emojiButton, 'pressOut');
    });

    it('should have button accessibility role', () => {
      const { getByLabelText } = render(<EmojiGrid {...defaultProps} />);

      const emojiButton = getByLabelText('Select 💪 emoji');
      expect(emojiButton.props.accessibilityRole).toBe('button');
    });
  });

  describe('T5.4: Category Header Labels', () => {
    it('should display category header when showCategoryHeader is true', () => {
      const { getByText } = render(<EmojiGrid {...defaultProps} />);

      expect(getByText('💪 FITNESS')).toBeDefined();
    });

    it('should hide category header when showCategoryHeader is false', () => {
      const { queryByText } = render(
        <EmojiGrid {...defaultProps} showCategoryHeader={false} />
      );

      expect(queryByText('💪 FITNESS')).toBeNull();
    });

    it('should hide category header when categoryName is undefined', () => {
      const { queryByText } = render(
        <EmojiGrid {...defaultProps} categoryName={undefined} />
      );

      expect(queryByText('💪 FITNESS')).toBeNull();
    });

    it('should update category header when category changes', () => {
      const { rerender, getByText, queryByText } = render(
        <EmojiGrid {...defaultProps} categoryName="💪 FITNESS" />
      );

      expect(getByText('💪 FITNESS')).toBeDefined();

      rerender(
        <EmojiGrid {...defaultProps} categoryName="📚 LEARNING" />
      );

      expect(queryByText('💪 FITNESS')).toBeNull();
      expect(getByText('📚 LEARNING')).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels for all emojis', () => {
      const { getByLabelText } = render(<EmojiGrid {...defaultProps} />);

      sampleEmojis.forEach((emoji) => {
        expect(getByLabelText(`Select ${emoji} emoji`)).toBeDefined();
      });
    });

    it('should have button role for emoji cells', () => {
      const { getByLabelText } = render(<EmojiGrid {...defaultProps} />);

      const emojiButton = getByLabelText('Select 💪 emoji');
      expect(emojiButton.props.accessibilityRole).toBe('button');
    });

    it('should indicate selected state in accessibility', () => {
      const { getByLabelText } = render(
        <EmojiGrid {...defaultProps} selectedEmoji="🏃" />
      );

      const selectedEmoji = getByLabelText('Select 🏃 emoji');
      expect(selectedEmoji.props.accessibilityState?.selected).toBe(true);

      const unselectedEmoji = getByLabelText('Select 💪 emoji');
      expect(unselectedEmoji.props.accessibilityState?.selected).toBe(false);
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no emojis provided', () => {
      const { getByText } = render(
        <EmojiGrid {...defaultProps} emojis={[]} />
      );

      expect(getByText('No emojis found')).toBeDefined();
      expect(getByText('Try a different search term')).toBeDefined();
    });

    it('should not show category header when empty', () => {
      const { queryByText } = render(
        <EmojiGrid {...defaultProps} emojis={[]} />
      );

      // Empty state should not show category header
      expect(queryByText('💪 FITNESS')).toBeNull();
    });
  });

  describe('Selection Behavior', () => {
    it('should call onEmojiSelect for each emoji pressed', () => {
      const { getByLabelText } = render(<EmojiGrid {...defaultProps} />);

      fireEvent.press(getByLabelText('Select 💪 emoji'));
      expect(mockOnEmojiSelect).toHaveBeenCalledWith('💪');

      fireEvent.press(getByLabelText('Select 🏃 emoji'));
      expect(mockOnEmojiSelect).toHaveBeenCalledWith('🏃');

      expect(mockOnEmojiSelect).toHaveBeenCalledTimes(2);
    });

    it('should allow reselecting the same emoji', () => {
      const { getByLabelText } = render(
        <EmojiGrid {...defaultProps} selectedEmoji="💪" />
      );

      fireEvent.press(getByLabelText('Select 💪 emoji'));
      expect(mockOnEmojiSelect).toHaveBeenCalledWith('💪');
    });
  });
});
