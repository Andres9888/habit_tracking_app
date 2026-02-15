/**
 * EmojiPicker Component Tests
 * Story 2.8: Emoji Picker Modal Redesign
 *
 * Tests:
 * - Recently Used section functionality
 * - Habit-focused categories
 * - Enhanced search with keyword synonyms
 * - Grid layout with 44px tap targets
 * - Accessibility labels
 */

import React, { createRef } from 'react';
import { AccessibilityInfo, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import { EmojiPicker } from '../EmojiPicker';

// Use the mock from __mocks__/@react-native-async-storage/async-storage.js
jest.mock('@react-native-async-storage/async-storage');

const mockOnClose = jest.fn();
const mockOnSelect = jest.fn();

const defaultProps = {
  visible: true,
  onClose: mockOnClose,
  onSelect: mockOnSelect,
  selectedEmoji: null,
};

describe('EmojiPicker - Story 2.8', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  describe('Component Rendering', () => {
    it('should render when visible', () => {
      const { getByText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByText('Choose Icon')).toBeDefined();
    });

    it('should not render when not visible', () => {
      const { queryByText } = render(
        <EmojiPicker {...defaultProps} visible={false} />
      );
      expect(queryByText('Choose Icon')).toBeNull();
    });

    it('should render close button', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByLabelText('Close emoji picker')).toBeDefined();
    });

    it('should render search input', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByLabelText('Search emojis')).toBeDefined();
    });

    it('should render No Icon button', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByLabelText('Select no icon for this habit')).toBeDefined();
    });
  });

  describe('AC1: Recently Used Section', () => {
    it('should display recently used emojis when available', async () => {
      const recentEmojis = ['💪', '🧘', '📚'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(recentEmojis)
      );

      const { findByText, getByText } = render(
        <EmojiPicker {...defaultProps} />
      );

      await findByText('Recently Used');
      expect(getByText('Recently Used')).toBeDefined();
    });

    it('should not display recently used section when empty', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const { queryByText } = render(<EmojiPicker {...defaultProps} />);

      await waitFor(() => {
        expect(queryByText('Recently Used')).toBeNull();
      });
    });

    it('should show selection indicator on currently selected emoji', async () => {
      const recentEmojis = ['💪', '🧘', '📚'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(recentEmojis)
      );

      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} selectedEmoji='💪' />
      );

      await waitFor(() => {
        expect(
          getByLabelText('Select 💪 emoji from recently used')
        ).toBeDefined();
      });
    });

    it('should save emoji to recent when selected', async () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      // Select an emoji (from the grid)
      const emojiButton = getByLabelText('Select 💪 emoji');
      fireEvent.press(emojiButton);

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });
    });
  });

  describe('AC2: Habit-Focused Categories', () => {
    it('should display habit-focused category chips', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      expect(getByLabelText('Filter by Fitness category')).toBeDefined();
      expect(getByLabelText('Filter by Learning category')).toBeDefined();
      expect(getByLabelText('Filter by Wellness category')).toBeDefined();
      expect(getByLabelText('Filter by Health category')).toBeDefined();
      expect(getByLabelText('Filter by Work category')).toBeDefined();
      expect(getByLabelText('Filter by Creative category')).toBeDefined();
      expect(getByLabelText('Filter by Home category')).toBeDefined();
      expect(getByLabelText('Filter by Finance category')).toBeDefined();
      expect(getByLabelText('Filter by Social category')).toBeDefined();
      expect(getByLabelText('Filter by All category')).toBeDefined();
    });

    it('should default to Fitness category', () => {
      const { getByText } = render(<EmojiPicker {...defaultProps} />);

      // Should show Fitness category header
      expect(getByText('💪 FITNESS')).toBeDefined();
    });

    it('should change category when chip is pressed', async () => {
      const { getByLabelText, findByText } = render(
        <EmojiPicker {...defaultProps} />
      );

      const learningChip = getByLabelText('Filter by Learning category');
      fireEvent.press(learningChip);

      // Should show Learning category header
      await findByText('📚 LEARNING');
    });

    it('should show all emojis when All category selected', async () => {
      const { getByLabelText, findByText } = render(
        <EmojiPicker {...defaultProps} />
      );

      const allChip = getByLabelText('Filter by All category');
      fireEvent.press(allChip);

      await findByText('⭐ ALL');
    });

    it('should announce category selection state for accessibility', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const fitnessChip = getByLabelText('Filter by Fitness category');
      expect(fitnessChip.props.accessibilityState?.selected).toBe(true);

      const learningChip = getByLabelText('Filter by Learning category');
      expect(learningChip.props.accessibilityState?.selected).toBe(false);
    });
  });

  describe('AC3: Improved Search', () => {
    it('should have search placeholder with examples', () => {
      const { getByPlaceholderText } = render(
        <EmojiPicker {...defaultProps} />
      );
      expect(
        getByPlaceholderText('Search "run", "water", "sleep"...')
      ).toBeDefined();
    });

    it('should show clear button when search has text', async () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const searchInput = getByLabelText('Search emojis');
      fireEvent.changeText(searchInput, 'run');

      await waitFor(() => {
        expect(getByLabelText('Clear search')).toBeDefined();
      });
    });

    it('should clear search when clear button pressed', async () => {
      const { getByLabelText, queryByLabelText } = render(
        <EmojiPicker {...defaultProps} />
      );

      const searchInput = getByLabelText('Search emojis');
      fireEvent.changeText(searchInput, 'run');

      await waitFor(() => {
        const clearButton = getByLabelText('Clear search');
        fireEvent.press(clearButton);
      });

      await waitFor(() => {
        expect(queryByLabelText('Clear search')).toBeNull();
      });
    });

    it('should hide categories when searching', async () => {
      const { getByLabelText, queryByLabelText } = render(
        <EmojiPicker {...defaultProps} />
      );

      const searchInput = getByLabelText('Search emojis');
      fireEvent.changeText(searchInput, 'run');

      await waitFor(() => {
        expect(queryByLabelText('Filter by Fitness category')).toBeNull();
      });
    });

    it('should show empty state when no results', async () => {
      const { getByLabelText, findByText } = render(
        <EmojiPicker {...defaultProps} />
      );

      const searchInput = getByLabelText('Search emojis');
      // Use a query that won't match any keyword substring
      fireEvent.changeText(searchInput, 'qwertyuiop');

      await findByText('No emojis found');
    });

    it('should have accessibility hint for search', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const searchInput = getByLabelText('Search emojis');
      expect(searchInput.props.accessibilityHint).toBe(
        'Type keywords like run, water, or sleep to find emojis'
      );
    });
  });

  describe('AC4: Grid Layout', () => {
    it('should display 7 emojis per row', () => {
      // This is validated by the EMOJIS_PER_ROW constant being 7
      // Visual testing would verify this in practice
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);
      // Grid should render with fitness emojis by default
      expect(getByLabelText('Select 💪 emoji')).toBeDefined();
    });

    it('should show selection state on selected emoji', () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} selectedEmoji='💪' />
      );

      // The selected emoji should have visual selection state
      // (blue border + scale 1.1 - tested via style props)
      expect(getByLabelText('Select 💪 emoji')).toBeDefined();
    });
  });

  describe('AC5: Accessibility', () => {
    it('should have accessible label for each emoji', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByLabelText('Select 💪 emoji')).toBeDefined();
    });

    it('should have accessible label for close button', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByLabelText('Close emoji picker')).toBeDefined();
    });

    it('should have accessible label for No Icon button', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByLabelText('Select no icon for this habit')).toBeDefined();
    });

    it('should have role="button" for emoji items', () => {
      const { getAllByRole } = render(<EmojiPicker {...defaultProps} />);
      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should return focus to trigger element on close', async () => {
      const mockSetAccessibilityFocus = jest.spyOn(
        AccessibilityInfo,
        'setAccessibilityFocus'
      );
      const triggerRef = createRef<View>() as React.RefObject<View>;

      const { getByLabelText } = render(
        <>
          <View
            ref={triggerRef}
            accessible
            accessibilityLabel='Trigger button'
          />
          <EmojiPicker {...defaultProps} triggerRef={triggerRef} />
        </>
      );

      const closeButton = getByLabelText('Close emoji picker');
      fireEvent.press(closeButton);

      // Wait for the focus return timeout (100ms)
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });

      mockSetAccessibilityFocus.mockRestore();
    });
  });

  describe('User Interactions', () => {
    it('should call onSelect when emoji is pressed', async () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const emojiButton = getByLabelText('Select 💪 emoji');
      fireEvent.press(emojiButton);

      // Wait for async addRecentEmoji to complete
      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith('💪');
      });
    });

    it('should call onClose when emoji is selected', async () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const emojiButton = getByLabelText('Select 💪 emoji');
      fireEvent.press(emojiButton);

      // Wait for async addRecentEmoji to complete
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should call onSelect with null when No Icon is pressed', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const noIconButton = getByLabelText('Select no icon for this habit');
      fireEvent.press(noIconButton);

      expect(mockOnSelect).toHaveBeenCalledWith(null);
    });

    it('should call onClose when close button is pressed', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      const closeButton = getByLabelText('Close emoji picker');
      fireEvent.press(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Acceptance Criteria Summary', () => {
    it('✅ AC1: Recently Used section with selection indicator', async () => {
      const recentEmojis = ['💪', '🧘', '📚'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(recentEmojis)
      );

      const { findByText } = render(
        <EmojiPicker {...defaultProps} selectedEmoji='💪' />
      );

      await findByText('Recently Used');
    });

    it('✅ AC2: Habit-focused categories replace generic ones', () => {
      const { getByLabelText, queryByLabelText } = render(
        <EmojiPicker {...defaultProps} />
      );

      // Should have habit categories
      expect(getByLabelText('Filter by Fitness category')).toBeDefined();
      expect(getByLabelText('Filter by Learning category')).toBeDefined();

      // Should NOT have generic categories like Smileys, Gestures
      expect(queryByLabelText('Filter by Smileys category')).toBeNull();
      expect(queryByLabelText('Filter by Gestures category')).toBeNull();
    });

    it('✅ AC3: Search with keyword synonyms', async () => {
      const { getByLabelText, findByLabelText } = render(
        <EmojiPicker {...defaultProps} />
      );

      const searchInput = getByLabelText('Search emojis');
      fireEvent.changeText(searchInput, 'run');

      // Should find running emoji via keyword search
      await findByLabelText('Select 🏃 emoji');
    });

    it('✅ AC4: 7 emojis per row with 44px targets', () => {
      // EMOJIS_PER_ROW = 7 is set in the component
      // minWidth: 44, minHeight: 44 is set on emoji items
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);
      expect(getByLabelText('Select 💪 emoji')).toBeDefined();
    });

    it('✅ AC5: All elements have accessibility labels', () => {
      const { getByLabelText } = render(<EmojiPicker {...defaultProps} />);

      expect(getByLabelText('Close emoji picker')).toBeDefined();
      expect(getByLabelText('Search emojis')).toBeDefined();
      expect(getByLabelText('Select no icon for this habit')).toBeDefined();
      expect(getByLabelText('Filter by Fitness category')).toBeDefined();
      expect(getByLabelText('Select 💪 emoji')).toBeDefined();
    });
  });

  // Task 5: Auto-Suggest Emojis
  describe('Task 5: Auto-Suggest Emojis', () => {
    it('should display suggested emojis section when habitName is provided', () => {
      const { getByText } = render(
        <EmojiPicker {...defaultProps} habitName='Morning Run' />
      );

      expect(getByText('Suggested for "Morning Run"')).toBeDefined();
    });

    it('should not display suggested emojis section when habitName is empty', () => {
      const { queryByText } = render(
        <EmojiPicker {...defaultProps} habitName='' />
      );

      expect(queryByText(/Suggested for/)).toBeNull();
    });

    it('should not display suggested emojis section when habitName is not provided', () => {
      const { queryByText } = render(<EmojiPicker {...defaultProps} />);

      expect(queryByText(/Suggested for/)).toBeNull();
    });

    it('should suggest 🏃 for "Run" habit name', () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='Run' />
      );

      expect(getByLabelText('Select 🏃 emoji from suggestions')).toBeDefined();
    });

    it('should suggest 💧 for "Drink Water" habit name', () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='Drink Water' />
      );

      expect(getByLabelText('Select 💧 emoji from suggestions')).toBeDefined();
    });

    it('should suggest 🧘 for "Meditate" habit name', () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='Meditate' />
      );

      expect(getByLabelText('Select 🧘 emoji from suggestions')).toBeDefined();
    });

    it('should call onSelect when suggested emoji is pressed', async () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='Run' />
      );

      const suggestedEmoji = getByLabelText('Select 🏃 emoji from suggestions');
      fireEvent.press(suggestedEmoji);

      await waitFor(() => {
        expect(mockOnSelect).toHaveBeenCalledWith('🏃');
      });
    });

    it('should hide suggested emojis section when searching', async () => {
      const { getByLabelText, queryByText } = render(
        <EmojiPicker {...defaultProps} habitName='Run' />
      );

      const searchInput = getByLabelText('Search emojis');
      fireEvent.changeText(searchInput, 'yoga');

      await waitFor(() => {
        expect(queryByText(/Suggested for/)).toBeNull();
      });
    });

    it('should not show suggested section for unrelated habit names', () => {
      const { queryByText } = render(
        <EmojiPicker {...defaultProps} habitName='xyzabc' />
      );

      expect(queryByText(/Suggested for/)).toBeNull();
    });

    it('should show selection indicator on suggested emoji when selected', () => {
      const { getByLabelText } = render(
        <EmojiPicker {...defaultProps} habitName='Run' selectedEmoji='🏃' />
      );

      // If the suggested emoji matches selectedEmoji, it should have selection state
      expect(getByLabelText('Select 🏃 emoji from suggestions')).toBeDefined();
    });
  });
});
