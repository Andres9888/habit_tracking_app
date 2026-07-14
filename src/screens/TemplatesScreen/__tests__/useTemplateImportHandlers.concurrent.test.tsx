import { useState } from 'react';
import { act, renderHook } from '@testing-library/react-native';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useTemplateImportHandlers } from '../hooks/useTemplateImportHandlers';
import type { ImportFn } from '../hooks/useTemplateImportHandlers.types';
import { trackLibraryEvent } from '../utils/libraryAnalytics';

jest.mock('../utils/libraryAnalytics', () => ({
  trackLibraryEvent: jest.fn(),
}));

const mockTrackLibraryEvent = trackLibraryEvent as jest.MockedFunction<
  typeof trackLibraryEvent
>;

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function useImportHarness(
  importTemplate: ImportFn,
  setToastOnAction: jest.Mock = jest.fn()
) {
  const [importingTemplateIds, setImportingTemplateIds] = useState<Set<string>>(
    new Set()
  );
  const handlers = useTemplateImportHandlers({
    importTemplate,
    isPremiumUser: true,
    previewTemplate: null,
    setFeedbackHabitId: jest.fn(),
    setFeedbackVariant: jest.fn(),
    setImportedTemplateIds: jest.fn(),
    setImportingTemplateIds,
    setPreviewInitialAnchor: jest.fn(),
    setPreviewTemplate: jest.fn(),
    setSessionImportCount: jest.fn(),
    setShowCelebration: jest.fn(),
    setShowCustomizeModal: jest.fn(),
    setShowFullsizePreview: jest.fn(),
    setShowToast: jest.fn(),
    setToastMessage: jest.fn(),
    setToastOnAction,
    setToastTemplateData: jest.fn(),
    userHabitCount: 1,
  });

  return { handlers, importingTemplateIds };
}

describe('useTemplateImportHandlers concurrency', () => {
  const firstId = 'template-first' as Id<'templates'>;
  const secondId = 'template-second' as Id<'templates'>;

  it('keeps each card loading until its own request finishes', async () => {
    const first = deferred<Awaited<ReturnType<ImportFn>>>();
    const second = deferred<Awaited<ReturnType<ImportFn>>>();
    const importTemplate = jest.fn<ReturnType<ImportFn>, Parameters<ImportFn>>(
      ({ templateId }) =>
        templateId === firstId ? first.promise : second.promise
    );
    const { result } = renderHook(() => useImportHarness(importTemplate));
    let firstRequest!: Promise<void>;
    let secondRequest!: Promise<void>;

    act(() => {
      firstRequest = result.current.handlers.handleDirectImport(firstId);
      secondRequest = result.current.handlers.handleDirectImport(secondId);
    });

    expect(result.current.importingTemplateIds).toEqual(
      new Set([firstId, secondId])
    );

    await act(async () => {
      first.resolve({ success: false });
      await firstRequest;
    });

    expect(result.current.importingTemplateIds).toEqual(new Set([secondId]));

    await act(async () => {
      second.resolve({ success: false });
      await secondRequest;
    });

    expect(result.current.importingTemplateIds).toEqual(new Set());
  });

  it('ignores a duplicate request for the same template', async () => {
    const pending = deferred<Awaited<ReturnType<ImportFn>>>();
    const importTemplate = jest.fn<ReturnType<ImportFn>, Parameters<ImportFn>>(
      () => pending.promise
    );
    const { result } = renderHook(() => useImportHarness(importTemplate));
    let request!: Promise<void>;

    act(() => {
      request = result.current.handlers.handleDirectImport(firstId);
      void result.current.handlers.handleDirectImport(firstId);
    });

    expect(importTemplate).toHaveBeenCalledTimes(1);
    expect(result.current.importingTemplateIds).toEqual(new Set([firstId]));

    await act(async () => {
      pending.resolve({ success: false });
      await request;
    });
  });
});

describe('useTemplateImportHandlers analytics', () => {
  const templateId = 'template-analytics' as Id<'templates'>;
  const habitId = 'habit-analytics' as Id<'habits'>;

  beforeEach(() => {
    mockTrackLibraryEvent.mockClear();
  });

  it('tracks a direct import only after a fresh habit is created', async () => {
    const pending = deferred<Awaited<ReturnType<ImportFn>>>();
    const importTemplate = jest.fn<ReturnType<ImportFn>, Parameters<ImportFn>>(
      () => pending.promise
    );
    const { result } = renderHook(() => useImportHarness(importTemplate));
    let request!: Promise<void>;

    act(() => {
      request = result.current.handlers.handleDirectImport(
        templateId,
        'details'
      );
    });

    expect(mockTrackLibraryEvent).not.toHaveBeenCalled();

    await act(async () => {
      pending.resolve({ habitId, success: true });
      await request;
    });

    expect(mockTrackLibraryEvent).toHaveBeenCalledTimes(1);
    expect(importTemplate).toHaveBeenCalledWith({
      source: 'details',
      templateId,
    });
    expect(mockTrackLibraryEvent).toHaveBeenCalledWith({
      type: 'template_added',
      templateId,
      source: 'details',
    });
  });

  it('does not count an already-existing habit as a direct conversion', async () => {
    const importTemplate = jest.fn<ReturnType<ImportFn>, Parameters<ImportFn>>(
      async () => ({ alreadyExists: true, habitId, success: true })
    );
    const { result } = renderHook(() => useImportHarness(importTemplate));

    await act(async () => {
      await result.current.handlers.handleDirectImport(templateId, 'catalog');
    });

    expect(mockTrackLibraryEvent).not.toHaveBeenCalled();
  });

  it('does not count a failed import as a conversion', async () => {
    const importTemplate = jest.fn<ReturnType<ImportFn>, Parameters<ImportFn>>(
      async () => ({ success: false })
    );
    const { result } = renderHook(() => useImportHarness(importTemplate));

    await act(async () => {
      await result.current.handlers.handleDirectImport(templateId, 'catalog');
    });

    expect(mockTrackLibraryEvent).not.toHaveBeenCalled();
  });

  it('preserves the original source when a failed direct import is retried', async () => {
    const retrySuccess = deferred<Awaited<ReturnType<ImportFn>>>();
    const importTemplate = jest
      .fn<ReturnType<ImportFn>, Parameters<ImportFn>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockImplementationOnce(() => retrySuccess.promise);
    const setToastOnAction = jest.fn();
    const { result } = renderHook(() =>
      useImportHarness(importTemplate, setToastOnAction)
    );

    await act(async () => {
      await result.current.handlers.handleDirectImport(templateId, 'details');
    });

    const retryValue = setToastOnAction.mock.calls[0]?.[0] as unknown;
    expect(typeof retryValue).toBe('function');
    const retry = (retryValue as (previous: (() => void) | null) => () => void)(
      null
    );

    act(() => retry());
    expect(importTemplate).toHaveBeenCalledTimes(2);

    await act(async () => {
      retrySuccess.resolve({ habitId, success: true });
      await Promise.resolve();
    });

    expect(mockTrackLibraryEvent).toHaveBeenCalledWith({
      type: 'template_added',
      templateId,
      source: 'details',
    });
  });

  it('tracks a customized import only when it creates a fresh habit', async () => {
    const importTemplate = jest.fn<ReturnType<ImportFn>, Parameters<ImportFn>>(
      async () => ({ habitId, success: true })
    );
    const { result } = renderHook(() => useImportHarness(importTemplate));

    await act(async () => {
      await result.current.handlers.handleTemplateImport(templateId, {
        name: 'Morning walk',
      });
    });

    expect(mockTrackLibraryEvent).toHaveBeenCalledWith({
      type: 'template_added',
      templateId,
      source: 'details',
    });
    expect(importTemplate).toHaveBeenCalledWith({
      customizations: { name: 'Morning walk' },
      source: 'details',
      templateId,
    });
  });

  it('does not count an already-existing habit as a customized conversion', async () => {
    const importTemplate = jest.fn<ReturnType<ImportFn>, Parameters<ImportFn>>(
      async () => ({ alreadyExists: true, habitId, success: true })
    );
    const { result } = renderHook(() => useImportHarness(importTemplate));

    await act(async () => {
      await result.current.handlers.handleTemplateImport(templateId);
    });

    expect(mockTrackLibraryEvent).not.toHaveBeenCalled();
  });
});
