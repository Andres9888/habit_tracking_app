/**
 * automaticityMeta — the hero pill and the timeline must agree.
 */

import {
  getAutomaticityMeta,
  parseWhenToDays,
  peakDays,
} from '../automaticityMeta';
import type { Template } from '../../../../types/template';
import type { Id } from '../../../../../convex/_generated/dataModel';

const base = {
  _id: 't1' as Id<'templates'>,
  _creationTime: 0,
  name: 'Test',
  description: 'Desc',
  icon: '🧘',
  iconColor: '#000',
  category: 'mindfulness',
  frequency: 'daily' as const,
  createdAt: 0,
};

function template(overrides: Partial<Template> = {}): Template {
  return { ...base, ...overrides } as Template;
}

function peak(when: string) {
  return [
    { when: 'Week 1', title: 'Start', description: 'Effortful' },
    { when, title: 'Automatic', description: 'Holds itself', peak: true },
  ];
}

describe('parseWhenToDays', () => {
  it('parses the authored shapes', () => {
    expect(parseWhenToDays('~30 days')).toBe(30);
    expect(parseWhenToDays('Day 21')).toBe(21);
    expect(parseWhenToDays('Week 6')).toBe(42);
    expect(parseWhenToDays('Month 3')).toBe(90);
    expect(parseWhenToDays('Night 1')).toBe(1);
  });

  it('takes the upper bound of a range', () => {
    expect(parseWhenToDays('Days 1-4')).toBe(4);
    expect(parseWhenToDays('Week 2-3')).toBe(21);
  });

  it('returns null rather than guessing', () => {
    expect(parseWhenToDays(undefined)).toBeNull();
    expect(parseWhenToDays('Ongoing')).toBeNull();
    expect(parseWhenToDays('First use')).toBeNull();
    expect(parseWhenToDays('Day 0')).toBeNull();
  });
});

describe('peakDays', () => {
  it('reads the peak node, not the last node', () => {
    expect(
      peakDays([
        { when: '~40 days', title: 'A', description: 'd', peak: true },
        { when: 'Month 6', title: 'B', description: 'd' },
      ])
    ).toBe(40);
  });

  it('returns null with no timeline or no peak', () => {
    expect(peakDays(undefined)).toBeNull();
    expect(peakDays([])).toBeNull();
    expect(
      peakDays([{ when: 'Week 1', title: 'A', description: 'd' }])
    ).toBeNull();
  });
});

describe('getAutomaticityMeta', () => {
  it('prefers the timeline peak over growthType', () => {
    // The contradiction this exists to kill: growthType said 66, the authored
    // timeline said 30, and the page printed both.
    expect(
      getAutomaticityMeta(
        template({ growthType: 'average', timeline: peak('~30 days') })
      )
    ).toEqual({ days: 30, label: 'Simple' });
  });

  it('falls back to growthType when no timeline peak parses', () => {
    expect(getAutomaticityMeta(template({ growthType: 'complex' }))).toEqual({
      days: 120,
      label: 'Complex',
    });
    expect(
      getAutomaticityMeta(
        template({ growthType: 'average', timeline: peak('Ongoing') })
      )
    ).toEqual({ days: 66, label: 'Average' });
  });

  it('derives the label from the resolved days, never from growthType', () => {
    // Would previously have rendered "Complex · ~30d".
    expect(
      getAutomaticityMeta(
        template({ growthType: 'complex', timeline: peak('~30 days') })
      )?.label
    ).toBe('Simple');
  });

  it('returns null when there is nothing to state', () => {
    expect(getAutomaticityMeta(template())).toBeNull();
    expect(getAutomaticityMeta(null)).toBeNull();
  });
});
