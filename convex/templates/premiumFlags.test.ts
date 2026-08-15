import { FREE_STARTER_TEMPLATE_NAMES } from './freeStarterTemplateNames';
import { isPremiumTemplate } from './premiumFlags';
import { PREMIUM_TEMPLATE_NAMES } from './premiumTemplateNames';

describe('premium template flags', () => {
  it('flags a substantial curated premium set (80–100 names)', () => {
    expect(PREMIUM_TEMPLATE_NAMES.length).toBeGreaterThanOrEqual(80);
    expect(PREMIUM_TEMPLATE_NAMES.length).toBeLessThanOrEqual(100);
  });

  it('keeps starter / onboarding names out of the premium list', () => {
    const premium = new Set(
      PREMIUM_TEMPLATE_NAMES.map((name) => name.trim().toLowerCase())
    );
    const overlap = FREE_STARTER_TEMPLATE_NAMES.filter((name) =>
      premium.has(name.trim().toLowerCase())
    );
    expect(overlap).toEqual([]);
  });

  it('keeps the starter set free even if a name later appears in a premium category', () => {
    expect(isPremiumTemplate('5-Minute Meditation')).toBe(false);
    expect(isPremiumTemplate('5-Minute Meditation', 'andrew_huberman')).toBe(
      false
    );
    expect(isPremiumTemplate('Make Your Bed')).toBe(false);
  });

  it('marks Huberman-protocol templates premium', () => {
    expect(
      isPremiumTemplate('Morning Sunlight Viewing', 'andrew_huberman')
    ).toBe(true);
    expect(isPremiumTemplate('Deliberate Cold Exposure')).toBe(true);
  });

  it('does not mark unknown names premium unless they are Huberman-category', () => {
    expect(isPremiumTemplate('Totally Unknown Habit')).toBe(false);
    expect(isPremiumTemplate('Totally Unknown Habit', 'andrew_huberman')).toBe(
      true
    );
  });
});
