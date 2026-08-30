import { act, renderHook } from '@testing-library/react-native';
import { useTemplateImportHandlers } from '../hooks/useTemplateImportHandlers';

const TEMPLATE = {
  _id: 'template-1',
  icon: '✍️',
  iconColor: '#7C3AED',
  name: 'Creative Writing',
} as never;

describe('useTemplateImportHandlers optimistic list feedback', () => {
  it('shows a disabled success toast before the mutation resolves', async () => {
    let resolveImport!: (value: {
      habitId: 'habit-1';
      success: true;
    }) => void;
    const importTemplate = jest.fn(
      () =>
        new Promise<{ habitId: 'habit-1'; success: true }>((resolve) => {
          resolveImport = resolve;
        })
    );
    const options = {
      importTemplate,
      isPremiumUser: true,
      previewTemplate: null,
      recordImportedHabitId: jest.fn(),
      setFeedbackHabitId: jest.fn(),
      setFeedbackVariant: jest.fn(),
      setImportedTemplateIds: jest.fn(),
      setImportingTemplateId: jest.fn(),
      setPreviewInitialAnchor: jest.fn(),
      setPreviewTemplate: jest.fn(),
      setSessionImportCount: jest.fn(),
      setShowCelebration: jest.fn(),
      setShowCustomizeModal: jest.fn(),
      setShowFullsizePreview: jest.fn(),
      setShowToast: jest.fn(),
      setToastMessage: jest.fn(),
      setToastOnAction: jest.fn(),
      setToastTemplateData: jest.fn(),
      userHabitCount: 200,
    };
    const { result } = renderHook(() =>
      useTemplateImportHandlers(options as never)
    );

    let pending!: Promise<unknown>;
    act(() => {
      pending = result.current.handleDirectImport(
        'template-1' as never,
        'list',
        TEMPLATE
      );
    });

    expect(options.setFeedbackHabitId).toHaveBeenCalledWith(null);
    expect(options.setFeedbackVariant).toHaveBeenCalledWith('success');
    expect(options.setToastTemplateData).toHaveBeenCalledWith({
      color: '#7C3AED',
      icon: '✍️',
      name: 'Creative Writing',
    });
    expect(options.setShowToast).toHaveBeenCalledWith(true);
    expect(options.recordImportedHabitId).not.toHaveBeenCalled();

    await act(async () => {
      resolveImport({ habitId: 'habit-1', success: true });
      await pending;
    });

    expect(options.recordImportedHabitId).toHaveBeenCalledWith(
      'template-1',
      'habit-1'
    );
    expect(options.setFeedbackHabitId).toHaveBeenCalledWith('habit-1');
  });
});
