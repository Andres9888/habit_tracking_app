/**
 * StreakRunsCard — "Your runs": every streak this habit has put together,
 * longest first, with the dates that make each one a memory rather than a
 * number. The live run leads even when it is not the longest, in amber,
 * because it is the one that can still be lost.
 *
 * The axis is the goal when there is one, so a run's bar reads as progress
 * toward the target rather than against the personal best alone.
 *
 * The runs are built from year-to-date check-ins while the rail above states
 * the all-time record, so "★ best" is withheld unless the longest run shown
 * actually reaches that record — otherwise the two cards contradict each other.
 */
import { View } from 'react-native';
import type { InsightPalette } from '../../insightPalette';
import {
  rankStreakRuns,
  runRangeLabel,
  runTrend,
  type StreakRun,
} from '../../insights';
import { CardEyebrow } from '../CardEyebrow';
import { InsightCard } from '../InsightCard';
import { CardFootnote } from '../CardFootnote';
import { goalRowMeta, runsFootnote, runsNote } from './runsCopy';
import { StreakRunRow } from './StreakRunRow';

interface StreakRunsCardProps {
  /** All-time record from the backend; guards the "★ best" badge. */
  bestStreak?: number;
  goalDuration?: number;
  palette: InsightPalette;
  runs: StreakRun[];
  today?: string;
}

export function StreakRunsCard({
  bestStreak = 0,
  goalDuration = 0,
  palette,
  runs,
  today,
}: StreakRunsCardProps) {
  if (runs.length === 0) return null;

  const ranked = rankStreakRuns(runs);
  const longest = Math.max(...runs.map((run) => run.length));
  const isRecord = longest >= bestStreak;
  const axis = Math.max(longest, goalDuration, 1);
  const current = runs.find((run) => run.isCurrent);

  return (
    <InsightCard palette={palette}>
      <CardEyebrow
        label='Your runs'
        note={runsNote(runs.length, goalDuration)}
        palette={palette}
      />
      <View style={{ gap: 9, marginTop: 15 }}>
        {ranked.map((run) => (
          <RunRow
            key={run.start}
            axis={axis}
            isLongest={run.length === longest && isRecord}
            palette={palette}
            run={run}
            today={today}
          />
        ))}
        {goalDuration > 0 ? (
          <StreakRunRow
            dashed
            meta={goalRowMeta(current, goalDuration)}
            numeral={goalDuration}
            numeralColor={palette.amber}
            palette={palette}
            pct={0}
            track='transparent'
            unit='goal'
          />
        ) : null}
      </View>
      <CardFootnote palette={palette}>
        {runsFootnote(ranked.length, runs.length, runTrend(runs))}
      </CardFootnote>
    </InsightCard>
  );
}

function RunRow({
  axis,
  isLongest,
  palette,
  run,
  today,
}: {
  axis: number;
  isLongest: boolean;
  palette: InsightPalette;
  run: StreakRun;
  today?: string;
}) {
  const fill = run.isCurrent
    ? palette.amberBar
    : isLongest
      ? palette.green
      : palette.greenSoft;

  return (
    <StreakRunRow
      badge={isLongest && !run.isCurrent ? '★ best' : undefined}
      fill={fill}
      meta={runRangeLabel(run, today)}
      numeral={run.length}
      numeralColor={run.isCurrent ? palette.amberBar : palette.textPrimary}
      palette={palette}
      pct={(run.length / axis) * 100}
      track={run.isCurrent ? palette.amberBg : palette.cellEmpty}
      unit='days'
    />
  );
}
