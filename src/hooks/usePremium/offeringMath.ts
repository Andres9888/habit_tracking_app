/**
 * Pure derivations over RevenueCat offering data.
 *
 * Kept out of the hook so the arithmetic behind money-facing copy ("save 17%",
 * "7-day free trial") is unit-testable. Every function returns null rather than
 * guessing: we never advertise a saving or a trial we can't substantiate.
 */

interface IntroPriceLike {
  price?: number | null;
  periodUnit?: string | null;
  periodNumberOfUnits?: number | null;
}

/**
 * Percent saved paying yearly instead of 12x monthly.
 * Null unless both prices are known and annual is genuinely cheaper.
 */
export function getAnnualSavingsPercent(
  monthlyPrice: number | null | undefined,
  annualPrice: number | null | undefined
): number | null {
  if (typeof monthlyPrice !== 'number' || typeof annualPrice !== 'number') {
    return null;
  }
  if (!Number.isFinite(monthlyPrice) || !Number.isFinite(annualPrice)) {
    return null;
  }
  if (monthlyPrice <= 0 || annualPrice <= 0) return null;

  const yearlyAtMonthlyRate = monthlyPrice * 12;
  if (annualPrice >= yearlyAtMonthlyRate) return null;

  return Math.round((1 - annualPrice / yearlyAtMonthlyRate) * 100);
}

/**
 * Length of a genuinely free introductory offer, in days.
 * Null when there is no intro offer, or the intro offer costs money — so copy
 * only ever says "free trial" when the store will actually charge nothing.
 */
export function getTrialDays(
  introPrice: IntroPriceLike | null | undefined
): number | null {
  if (!introPrice) return null;
  if (introPrice.price !== 0) return null;

  const units = introPrice.periodNumberOfUnits;
  if (typeof units !== 'number' || !Number.isFinite(units) || units <= 0) {
    return null;
  }

  switch (introPrice.periodUnit?.toString().toUpperCase()) {
    case 'DAY':
      return units;
    case 'WEEK':
      return units * 7;
    case 'MONTH':
      return units * 30;
    case 'YEAR':
      return units * 365;
    default:
      return null;
  }
}

/**
 * Single-line value proposition for the upsell banner.
 * Degrades gracefully as offering data becomes available.
 */
export function getUpsellSubtitle(
  priceString: string | null,
  trialDays: number | null
): string {
  if (trialDays && priceString) {
    return `${trialDays}-day free trial, then ${priceString}/mo`;
  }
  if (trialDays) return `${trialDays}-day free trial`;
  // Phrased as an ask, not a claim: "Everything unlocked" next to an Upgrade
  // button reads like the user already subscribed.
  if (priceString) return `Unlock everything — ${priceString}/mo`;
  return 'Unlock everything';
}
