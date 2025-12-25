/**
 * Search Components Accessibility Tests
 *
 * Automated tests that verify accessibility props are correctly set
 * for screen reader compatibility (VoiceOver/TalkBack).
 *
 * Note: These tests verify the accessibility props are set correctly,
 * but manual testing with actual screen readers is still recommended.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RecentSearches } from '../RecentSearches';
import { SearchSuggestions } from '../SearchSuggestions';
import { SearchCategoryFilter } from '../SearchCategoryFilter';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    FadeIn: { duration: () => ({}) },
    FadeOut: { duration: () => ({}) },
    Layout: { springify: () => ({}) },
    useAnimatedStyle: () => ({}),
    useSharedValue: (val: unknown) => ({ value: val }),
    withSpring: (val: unknown) => val,
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
  },
}));

// Mock the constants module
jest.mock('../../../screens/templates/constants', () => ({
  CATEGORY_COLORS: {
    health: { bgSelected: '#10B981' },
    mindfulness: { bgSelected: '#8B5CF6' },
    productivity: { bgSelected: '#F59E0B' },
  },
  DEFAULT_CATEGORY_COLORS: { bgSelected: '#6B7280' },
}));

describe('Search Components Accessibility', () => {
  describe('RecentSearches', () => {
    const mockSearches = ['meditation', 'exercise', 'sleep'];
    const mockOnSelect = jest.fn();
    const mockOnRemove = jest.fn();
    const mockOnClearAll = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders nothing when searches array is empty', () => {
      const { queryByText } = render(
        <RecentSearches
          searches={[]}
          onSelect={mockOnSelect}
          onRemove={mockOnRemove}
          onClearAll={mockOnClearAll}
        />
      );
      expect(queryByText('Recent')).toBeNull();
    });

    it('each search chip has accessibilityRole="button"', () => {
      const { getAllByRole } = render(
        <RecentSearches
          searches={mockSearches}
          onSelect={mockOnSelect}
          onRemove={mockOnRemove}
          onClearAll={mockOnClearAll}
        />
      );
      const buttons = getAllByRole('button');
      // Should have chips + remove buttons + clear all button
      expect(buttons.length).toBeGreaterThanOrEqual(mockSearches.length);
    });

    it('each search chip has correct accessibilityLabel', () => {
      const { getByLabelText } = render(
        <RecentSearches
          searches={mockSearches}
          onSelect={mockOnSelect}
          onRemove={mockOnRemove}
          onClearAll={mockOnClearAll}
        />
      );
      mockSearches.forEach((search) => {
        expect(
          getByLabelText(`Recent search: ${search}, double tap to search`)
        ).toBeTruthy();
      });
    });

    it('remove button has accessibilityLabel="Remove {query} from recent searches"', () => {
      const { getByLabelText } = render(
        <RecentSearches
          searches={mockSearches}
          onSelect={mockOnSelect}
          onRemove={mockOnRemove}
          onClearAll={mockOnClearAll}
        />
      );
      mockSearches.forEach((search) => {
        expect(
          getByLabelText(`Remove ${search} from recent searches`)
        ).toBeTruthy();
      });
    });

    it('remove button has accessibilityRole="button"', () => {
      const { getByLabelText } = render(
        <RecentSearches
          searches={mockSearches}
          onSelect={mockOnSelect}
          onRemove={mockOnRemove}
          onClearAll={mockOnClearAll}
        />
      );
      const removeButton = getByLabelText(
        `Remove ${mockSearches[0]} from recent searches`
      );
      expect(removeButton.props.accessibilityRole).toBe('button');
    });

    it('clear all button has accessibilityLabel', () => {
      const { getByLabelText } = render(
        <RecentSearches
          searches={mockSearches}
          onSelect={mockOnSelect}
          onRemove={mockOnRemove}
          onClearAll={mockOnClearAll}
        />
      );
      expect(getByLabelText('Clear all recent searches')).toBeTruthy();
    });

    it('clear all button has accessibilityRole="button"', () => {
      const { getByLabelText } = render(
        <RecentSearches
          searches={mockSearches}
          onSelect={mockOnSelect}
          onRemove={mockOnRemove}
          onClearAll={mockOnClearAll}
        />
      );
      const clearButton = getByLabelText('Clear all recent searches');
      expect(clearButton.props.accessibilityRole).toBe('button');
    });

    it('search chips are focusable and tappable', () => {
      const { getByLabelText } = render(
        <RecentSearches
          searches={mockSearches}
          onSelect={mockOnSelect}
          onRemove={mockOnRemove}
          onClearAll={mockOnClearAll}
        />
      );
      const chip = getByLabelText(
        `Recent search: ${mockSearches[0]}, double tap to search`
      );
      fireEvent.press(chip);
      expect(mockOnSelect).toHaveBeenCalledWith(mockSearches[0]);
    });
  });

  describe('SearchSuggestions', () => {
    const mockSuggestions = ['Meditation', 'Mediterranean Diet', 'Medicine'];
    const mockOnSelect = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders nothing when suggestions are empty', () => {
      const { queryByRole } = render(
        <SearchSuggestions
          suggestions={[]}
          query="med"
          onSelect={mockOnSelect}
        />
      );
      expect(queryByRole('menu')).toBeNull();
    });

    it('renders nothing when query is less than 2 characters', () => {
      const { queryByRole } = render(
        <SearchSuggestions
          suggestions={mockSuggestions}
          query="m"
          onSelect={mockOnSelect}
        />
      );
      expect(queryByRole('menu')).toBeNull();
    });

    it('container has accessibilityRole="menu"', () => {
      const { toJSON } = render(
        <SearchSuggestions
          suggestions={mockSuggestions}
          query="med"
          onSelect={mockOnSelect}
        />
      );
      const tree = toJSON();
      // The Animated.View with accessibilityRole="menu" should be the root element
      expect(tree).not.toBeNull();
      expect((tree as { props?: { accessibilityRole?: string } })?.props?.accessibilityRole).toBe('menu');
    });

    it('each suggestion has accessibilityRole="menuitem"', () => {
      const { getAllByRole } = render(
        <SearchSuggestions
          suggestions={mockSuggestions}
          query="med"
          onSelect={mockOnSelect}
        />
      );
      const menuItems = getAllByRole('menuitem');
      expect(menuItems.length).toBe(mockSuggestions.length);
    });

    it('each suggestion has accessibilityLabel with the suggestion text', () => {
      const { getByLabelText } = render(
        <SearchSuggestions
          suggestions={mockSuggestions}
          query="med"
          onSelect={mockOnSelect}
        />
      );
      mockSuggestions.forEach((suggestion) => {
        expect(getByLabelText(suggestion)).toBeTruthy();
      });
    });

    it('suggestions are tappable and trigger onSelect', () => {
      const { getByLabelText } = render(
        <SearchSuggestions
          suggestions={mockSuggestions}
          query="med"
          onSelect={mockOnSelect}
        />
      );
      const suggestion = getByLabelText(mockSuggestions[0]);
      fireEvent.press(suggestion);
      expect(mockOnSelect).toHaveBeenCalledWith(mockSuggestions[0]);
    });
  });

  describe('SearchCategoryFilter', () => {
    const mockCategories = [
      { id: 'health', label: 'Health', icon: '💪' },
      { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
      { id: 'productivity', label: 'Productivity', icon: '📊' },
    ];
    const mockResultCounts = {
      health: 5,
      mindfulness: 3,
      productivity: 2,
    };
    const mockOnSelectCategory = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders nothing when no categories have results', () => {
      const { queryAllByRole } = render(
        <SearchCategoryFilter
          categories={mockCategories}
          resultCounts={{}}
          selectedCategory={null}
          onSelectCategory={mockOnSelectCategory}
        />
      );
      expect(queryAllByRole('button')).toHaveLength(0);
    });

    it('each category pill has accessibilityRole="button"', () => {
      const { getAllByRole } = render(
        <SearchCategoryFilter
          categories={mockCategories}
          resultCounts={mockResultCounts}
          selectedCategory={null}
          onSelectCategory={mockOnSelectCategory}
        />
      );
      const buttons = getAllByRole('button');
      // All + category pills
      expect(buttons.length).toBe(mockCategories.length + 1);
    });

    it('each category pill has accessibilityLabel with label and count', () => {
      const { getByLabelText } = render(
        <SearchCategoryFilter
          categories={mockCategories}
          resultCounts={mockResultCounts}
          selectedCategory={null}
          onSelectCategory={mockOnSelectCategory}
        />
      );
      // All pill
      expect(getByLabelText(/All category, \d+ results/)).toBeTruthy();
      // Category pills
      mockCategories.forEach((cat) => {
        expect(
          getByLabelText(`${cat.label} category, ${mockResultCounts[cat.id as keyof typeof mockResultCounts]} results`)
        ).toBeTruthy();
      });
    });

    it('selected category has accessibilityState.selected=true', () => {
      const { getByLabelText } = render(
        <SearchCategoryFilter
          categories={mockCategories}
          resultCounts={mockResultCounts}
          selectedCategory="health"
          onSelectCategory={mockOnSelectCategory}
        />
      );
      const healthPill = getByLabelText('Health category, 5 results');
      expect(healthPill.props.accessibilityState).toEqual({ selected: true });
    });

    it('non-selected category has accessibilityState.selected=false', () => {
      const { getByLabelText } = render(
        <SearchCategoryFilter
          categories={mockCategories}
          resultCounts={mockResultCounts}
          selectedCategory="health"
          onSelectCategory={mockOnSelectCategory}
        />
      );
      const mindfulnessPill = getByLabelText('Mindfulness category, 3 results');
      expect(mindfulnessPill.props.accessibilityState).toEqual({ selected: false });
    });

    it('"All" pill has accessibilityState.selected=true when no category selected', () => {
      const { getByLabelText } = render(
        <SearchCategoryFilter
          categories={mockCategories}
          resultCounts={mockResultCounts}
          selectedCategory={null}
          onSelectCategory={mockOnSelectCategory}
        />
      );
      const allPill = getByLabelText(/All category, \d+ results/);
      expect(allPill.props.accessibilityState).toEqual({ selected: true });
    });

    it('category pills are tappable and trigger onSelectCategory', () => {
      const { getByLabelText } = render(
        <SearchCategoryFilter
          categories={mockCategories}
          resultCounts={mockResultCounts}
          selectedCategory={null}
          onSelectCategory={mockOnSelectCategory}
        />
      );
      const healthPill = getByLabelText('Health category, 5 results');
      fireEvent.press(healthPill);
      expect(mockOnSelectCategory).toHaveBeenCalledWith('health');
    });

    it('tapping selected category deselects it', () => {
      const { getByLabelText } = render(
        <SearchCategoryFilter
          categories={mockCategories}
          resultCounts={mockResultCounts}
          selectedCategory="health"
          onSelectCategory={mockOnSelectCategory}
        />
      );
      const healthPill = getByLabelText('Health category, 5 results');
      fireEvent.press(healthPill);
      expect(mockOnSelectCategory).toHaveBeenCalledWith(null);
    });
  });
});

/**
 * MANUAL TESTING CHECKLIST FOR VOICEOVER/TALKBACK
 *
 * The following tests must be performed manually on actual devices:
 *
 * iOS VoiceOver Testing:
 * 1. Enable VoiceOver (Settings > Accessibility > VoiceOver)
 * 2. Navigate to TemplatesScreen
 * 3. Verify the following announcements:
 *
 *    Search Input:
 *    [ ] "Search templates" announced when focusing input
 *    [ ] "Enter keywords to search for habit templates" hint announced
 *    [ ] Keyboard appears with "search" return key
 *
 *    Clear Button:
 *    [ ] "Clear search, button" announced when visible
 *
 *    Recent Searches (when visible):
 *    [ ] "Recent search: {query}, double tap to search, button" for each chip
 *    [ ] "Remove {query} from recent searches, button" for remove buttons
 *    [ ] "Clear all recent searches, button" for clear button
 *
 *    Search Suggestions (when typing):
 *    [ ] Container announced as "menu"
 *    [ ] Each suggestion announced as "menuitem" with text
 *    [ ] Double-tap selects suggestion
 *
 *    Category Filter Pills (when searching):
 *    [ ] "All category, {N} results, button, selected" when All is active
 *    [ ] "{Category} category, {N} results, button" for each category
 *    [ ] Selected state announced when category is active
 *
 * Android TalkBack Testing:
 * 1. Enable TalkBack (Settings > Accessibility > TalkBack)
 * 2. Repeat all iOS tests above
 * 3. Additionally verify:
 *    [ ] Touch exploration works correctly
 *    [ ] Linear navigation moves through elements in logical order
 *    [ ] Double-tap activates focused element
 *
 * Cross-Platform Verification:
 * [ ] All labels are clear and descriptive
 * [ ] Focus order follows visual layout (left-to-right, top-to-bottom)
 * [ ] Touch targets are at least 44x44 points
 * [ ] Color is not the only means of conveying information
 * [ ] Interactive elements have visible focus indicators
 */
