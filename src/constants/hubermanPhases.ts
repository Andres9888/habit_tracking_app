/**
 * Andrew Huberman's 3-Phase Day Timing System
 *
 * Based on circadian biology and neurochemistry research:
 * - Phase 1 (0-8h after waking): High dopamine/cortisol/epinephrine → peak focus
 * - Phase 2 (9-15h after waking): Serotonin transition → creative/flexible work
 * - Phase 3 (16+h after waking): Adenosine accumulation → wind-down activities
 *
 * Reference: Huberman Lab Podcast - "Optimize Your Daily Routine"
 */

export type HubermanPhase = 'phase1_push' | 'phase2_pivot' | 'phase3_pull';

export interface PhaseInfo {
  id: HubermanPhase;
  label: string;
  shortLabel: string;
  icon: string;
  timeRange: string;
  description: string;
  color: string;
  bgColor: string;
  activities: string[];
}

export const HUBERMAN_PHASES: Record<HubermanPhase, PhaseInfo> = {
  phase1_push: {
    id: 'phase1_push',
    label: 'Phase 1: Push',
    shortLabel: 'Push',
    icon: '🌅',
    timeRange: '0-8h after waking',
    description: 'Peak focus & demanding work',
    color: '#F97316', // Orange-500
    bgColor: '#FFEDD5', // Orange-100
    activities: [
      'Deep work',
      'Learning new skills',
      'Exercise',
      'Problem-solving',
      'Writing',
      'Important decisions',
    ],
  },
  phase2_pivot: {
    id: 'phase2_pivot',
    label: 'Phase 2: Pivot',
    shortLabel: 'Pivot',
    icon: '☀️',
    timeRange: '9-15h after waking',
    description: 'Creative & collaborative work',
    color: '#EAB308', // Yellow-500
    bgColor: '#FEF9C3', // Yellow-100
    activities: [
      'Creative tasks',
      'Brainstorming',
      'Meetings',
      'Social activities',
      'Light exercise',
      'Skill practice',
    ],
  },
  phase3_pull: {
    id: 'phase3_pull',
    label: 'Phase 3: Pull',
    shortLabel: 'Pull',
    icon: '🌙',
    timeRange: '16+h after waking',
    description: 'Wind-down & reflection',
    color: '#8B5CF6', // Violet-500
    bgColor: '#EDE9FE', // Violet-100
    activities: [
      'Journaling',
      'Reading',
      'Meditation',
      'Light stretching',
      'Planning tomorrow',
      'Relaxation',
    ],
  },
} as const;

export const PHASE_ORDER: HubermanPhase[] = [
  'phase1_push',
  'phase2_pivot',
  'phase3_pull',
];

export const getPhaseInfo = (phase: HubermanPhase | undefined): PhaseInfo | null => {
  if (!phase) return null;
  return HUBERMAN_PHASES[phase] ?? null;
};

export const getPhaseFromPreferredTime = (
  preferredTime: string | undefined
): HubermanPhase | null => {
  if (!preferredTime) return null;

  // Map legacy preferredTime values to phases
  const timeToPhase: Record<string, HubermanPhase> = {
    morning: 'phase1_push',
    afternoon: 'phase2_pivot',
    evening: 'phase3_pull',
    // Direct phase values
    phase1_push: 'phase1_push',
    phase2_pivot: 'phase2_pivot',
    phase3_pull: 'phase3_pull',
  };

  return timeToPhase[preferredTime] ?? null;
};

export default HUBERMAN_PHASES;
