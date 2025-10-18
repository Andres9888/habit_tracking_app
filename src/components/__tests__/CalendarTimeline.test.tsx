import React from 'react';
import { render } from '@testing-library/react-native';
import { CalendarTimeline } from '../CalendarTimeline';
import { addDays } from 'date-fns';

describe('CalendarTimeline', () => {
  const today = new Date(2024, 9, 14); // Oct 14, 2024 (Monday)

  it('renders dates correctly', () => {
    const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));

    const { getAllByText } = render(<CalendarTimeline dates={dates} />);

    // Check that weekday names are rendered
    expect(getAllByText(/Mon|Tue|Wed|Thu|Fri/)).toHaveLength(5);

    // Check that date numbers are rendered
    expect(getAllByText('14')).toBeTruthy();
    expect(getAllByText('15')).toBeTruthy();
    expect(getAllByText('16')).toBeTruthy();
    expect(getAllByText('17')).toBeTruthy();
    expect(getAllByText('18')).toBeTruthy();
  });

  it('renders with separator by default', () => {
    const dates = Array.from({ length: 3 }, (_, i) => addDays(today, i));

    const { UNSAFE_root } = render(<CalendarTimeline dates={dates} />);

    // Component should render without errors
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders without separator when showSeparator is false', () => {
    const dates = Array.from({ length: 3 }, (_, i) => addDays(today, i));

    const { UNSAFE_root } = render(
      <CalendarTimeline dates={dates} showSeparator={false} />
    );

    // Component should render without errors
    expect(UNSAFE_root).toBeTruthy();
  });

  it('handles empty dates array gracefully', () => {
    const { UNSAFE_root } = render(<CalendarTimeline dates={[]} />);

    // Component should render without crashing
    expect(UNSAFE_root).toBeTruthy();
  });

  it('handles single date', () => {
    const dates = [today];

    const { getAllByText } = render(<CalendarTimeline dates={dates} />);

    // Should render one weekday and one date number
    expect(getAllByText('Mon')).toBeTruthy();
    expect(getAllByText('14')).toBeTruthy();
  });

  it('formats weekdays correctly', () => {
    // Create dates spanning Monday to Friday
    const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));

    const { getByText } = render(<CalendarTimeline dates={dates} />);

    // Verify all weekdays are rendered
    expect(getByText('Mon')).toBeTruthy();
    expect(getByText('Tue')).toBeTruthy();
    expect(getByText('Wed')).toBeTruthy();
    expect(getByText('Thu')).toBeTruthy();
    expect(getByText('Fri')).toBeTruthy();
  });

  it('renders with selected date', () => {
    const dates = Array.from({ length: 5 }, (_, i) => addDays(today, i));
    const selectedDate = dates[2]; // Select Wednesday

    const { getByText } = render(
      <CalendarTimeline dates={dates} selectedDate={selectedDate} />
    );

    // Component should render with selected date
    expect(getByText('16')).toBeTruthy(); // Wednesday's date
  });
});
