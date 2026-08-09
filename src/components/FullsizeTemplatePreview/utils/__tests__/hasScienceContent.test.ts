/**
 * hasScienceContent — gates science-anchor measurement.
 */

import { hasScienceContent } from '../hasScienceContent';
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

describe('hasScienceContent', () => {
  it('returns false for null/undefined/empty templates', () => {
    expect(hasScienceContent(null)).toBe(false);
    expect(hasScienceContent(undefined)).toBe(false);
    expect(hasScienceContent(template())).toBe(false);
  });

  it('returns true when lead or evidence is present', () => {
    expect(hasScienceContent(template({ lead: 'Works via X' }))).toBe(true);
    expect(hasScienceContent(template({ evidence: 'Study Y' }))).toBe(true);
  });

  it('returns false for a timeline alone — expectations are not evidence', () => {
    expect(
      hasScienceContent(
        template({
          timeline: [
            { when: 'Week 1', title: 'Start', description: 'Effortful' },
          ],
        })
      )
    ).toBe(false);
  });

  it('returns true when sources or scientificReference is present', () => {
    expect(
      hasScienceContent(
        template({
          sources: [
            {
              authors: 'A',
              title: 'Paper',
              journal: 'J',
              year: '2020',
            },
          ],
        })
      )
    ).toBe(true);
    expect(
      hasScienceContent(template({ scientificReference: 'Some book' }))
    ).toBe(true);
  });

  it('ignores blank strings and empty arrays', () => {
    expect(
      hasScienceContent(
        template({
          lead: '   ',
          evidence: '',
          scientificReference: '  ',
          timeline: [],
          sources: [],
        })
      )
    ).toBe(false);
  });
});
