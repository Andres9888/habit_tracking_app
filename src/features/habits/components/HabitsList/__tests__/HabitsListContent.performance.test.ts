import fs from 'node:fs';
import path from 'node:path';

const HABITS_ROOT = path.resolve(__dirname, '../../..');

function readHabitsSource(relativePath: string) {
  return fs.readFileSync(path.join(HABITS_ROOT, relativePath), 'utf8');
}

describe('habits list interaction performance', () => {
  it('renders ahead for fast flings without authoritative variable-row layouts', () => {
    const source = readHabitsSource(
      'components/HabitsList/HabitsListContent.tsx'
    );

    expect(source).toContain('initialNumToRender={8}');
    expect(source).toContain('initialNumToRender: 4');
    expect(source).toContain('maxToRenderPerBatch={10}');
    expect(source).toContain('updateCellsBatchingPeriod={16}');
    expect(source).toContain('windowSize={11}');
    // Normal scrolling remains variable-height. During a focus remount only,
    // a measured row-length estimate lets initialScrollIndex mount real cells
    // instead of stranding Fabric on an empty render window.
    expect(source).toContain(
      'focusRequestPending ? getFocusedItemLayout : undefined'
    );
    expect(source).toContain(
      'estimatedRowLength: focusEstimatedRowLength'
    );
    // Far focus targets mount as the initial region instead of walking.
    expect(source).toContain('initialScrollIndex={focusAnchor?.index}');
    expect(source).toContain('key={focusAnchor?.key');
    // No maintainVisibleContentPosition: on Fabric it re-anchors natively
    // without a JS scroll event and strands the render window after the
    // focus remount (unmounted hole under the target).
    expect(source).not.toContain('maintainVisibleContentPosition=');
  });

  it('defers card recalculation without deferring date navigation', () => {
    const listStateSource = readHabitsSource('hooks/useHabitsListState.ts');
    const weekDatesSource = readHabitsSource('hooks/useHabitsWeekDates.ts');

    expect(listStateSource).toContain(
      'useDeferredValue(\n    weekDatesState.weekDateStrings\n  )'
    );
    expect(weekDatesSource).not.toContain('useTransition');
  });
});
