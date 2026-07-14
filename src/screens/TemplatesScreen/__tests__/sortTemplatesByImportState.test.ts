import type { Doc } from '../../../../convex/_generated/dataModel';
import {
  compareTemplatesByPopularity,
  sortTemplatesByImportState,
} from '../utils/sortTemplatesByImportState';

const templates = [
  { _id: 'imported-high', popularityScore: 100 },
  { _id: 'available-low', popularityScore: 20 },
  { _id: 'available-high', popularityScore: 80 },
  { _id: 'imported-low', popularityScore: 10 },
] as unknown as Doc<'templates'>[];

describe('sortTemplatesByImportState', () => {
  it('puts available templates first and preserves popularity within each group', () => {
    const result = sortTemplatesByImportState(
      templates,
      new Set(['imported-high', 'imported-low']),
      compareTemplatesByPopularity
    );

    expect(result.map((template) => template._id)).toEqual([
      'available-high',
      'available-low',
      'imported-high',
      'imported-low',
    ]);
  });

  it('does not mutate the source collection', () => {
    const sourceOrder = templates.map((template) => template._id);

    sortTemplatesByImportState(
      templates,
      new Set(['imported-high']),
      compareTemplatesByPopularity
    );

    expect(templates.map((template) => template._id)).toEqual(sourceOrder);
  });
});
