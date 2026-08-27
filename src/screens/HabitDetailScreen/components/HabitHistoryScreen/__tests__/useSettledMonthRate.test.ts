import { renderHook } from '@testing-library/react-native';
import { useSettledMonthRate } from '../useSettledMonthRate';

const TODAY = '2026-08-15';
const JUNE = new Date(2026, 5, 12);
const AUGUST = new Date(2026, 7, 12);

function rateFor(month: Date, createdAt?: number) {
  const { result } = renderHook(() =>
    useSettledMonthRate({
      completedDates: new Set(['2026-06-01']),
      createdAt,
      month,
      today: TODAY,
    })
  );
  return result.current.rate;
}

describe('useSettledMonthRate', () => {
  it('rates a settled month the habit was alive for', () => {
    const rate = rateFor(JUNE, Date.parse('2026-05-01T09:00:00'));
    expect(rate?.month).toBe(5);
    expect(rate?.done).toBe(1);
  });

  it('withholds a rate for months that ended before the habit existed', () => {
    expect(rateFor(JUNE, Date.parse('2026-08-10T09:00:00'))).toBeUndefined();
  });

  it('rates the creation month itself, which the habit was partly alive for', () => {
    expect(rateFor(JUNE, Date.parse('2026-06-30T09:00:00'))?.month).toBe(5);
  });

  it('withholds a rate for the current month', () => {
    expect(rateFor(AUGUST, Date.parse('2026-05-01T09:00:00'))).toBeUndefined();
  });

  it('rates any settled month when the habit has no createdAt', () => {
    expect(rateFor(JUNE)?.month).toBe(5);
    expect(rateFor(AUGUST)).toBeUndefined();
  });
});
