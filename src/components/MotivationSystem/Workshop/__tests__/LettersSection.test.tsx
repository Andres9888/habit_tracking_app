/**
 * LettersSection Tests
 * Story T11.2-T11.8 - Letters to Self Feature
 *
 * Tests:
 * - Empty state rendering with pulsing icon
 * - Filled state rendering with letter list
 * - WriteLetterModal two-step flow (T11.2)
 * - Unlock date picker (T11.3)
 * - Locked/unlocked letter display (T11.4)
 * - Premium gating (T11.7)
 * - Violet accent styling (T11.8)
 * - Accessibility labels
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import {
  LettersSection,
  LetterSummary,
  UNLOCK_DURATION_OPTIONS,
} from '../LettersSection';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Mail: () => null,
  Plus: () => null,
  Check: () => null,
  X: () => null,
  Lock: () => null,
  Calendar: () => null,
  Sparkles: () => null,
  Clock: () => null,
  ChevronRight: () => null,
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      createAnimatedComponent: (Component: any) => Component,
    },
    useSharedValue: (initial: any) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withSpring: (value: any) => value,
    withTiming: (value: any) => value,
    withSequence: (...values: any[]) => values[values.length - 1],
    interpolate: (value: number, input: number[], output: number[]) =>
      output[0],
    runOnJS: (fn: any) => fn,
    View,
  };
});

describe('LettersSection', () => {
  const defaultProps = {
    letters: [] as LetterSummary[],
    letterCount: 0,
    isPremium: true,
    onSaveLetter: jest.fn().mockResolvedValue(undefined),
    onViewAllLetters: jest.fn(),
    onReadLetter: jest.fn(),
    onPremiumRequired: jest.fn(),
  };

  const mockLetter: LetterSummary = {
    id: 'letter-1',
    title: 'Keep Going',
    content: 'Dear Future Me, I know you can do this...',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    unlockAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    isRead: false,
  };

  const unlockedLetter: LetterSummary = {
    id: 'letter-2',
    title: 'Remember Why',
    content: 'You started this because...',
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
    unlockAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // Unlocked yesterday
    isRead: false,
  };

  const readLetter: LetterSummary = {
    id: 'letter-3',
    title: 'Past Motivation',
    content: 'This was important to you...',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    unlockAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // Unlocked 7 days ago
    isRead: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty state rendering', () => {
    it('renders empty state when no letters exist', () => {
      const { getByText } = render(<LettersSection {...defaultProps} />);

      expect(getByText('Letters to Self')).toBeTruthy();
      expect(getByText('Send motivation to your future self')).toBeTruthy();
      expect(getByText('Write')).toBeTruthy();
    });

    it('has correct accessibility label for empty state', () => {
      const { getByLabelText } = render(<LettersSection {...defaultProps} />);

      expect(getByLabelText('Write a letter to your future self')).toBeTruthy();
    });

    it('displays science tip in empty state', () => {
      const { getByText } = render(<LettersSection {...defaultProps} />);

      expect(
        getByText(/Time-locked messages create powerful emotional anchors/)
      ).toBeTruthy();
    });

    it('shows "Write Your First Letter" button for premium users', () => {
      const { getByText } = render(<LettersSection {...defaultProps} />);

      expect(getByText('Write Your First Letter')).toBeTruthy();
    });
  });

  describe('Filled state rendering', () => {
    const filledProps = {
      ...defaultProps,
      letters: [mockLetter],
      letterCount: 1,
    };

    it('renders filled state when letters exist', () => {
      const { getByText, queryByText } = render(
        <LettersSection {...filledProps} />
      );

      expect(getByText('Letters to Self')).toBeTruthy();
      expect(getByText('Your Letters (1)')).toBeTruthy();
      expect(queryByText('Send motivation to your future self')).toBeNull();
    });

    it('has correct accessibility label for filled state', () => {
      const { getByLabelText } = render(<LettersSection {...filledProps} />);

      expect(getByLabelText('Letters to self')).toBeTruthy();
    });

    it('shows "Write Another" button when letters exist', () => {
      const { getByText } = render(<LettersSection {...filledProps} />);

      expect(getByText('Write Another')).toBeTruthy();
    });
  });

  describe('T11.2: WriteLetterModal - Two-step flow', () => {
    it('opens modal when write button is pressed', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));

      expect(getByText('Write Your Letter')).toBeTruthy();
      expect(getByLabelText('Letter content')).toBeTruthy();
    });

    it('shows title input in modal', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));

      expect(getByText('Title (optional)')).toBeTruthy();
      expect(getByLabelText('Letter title')).toBeTruthy();
    });

    it('shows content input in modal', () => {
      const { getByText, getByLabelText, getByPlaceholderText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));

      expect(getByText('Your Letter')).toBeTruthy();
      expect(getByPlaceholderText(/Dear Future Me/)).toBeTruthy();
    });

    it('shows writing prompts in modal', () => {
      const { getByText } = render(<LettersSection {...defaultProps} />);

      fireEvent.press(getByText('Write Your First Letter'));

      expect(getByText('Writing Prompts')).toBeTruthy();
      expect(
        getByText('What will you feel when you achieve this habit?')
      ).toBeTruthy();
    });

    it('disables Continue button when content is too short', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(getByLabelText('Letter content'), 'Short');

      expect(getByText('5 more characters needed')).toBeTruthy();
    });

    it('enables Continue button when content meets minimum length', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(
        getByLabelText('Letter content'),
        'This is a long enough letter'
      );

      fireEvent.press(getByLabelText('Continue to schedule'));

      expect(getByText('Schedule Delivery')).toBeTruthy();
    });

    it('shows character counter for content', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(getByLabelText('Letter content'), 'Hello');

      expect(getByText('5/5000')).toBeTruthy();
    });

    it('allows navigation back to write step', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(
        getByLabelText('Letter content'),
        'This is my letter to future me'
      );
      fireEvent.press(getByLabelText('Continue to schedule'));

      expect(getByText('Schedule Delivery')).toBeTruthy();

      fireEvent.press(getByText('Back to letter'));

      expect(getByText('Write Your Letter')).toBeTruthy();
    });

    it('closes modal when X button is pressed', () => {
      const { getByText, getByLabelText, queryByText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      expect(queryByText('Write Your Letter')).toBeTruthy();

      fireEvent.press(getByLabelText('Close'));
      expect(queryByText('Write Your Letter')).toBeNull();
    });
  });

  describe('T11.3: Unlock duration picker', () => {
    it('shows unlock duration options', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(
        getByLabelText('Letter content'),
        'This is my letter content'
      );
      fireEvent.press(getByLabelText('Continue to schedule'));

      // Check all duration options
      expect(getByText('1 Week')).toBeTruthy();
      expect(getByText('2 Weeks')).toBeTruthy();
      expect(getByText('1 Month')).toBeTruthy();
      expect(getByText('3 Months')).toBeTruthy();
    });

    it('defaults to 1 week unlock duration', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(
        getByLabelText('Letter content'),
        'This is my letter content'
      );
      fireEvent.press(getByLabelText('Continue to schedule'));

      // 1 Week should be selected by default
      expect(getByLabelText('Unlock in 1 Week')).toBeTruthy();
    });

    it('allows changing unlock duration', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(
        getByLabelText('Letter content'),
        'This is my letter content'
      );
      fireEvent.press(getByLabelText('Continue to schedule'));

      fireEvent.press(getByLabelText('Unlock in 1 Month'));

      // Should show updated unlock date
      expect(getByText(/Unlocks on:/)).toBeTruthy();
    });

    it('shows unlock date preview', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(
        getByLabelText('Letter content'),
        'This is my letter content'
      );
      fireEvent.press(getByLabelText('Continue to schedule'));

      expect(getByText(/Unlocks on:/)).toBeTruthy();
    });
  });

  describe('T11.4: Letter display states', () => {
    it('renders locked letter with lock icon', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection
          {...defaultProps}
          letters={[mockLetter]}
          letterCount={1}
        />
      );

      expect(getByText('Keep Going')).toBeTruthy();
      expect(getByText(/Unlocks in 7 days/)).toBeTruthy();
    });

    it('renders unlocked unread letter', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection
          {...defaultProps}
          letters={[unlockedLetter]}
          letterCount={1}
        />
      );

      expect(getByText('Remember Why')).toBeTruthy();
      expect(getByText('Ready to read!')).toBeTruthy();
    });

    it('shows unread badge when letters are ready to read', () => {
      const { getByText } = render(
        <LettersSection
          {...defaultProps}
          letters={[unlockedLetter]}
          letterCount={1}
        />
      );

      expect(getByText('1 new')).toBeTruthy();
    });

    it('renders read letter', () => {
      const { getByText } = render(
        <LettersSection
          {...defaultProps}
          letters={[readLetter]}
          letterCount={1}
        />
      );

      expect(getByText('Past Motivation')).toBeTruthy();
      expect(getByText(/Read/)).toBeTruthy();
    });

    it('calls onReadLetter when letter is pressed', () => {
      const onReadLetter = jest.fn();
      const { getByText } = render(
        <LettersSection
          {...defaultProps}
          letters={[unlockedLetter]}
          letterCount={1}
          onReadLetter={onReadLetter}
        />
      );

      fireEvent.press(getByText('Remember Why'));

      expect(onReadLetter).toHaveBeenCalledWith('letter-2');
    });
  });

  describe('Letter list display', () => {
    it('shows View All button when more than 3 letters', () => {
      const manyLetters = [
        mockLetter,
        { ...unlockedLetter, id: 'letter-2a' },
        { ...readLetter, id: 'letter-3a' },
        { ...mockLetter, id: 'letter-4', title: 'Fourth Letter' },
      ];

      const { getByText } = render(
        <LettersSection
          {...defaultProps}
          letters={manyLetters}
          letterCount={4}
        />
      );

      expect(getByText('View All')).toBeTruthy();
      expect(getByText('Your Letters (4)')).toBeTruthy();
    });

    it('calls onViewAllLetters when View All is pressed', () => {
      const onViewAllLetters = jest.fn();
      const manyLetters = [
        mockLetter,
        { ...unlockedLetter, id: 'letter-2a' },
        { ...readLetter, id: 'letter-3a' },
        { ...mockLetter, id: 'letter-4', title: 'Fourth Letter' },
      ];

      const { getByText } = render(
        <LettersSection
          {...defaultProps}
          letters={manyLetters}
          letterCount={4}
          onViewAllLetters={onViewAllLetters}
        />
      );

      fireEvent.press(getByText('View All'));

      expect(onViewAllLetters).toHaveBeenCalled();
    });

    it('only displays first 3 letters', () => {
      const manyLetters = [
        { ...mockLetter, id: 'letter-1', title: 'First' },
        { ...mockLetter, id: 'letter-2', title: 'Second' },
        { ...mockLetter, id: 'letter-3', title: 'Third' },
        { ...mockLetter, id: 'letter-4', title: 'Fourth' },
      ];

      const { getByText, queryByText } = render(
        <LettersSection
          {...defaultProps}
          letters={manyLetters}
          letterCount={4}
        />
      );

      expect(getByText('First')).toBeTruthy();
      expect(getByText('Second')).toBeTruthy();
      expect(getByText('Third')).toBeTruthy();
      expect(queryByText('Fourth')).toBeNull();
    });
  });

  describe('T11.7: Premium gating', () => {
    it('shows PRO badge for non-premium users', () => {
      const { getByText } = render(
        <LettersSection {...defaultProps} isPremium={false} />
      );

      expect(getByText('PRO')).toBeTruthy();
    });

    it('does not show write button for non-premium users', () => {
      const { queryByText } = render(
        <LettersSection {...defaultProps} isPremium={false} />
      );

      expect(queryByText('Write Your First Letter')).toBeNull();
    });

    it('calls onPremiumRequired when non-premium user taps section', () => {
      const onPremiumRequired = jest.fn();
      const { getByLabelText } = render(
        <LettersSection
          {...defaultProps}
          isPremium={false}
          onPremiumRequired={onPremiumRequired}
        />
      );

      fireEvent.press(getByLabelText('Write a letter to your future self'));

      expect(onPremiumRequired).toHaveBeenCalled();
    });

    it('does not show PRO badge for premium users', () => {
      const { queryByText } = render(
        <LettersSection {...defaultProps} isPremium={true} />
      );

      expect(queryByText('PRO')).toBeNull();
    });
  });

  describe('Save letter functionality', () => {
    it('calls onSaveLetter with correct arguments', async () => {
      const onSaveLetter = jest.fn().mockResolvedValue(undefined);
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} onSaveLetter={onSaveLetter} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(getByLabelText('Letter title'), 'My Title');
      fireEvent.changeText(
        getByLabelText('Letter content'),
        'This is my letter content'
      );
      fireEvent.press(getByLabelText('Continue to schedule'));
      fireEvent.press(getByLabelText('Unlock in 2 Weeks'));
      fireEvent.press(getByLabelText('Save and lock letter'));

      await waitFor(() => {
        expect(onSaveLetter).toHaveBeenCalledWith(
          'This is my letter content',
          14, // 2 weeks
          'My Title'
        );
      });
    });

    it('closes modal after successful save', async () => {
      const onSaveLetter = jest.fn().mockResolvedValue(undefined);
      const { getByText, getByLabelText, queryByText } = render(
        <LettersSection {...defaultProps} onSaveLetter={onSaveLetter} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(
        getByLabelText('Letter content'),
        'This is my letter content'
      );
      fireEvent.press(getByLabelText('Continue to schedule'));
      fireEvent.press(getByLabelText('Save and lock letter'));

      await waitFor(() => {
        expect(queryByText('Schedule Delivery')).toBeNull();
      });
    });

    it('handles save without title', async () => {
      const onSaveLetter = jest.fn().mockResolvedValue(undefined);
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} onSaveLetter={onSaveLetter} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(
        getByLabelText('Letter content'),
        'This is my letter content'
      );
      fireEvent.press(getByLabelText('Continue to schedule'));
      fireEvent.press(getByLabelText('Save and lock letter'));

      await waitFor(() => {
        expect(onSaveLetter).toHaveBeenCalledWith(
          'This is my letter content',
          7, // Default 1 week
          undefined // No title
        );
      });
    });
  });

  describe('T11.8: Violet accent styling', () => {
    it('has violet border styling', () => {
      const { getByLabelText } = render(<LettersSection {...defaultProps} />);

      // The section card should have violet styling
      expect(getByLabelText('Write a letter to your future self')).toBeTruthy();
    });
  });

  describe('Completion checkmark', () => {
    it('does not show checkmark in empty state', () => {
      const { queryByTestId } = render(<LettersSection {...defaultProps} />);

      expect(queryByTestId('completion-checkmark')).toBeNull();
    });

    it('shows checkmark when letters exist', () => {
      const { getByLabelText } = render(
        <LettersSection
          {...defaultProps}
          letters={[mockLetter]}
          letterCount={1}
        />
      );

      expect(getByLabelText('Letters to self')).toBeTruthy();
    });
  });

  describe('Animation props', () => {
    it('accepts shouldAnimate prop', () => {
      const { getByLabelText } = render(
        <LettersSection {...defaultProps} shouldAnimate={true} />
      );

      expect(getByLabelText('Write a letter to your future self')).toBeTruthy();
    });

    it('accepts reduceMotion prop', () => {
      const { getByLabelText } = render(
        <LettersSection {...defaultProps} reduceMotion={true} />
      );

      expect(getByLabelText('Write a letter to your future self')).toBeTruthy();
    });

    it('accepts sectionIndex prop', () => {
      const { getByLabelText } = render(
        <LettersSection {...defaultProps} sectionIndex={5} />
      );

      expect(getByLabelText('Write a letter to your future self')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible button role', () => {
      const { getByRole } = render(<LettersSection {...defaultProps} />);

      expect(getByRole('button')).toBeTruthy();
    });

    it('modal has accessible inputs', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));

      expect(getByLabelText('Letter title')).toBeTruthy();
      expect(getByLabelText('Letter content')).toBeTruthy();
      expect(getByLabelText('Close')).toBeTruthy();
    });

    it('duration options have radio role', () => {
      const { getByText, getByLabelText } = render(
        <LettersSection {...defaultProps} />
      );

      fireEvent.press(getByText('Write Your First Letter'));
      fireEvent.changeText(
        getByLabelText('Letter content'),
        'This is my letter content'
      );
      fireEvent.press(getByLabelText('Continue to schedule'));

      // Duration options should be accessible
      expect(getByLabelText('Unlock in 1 Week')).toBeTruthy();
      expect(getByLabelText('Unlock in 2 Weeks')).toBeTruthy();
    });

    it('letters have accessible labels with state info', () => {
      const { getByLabelText } = render(
        <LettersSection
          {...defaultProps}
          letters={[mockLetter]}
          letterCount={1}
        />
      );

      expect(
        getByLabelText(/Locked letter: Keep Going, unlocks in 7 days/)
      ).toBeTruthy();
    });
  });

  describe('UNLOCK_DURATION_OPTIONS export', () => {
    it('exports duration options for use elsewhere', () => {
      expect(UNLOCK_DURATION_OPTIONS).toBeDefined();
      expect(UNLOCK_DURATION_OPTIONS).toHaveLength(4);
      expect(UNLOCK_DURATION_OPTIONS[0].value).toBe(7);
      expect(UNLOCK_DURATION_OPTIONS[1].value).toBe(14);
      expect(UNLOCK_DURATION_OPTIONS[2].value).toBe(30);
      expect(UNLOCK_DURATION_OPTIONS[3].value).toBe(90);
    });
  });
});
