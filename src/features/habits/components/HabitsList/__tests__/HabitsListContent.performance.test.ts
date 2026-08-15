import fs from 'node:fs';
import path from 'node:path';

const HABITS_ROOT = path.resolve(__dirname, '../../..');

function readHabitsSource(relativePath: string) {
  return fs.readFileSync(path.join(HABITS_ROOT, relativePath), 'utf8');
}

describe('habits list interaction performance', () => {
  it('keeps the mounted card window bounded', () => {
    const source = readHabitsSource(
      'components/HabitsList/HabitsListContent.tsx'
    );

    expect(source).toContain('initialNumToRender={8}');
    expect(source).toContain('maxToRenderPerBatch={8}');
    expect(source).toContain('removeClippedSubviews');
    expect(source).toContain('updateCellsBatchingPeriod={16}');
    expect(source).toContain('windowSize={7}');
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
