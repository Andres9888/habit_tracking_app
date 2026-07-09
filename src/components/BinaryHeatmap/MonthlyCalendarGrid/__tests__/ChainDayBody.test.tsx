import React from 'react';
import { render } from '@testing-library/react-native';
import { ChainDayBody } from '../ChainDayBody';
import type { DayData } from '../types';

function makeDay(overrides: Partial<DayData> = {}): DayData {
  return {
    date: new Date('2026-07-15'),
    dateString: '2026-07-15',
    dayNumber: 15,
    isCurrentMonth: true,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
    isCompleted: false,
    isMissed: false,
    ...overrides,
  };
}

describe('ChainDayBody', () => {
  it('renders a filled link for a completed day', () => {
    const { getByTestId } = render(
      <ChainDayBody
        day={makeDay({ isCompleted: true })}
        habitColor='#10B981'
        connectorStyle='full'
        joinRight={false}
      />
    );
    const dot = getByTestId('chain-day-dot');
    const flat = Array.isArray(dot.props.style)
      ? Object.assign({}, ...dot.props.style.filter(Boolean))
      : dot.props.style;
    expect(flat).toEqual(
      expect.objectContaining({ backgroundColor: '#10B981' })
    );
  });

  it('renders a join bar when joinRight is true and connectorStyle is full', () => {
    const { getByTestId } = render(
      <ChainDayBody
        day={makeDay({ isCompleted: true })}
        habitColor='#10B981'
        connectorStyle='full'
        joinRight
      />
    );
    expect(getByTestId('chain-join-bar')).toBeTruthy();
  });

  it('does not render a join bar when connectorStyle is none, even if joinRight is true', () => {
    const { queryByTestId } = render(
      <ChainDayBody
        day={makeDay({ isCompleted: true })}
        habitColor='#10B981'
        connectorStyle='none'
        joinRight
      />
    );
    expect(queryByTestId('chain-join-bar')).toBeNull();
  });

  it('renders the small DayConnector when connectorStyle is small and joinRight is true', () => {
    const { getByTestId } = render(
      <ChainDayBody
        day={makeDay({ isCompleted: true })}
        habitColor='#10B981'
        connectorStyle='small'
        joinRight
      />
    );
    expect(getByTestId('chain-small-connector')).toBeTruthy();
  });

  it('renders dotted trace stubs for a missed day', () => {
    const { getByTestId } = render(
      <ChainDayBody
        day={makeDay({ isMissed: true })}
        habitColor='#10B981'
        connectorStyle='full'
        joinRight={false}
      />
    );
    expect(getByTestId('chain-missed-trace-left')).toBeTruthy();
    expect(getByTestId('chain-missed-trace-right')).toBeTruthy();
  });

  it('does not render dotted trace stubs when connectorStyle is none', () => {
    const { queryByTestId } = render(
      <ChainDayBody
        day={makeDay({ isMissed: true })}
        habitColor='#10B981'
        connectorStyle='none'
        joinRight={false}
      />
    );
    expect(queryByTestId('chain-missed-trace-left')).toBeNull();
  });
});
