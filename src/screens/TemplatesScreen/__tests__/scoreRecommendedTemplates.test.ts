import { scoreRecommendedTemplates } from '../hooks/scoreRecommendedTemplates';

const baseTemplate = {
  createdAt: 1,
  description: 'Template description',
  frequency: 'daily',
  icon: '💧',
  iconColor: '#10b981',
  popularityScore: 10,
  scientificReference: null,
  youtubeLink: null,
};

describe('scoreRecommendedTemplates', () => {
  const templates = [
    {
      ...baseTemplate,
      _id: 'fit-1',
      category: 'health_fitness',
      name: 'Morning Run',
      popularityScore: 80,
    },
    {
      ...baseTemplate,
      _id: 'veg-1',
      category: 'health_fitness',
      name: 'Eat a vegetable',
      popularityScore: 40,
    },
    {
      ...baseTemplate,
      _id: 'sleep-1',
      category: 'sleep',
      name: 'No screens in bed',
      popularityScore: 60,
    },
    {
      ...baseTemplate,
      _id: 'mind-1',
      category: 'mindfulness',
      name: '2-min breathing',
      popularityScore: 30,
    },
  ] as never;

  it('returns empty for brand-new users', () => {
    expect(
      scoreRecommendedTemplates({
        allTemplates: templates,
        importedTemplateIds: new Set(),
        userHabitCount: 1,
        userHabitNames: ['Morning Run'],
      })
    ).toEqual([]);
  });

  it('excludes imported templates and habits with matching names', () => {
    const results = scoreRecommendedTemplates({
      allTemplates: templates,
      importedTemplateIds: new Set(['veg-1']),
      userHabitCount: 2,
      userHabitNames: ['Morning Run', 'Journal'],
    });

    expect(results.map((entry) => entry.template._id)).not.toContain('fit-1');
    expect(results.map((entry) => entry.template._id)).not.toContain('veg-1');
  });

  it('boosts same-category templates with affinity reason', () => {
    const results = scoreRecommendedTemplates({
      allTemplates: templates,
      importedTemplateIds: new Set(),
      userHabitCount: 2,
      userHabitNames: ['Morning Run'],
    });

    const veg = results.find((entry) => entry.template._id === 'veg-1');
    expect(veg?.reason).toContain('Because you track');
  });

  it('suggests gap categories from related goal collections', () => {
    const withMorning = [
      ...templates,
      {
        ...baseTemplate,
        _id: 'morning-1',
        category: 'morning_routine',
        name: 'Sunlight walk',
        popularityScore: 55,
      },
    ] as never;

    const results = scoreRecommendedTemplates({
      allTemplates: withMorning,
      importedTemplateIds: new Set(),
      userHabitCount: 2,
      userHabitNames: ['Morning Run'],
    });

    const morning = results.find((entry) => entry.template._id === 'morning-1');
    expect(morning?.reason).toBe('Fills a gap: Morning');
  });
});
