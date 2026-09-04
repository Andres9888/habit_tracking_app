/**
 * One why card, two sizes. The compact variant replaced the one-line why under
 * the recovery / completed state cards: it keeps the card shape and lets the
 * sentence run to three lines so authored science whys never cut mid-word.
 */
import { render } from '@testing-library/react-native';
import type { Habit } from '../../../../../features/habits/types';
import { useInsightPalette } from '../../../insightPalette';
import { RECOVERY_INK_SMALL } from '../../../insightPalette.tokens';
import { HeroWhyPill } from '../HeroWhyPill';

const SCIENCE_WHY =
  'Cold drives a long rise in noradrenaline and dopamine, so mood and focus stay lifted for hours.';

function Harness({
  habit,
  isRecovery = false,
  variant = 'card',
}: {
  habit: Habit;
  isRecovery?: boolean;
  variant?: 'card' | 'compact';
}) {
  const palette = useInsightPalette();
  return (
    <HeroWhyPill
      habit={habit}
      isRecovery={isRecovery}
      palette={palette}
      variant={variant}
    />
  );
}

function renderPill(
  overrides: Partial<Habit>,
  props: { isRecovery?: boolean; variant?: 'card' | 'compact' } = {}
) {
  return render(
    <Harness
      habit={{ name: 'Cold Exposure', ...overrides } as unknown as Habit}
      {...props}
    />
  );
}

describe('HeroWhyPill', () => {
  it('shows the full sentence unclamped in the card variant', () => {
    const { getByText } = renderPill({ why: SCIENCE_WHY });
    expect(getByText(SCIENCE_WHY).props.numberOfLines).toBeUndefined();
  });

  it('clamps the compact variant to three lines, never one', () => {
    const { getByText } = renderPill(
      { why: SCIENCE_WHY },
      { variant: 'compact' }
    );
    expect(getByText(SCIENCE_WHY).props.numberOfLines).toBe(3);
  });

  it('inks the compact label amber under the recovery card', () => {
    const { getByText } = renderPill(
      { why: SCIENCE_WHY },
      { isRecovery: true, variant: 'compact' }
    );
    expect(getByText('Your why').props.style.color).toBe(RECOVERY_INK_SMALL);
  });

  it('labels an untouched template why as "Why it works"', () => {
    const { getByText } = renderPill({
      templateWhy: SCIENCE_WHY,
      why: SCIENCE_WHY,
    });
    expect(getByText('Why it works')).toBeTruthy();
  });

  it('labels an edited why as "Your why"', () => {
    const { getByText } = renderPill({
      templateWhy: SCIENCE_WHY,
      why: 'I want to stop dreading the shower.',
    });
    expect(getByText('Your why')).toBeTruthy();
  });

  it('follows resolveWhy down to identity and wish', () => {
    expect(
      renderPill({ identity: 'I am someone who moves first.' }).getByText(
        "Who you're becoming"
      )
    ).toBeTruthy();
    expect(
      renderPill({ woopWish: 'Run the loop without stopping.' }).getByText(
        'Your wish'
      )
    ).toBeTruthy();
  });

  it('renders nothing when there is no why, identity or wish', () => {
    const { toJSON } = renderPill({
      identity: undefined,
      why: undefined,
      woopWish: undefined,
    });
    expect(toJSON()).toBeNull();
  });
});
