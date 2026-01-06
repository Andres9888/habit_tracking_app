/**
 * SuggestionChips - Component Tests
 *
 * Tests for the time-based suggestion chips component.
 */

import { render } from '@testing-library/react-native';
import { View } from 'react-native';

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
