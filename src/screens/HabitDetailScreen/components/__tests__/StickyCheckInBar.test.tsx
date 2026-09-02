/**
 * The sticky bar is deliberately thin: it re-hosts the hero's own toggle so
 * both surfaces share one control, one label set and one undo path.
 */
import { fireEvent, render } from '@testing-library/react-native';
import { StickyCheckInBar } from '../StickyCheckInBar';

function renderBar(props: Partial<{ checked: boolean; disabled: boolean }>) {
  const onPress = jest.fn();
  const view = render(
    <StickyCheckInBar
      checked={props.checked ?? false}
      disabled={props.disabled ?? false}
      surface='#F5F2EC'
      onPress={onPress}
    />
  );
  return { ...view, onPress };
}

describe('StickyCheckInBar', () => {
  it('hosts the same check-in toggle as the hero', () => {
    const { getByLabelText, getByText, onPress } = renderBar({});

    expect(getByText('Complete today')).toBeTruthy();
    fireEvent.press(getByLabelText('Complete today. Tap to log today.'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('carries the logged state and its undo affordance', () => {
    const { getByLabelText, getByText } = renderBar({ checked: true });

    expect(getByText('Logged today')).toBeTruthy();
    expect(getByText('Undo')).toBeTruthy();
    expect(
      getByLabelText('Logged today. Tap to undo.').props.accessibilityState
    ).toEqual({ checked: true, disabled: false });
  });

  it('swallows taps while a toggle is in flight', () => {
    const { getByLabelText, onPress } = renderBar({ disabled: true });

    fireEvent.press(getByLabelText('Complete today. Tap to log today.'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('never traps VoiceOver behind a modal view', () => {
    const { getByTestId } = renderBar({});

    expect(
      getByTestId('sticky-check-in-bar').props.accessibilityViewIsModal
    ).toBe(false);
  });
});
