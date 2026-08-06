/**
 * The detail modal's two exits, wired end-to-end through the real screen.
 *
 * This is deliberately an integration test rather than a component one: the
 * defect it guards against was a missing prop between TemplateModals and
 * FullsizeTemplatePreview, so the back button existed in code but never
 * rendered. Only the assembled tree catches that.
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import { queryCacheStore } from '../../../lib/queryCache/store/state';
import TemplatesScreen from '../TemplatesScreen';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: () => jest.fn(),
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mocked per-query rather than blanket-mocking useQuery: the added-state test
// needs getImportedTemplateIds to return an id while templates.list returns a
// row, and those two cannot be the same value.
let mockImportedIds: string[] = [];
jest.mock('../../../lib/queryCache', () => ({
  useCachedQuery: (
    _query: unknown,
    _args: unknown,
    options?: { entryName?: string }
  ) => {
    if (options?.entryName === 'templates.list') return mockTemplates;
    if (options?.entryName === 'templates.getImportedTemplateIds') {
      return mockImportedIds;
    }
    if (options?.entryName === 'settings.get') return { hasPremium: false };
    return [];
  },
}));

const mockTemplates = [
  {
    _id: 'template-1',
    _creationTime: 0,
    category: 'health_fitness',
    description: 'Walk after lunch.',
    frequency: 'daily',
    icon: '🚶',
    iconColor: '#10B981',
    name: 'Daily walk',
    scientificReference: 'Some reference',
  },
];

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: require('react-native').View,
}));

jest.mock('@/utils/haptics', () => ({ triggerHaptic: jest.fn() }));

const mockUseQuery = useQuery as jest.Mock;

/** Renders the library and opens the detail modal for the seeded habit. */
function openPreview() {
  const onCloseLibrary = jest.fn();
  render(<TemplatesScreen onCloseLibrary={onCloseLibrary} />);
  fireEvent.press(screen.getByLabelText('Daily walk habit'));
  return onCloseLibrary;
}

describe('template detail exits', () => {
  beforeEach(() => {
    mockImportedIds = [];
    mockUseQuery.mockImplementation(() => mockTemplates);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryCacheStore.reset();
  });

  it('shows both exits, distinctly labelled', () => {
    openPreview();

    // Regression: back rendered only once TemplateModals actually passed onBack.
    expect(screen.getByTestId('templates-preview-back')).toBeTruthy();
    expect(screen.getByTestId('templates-preview-exit-home')).toBeTruthy();
    expect(screen.getByLabelText('Back to habit library')).toBeTruthy();
    expect(screen.getByLabelText('Close and go to my habits')).toBeTruthy();
  });

  it('back returns to the library without dismissing it', () => {
    const onCloseLibrary = openPreview();

    fireEvent.press(screen.getByTestId('templates-preview-back'));

    expect(onCloseLibrary).not.toHaveBeenCalled();
    // The catalog was never unmounted, so its scroll/filter state survives.
    expect(screen.getByTestId('templates-catalog-view')).toBeTruthy();
  });

  it('X dismisses the library so the user lands on home', () => {
    const onCloseLibrary = openPreview();

    fireEvent.press(screen.getByTestId('templates-preview-exit-home'));

    expect(onCloseLibrary).toHaveBeenCalledTimes(1);
  });

  it('keeps both exits working when the habit is already added', () => {
    mockImportedIds = ['template-1'];
    const onCloseLibrary = openPreview();

    // Guard the premise: the preview really is in its added state, so this
    // is not silently re-running the not-added case.
    expect(screen.getByTestId('templates-preview-added')).toBeTruthy();
    expect(screen.getByTestId('templates-preview-back')).toBeTruthy();

    fireEvent.press(screen.getByTestId('templates-preview-exit-home'));
    expect(onCloseLibrary).toHaveBeenCalledTimes(1);
  });

  it('sends the post-add secondary action back to the library, not home', () => {
    mockImportedIds = ['template-1'];
    const onCloseLibrary = openPreview();

    fireEvent.press(screen.getByTestId('templates-preview-find-another'));

    expect(onCloseLibrary).not.toHaveBeenCalled();
    expect(screen.getByTestId('templates-catalog-view')).toBeTruthy();
  });
});
