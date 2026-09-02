/**
 * The full why pill owns the neutral ready state; recovery and completion give
 * that slot to their state card. This one line is how the why survives those
 * two moments — the ones where the reason you started matters most.
 */
import { render } from '@testing-library/react-native';
import type { Habit } from '../../../../../features/habits/types';
import { useInsightPalette } from '../../../insightPalette';
import { HeroWhyLine } from '../HeroWhyLine';

function Harness({
  habit,
  isRecovery = false,
}: {
  habit: Habit;
  isRecovery?: boolean;
}) {
  const palette = useInsightPalette();
  return (
    <HeroWhyLine habit={habit} isRecovery={isRecovery} palette={palette} />
  );
}

function renderLine(overrides: Partial<Habit>, isRecovery = false) {
  return render(
    <Harness
      habit={{ name: 'Wake-Up Movement', ...overrides } as unknown as Habit}
      isRecovery={isRecovery}
    />
  );
}

describe('HeroWhyLine', () => {
  it('compresses the resolved why to one labelled line', () => {
    const { getByText } = renderLine({
      why: 'Have energy for the kids before the day takes over.',
    });

    expect(
      getByText(
        'Your why · Have energy for the kids before the day takes over.'
      ).props.numberOfLines
    ).toBe(1);
  });

  it('follows resolveWhy down to identity and wish', () => {
    expect(
      renderLine({ identity: 'I am someone who moves first.' }).getByText(
        "Who you're becoming · I am someone who moves first."
      )
    ).toBeTruthy();
    expect(
      renderLine({ woopWish: 'Run the loop without stopping.' }).getByText(
        'Your wish · Run the loop without stopping.'
      )
    ).toBeTruthy();
  });

  it('renders nothing when there is no why, identity or wish', () => {
    const { toJSON } = renderLine({
      identity: undefined,
      why: undefined,
      woopWish: undefined,
    });

    expect(toJSON()).toBeNull();
  });
});
