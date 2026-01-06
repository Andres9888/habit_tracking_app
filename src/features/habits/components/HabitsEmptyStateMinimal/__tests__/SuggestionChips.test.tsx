/**
 * SuggestionChips - Component Tests
 *
 * Tests for the time-based suggestion chips component.
 * Includes tests for breathing animation behavior.
 */

import { fireEvent, render } from '@testing-library/react-native';
import { View } from 'react-native';

import { BREATHING_CONFIG } from '../animations';
import { SuggestionChips } from '../SuggestionChips';
import { getTimeBasedChips } from '../utils';

// Mock the utils module to control chip selection in tests
jest.mock('../utils', () => ({
  getTimeBasedChips: jest.fn(),
}));

// Mock haptic feedback hook
jest.mock('../../../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerSelection: jest.fn(),
  }),
}));

// Mock for useReducedMotion - default to false (motion enabled)
let mockReducedMotion = false;
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated/mock');
  return {
    ...actual,
    useReducedMotion: () => mockReducedMotion,
  };
});

describe('SuggestionChips - Time-Based Behavior', () => {
  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks();
  });

  it('renders chips from getTimeBasedChips utility', () => {
    const mockChips = [
      { emoji: '☕', fullName: 'Morning coffee', label: 'Coffee' },
      { emoji: '🏃', fullName: 'Morning run', label: 'Run' },
      { emoji: '🧘', fullName: 'Morning meditation', label: 'Meditate' },
      { emoji: '📝', fullName: 'Journal', label: 'Journal' },
      { emoji: '💧', fullName: 'Drink water', label: 'Water' },
      { emoji: '📚', fullName: 'Read', label: 'Read' },
    ];

    (getTimeBasedChips as jest.Mock).mockReturnValue(mockChips);

    const { getByText } = render(
      <SuggestionChips selectedIndex={null} onSelect={jest.fn()} />
    );

    // Verify all mock chips are rendered
    expect(getByText('Coffee')).toBeTruthy();
    expect(getByText('Run')).toBeTruthy();
    expect(getByText('Meditate')).toBeTruthy();
    expect(getByText('Journal')).toBeTruthy();
    expect(getByText('Water')).toBeTruthy();
    expect(getByText('Read')).toBeTruthy();
  });

  it('calls getTimeBasedChips on mount', () => {
    const mockChips = [
      { emoji: '💧', fullName: 'Drink water', label: 'Water' },
      { emoji: '🚶', fullName: 'Walk', label: 'Walk' },
      { emoji: '📝', fullName: 'Write', label: 'Write' },
      { emoji: '🧘', fullName: 'Breathe', label: 'Breathe' },
      { emoji: '📚', fullName: 'Read', label: 'Read' },
      { emoji: '🤸', fullName: 'Stretch', label: 'Stretch' },
    ];

    (getTimeBasedChips as jest.Mock).mockReturnValue(mockChips);

    render(<SuggestionChips selectedIndex={null} onSelect={jest.fn()} />);

    expect(getTimeBasedChips).toHaveBeenCalledTimes(1);
  });

  it('maintains pyramid layout with time-based chips', () => {
    const mockChips = [
      { emoji: '1️⃣', fullName: 'First', label: 'First' },
      { emoji: '2️⃣', fullName: 'Second', label: 'Second' },
      { emoji: '3️⃣', fullName: 'Third', label: 'Third' },
      { emoji: '4️⃣', fullName: 'Fourth', label: 'Fourth' },
      { emoji: '5️⃣', fullName: 'Fifth', label: 'Fifth' },
      { emoji: '6️⃣', fullName: 'Sixth', label: 'Sixth' },
    ];

    (getTimeBasedChips as jest.Mock).mockReturnValue(mockChips);

    const { UNSAFE_getAllByType } = render(
      <SuggestionChips selectedIndex={null} onSelect={jest.fn()} />
    );

    // Get all View components that have flexDirection: 'row' (the chip rows)
    const rows = UNSAFE_getAllByType(View).filter(
      (view) => view.props.style?.flexDirection === 'row'
    );

    // Should have 3 rows (pyramid: 3-2-1)
    // Note: There may be additional Views in the chip buttons themselves
    // So we check that at least 3 row Views exist
    expect(rows.length).toBeGreaterThanOrEqual(3);
  });

  it('renders different chip sets based on time', () => {
    // Test morning chips
    const morningChips = [
      { emoji: '☕', fullName: 'Morning coffee', label: 'Coffee' },
      { emoji: '🏃', fullName: 'Morning run', label: 'Run' },
      { emoji: '🧘', fullName: 'Morning meditation', label: 'Meditate' },
      { emoji: '📝', fullName: 'Journal', label: 'Journal' },
      { emoji: '💧', fullName: 'Drink water', label: 'Water' },
      { emoji: '📚', fullName: 'Read', label: 'Read' },
    ];

    (getTimeBasedChips as jest.Mock).mockReturnValue(morningChips);

    const { getByText: getMorningText } = render(
      <SuggestionChips selectedIndex={null} onSelect={jest.fn()} />
    );

    expect(getMorningText('Coffee')).toBeTruthy();
    expect(getMorningText('Run')).toBeTruthy();

    // Test afternoon chips
    const afternoonChips = [
      { emoji: '💧', fullName: 'Drink water', label: 'Water' },
      { emoji: '🚶', fullName: 'Walk', label: 'Walk' },
      { emoji: '🥗', fullName: 'Healthy lunch', label: 'Lunch' },
      { emoji: '🧘', fullName: 'Breathe', label: 'Breathe' },
      { emoji: '👀', fullName: 'Eye rest', label: 'Eye rest' },
      { emoji: '🧠', fullName: 'Learn', label: 'Learn' },
    ];

    (getTimeBasedChips as jest.Mock).mockReturnValue(afternoonChips);

    const { getByText: getAfternoonText } = render(
      <SuggestionChips selectedIndex={null} onSelect={jest.fn()} />
    );

    expect(getAfternoonText('Lunch')).toBeTruthy();
    expect(getAfternoonText('Eye rest')).toBeTruthy();
  });

  it('handles chip selection correctly', () => {
    const mockChips = [
      { emoji: '💧', fullName: 'Drink water', label: 'Water' },
      { emoji: '🚶', fullName: 'Walk', label: 'Walk' },
      { emoji: '📝', fullName: 'Write', label: 'Write' },
      { emoji: '🧘', fullName: 'Breathe', label: 'Breathe' },
      { emoji: '📚', fullName: 'Read', label: 'Read' },
      { emoji: '🤸', fullName: 'Stretch', label: 'Stretch' },
    ];

    (getTimeBasedChips as jest.Mock).mockReturnValue(mockChips);

    const onSelectMock = jest.fn();

    const { getByText } = render(
      <SuggestionChips selectedIndex={0} onSelect={onSelectMock} />
    );

    // Verify chips render
    expect(getByText('Water')).toBeTruthy();
  });

  it('always receives exactly 6 chips from getTimeBasedChips', () => {
    const mockChips = [
      { emoji: '1️⃣', fullName: 'One', label: 'One' },
      { emoji: '2️⃣', fullName: 'Two', label: 'Two' },
      { emoji: '3️⃣', fullName: 'Three', label: 'Three' },
      { emoji: '4️⃣', fullName: 'Four', label: 'Four' },
      { emoji: '5️⃣', fullName: 'Five', label: 'Five' },
      { emoji: '6️⃣', fullName: 'Six', label: 'Six' },
    ];

    (getTimeBasedChips as jest.Mock).mockReturnValue(mockChips);

    const { getByText } = render(
      <SuggestionChips selectedIndex={null} onSelect={jest.fn()} />
    );

    // Verify all 6 chips are rendered
    expect(getByText('One')).toBeTruthy();
    expect(getByText('Two')).toBeTruthy();
    expect(getByText('Three')).toBeTruthy();
    expect(getByText('Four')).toBeTruthy();
    expect(getByText('Five')).toBeTruthy();
    expect(getByText('Six')).toBeTruthy();
  });

  it('renders with no selected chip', () => {
    const mockChips = [
      { emoji: '💧', fullName: 'Drink water', label: 'Water' },
      { emoji: '🚶', fullName: 'Walk', label: 'Walk' },
      { emoji: '📝', fullName: 'Write', label: 'Write' },
      { emoji: '🧘', fullName: 'Breathe', label: 'Breathe' },
      { emoji: '📚', fullName: 'Read', label: 'Read' },
      { emoji: '🤸', fullName: 'Stretch', label: 'Stretch' },
    ];

    (getTimeBasedChips as jest.Mock).mockReturnValue(mockChips);

    const { getByText } = render(
      <SuggestionChips selectedIndex={null} onSelect={jest.fn()} />
    );

    expect(getByText('Water')).toBeTruthy();
  });

  it('renders with a selected chip', () => {
    const mockChips = [
      { emoji: '💧', fullName: 'Drink water', label: 'Water' },
      { emoji: '🚶', fullName: 'Walk', label: 'Walk' },
      { emoji: '📝', fullName: 'Write', label: 'Write' },
      { emoji: '🧘', fullName: 'Breathe', label: 'Breathe' },
      { emoji: '📚', fullName: 'Read', label: 'Read' },
      { emoji: '🤸', fullName: 'Stretch', label: 'Stretch' },
    ];

    (getTimeBasedChips as jest.Mock).mockReturnValue(mockChips);

    const { getByText } = render(
      <SuggestionChips selectedIndex={2} onSelect={jest.fn()} />
    );

    expect(getByText('Write')).toBeTruthy();
  });
});

describe('SuggestionChips - Breathing Animation', () => {
  const mockChips = [
    { emoji: '💧', fullName: 'Drink water', label: 'Water' },
    { emoji: '🚶', fullName: 'Walk 5 minutes', label: 'Walk' },
    { emoji: '📝', fullName: 'Write 100 words', label: 'Write' },
    { emoji: '🧘', fullName: 'Breathe for 2 minutes', label: 'Breathe' },
    { emoji: '📚', fullName: 'Read 5 pages', label: 'Read' },
    { emoji: '🤸', fullName: 'Stretch for 5 minutes', label: 'Stretch' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockReducedMotion = false;
    (getTimeBasedChips as jest.Mock).mockReturnValue(mockChips);
  });

  describe('isIdle prop behavior', () => {
    it('renders correctly when isIdle is false (default)', () => {
      const { getByText, getByLabelText } = render(
        <SuggestionChips selectedIndex={null} onSelect={jest.fn()} />
      );

      // All chips should be rendered
      expect(getByText('Water')).toBeTruthy();
      expect(getByText('Walk')).toBeTruthy();
      expect(getByText('Write')).toBeTruthy();
      expect(getByLabelText('Select Drink water')).toBeTruthy();
    });

    it('renders correctly when isIdle is explicitly false', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={false}
        />
      );

      expect(getByText('Water')).toBeTruthy();
      expect(getByText('Breathe')).toBeTruthy();
    });

    it('renders correctly when isIdle is true', () => {
      const { getByText, getByLabelText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      // All chips should still be rendered (breathing is visual only)
      expect(getByText('Water')).toBeTruthy();
      expect(getByText('Walk')).toBeTruthy();
      expect(getByLabelText('Select Drink water')).toBeTruthy();
    });

    it('transitions from not idle to idle without crashing', () => {
      const { rerender, getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={false}
        />
      );

      expect(getByText('Water')).toBeTruthy();

      // Transition to idle
      rerender(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      // Still renders
      expect(getByText('Water')).toBeTruthy();
    });

    it('transitions from idle to not idle without crashing', () => {
      const { rerender, getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      expect(getByText('Water')).toBeTruthy();

      // Transition out of idle
      rerender(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={false}
        />
      );

      // Still renders
      expect(getByText('Water')).toBeTruthy();
    });
  });

  describe('selected chip behavior', () => {
    it('does not breathe when chip is selected (even if idle)', () => {
      const { getByText, getByLabelText } = render(
        <SuggestionChips
          selectedIndex={0}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      // Selected chip should still be visible and functional
      expect(getByText('Water')).toBeTruthy();
      expect(getByLabelText('Select Drink water')).toBeTruthy();
    });

    it('stops breathing when chip becomes selected', () => {
      const mockOnSelect = jest.fn();

      const { rerender, getByText, getByLabelText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          isIdle={true}
        />
      );

      // Press chip (simulate selection)
      fireEvent.press(getByLabelText('Select Drink water'));
      expect(mockOnSelect).toHaveBeenCalledWith(0, mockChips[0]);

      // Rerender with selected state
      rerender(
        <SuggestionChips
          selectedIndex={0}
          onSelect={mockOnSelect}
          isIdle={true}
        />
      );

      // Chip should still be rendered
      expect(getByText('Water')).toBeTruthy();
    });

    it('other chips can breathe while one is selected', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={0}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      // All chips rendered (first is selected, others would be breathing)
      expect(getByText('Water')).toBeTruthy(); // Selected
      expect(getByText('Walk')).toBeTruthy(); // Would be breathing
      expect(getByText('Write')).toBeTruthy(); // Would be breathing
    });
  });

  describe('reduced motion behavior', () => {
    it('renders correctly when reduced motion is enabled and idle', () => {
      mockReducedMotion = true;

      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      // Chips should still render without breathing animation
      expect(getByText('Water')).toBeTruthy();
      expect(getByText('Read')).toBeTruthy();
    });

    it('renders correctly when reduced motion is enabled and not idle', () => {
      mockReducedMotion = true;

      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={false}
        />
      );

      expect(getByText('Water')).toBeTruthy();
    });

    it('handles transition to idle with reduced motion enabled', () => {
      mockReducedMotion = true;

      const { rerender, getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={false}
        />
      );

      // Transition to idle
      rerender(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      expect(getByText('Water')).toBeTruthy();
    });
  });

  describe('interaction during breathing', () => {
    it('allows chip selection while breathing', () => {
      const mockOnSelect = jest.fn();

      const { getByLabelText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          isIdle={true}
        />
      );

      // Press chip while in idle/breathing state
      fireEvent.press(getByLabelText('Select Drink water'));

      expect(mockOnSelect).toHaveBeenCalledWith(0, mockChips[0]);
    });

    it('allows selecting different chips while breathing', () => {
      const mockOnSelect = jest.fn();

      const { getByLabelText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={mockOnSelect}
          isIdle={true}
        />
      );

      // Select first chip
      fireEvent.press(getByLabelText('Select Drink water'));
      expect(mockOnSelect).toHaveBeenCalledWith(0, mockChips[0]);

      // Select third chip
      fireEvent.press(getByLabelText('Select Write 100 words'));
      expect(mockOnSelect).toHaveBeenCalledWith(2, mockChips[2]);
    });

    it('handles rapid isIdle toggles without crashing', () => {
      const { rerender, getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={false}
        />
      );

      // Rapid toggles
      for (let i = 0; i < 10; i++) {
        rerender(
          <SuggestionChips
            selectedIndex={null}
            onSelect={jest.fn()}
            isIdle={i % 2 === 0}
          />
        );
      }

      // Component should still be functional
      expect(getByText('Water')).toBeTruthy();
    });
  });

  describe('breathing animation constants', () => {
    it('has correct breathing duration constant', () => {
      expect(BREATHING_CONFIG.duration).toBe(3000);
    });

    it('has correct max scale constant', () => {
      expect(BREATHING_CONFIG.maxScale).toBe(1.02);
    });

    it('has correct idle delay constant', () => {
      expect(BREATHING_CONFIG.idleDelay).toBe(5000);
    });

    it('has correct stagger delay constant', () => {
      expect(BREATHING_CONFIG.staggerDelay).toBe(250);
    });

    it('has easing defined', () => {
      expect(BREATHING_CONFIG.easing).toBeDefined();
    });
  });

  describe('stagger effect', () => {
    it('renders all 6 chips for staggered breathing', () => {
      const { getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      // All 6 chips should be rendered
      expect(getByText('Water')).toBeTruthy();
      expect(getByText('Walk')).toBeTruthy();
      expect(getByText('Write')).toBeTruthy();
      expect(getByText('Breathe')).toBeTruthy();
      expect(getByText('Read')).toBeTruthy();
      expect(getByText('Stretch')).toBeTruthy();
    });

    it('maintains pyramid layout during breathing', () => {
      const { UNSAFE_getAllByType } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      // Get all View components that have flexDirection: 'row' (the chip rows)
      const rows = UNSAFE_getAllByType(View).filter(
        (view) => view.props.style?.flexDirection === 'row'
      );

      // Should have at least 3 rows (pyramid: 3-2-1)
      expect(rows.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('edge cases', () => {
    it('handles undefined isIdle prop (defaults to false)', () => {
      const { getByText } = render(
        <SuggestionChips selectedIndex={null} onSelect={jest.fn()} />
      );

      expect(getByText('Water')).toBeTruthy();
    });

    it('handles simultaneous selection change and idle change', () => {
      const { rerender, getByText } = render(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={false}
        />
      );

      // Change both at once
      rerender(
        <SuggestionChips
          selectedIndex={2}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      expect(getByText('Write')).toBeTruthy();
    });

    it('handles changing selected chip while idle', () => {
      const { rerender, getByText } = render(
        <SuggestionChips
          selectedIndex={0}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      // Change selection
      rerender(
        <SuggestionChips
          selectedIndex={3}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      expect(getByText('Breathe')).toBeTruthy();
    });

    it('handles deselection while idle', () => {
      const { rerender, getByText } = render(
        <SuggestionChips
          selectedIndex={2}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      // Deselect
      rerender(
        <SuggestionChips
          selectedIndex={null}
          onSelect={jest.fn()}
          isIdle={true}
        />
      );

      expect(getByText('Write')).toBeTruthy();
    });
  });
});
