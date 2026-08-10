/**
 * Build a provisional science insight for days 0–13.
 * Returns null when personal insights should take over, or when there is no
 * template science to show (manual habits keep the dashed placeholder).
 */
export interface HabitScienceSource {
  authors: string;
  title: string;
  year?: string;
}

export interface HabitScienceFields {
  evidence?: string;
  howToStart?: string[];
  lead?: string;
  sources?: HabitScienceSource[];
  tips?: string[];
}

export interface ProvisionalInsight {
  attribution: string | null;
  body: string;
  daysRemaining: number;
  fillPct: number;
  heading: string;
}

export function buildProvisionalInsight(
  science: HabitScienceFields | null | undefined,
  daysOfData: number,
  minDays = 14
): ProvisionalInsight | null {
  if (!science || daysOfData >= minDays) return null;

  const tip = science.tips?.find((text) => text.trim())?.trim();
  const step = science.howToStart?.find((text) => text.trim())?.trim();
  const evidence = science.evidence?.trim();
  const lead = science.lead?.trim();

  const heading = tip ?? step ?? lead;
  const body = evidence ?? lead ?? tip ?? step;
  if (!heading || !body) return null;

  const source = science.sources?.[0];
  const attribution = source
    ? `From the science · ${source.title}${
        source.authors ? `, ${source.authors}` : ''
      }`
    : null;

  const remaining = Math.max(0, minDays - daysOfData);
  return {
    attribution,
    body,
    daysRemaining: remaining,
    fillPct: Math.min(100, (daysOfData / minDays) * 100),
    heading,
  };
}
