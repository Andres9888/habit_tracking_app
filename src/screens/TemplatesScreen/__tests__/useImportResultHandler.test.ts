/**
 * Recording template → habit is the one thing that must happen in *every*
 * feedback mode. The drill-down runs in 'inline' mode, which skips showSuccess
 * entirely, so feedbackHabitId is never set for it — without this record the
 * "Go to Today and complete X" button has no habit to focus.
 */

import { renderHook } from '@testing-library/react-native';
import { useImportResultHandler } from '../hooks/useImportResultHandler';

function setup() {
  const options = {
    recordImportedHabitId: jest.fn(),
    setImportedTemplateIds: jest.fn(),
    showAlreadyImported: jest.fn(),
    showError: jest.fn(),
    showSuccess: jest.fn(),
  };
  const { result } = renderHook(() => useImportResultHandler(options as never));
  return { handle: result.current, options };
}

describe('useImportResultHandler', () => {
  it('records the habit id for a fresh inline import', () => {
    const { handle, options } = setup();

    handle(
      { habitId: 'habit-1', success: true } as never,
      'tpl-1' as never,
      'inline'
    );

    expect(options.recordImportedHabitId).toHaveBeenCalledWith(
      'tpl-1',
      'habit-1'
    );
    // 'inline' owns its own post-add panel; no overlay should compete with it.
    expect(options.showSuccess).not.toHaveBeenCalled();
  });

  it('records the habit id when the template was already imported', () => {
    const { handle, options } = setup();

    handle(
      { alreadyExists: true, habitId: 'habit-2', success: true } as never,
      'tpl-2' as never,
      'inline'
    );

    expect(options.recordImportedHabitId).toHaveBeenCalledWith(
      'tpl-2',
      'habit-2'
    );
  });

  it('records in overlay and list modes too', () => {
    for (const mode of ['overlay', 'list'] as const) {
      const { handle, options } = setup();
      handle(
        { habitId: 'habit-3', success: true } as never,
        'tpl-3' as never,
        mode
      );
      expect(options.recordImportedHabitId).toHaveBeenCalledWith(
        'tpl-3',
        'habit-3'
      );
    }
  });

  it('records nothing when the mutation returned no habit id', () => {
    const { handle, options } = setup();

    handle(
      { alreadyExists: true, success: true } as never,
      'tpl-4' as never,
      'inline'
    );
    handle({ success: true } as never, 'tpl-4' as never, 'inline');

    expect(options.recordImportedHabitId).not.toHaveBeenCalled();
    expect(options.showError).toHaveBeenCalledTimes(2);
  });
});
