/**
 * Functions with no client caller must not be reachable from the public API.
 * Convex exposes every `mutation`/`query` export, including barrel re-exports.
 */
import * as habitStrength from './habitStrength';
import * as templatesDataSeed from './templatesDataSeed';

type Registered = { isPublic?: boolean; isInternal?: boolean };

const internalOnly = (fn: unknown) => {
  const registered = fn as Registered;
  expect(registered.isInternal).toBe(true);
  expect(registered.isPublic).toBeFalsy();
};

describe('public surface', () => {
  it('keeps the unused strength mutations internal', () => {
    internalOnly(habitStrength.updateHabitStrength);
    internalOnly(habitStrength.recalculateHabitStrength);
    internalOnly(habitStrength.updateHabitParameters);
  });

  it('keeps the seed module catalog queries internal', () => {
    internalOnly(templatesDataSeed.list);
    internalOnly(templatesDataSeed.getById);
    internalOnly(templatesDataSeed.getPopular);
    internalOnly(templatesDataSeed.getTemplateCount);
    internalOnly(templatesDataSeed.listTemplateNames);
  });
});
