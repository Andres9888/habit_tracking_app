/**
 * GoalMilestoneTeaser — "We'll celebrate 7d · 30d · 66d" line under the preset
 * grid. Marks bold-emphasized; recomputes as the selected goal changes.
 */
import { Fragment } from 'react';
import { Text } from 'react-native';
import { useThemeColors } from '../../../theme';
import { typography, fontWeights } from '../../../theme/typography';
import { formatGoalMark, milestonesForGoal } from './goalPresets';

interface GoalMilestoneTeaserProps {
  selected: number;
}

export function GoalMilestoneTeaser({ selected }: GoalMilestoneTeaserProps) {
  const { colors } = useThemeColors();
  const marks = milestonesForGoal(selected);

  return (
    <Text
      accessibilityLiveRegion='polite'
      className='mb-6 text-center'
      style={{ ...typography.caption, color: colors.text.tertiary }}
    >
      We&apos;ll celebrate{' '}
      {marks.map((d, i) => (
        <Fragment key={d}>
          {i > 0 ? ' · ' : null}
          <Text
            style={{
              color: colors.text.secondary,
              fontWeight: fontWeights.bold,
            }}
          >
            {formatGoalMark(d)}
          </Text>
        </Fragment>
      ))}
    </Text>
  );
}
