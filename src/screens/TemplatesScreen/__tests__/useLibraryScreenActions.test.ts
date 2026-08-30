import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useLibraryScreenActions } from '../hooks/useLibraryScreenActions';

const TEMPLATE = { _id: 'template-1', name: 'Daily compliment' } as never;

function setup(
  result: {
    alreadyExists?: boolean;
    habitId?: string;
    success?: boolean;
  } = { habitId: 'habit-1', success: true }
) {
  const dismissFeedback = jest.fn();
  const handleDirectImport = jest.fn().mockResolvedValue(result);
  const onCancelPreparedGoToHabit = jest.fn();
  const onPrepareGoToHabit = jest.fn();
  const view = renderHook(() =>
    useLibraryScreenActions({
      handlers: { handleDirectImport } as never,
      onCancelPreparedGoToHabit,
      onPrepareGoToHabit,
      packConfirm: {} as never,
      state: {
        dismissFeedback,
        feedbackHabitId: null,
        feedbackVariant: null,
        setPreviewTemplate: jest.fn(),
        showFeedbackError: jest.fn(),
      } as never,
    })
  );

  return {
    dismissFeedback,
    handleDirectImport,
    onCancelPreparedGoToHabit,
    onPrepareGoToHabit,
    view,
  };
}

describe('useLibraryScreenActions focus preparation', () => {
  it('prepares home after a fresh list import returns its habit id', async () => {
    const { handleDirectImport, onPrepareGoToHabit, view } = setup();

    act(() => view.result.current.handlePopularImport(TEMPLATE));

    expect(handleDirectImport).toHaveBeenCalledWith(
      'template-1',
      'list',
      TEMPLATE
    );
    await waitFor(() =>
      expect(onPrepareGoToHabit).toHaveBeenCalledWith('habit-1')
    );
  });

  it('does not prepare home for an already-existing import', async () => {
    const { onPrepareGoToHabit, view } = setup({
      alreadyExists: true,
      habitId: 'habit-1',
      success: true,
    });

    act(() => view.result.current.handlePopularImport(TEMPLATE));
    await waitFor(() =>
      expect(view.result.current.handlePopularImport).toBeDefined()
    );

    expect(onPrepareGoToHabit).not.toHaveBeenCalled();
  });

  it('cancels the old prepared anchor when another Add starts', () => {
    const { onCancelPreparedGoToHabit, view } = setup();

    act(() => view.result.current.handlePopularImport(TEMPLATE));

    expect(onCancelPreparedGoToHabit).toHaveBeenCalledTimes(1);
  });

  it('cancels preparation when Keep exploring dismisses success feedback', () => {
    const {
      dismissFeedback,
      onCancelPreparedGoToHabit,
      view,
    } = setup();

    act(() => view.result.current.handleAddAnother());

    expect(onCancelPreparedGoToHabit).toHaveBeenCalledTimes(1);
    expect(dismissFeedback).toHaveBeenCalledTimes(1);
  });
});
