import { render } from '@testing-library/react-native';
import { triggerHaptic } from '@/utils/haptics';
import { ListCardAddButton } from '../ListCardAddButton';

jest.mock('@/utils/haptics', () => ({
  triggerHaptic: jest.fn(),
}));

jest.mock('@/theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      primary: { 100: '#d1fae5', 600: '#059669', 700: '#047857' },
      text: { inverse: '#fff' },
    },
  }),
}));

const mockTriggerHaptic = jest.mocked(triggerHaptic);

describe('ListCardAddButton success feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('does not fire success feedback for an imported card on mount', () => {
    render(
      <ListCardAddButton
        isImported
        isImporting={false}
        name='Read'
        onImport={jest.fn()}
      />
    );

    expect(mockTriggerHaptic).not.toHaveBeenCalled();
  });

  it('fires success feedback exactly once on a false-to-true transition', () => {
    const onImport = jest.fn();
    const { rerender } = render(
      <ListCardAddButton
        isImported={false}
        isImporting={false}
        name='Read'
        onImport={onImport}
      />
    );

    rerender(
      <ListCardAddButton
        isImported
        isImporting={false}
        name='Read'
        onImport={onImport}
      />
    );
    rerender(
      <ListCardAddButton
        isImported
        isImporting={false}
        name='Read'
        onImport={onImport}
      />
    );

    expect(mockTriggerHaptic).toHaveBeenCalledTimes(1);
    expect(mockTriggerHaptic).toHaveBeenCalledWith('success');
  });
});
