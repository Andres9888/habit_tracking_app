/**
 * On create, the section holds the form's exit until the Home focus request
 * has converged (or the cap), so the modal exit reveals a finished list —
 * the same reveal the Habit Library gets by staying open under its toast.
 */

import { act, render } from '@testing-library/react-native';
import {
  CreateHabitModalSection,
  FOCUS_HOLD_CAP_MS,
  FOCUS_HOLD_GRACE_MS,
} from '../CreateHabitModalSection';

let latestProps: {
  onClose: () => void;
  onHabitCreated?: (id: string) => void;
} | null = null;

jest.mock('../../../../../components/CreateHabitModal', () => ({
  __esModule: true,
  default: (props: typeof latestProps) => {
    latestProps = props;
    return null;
  },
}));
jest.mock('../../../../../components/ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

function setup(createdFocusPending: boolean) {
  const closeCreateHabit = jest.fn();
  const onHabitCreated = jest.fn();
  const view = render(
    <CreateHabitModalSection
      closeCreateHabit={closeCreateHabit}
      createdFocusPending={createdFocusPending}
      habitToEdit={null}
      showCreateHabit
      onHabitCreated={onHabitCreated}
    />
  );
  const rerender = (pending: boolean) =>
    view.rerender(
      <CreateHabitModalSection
        closeCreateHabit={closeCreateHabit}
        createdFocusPending={pending}
        habitToEdit={null}
        showCreateHabit
        onHabitCreated={onHabitCreated}
      />
    );
  return { closeCreateHabit, onHabitCreated, rerender };
}

describe('CreateHabitModalSection close hold', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    latestProps = null;
  });
  afterEach(() => jest.useRealTimers());

  it('a plain close (no create) passes straight through', () => {
    const s = setup(false);
    act(() => latestProps!.onClose());
    expect(s.closeCreateHabit).toHaveBeenCalledTimes(1);
  });

  it('holds the close after a create until the focus request converges', () => {
    const s = setup(false);
    act(() => {
      latestProps!.onHabitCreated!('temp-1');
      latestProps!.onClose();
    });
    expect(s.onHabitCreated).toHaveBeenCalledWith('temp-1');
    // The request is now pending (state arrives on the next render).
    s.rerender(true);
    expect(s.closeCreateHabit).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(FOCUS_HOLD_CAP_MS - 1));
    expect(s.closeCreateHabit).not.toHaveBeenCalled();

    s.rerender(false);
    expect(s.closeCreateHabit).toHaveBeenCalledTimes(1);
  });

  it('releases after a short grace if no request ever turns up', () => {
    const s = setup(false);
    act(() => {
      latestProps!.onHabitCreated!('temp-1');
      latestProps!.onClose();
    });
    expect(s.closeCreateHabit).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(FOCUS_HOLD_GRACE_MS));
    expect(s.closeCreateHabit).toHaveBeenCalledTimes(1);
  });

  it('never holds past the cap', () => {
    const s = setup(false);
    act(() => {
      latestProps!.onHabitCreated!('temp-1');
      latestProps!.onClose();
    });
    s.rerender(true);
    act(() => jest.advanceTimersByTime(FOCUS_HOLD_CAP_MS));
    expect(s.closeCreateHabit).toHaveBeenCalledTimes(1);
  });
});
