import { projectCatalogTemplate } from './catalog';
import type { Doc } from '../_generated/dataModel';

describe('projectCatalogTemplate', () => {
  it('drops science drill-down fields used only by the preview', () => {
    const template = {
      _creationTime: 1,
      _id: 'templates:1',
      category: 'sleep',
      createdAt: 1,
      description: 'Wind down',
      evidence: 'a long cited paragraph',
      frequency: 'daily',
      icon: '😴',
      iconColor: '#000',
      lead: 'why it works copy',
      name: 'Sleep',
      scientificReference: 'Walker 2017',
      sources: [{ authors: 'A', journal: 'J', title: 'T', year: '2017' }],
      suggestedCue: 'After I brush my teeth',
      tips: ['Dim lights'],
    } as unknown as Doc<'templates'>;

    const projected = projectCatalogTemplate(template);

    expect(projected.name).toBe('Sleep');
    expect(projected.suggestedCue).toBe('After I brush my teeth');
    expect(projected.tips).toEqual(['Dim lights']);
    expect(projected).not.toHaveProperty('lead');
    expect(projected).not.toHaveProperty('evidence');
    expect(projected).not.toHaveProperty('sources');
  });
});
