/**
 * One import at a time: importing state is a single scalar, so a second
 * concurrent mutation would have its spinner cleared by whichever finishes
 * first — the double-tap must be refused, not raced.
 */

import { renderHook, act } from '@testing-library/react-native';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { useTemplateImportHandlers } from '../useTemplateImportHandlers';

const t1 = 't1' as Id<'templates'>;
const t2 = 't2' as Id<'templates'>;

function makeOptions(importTemplate: jest.Mock) {
  const setter = () => jest.fn();
  return {
    importTemplate,
    previewTemplate: null,
    isPremiumUser: false,
    userHabitCount: 3,
    setFeedbackHabitId: setter(),
    setFeedbackVariant: setter(),
    setImportedTemplateIds: setter(),
    setImportingTemplateId: setter(),
    setPreviewInitialAnchor: setter(),
    setPreviewTemplate: setter(),
    setSessionImportCount: setter(),
    setShowCustomizeModal: setter(),
    setShowCelebration: setter(),
    setShowFullsizePreview: setter(),
    setShowToast: setter(),
    setToastMessage: setter(),
    setToastOnAction: setter(),
    setToastTemplateData: setter(),
  } as never;
}

it('a second direct import while one is in flight is refused', async () => {
  let resolveFirst!: (v: unknown) => void;
  const importTemplate = jest
    .fn()
    .mockImplementationOnce(
      () => new Promise((res) => { resolveFirst = res; })
    )
    .mockResolvedValue({ success: true, habitId: 'h2' });

  const { result } = renderHook(() =>
    useTemplateImportHandlers(makeOptions(importTemplate))
  );

  await act(async () => {
    const first = result.current.handleDirectImport(t1);
    const second = await result.current.handleDirectImport(t2);
    expect(second).toBeUndefined();
    resolveFirst({ success: true, habitId: 'h1' });
    await first;
  });

  expect(importTemplate).toHaveBeenCalledTimes(1);
});

it('a customize import is refused while a direct import is in flight', async () => {
  let resolveFirst!: (v: unknown) => void;
  const importTemplate = jest
    .fn()
    .mockImplementationOnce(
      () => new Promise((res) => { resolveFirst = res; })
    )
    .mockResolvedValue({ success: true, habitId: 'h2' });

  const { result } = renderHook(() =>
    useTemplateImportHandlers(makeOptions(importTemplate))
  );

  await act(async () => {
    const first = result.current.handleDirectImport(t1);
    const second = await result.current.handleTemplateImport(t2);
    expect(second).toBeUndefined();
    resolveFirst({ success: true, habitId: 'h1' });
    await first;
  });

  expect(importTemplate).toHaveBeenCalledTimes(1);
});

it('imports run again after the first completes', async () => {
  const importTemplate = jest
    .fn()
    .mockResolvedValue({ success: true, habitId: 'h1' });

  const { result } = renderHook(() =>
    useTemplateImportHandlers(makeOptions(importTemplate))
  );

  await act(async () => {
    await result.current.handleDirectImport(t1);
    await result.current.handleDirectImport(t2);
  });

  expect(importTemplate).toHaveBeenCalledTimes(2);
});
