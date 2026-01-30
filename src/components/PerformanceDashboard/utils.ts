/**
 * Performance Dashboard Utilities
 * Helper functions for the dashboard component.
 */

import type { DashboardConfig, DashboardState, StatusLevel } from './types';

/** Calculate overall status from all metric statuses */
export function getOverallStatus(
  state: Pick<DashboardState, 'fps' | 'memory' | 'network' | 'renders'>
): StatusLevel {
  const statuses = new Set([
    state.fps.status,
    state.memory.status,
    state.network.status,
    state.renders.status,
  ]);
  if (statuses.has('critical')) return 'critical';
  if (statuses.has('warning')) return 'warning';
  return 'good';
}

/** Get position style based on config */
export function getPositionStyle(position?: DashboardConfig['position']) {
  switch (position) {
    case 'top-left': {
      return { left: 16, top: 60 };
    }
    case 'top-right': {
      return { right: 16, top: 60 };
    }
    case 'bottom-left': {
      return { bottom: 100, left: 16 };
    }
    default: {
      return { bottom: 100, right: 16 };
    }
  }
}
