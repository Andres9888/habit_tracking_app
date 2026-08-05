import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { useFilteredTemplates } from '../useFilteredTemplates';

const baseTemplate = {
  createdAt: 1,
  description: 'Template description',
  frequency: 'daily',
  icon: '🌅',
  iconColor: '#10b981',
  name: 'Template',
  popularityScore: 10,
  scientificReference: null,
  youtubeLink: null,
};

function Harness({
  searchQuery,
  selectedCategory = 'all',
  templates,
}: {
  searchQuery: string;
  selectedCategory?: Parameters<typeof useFilteredTemplates>[1];
  templates: Parameters<typeof useFilteredTemplates>[0];
}) {
  const results = useFilteredTemplates(
    templates,
    selectedCategory,
    searchQuery,
    'popular'
  );

  return (
    <Text testID='results'>
      {results.map((template) => template._id).join(',')}
    </Text>
  );
}

describe('useFilteredTemplates', () => {
  const templates = [
    {
      ...baseTemplate,
      _id: 'sleep-1',
      category: 'sleep',
      name: 'Read before bed',
    },
    {
      ...baseTemplate,
      _id: 'science-1',
      category: 'mindfulness',
      name: 'Breath reset',
      scientificReference:
        'Bedtime breathing lowered stress in trial participants.',
    },
    {
      ...baseTemplate,
      _id: 'morning-1',
      category: 'morning_routine',
      name: 'Sunlight walk',
    },
  ] as never;

  it('returns all templates when no search or category filter is active', () => {
    const { getByTestId } = render(
      <Harness searchQuery='' templates={templates} />
    );

    const results = getByTestId('results').props.children;
    expect(results).toContain('sleep-1');
    expect(results).toContain('science-1');
    expect(results).toContain('morning-1');
  });

  it('matches templates by scientific reference text', () => {
    const { getByTestId } = render(
      <Harness searchQuery='trial participants' templates={templates} />
    );

    expect(getByTestId('results').props.children).toBe('science-1');
  });

  it('matches templates by human-readable category label', () => {
    const { getByTestId } = render(
      <Harness searchQuery='morning' templates={templates} />
    );

    expect(getByTestId('results').props.children).toContain('morning-1');
  });

  it('filters to short-duration templates when selectedCategory is "quick"', () => {
    const presetTemplates = [
      {
        ...baseTemplate,
        _id: 'quick-1',
        category: 'mindfulness',
        description: 'Take 2 minutes to breathe.',
        name: '2-Minute Reset',
      },
      {
        ...baseTemplate,
        _id: 'quick-2',
        category: 'morning_routine',
        description: 'A brief gratitude moment to start the day.',
        name: 'Gratitude Note',
      },
      {
        ...baseTemplate,
        _id: 'long-1',
        category: 'health_fitness',
        description: 'A 30-minute strength session for full body.',
        name: '30-Minute Run',
      },
    ] as never;

    const { getByTestId } = render(
      <Harness searchQuery='' selectedCategory='quick' templates={presetTemplates} />
    );

    const results = getByTestId('results').props.children;
    expect(results).toContain('quick-1');
    expect(results).toContain('quick-2');
    expect(results).not.toContain('long-1');
  });

  it('filters to high-popularity or richly-curated templates when selectedCategory is "high-roi"', () => {
    const presetTemplates = [
      {
        ...baseTemplate,
        _id: 'roi-high-1',
        category: 'health_fitness',
        name: '7-Minute Workout',
        popularityScore: 98,
      },
      {
        ...baseTemplate,
        _id: 'roi-curated-1',
        category: 'morning_routine',
        name: 'Morning Sunlight',
        popularityScore: 0,
        tips: ['Step outside within 30 min', 'Aim for 5-10 minutes', 'Skip sunglasses'],
      },
      {
        ...baseTemplate,
        _id: 'roi-low-1',
        category: 'creativity',
        name: 'Sketch a doodle',
        popularityScore: 60,
      },
    ] as never;

    const { getByTestId } = render(
      <Harness searchQuery='' selectedCategory='high-roi' templates={presetTemplates} />
    );

    const results = getByTestId('results').props.children;
    expect(results).toContain('roi-high-1');
    expect(results).toContain('roi-curated-1');
    expect(results).not.toContain('roi-low-1');
  });
});
