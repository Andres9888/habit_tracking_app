/**
 * template_added must fire exactly once per confirmed fresh import — never on
 * failure, never on duplicates, never before the mutation resolves.
 */

import { renderHook, act } from '@testing-library/react-native';
import type { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { useLibraryScreenActions } from '../useLibraryScreenActions';
import { trackLibraryEvent } from '../../utils/libraryAnalytics';

jest.mock('../../utils/libraryAnalytics', () => ({
  trackLibraryEvent: jest.fn(),
}));

const template = { _id: 't1' } as Doc<'templates'>;
const tid = 't1' as Id<'templates'>;

function setup(outcome: 'added' | 'exists' | 'failed' | undefined) {
  const handlers = {
    handleDirectImport: jest.fn().mockResolvedValue(outcome),
    handleSeedTemplates: jest.fn(),
  };
  const state = {
    dismissFeedback: jest.fn(),
    feedbackHabitId: null,
    setPreviewTemplate: jest.fn(),
    showFeedbackError: jest.fn(),
  };
  const { result } = renderHook(() =>
    useLibraryScreenActions({
      handlers: handlers as never,
      packConfirm: { handleConfirm: jest.fn() } as never,
      state: state as never,
    })
  );
  return { actions: result.current, handlers, state };
}

beforeEach(() => jest.clearAllMocks());

describe('template_added analytics', () => {
  it('popular import fires once with its source on success', async () => {
    const { actions } = setup('added');
    await act(async () => actions.handlePopularImport(template));
    expect(trackLibraryEvent).toHaveBeenCalledTimes(1);
    expect(trackLibraryEvent).toHaveBeenCalledWith({
      type: 'template_added',
      templateId: tid,
      source: 'popular',
    });
  });

  it('does not fire when the import fails', async () => {
    const { actions } = setup('failed');
    await act(async () => actions.handlePopularImport(template));
    expect(trackLibraryEvent).not.toHaveBeenCalled();
  });

  it('does not fire when the habit already exists', async () => {
    const { actions } = setup('exists');
    await act(async () => actions.handlePopularImport(template));
    expect(trackLibraryEvent).not.toHaveBeenCalled();
  });

  it('does not fire when the import throws before a result', async () => {
    const { actions } = setup(undefined);
    await act(async () => actions.handlePopularImport(template));
    expect(trackLibraryEvent).not.toHaveBeenCalled();
  });

  it('details path fires exactly once on success', async () => {
    const { actions, handlers } = setup('added');
    await act(async () => {
      await actions.handleDetailsDirectImport(tid);
    });
    expect(trackLibraryEvent).toHaveBeenCalledTimes(1);
    expect(trackLibraryEvent).toHaveBeenCalledWith({
      type: 'template_added',
      templateId: tid,
      source: 'details',
    });
    expect(handlers.handleDirectImport).toHaveBeenCalledWith(tid, 'inline');
  });

  it('details path does not fire on failure', async () => {
    const { actions } = setup('failed');
    await act(async () => {
      await actions.handleDetailsDirectImport(tid);
    });
    expect(trackLibraryEvent).not.toHaveBeenCalled();
  });
});
