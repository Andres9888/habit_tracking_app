/**
 * A/B Test Experiment Definitions
 *
 * To add a new experiment: add an entry here, read with getABVariant(key).
 */

export interface Experiment {
  variants: string[];
  active: boolean;
  description?: string;
}

export const EXPERIMENTS: Record<string, Experiment> = {
  paywall_copy_v1: {
    active: true,
    description: 'Test different paywall headline copy styles',
    variants: ['control', 'urgency', 'social_proof'],
  },
  paywall_layout: {
    active: false,
    description: 'Test benefits-first layout vs current CTA-first',
    variants: ['control', 'benefits_first'],
  },
  paywall_timing: {
    active: true,
    description: 'Test showing paywall after 3 habits vs immediately at limit',
    variants: ['control', 'delayed'],
  },
};
