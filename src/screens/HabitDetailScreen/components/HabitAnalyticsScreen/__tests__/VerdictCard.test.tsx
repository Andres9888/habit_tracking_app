import { render } from '@testing-library/react-native';
import { lightColors } from '../../../../../theme/darkColors';
import { buildInsightPalette } from '../../../insightPalette';
import type { Verdict } from '../verdict';
import { VerdictCard } from '../VerdictCard';

const palette = buildInsightPalette(lightColors, false);

const verdict: Verdict = {
  bars: [81, 88],
  body: '88% of scheduled days in August, up from 81% in July.',
  deltaPct: 7,
  headline: "You're steadier than last month.",
  labels: ['Jul', 'Aug'],
};

const NEXT_STEP =
  "Covering Fridays would have put August at 93%. It's the only weekday under 60%.";

describe('VerdictCard', () => {
  it('renders the next step under the body when there is one', () => {
    const { getByLabelText, getByText } = render(
      <VerdictCard nextStep={NEXT_STEP} palette={palette} verdict={verdict} />
    );

    expect(getByText(verdict.headline)).toBeTruthy();
    expect(getByText(NEXT_STEP)).toBeTruthy();
    expect(getByLabelText(NEXT_STEP)).toBeTruthy();
  });

  it('keeps headline, body and sparkline when there is no next step', () => {
    const { queryByLabelText, getByText } = render(
      <VerdictCard palette={palette} verdict={verdict} />
    );

    expect(getByText(verdict.headline)).toBeTruthy();
    expect(getByText(verdict.body)).toBeTruthy();
    expect(getByText('Aug')).toBeTruthy();
    expect(queryByLabelText(NEXT_STEP)).toBeNull();
  });
});
