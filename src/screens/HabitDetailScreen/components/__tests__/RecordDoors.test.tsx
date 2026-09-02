/**
 * Analytics is empty until there are 14 days behind it. The door stays
 * openable — it is the only route to the screen anywhere in the app — but its
 * subtitle stops promising "what helps you stay consistent" before there is
 * any data to say it with.
 */
import { fireEvent, render } from '@testing-library/react-native';
import { MIN_DAYS_OF_DATA } from '../../insights';
import { analyticsSubtitle, RecordDoors } from '../RecordDoors';

function renderDoors(daysOfData: number) {
  const onOpenAnalytics = jest.fn();
  const onOpenHistory = jest.fn();
  const view = render(
    <RecordDoors
      daysOfData={daysOfData}
      onOpenAnalytics={onOpenAnalytics}
      onOpenHistory={onOpenHistory}
    />
  );
  return { ...view, onOpenAnalytics, onOpenHistory };
}

/** The unlock rail is decorative, so it is hidden from the a11y tree. */
function hasRail(view: ReturnType<typeof renderDoors>): boolean {
  return (
    view.UNSAFE_queryAllByProps({
      importantForAccessibility: 'no-hide-descendants',
    }).length > 0
  );
}

describe('analyticsSubtitle', () => {
  it('counts down to the unlock', () => {
    expect(analyticsSubtitle(5)).toBe('Unlocks after 14 days · 9 to go');
  });

  it('never counts below zero', () => {
    expect(analyticsSubtitle(-3)).toBe('Unlocks after 14 days · 14 to go');
  });

  it('switches to the promise once the data is there', () => {
    expect(analyticsSubtitle(MIN_DAYS_OF_DATA)).toBe(
      'See what helps you stay consistent'
    );
  });
});

describe('RecordDoors', () => {
  it('counts down and draws the rail while Analytics is still empty', () => {
    const view = renderDoors(5);

    expect(view.getByText('Unlocks after 14 days · 9 to go')).toBeTruthy();
    expect(hasRail(view)).toBe(true);
  });

  it('drops the countdown and the rail once the data is there', () => {
    const view = renderDoors(MIN_DAYS_OF_DATA);

    expect(view.getByText('See what helps you stay consistent')).toBeTruthy();
    expect(view.queryByText(/Unlocks after/)).toBeNull();
    expect(hasRail(view)).toBe(false);
  });

  it('keeps the locked door openable', () => {
    const view = renderDoors(0);

    fireEvent.press(view.getByLabelText('Patterns & trends'));
    fireEvent.press(view.getByLabelText('Calendar & notes'));

    expect(view.onOpenAnalytics).toHaveBeenCalledTimes(1);
    expect(view.onOpenHistory).toHaveBeenCalledTimes(1);
  });
});
