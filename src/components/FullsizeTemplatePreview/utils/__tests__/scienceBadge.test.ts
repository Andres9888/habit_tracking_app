/**
 * scienceBadge — the badge must not borrow credibility a habit does not have.
 */

import {
  citedSources,
  isPeerReviewedSource,
  isScienceBacked,
} from '../scienceBadge';
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

function source(journal: string) {
  return { authors: 'A', title: 'T', journal, year: '2020' };
}

describe('isPeerReviewedSource', () => {
  it('accepts journals and guideline bodies', () => {
    expect(isPeerReviewedSource(source('JAMA'))).toBe(true);
    expect(isPeerReviewedSource(source('Sleep Health'))).toBe(true);
    expect(isPeerReviewedSource(source('PNAS'))).toBe(true);
    // Guidance is evidence; it is just not a journal article.
    expect(isPeerReviewedSource(source('CDC'))).toBe(true);
    expect(isPeerReviewedSource(source('ACSM Position Stand'))).toBe(true);
  });

  it('rejects trade imprints and university presses', () => {
    expect(isPeerReviewedSource(source('Scribner'))).toBe(false);
    expect(isPeerReviewedSource(source('Portfolio'))).toBe(false);
    expect(isPeerReviewedSource(source('Grand Central Publishing'))).toBe(false);
    expect(isPeerReviewedSource(source('Harvard University Press'))).toBe(false);
    expect(isPeerReviewedSource(source('Riverhead Books'))).toBe(false);
    expect(isPeerReviewedSource(source('Gottman Institute research summaries')))
      .toBe(false);
  });

  it('rejects an empty venue — the scientificReference fallback shape', () => {
    expect(isPeerReviewedSource(source(''))).toBe(false);
    expect(isPeerReviewedSource(source('   '))).toBe(false);
  });
});

describe('isScienceBacked', () => {
  it('is true with an authored finding', () => {
    expect(isScienceBacked(template({ evidence: 'Chang et al. found X' }))).toBe(
      true
    );
  });

  it('is true with at least one cited paper', () => {
    expect(isScienceBacked(template({ sources: [source('The Lancet')] }))).toBe(
      true
    );
  });

  it('is false when the only source is a trade book', () => {
    // "Consistent Bedtime" — backed solely by Why We Sleep (Scribner).
    expect(isScienceBacked(template({ sources: [source('Scribner')] }))).toBe(
      false
    );
  });

  it('never gates on the scientificReference fallback', () => {
    expect(
      isScienceBacked(
        template({ scientificReference: 'Cal Newport (2016) - Deep Work' })
      )
    ).toBe(false);
  });

  it('is false for empty or missing templates', () => {
    expect(isScienceBacked(template())).toBe(false);
    expect(isScienceBacked(null)).toBe(false);
  });
});

describe('citedSources', () => {
  it('keeps papers and drops imprints', () => {
    const t = template({
      sources: [source('Nature Medicine'), source('Crown'), source('Neuron')],
    });
    expect(citedSources(t).map((s) => s.journal)).toEqual([
      'Nature Medicine',
      'Neuron',
    ]);
  });
});
