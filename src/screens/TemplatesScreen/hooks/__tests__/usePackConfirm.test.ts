import { act, renderHook } from '@testing-library/react-native';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { PremiumPack } from '../../data/premiumPacks';
import { usePackConfirm, type PackPartialFailure } from '../usePackConfirm';

const tid = (n: number) => `template_${n}` as Id<'templates'>;
const pack = {
  habits: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
  id: 'p',
  name: 'Pack',
} as unknown as PremiumPack;
const allTemplates = [
  { _id: tid(1), name: 'a' },
  { _id: tid(2), name: 'B ' },
  { _id: tid(3), name: 'c' },
  { _id: tid(4), name: 'unrelated' },
];

function setup(importTemplate: jest.Mock) {
  const onComplete = jest.fn();
  const onPartialFailure = jest.fn();
  const setImportedIds = jest.fn();
  const hook = renderHook(() =>
    usePackConfirm({
      allTemplates,
      importTemplate,
      onComplete,
      onPartialFailure,
      setImportedIds,
    })
  );
  return { hook, onComplete, onPartialFailure, setImportedIds };
}

describe('usePackConfirm', () => {
  it('imports every matching template and reports the count', async () => {
    const importTemplate = jest.fn(async () => ({ success: true }));
    const { hook, onComplete, onPartialFailure } = setup(importTemplate);

    act(() => hook.result.current.handlePackPress(pack));
    await act(() => hook.result.current.handleConfirm());

    expect(importTemplate).toHaveBeenCalledTimes(3);
    expect(onComplete).toHaveBeenCalledWith(3);
    expect(onPartialFailure).not.toHaveBeenCalled();
    expect(hook.result.current.selectedPack).toBeNull();
  });

  it('surfaces mid-pack failures and retries only the failed ones', async () => {
    const importTemplate = jest
      .fn<Promise<{ success: boolean }>, [{ templateId: Id<'templates'> }]>()
      .mockResolvedValueOnce({ success: true })
      .mockRejectedValueOnce(new Error('Too many requests'))
      .mockRejectedValueOnce(new Error('Too many requests'))
      .mockResolvedValue({ success: true });
    const { hook, onComplete, onPartialFailure } = setup(importTemplate);

    act(() => hook.result.current.handlePackPress(pack));
    await act(() => hook.result.current.handleConfirm());

    expect(onComplete).toHaveBeenCalledWith(1);
    expect(onPartialFailure).toHaveBeenCalledTimes(1);
    const info = onPartialFailure.mock.calls[0][0] as PackPartialFailure;
    expect(info).toMatchObject({ failedCount: 2, importedCount: 1 });

    await act(() => info.retry());

    const retried = importTemplate.mock.calls
      .slice(3)
      .map((c) => c[0].templateId);
    expect(retried).toEqual([tid(2), tid(3)]);
    expect(onComplete).toHaveBeenLastCalledWith(2);
    expect(onPartialFailure).toHaveBeenCalledTimes(1);
  });

  it('does not report completion when nothing imported', async () => {
    const importTemplate = jest.fn(async () => {
      throw new Error('offline');
    });
    const { hook, onComplete, onPartialFailure } = setup(importTemplate);

    act(() => hook.result.current.handlePackPress(pack));
    await act(() => hook.result.current.handleConfirm());

    expect(onComplete).not.toHaveBeenCalled();
    expect(onPartialFailure).toHaveBeenCalledWith(
      expect.objectContaining({ failedCount: 3, importedCount: 0 })
    );
  });
});
