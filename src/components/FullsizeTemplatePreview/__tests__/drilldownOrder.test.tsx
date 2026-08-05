/**
 * Decision / science drill-down section order and sparse-data collapse.
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { DecisionDrilldown } from '../components/DecisionDrilldown';
import { ScienceDrilldown } from '../components/science/ScienceDrilldown';
import type { Template } from '../../../types/template';
import type { Id } from '../../../../convex/_generated/dataModel';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('@/utils/haptics', () => ({
  triggerHaptic: jest.fn(),
}));

jest.mock('@/components/ui/AnimatedPressable', () => {
  const React = require('react');
  const { Pressable } = require('react-native');
  return {
    AnimatedPressable: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(Pressable, props, children),
  };
});

const richTemplate = {
  _id: 't1' as Id<'templates'>,
  _creationTime: 0,
  name: 'Meditate',
  description: 'A quiet reset.',
  icon: '🧘',
  iconColor: '#10B981',
  category: 'mindfulness',
  frequency: 'daily' as const,
  createdAt: 0,
  benefitDetails: [
    {
      icon: 'wave',
      title: 'Calmer within days',
      description: 'Lower reactivity',
    },
  ],
  howToStart: ['Sit quietly', 'Breathe for 3 minutes'],
  lead: 'Meditation lowers cortisol.',
  evidence: 'Goyal et al., 2014',
  timeline: [
    {
      when: 'Week 1',
      title: 'Feels effortful',
      description: 'Building the cue',
    },
  ],
  sources: [
    {
      authors: 'Goyal',
      title: 'Meditation programs',
      journal: 'JAMA',
      year: '2014',
    },
  ],
} as Template;

function textOrder(json: string, labels: string[]): number[] {
  return labels.map((label) => json.indexOf(label));
}

describe('DecisionDrilldown', () => {
  it('orders Benefits → How to start', () => {
    const { toJSON, getByText } = render(
      <DecisionDrilldown template={richTemplate} />
    );

    expect(getByText("What you'll feel")).toBeTruthy();
    expect(getByText('How to start')).toBeTruthy();

    const [benefits, howTo] = textOrder(JSON.stringify(toJSON()), [
      "What you'll feel",
      'How to start',
    ]);
    expect(benefits).toBeGreaterThan(-1);
    expect(howTo).toBeGreaterThan(benefits);
  });

  it('returns null when no decision content exists', () => {
    const empty = {
      ...richTemplate,
      benefitDetails: undefined,
      howToStart: undefined,
      tips: undefined,
    } as Template;
    const { toJSON } = render(<DecisionDrilldown template={empty} />);
    expect(toJSON()).toBeNull();
  });

  it('still renders when only steps are present', () => {
    const partial = {
      ...richTemplate,
      benefitDetails: undefined,
    } as Template;
    const { getByText, queryByText } = render(
      <DecisionDrilldown template={partial} />
    );
    expect(getByText('How to start')).toBeTruthy();
    expect(queryByText("What you'll feel")).toBeNull();
  });
});

describe('ScienceDrilldown', () => {
  it('orders Why it works → What to expect → The research', () => {
    const { toJSON, getByText } = render(
      <ScienceDrilldown template={richTemplate} />
    );

    expect(getByText('Why it works')).toBeTruthy();
    expect(getByText('What to expect')).toBeTruthy();
    expect(getByText('The research')).toBeTruthy();

    const [why, expectLabel, research] = textOrder(JSON.stringify(toJSON()), [
      'Why it works',
      'What to expect',
      'The research',
    ]);
    expect(why).toBeGreaterThan(-1);
    expect(expectLabel).toBeGreaterThan(why);
    expect(research).toBeGreaterThan(expectLabel);
  });

  it('does not include decision-group or strength-explainer sections', () => {
    const { queryByText } = render(
      <ScienceDrilldown template={richTemplate} />
    );
    expect(queryByText("What you'll feel")).toBeNull();
    expect(queryByText('How to start')).toBeNull();
    expect(queryByText('How it becomes automatic')).toBeNull();
  });

  it('returns null when no science content exists', () => {
    const empty = {
      ...richTemplate,
      lead: undefined,
      evidence: undefined,
      scientificReference: undefined,
      timeline: undefined,
      sources: undefined,
    } as Template;
    const { toJSON } = render(<ScienceDrilldown template={empty} />);
    expect(toJSON()).toBeNull();
  });

  it('collapses Why it works when only timeline data exists', () => {
    const timelineOnly = {
      ...richTemplate,
      lead: undefined,
      evidence: undefined,
      scientificReference: undefined,
      sources: undefined,
    } as Template;
    const { getByText, queryByText } = render(
      <ScienceDrilldown template={timelineOnly} />
    );
    expect(getByText('What to expect')).toBeTruthy();
    expect(queryByText('Why it works')).toBeNull();
    expect(queryByText('The research')).toBeNull();
  });
});

describe('combined decision then science order', () => {
  it('places the decision group before the science group', () => {
    const { toJSON } = render(
      <>
        <DecisionDrilldown template={richTemplate} />
        <ScienceDrilldown template={richTemplate} />
      </>
    );
    const [benefits, howTo, why, research] = textOrder(
      JSON.stringify(toJSON()),
      ["What you'll feel", 'How to start', 'Why it works', 'The research']
    );
    expect(benefits).toBeGreaterThan(-1);
    expect(howTo).toBeGreaterThan(benefits);
    expect(why).toBeGreaterThan(howTo);
    expect(research).toBeGreaterThan(why);
  });
});
