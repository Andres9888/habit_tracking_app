import * as fs from 'fs';
import * as path from 'path';

describe('useCalendarHandlers offline toggle contract', () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, '../useCalendarHandlers.ts'),
    'utf8'
  );

  it('uses the optimistic toggle path with offline queue support', () => {
    expect(source).toContain('useOptimisticToggleMutation');
    expect(source).toContain('useIsOnline');
    expect(source).toContain('{ isOnline }');
    expect(source).toContain('completed: !wasCompleted');
  });
});
