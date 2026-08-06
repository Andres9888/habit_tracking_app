/**
 * Decision / science drill-down section order.
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { DecisionDrilldown } from '../components/DecisionDrilldown';
import { ScienceDrilldown } from '../components/science/ScienceDrilldown';
import type { Template } from '../../../types/template';
import type { Id } from '../../../../convex/_generated/dataModel';

jest.mock('@/theme/iconSizes', () => ({
  iconSizes: { medium: 20, small: 16 },
}));

jest.mock('@/utils/haptics', () => ({
  triggerHaptic: jest.fn(),
}));

jest.mock('@/utils/openExternalLink', () => ({
  openExternalLink: jest.fn(),
}));

jest.mock('@/components/ui/AnimatedPressable', () => {
  const React = require('react');
  const { Pressable } = require('react-native');
  return {
    AnimatedPressable: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement(Pressable, props, children),
  };
});

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      accent: '#059669',
      background: '#F5F1ED',
      border: '#DDD8D2',
      card: '#EDEAE5',
      cardPaper: '#F8F5F1',
      gray: { 200: '#DDD8D2', 300: '#C4BFB7', 400: '#9CA3AF', 900: '#1A1816' },
      primary: {
        100: '#d1fae5',
        400: '#34D399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
      },
      status: {
        streak: '#D97706',
        streakLight: '#FEF3C7',
        success: '#059669',
      },
      text: {
        inverse: '#fff',
        primary: '#2D2A26',
        secondary: '#6B6560',
        tertiary: '#6E6660',
      },
    },
    isDark: false,
  }),
}));

jest.mock('../../../theme', () => ({
  useAppTheme: () => ({
    custom: {
      colors: {
        primary: '#000',
        background: '#fff',
        text: '#000',
        textSecondary: '#666',
        border: '#ddd',
        card: '#fff',
      },
      fontFamilies: { primary: { text: 'System', display: 'System' } },
    },
    dark: false,
  }),
}));

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
  startSmallVersion: 'Sit still for one breath.',
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
  it('orders Benefits → Start small → How to start', () => {
    const { toJSON, getByText } = render(
      <DecisionDrilldown template={richTemplate} />
    );

    expect(getByText("What you'll feel")).toBeTruthy();
    expect(getByText('Start small')).toBeTruthy();
    expect(getByText('How to start')).toBeTruthy();

    const [benefits, startSmall, howTo] = textOrder(JSON.stringify(toJSON()), [
      "What you'll feel",
      'Start small',
      'How to start',
    ]);
    expect(benefits).toBeGreaterThan(-1);
    expect(startSmall).toBeGreaterThan(benefits);
    expect(howTo).toBeGreaterThan(startSmall);
  });

  it('returns null when no decision content exists', () => {
    const empty = {
      ...richTemplate,
      startSmallVersion: undefined,
      benefitDetails: undefined,
      howToStart: undefined,
      tips: undefined,
    } as Template;
    const { toJSON } = render(<DecisionDrilldown template={empty} />);
    expect(toJSON()).toBeNull();
  });

  it('still renders when only start-small is present', () => {
    const partial = {
      ...richTemplate,
      benefitDetails: undefined,
      howToStart: undefined,
      tips: undefined,
    } as Template;
    const { getByText, queryByText } = render(
      <DecisionDrilldown template={partial} />
    );
    expect(getByText('Start small')).toBeTruthy();
    expect(queryByText("What you'll feel")).toBeNull();
    expect(queryByText('How to start')).toBeNull();
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

  it('does not include decision-group sections', () => {
    const { queryByText } = render(
      <ScienceDrilldown template={richTemplate} />
    );
    expect(queryByText("What you'll feel")).toBeNull();
    expect(queryByText('Start small')).toBeNull();
    expect(queryByText('How to start')).toBeNull();
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
