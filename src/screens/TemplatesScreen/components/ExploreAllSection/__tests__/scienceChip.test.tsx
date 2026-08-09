/**
 * The science chip is the browse-level entry to the research section — it
 * must appear only when the template actually has science content, and it
 * must open the preview anchored to science, not the top.
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import type { Doc } from '../../../../../../convex/_generated/dataModel';
import { TemplateReadRow } from '../TemplateReadRow';

jest.mock('@/utils/haptics', () => ({ triggerHaptic: jest.fn() }));

const scienceTemplate = {
  _id: 't1',
  _creationTime: 0,
  category: 'mindfulness',
  description: 'A quiet reset.',
  frequency: 'daily',
  icon: '🧘',
  iconColor: '#10B981',
  name: 'Meditate',
  lead: 'Meditation lowers cortisol.',
  evidence: 'Goyal et al., 2014',
} as Doc<'templates'>;

const plainTemplate = {
  _id: 't2',
  _creationTime: 0,
  category: 'productivity',
  description: 'Clear surface, clear head.',
  frequency: 'daily',
  icon: '🧹',
  iconColor: '#F59E0B',
  name: 'Tidy desk',
} as Doc<'templates'>;

const baseProps = {
  isImported: false,
  isImporting: false,
  onImport: jest.fn(),
  onPreview: jest.fn(),
};

describe('science chip', () => {
  it('opens the preview anchored to science', () => {
    const onPreview = jest.fn();
    const { getByLabelText } = render(
      <TemplateReadRow
        {...baseProps}
        item={scienceTemplate}
        onPreview={onPreview}
      />
    );
    fireEvent.press(getByLabelText('See the science for Meditate'));
    expect(onPreview).toHaveBeenCalledWith(scienceTemplate, 'science');
  });

  it('does not render for templates without science content', () => {
    const { queryByLabelText } = render(
      <TemplateReadRow {...baseProps} item={plainTemplate} />
    );
    expect(queryByLabelText('See the science for Tidy desk')).toBeNull();
  });
});
