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
});
