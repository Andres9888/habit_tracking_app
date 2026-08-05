export type GrowthType = 'simple' | 'average' | 'complex';

export interface GrowthTypeMeta {
  label: string;
  days: number;
  pillBg: string;
  pillFg: string;
}

const META: Record<GrowthType, GrowthTypeMeta> = {
  simple: {
    label: 'Simple',
    days: 30,
    pillBg: '#dcfce7',
    pillFg: '#166534',
  },
  average: {
    label: 'Average',
    days: 66,
    pillBg: '#fef3c7',
    pillFg: '#92400e',
  },
  complex: {
    label: 'Complex',
    days: 120,
    pillBg: '#ede9fe',
    pillFg: '#5b21b6',
  },
};

export function getGrowthTypeMeta(type: GrowthType | undefined): GrowthTypeMeta | null {
  if (!type) return null;
  return META[type] ?? null;
}
