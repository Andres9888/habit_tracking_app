import { act, fireEvent, render } from '@testing-library/react-native';
import { ArchiveUndoToast } from '../ArchiveUndoToast';

describe('ArchiveUndoToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('does not confirm the archive after Undo is pressed', () => {
    const onDismiss = jest.fn();
    const onUndo = jest.fn();
    const { getByLabelText } = render(
      <ArchiveUndoToast
        duration={5000}
        habitName='Morning walk'
        visible
        onDismiss={onDismiss}
        onUndo={onUndo}
      />
    );

    fireEvent.press(getByLabelText('Undo archive'));
    act(() => jest.advanceTimersByTime(5000));

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('confirms once when the undo window expires', () => {
    const onDismiss = jest.fn();
    const onUndo = jest.fn();
    render(
      <ArchiveUndoToast
        duration={5000}
        habitName='Morning walk'
        visible
        onDismiss={onDismiss}
        onUndo={onUndo}
      />
    );

    act(() => jest.advanceTimersByTime(5250));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onUndo).not.toHaveBeenCalled();
  });
});
