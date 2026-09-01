import type { MonthRate, OneFixInsight, WeekdayStat } from '../../../insights';
import { buildNextStep } from '../nextStep';

const TODAY = '2026-08-31';
/** Fridays in August 2026. */
const FRIDAYS = ['2026-08-07', '2026-08-14', '2026-08-21', '2026-08-28'];
const PLURAL = [
  'Sundays',
  'Mondays',
  'Tuesdays',
  'Wednesdays',
  'Thursdays',
  'Fridays',
  'Saturdays',
];

const stat = (weekday: number, rate: number): WeekdayStat => ({
  done: Math.round(rate * 4),
  plural: PLURAL[weekday] as string,
  rate,
  scheduled: 4,
  short: 'X',
  weekday,
});

const month = (index: number, ratePct: number): MonthRate => ({
  done: Math.round((ratePct / 100) * 30),
  label: index === 6 ? 'July' : 'August',
  month: index,
  ratePct,
  scheduled: 30,
});

/** Fridays weak; every other scheduled weekday sits at `otherRate`. */
function oneFix(otherRate = 0.9, weakRate = 0.25): OneFixInsight {
  const weakest = stat(5, weakRate);
  return {
    bars: [0, 1, 2, 3, 4, 5, 6].map((weekday) =>
      weekday === 5 ? weakest : stat(weekday, otherRate)
    ),
    recentMissed: 3,
    recentOf: 4,
    weakest,
  };
}

/** August with `logged` of the four Fridays checked off. */
const done = (logged: number) => new Set(FRIDAYS.slice(0, logged));

describe('buildNextStep', () => {
  it('says nothing without a weak weekday', () => {
    const source = { doneDates: done(1), oneFix: null };
    expect(
      buildNextStep(source, [month(6, 90), month(7, 83)], TODAY)
    ).toBeNull();
  });

  it('projects the month covering the weak weekday would have had', () => {
    const source = { doneDates: done(1), oneFix: oneFix() };
    const step = buildNextStep(source, [month(6, 90), month(7, 83)], TODAY);

    expect(step?.text).toBe(
      "Covering Fridays would have put August at 93%. It's the only weekday under 60%."
    );
  });

  it('stays silent when the month is already the best in the window', () => {
    const source = { doneDates: done(1), oneFix: oneFix() };
    expect(
      buildNextStep(source, [month(6, 80), month(7, 83)], TODAY)
    ).toBeNull();
  });

  it('stays silent when there is no miss left to cover', () => {
    const source = { doneDates: done(4), oneFix: oneFix() };
    expect(
      buildNextStep(source, [month(6, 90), month(7, 83)], TODAY)
    ).toBeNull();
  });

  it('drops the "only weekday" claim when another day is under it too', () => {
    const source = { doneDates: done(1), oneFix: oneFix(0.58) };
    const step = buildNextStep(source, [month(6, 90), month(7, 83)], TODAY);

    expect(step?.text).toBe(
      'Covering Fridays would have put August at 93%. Fridays sit at 25% — every other day is above 50%.'
    );
  });

  it('leads with the projection alone when no clause is true', () => {
    const source = { doneDates: done(1), oneFix: oneFix(0.3) };
    const step = buildNextStep(source, [month(6, 90), month(7, 83)], TODAY);

    expect(step?.text).toBe('Covering Fridays would have put August at 93%.');
  });

  it('needs an elapsed month with scheduled days', () => {
    const source = { doneDates: done(1), oneFix: oneFix() };
    expect(buildNextStep(source, [], TODAY)).toBeNull();
  });
});
