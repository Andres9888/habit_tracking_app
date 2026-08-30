import fs from 'node:fs';
import path from 'node:path';

const HABITS_ROOT = path.resolve(__dirname, '../../..');

function readHabitsSource(relativePath: string) {
  return fs.readFileSync(path.join(HABITS_ROOT, relativePath), 'utf8');
}

describe('habits list interaction performance', () => {
  it('defers card recalculation without deferring date navigation', () => {
    const listStateSource = readHabitsSource('hooks/useHabitsListState.ts');
    const weekDatesSource = readHabitsSource('hooks/useHabitsWeekDates.ts');

    expect(listStateSource).toContain(
      'useDeferredValue(\n    weekDatesState.weekDateStrings\n  )'
    );
    expect(weekDatesSource).not.toContain('useTransition');
  });
});
