import { act, renderHook } from '@testing-library/react-native';
import { useImportFeedback } from './useImportFeedback';

function setup(overrides?: {
  isPremiumUser?: boolean;
  userHabitCount?: number;
}) {
  const onShowPaywall = jest.fn();
  const hook = renderHook(() =>
    useImportFeedback({
      isPremiumUser: overrides?.isPremiumUser ?? false,
      onShowPaywall,
      previewTemplate: null,
      setFeedbackHabitId: jest.fn(),
      setFeedbackVariant: jest.fn(),
      setSessionImportCount: jest.fn(),
      setShowCelebration: jest.fn(),
      setShowToast: jest.fn(),
      setToastMessage: jest.fn(),
      setToastOnAction: jest.fn(),
      setToastTemplateData: jest.fn(),
      userHabitCount: overrides?.userHabitCount ?? 0,
    })
  );
  return { ...hook, onShowPaywall };
}

describe('useImportFeedback.guardImport', () => {
  it('does not block a premium user', () => {
    const { result, onShowPaywall } = setup({
      isPremiumUser: true,
      userHabitCount: 8,
    });
    expect(result.current.guardImport()).toBe(false);
    expect(onShowPaywall).not.toHaveBeenCalled();
  });

  it('does not block a free user under the limit', () => {
    const { result, onShowPaywall } = setup({ userHabitCount: 2 });
    expect(result.current.guardImport()).toBe(false);
    expect(onShowPaywall).not.toHaveBeenCalled();
  });

  it('shows the paywall and blocks import at the free limit', () => {
    const { result, onShowPaywall } = setup({ userHabitCount: 3 });
    let blocked = false;
    act(() => {
      blocked = result.current.guardImport();
    });
    expect(blocked).toBe(true);
    expect(onShowPaywall).toHaveBeenCalledTimes(1);
  });
});
