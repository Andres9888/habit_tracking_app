import {
  getAnnualSavingsPercent,
  getTrialDays,
  getUpsellSubtitle,
} from '@/hooks/usePremium/offeringMath';

describe('getAnnualSavingsPercent', () => {
  it('computes percent saved vs 12x monthly', () => {
    // 12 x 4.99 = 59.88, annual 39.99 -> ~33% saved
    expect(getAnnualSavingsPercent(4.99, 39.99)).toBe(33);
  });

  it('returns null when annual is not cheaper', () => {
    expect(getAnnualSavingsPercent(4.99, 59.88)).toBeNull();
    expect(getAnnualSavingsPercent(4.99, 79.99)).toBeNull();
  });

  it('returns null when either price is missing or invalid', () => {
    expect(getAnnualSavingsPercent(null, 39.99)).toBeNull();
    expect(getAnnualSavingsPercent(4.99, undefined)).toBeNull();
    expect(getAnnualSavingsPercent(0, 39.99)).toBeNull();
    expect(getAnnualSavingsPercent(-1, 39.99)).toBeNull();
    expect(getAnnualSavingsPercent(Number.NaN, 39.99)).toBeNull();
  });
});

describe('getTrialDays', () => {
  it('converts each period unit to days', () => {
    expect(getTrialDays({ price: 0, periodNumberOfUnits: 7, periodUnit: 'DAY' })).toBe(7);
    expect(getTrialDays({ price: 0, periodNumberOfUnits: 1, periodUnit: 'WEEK' })).toBe(7);
    expect(getTrialDays({ price: 0, periodNumberOfUnits: 1, periodUnit: 'MONTH' })).toBe(30);
    expect(getTrialDays({ price: 0, periodNumberOfUnits: 1, periodUnit: 'YEAR' })).toBe(365);
  });

  it('refuses to call a paid intro offer a free trial', () => {
    expect(
      getTrialDays({ price: 1.99, periodNumberOfUnits: 7, periodUnit: 'DAY' })
    ).toBeNull();
  });

  it('returns null when there is no intro offer or the period is unusable', () => {
    expect(getTrialDays(null)).toBeNull();
    expect(getTrialDays(undefined)).toBeNull();
    expect(getTrialDays({ price: 0, periodNumberOfUnits: 0, periodUnit: 'DAY' })).toBeNull();
    expect(
      getTrialDays({ price: 0, periodNumberOfUnits: 7, periodUnit: 'FORTNIGHT' })
    ).toBeNull();
  });
});

describe('getUpsellSubtitle', () => {
  it('leads with the trial when there is one', () => {
    expect(getUpsellSubtitle('$4.99', 7)).toBe('7-day free trial, then $4.99/mo');
    expect(getUpsellSubtitle(null, 7)).toBe('7-day free trial');
  });

  it('falls back to price, then to generic copy', () => {
    expect(getUpsellSubtitle('$4.99', null)).toBe('Everything unlocked — $4.99/mo');
    expect(getUpsellSubtitle(null, null)).toBe('Everything unlocked');
  });
});
