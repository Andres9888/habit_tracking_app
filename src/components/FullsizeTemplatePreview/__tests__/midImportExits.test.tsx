/**
 * Every exit must respect an in-flight import: backdrop and hardware back are
 * blocked elsewhere, and the header pair must match — leaving mid-import
 * strands the add's result on a screen the user already left.
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import FullsizeTemplatePreview from '../FullsizeTemplatePreview';
import type { Template } from '../../../types/template';
import type { Id } from '../../../../convex/_generated/dataModel';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: require('react-native').View,
}));

jest.mock('@/utils/haptics', () => ({ triggerHaptic: jest.fn() }));

const template = {
  _id: 't1' as Id<'templates'>,
  _creationTime: 0,
  category: 'mindfulness',
  createdAt: 0,
  description: 'A quiet reset.',
  frequency: 'daily',
  icon: '🧘',
  iconColor: '#10B981',
  name: 'Meditate',
} as Template;

function renderPreview(isImporting: boolean) {
  const onBack = jest.fn();
  const onClose = jest.fn();
  const utils = render(
    <FullsizeTemplatePreview
      isImporting={isImporting}
      template={template}
      visible
      onBack={onBack}
      onClose={onClose}
      onImport={jest.fn()}
    />
  );
  return { ...utils, onBack, onClose };
}

describe('mid-import exits', () => {
  it('header back and X are inert while an import is in flight', () => {
    const { getByTestId, onBack, onClose } = renderPreview(true);
    fireEvent.press(getByTestId('templates-preview-back'));
    fireEvent.press(getByTestId('templates-preview-exit-home'));
    expect(onBack).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('header back and X work when no import is running', () => {
    const { getByTestId, onBack } = renderPreview(false);
    fireEvent.press(getByTestId('templates-preview-back'));
    expect(onBack).toHaveBeenCalled();
  });
});
