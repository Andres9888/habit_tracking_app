/**
 * The dial used to show a bare numeral with no unit and no label — the word
 * "Strength" existed only in the a11y label, so sighted readers got a rank
 * with nothing to rank it against. The overline, the "/100" and the caption
 * are the three pieces that make the number readable; all three are asserted
 * here, plus the a11y label that has to carry the same sentence.
 */
import { render } from '@testing-library/react-native';
import type { Habit } from '../../../../features/habits/types';
import {
  DEFAULT_STRENGTH_CAPTION,
  RECOVERY_STRENGTH_CAPTION,
  StrengthSnapshot,
} from '../StrengthSnapshot';

function renderSnapshot(isRecovery = false) {
  return render(
    <StrengthSnapshot
      habit={{ strength: 0.68 } as unknown as Habit}
      isRecovery={isRecovery}
    />
  );
}

describe('StrengthSnapshot', () => {
  it('labels the number for sighted readers', () => {
    const { getByText } = renderSnapshot();

    expect(getByText('Strength').props.style.textTransform).toBe('uppercase');
    expect(getByText('/100')).toBeTruthy();
    expect(getByText('68')).toBeTruthy();
  });

  it('ends the a11y label with the caption on screen', () => {
    const { getByLabelText, getByText } = renderSnapshot();

    expect(getByText(DEFAULT_STRENGTH_CAPTION)).toBeTruthy();
    expect(
      getByLabelText(
        `Habit strength 68 percent, Strong. ${DEFAULT_STRENGTH_CAPTION}`
      ).props.accessibilityRole
    ).toBe('progressbar');
  });

  it('swaps only the caption in recovery — the dial stays', () => {
    const { getByLabelText, getByText } = renderSnapshot(true);

    expect(getByText(RECOVERY_STRENGTH_CAPTION)).toBeTruthy();
    expect(getByText('/100')).toBeTruthy();
    expect(
      getByLabelText(/^Habit strength 68 percent/).props.accessibilityLabel
    ).toMatch(new RegExp(`${RECOVERY_STRENGTH_CAPTION}$`));
  });
});
