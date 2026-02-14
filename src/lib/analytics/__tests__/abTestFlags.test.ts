import {
  getABVariant,
  getAllAssignments,
  overrideVariant,
  resetAllAssignments,
  EXPERIMENTS,
} from '../abTestFlags';

describe('abTestFlags', () => {
  beforeEach(async () => {
    await resetAllAssignments();
  });

  it('returns a valid variant for active experiments', () => {
    const variant = getABVariant('paywall_copy_v1');
    expect(EXPERIMENTS.paywall_copy_v1.variants).toContain(variant);
  });

  it('returns control for inactive experiments', () => {
    const variant = getABVariant('paywall_layout');
    expect(variant).toBe('control');
  });

  it('returns control for unknown experiments', () => {
    const variant = getABVariant('nonexistent_experiment');
    expect(variant).toBe('control');
  });

  it('returns stable assignments across calls', () => {
    const first = getABVariant('paywall_copy_v1');
    const second = getABVariant('paywall_copy_v1');
    expect(first).toBe(second);
  });

  it('tracks all assignments', () => {
    getABVariant('paywall_copy_v1');
    getABVariant('paywall_timing');
    const assignments = getAllAssignments();
    expect(assignments).toHaveProperty('paywall_copy_v1');
    expect(assignments).toHaveProperty('paywall_timing');
  });

  it('allows overriding variants', () => {
    overrideVariant('paywall_copy_v1', 'social_proof');
    expect(getABVariant('paywall_copy_v1')).toBe('social_proof');
  });
});
