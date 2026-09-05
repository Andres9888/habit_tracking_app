/**
 * useHandlers — the two exits must stay distinct, and implicit dismissals
 * must resolve to BACK rather than dropping the user on the home screen.
 */

import { renderHook, act } from '@testing-library/react-native';

import { useHandlers } from '../useHandlers';
import type { Doc } from '../../../../../convex/_generated/dataModel';

jest.mock('@/utils/haptics', () => ({ triggerHaptic: jest.fn() }));

const template = { _id: 't1', name: 'Daily walk' } as unknown as Doc<'templates'>;

function setup(overrides: Record<string, unknown> = {}) {
  const onClose = jest.fn();
  const onBack = jest.fn();
  const onImport = jest.fn();
  const onCustomize = jest.fn();

  const { result } = renderHook(() =>
    useHandlers({
      isImported: false,
      isImporting: false,
      onBack,
      onClose,
      onCustomize,
      onImport,
      template,
      ...overrides,
    })
  );

  return { onBack, onClose, onCustomize, onImport, result };
}

describe('useHandlers exits', () => {
  it('routes back to the library and close to home, never crossing them', () => {
    const { onBack, onClose, result } = setup();

    act(() => result.current.handleBack?.());
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    act(() => result.current.handleClose());
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('resolves an implicit dismissal to back, not home', () => {
    // Hardware back / backdrop must not eject the user out of the library.
    const { onBack, onClose, result } = setup();

    act(() => result.current.handleDismiss());

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('falls back to close when no library sits behind the preview', () => {
    const { onClose, result } = setup({ onBack: undefined });

    expect(result.current.handleBack).toBeUndefined();

    act(() => result.current.handleDismiss());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps both exits live once the habit is already added', () => {
    const { onBack, onClose, result } = setup({ isImported: true });

    act(() => result.current.handleDismiss());
    act(() => result.current.handleClose());

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
