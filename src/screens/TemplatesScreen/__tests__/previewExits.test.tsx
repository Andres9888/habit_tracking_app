/**
 * The detail modal's two exits, wired end-to-end through the real screen.
 *
 * This is deliberately an integration test rather than a component one: the
 * defect it guards against was a missing prop between TemplateModals and
 * FullsizeTemplatePreview, so the back button existed in code but never
 * rendered. Only the assembled tree catches that.
 */

import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react-native';
import { useMutation, useQuery } from 'convex/react';
import { queryCacheStore } from '../../../lib/queryCache/store/state';
import { requestHabitFocus } from '../../../features/habits/hooks/habitFocusStore';
import TemplatesScreen from '../TemplatesScreen';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../../features/habits/hooks/habitFocusStore', () => ({
  requestHabitFocus: jest.fn(),
}));

// Mocked per-query rather than blanket-mocking useQuery: the added-state test
// needs getImportedTemplateIds to return an id while templates.list returns a
// row, and those two cannot be the same value.
let mockImportedIds: string[] = [];
let mockImportedTemplateHabits: Array<{
  habitId: string;
  templateId: string;
}> = [];
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
    if (options?.entryName === 'templates.getImportedTemplateHabits') {
      return mockImportedTemplateHabits;
    }
    if (options?.entryName === 'settings.get') return { hasPremium: false };
    return [];
  },
}));

const defaultTemplate = {
  _id: 'template-1',
  _creationTime: 0,
  category: 'health_fitness',
  description: 'Walk after lunch.',
  frequency: 'daily',
  icon: '🚶',
  iconColor: '#10B981',
  name: 'Daily walk',
  scientificReference: 'Some reference',
};
let mockTemplates = [
  {
    ...defaultTemplate,
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
const mockUseMutation = useMutation as jest.Mock;
const mockRequestHabitFocus = requestHabitFocus as jest.Mock;
const mockImportTemplate = jest.fn();

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
    mockImportedTemplateHabits = [];
    mockTemplates = [{ ...defaultTemplate }];
    mockImportTemplate.mockResolvedValue({
      habitId: 'habit-1',
      success: true,
    });
    mockUseMutation.mockReturnValue(mockImportTemplate);
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

  it('keeps the post-add secondary action explicit and in the library', () => {
    mockImportedIds = ['template-1'];
    const onCloseLibrary = openPreview();

    expect(screen.getByText('Keep exploring habits')).toBeTruthy();
    fireEvent.press(screen.getByTestId('templates-preview-keep-exploring'));

    expect(onCloseLibrary).not.toHaveBeenCalled();
    expect(screen.getByTestId('templates-catalog-view')).toBeTruthy();
  });

  it('uses the safe Today fallback for the explicit post-add primary action', () => {
    mockImportedIds = ['template-1'];
    mockImportedTemplateHabits = [
      { habitId: 'habit-1', templateId: 'template-1' },
    ];
    const onCloseLibrary = openPreview();

    expect(
      screen.getByText('Go to Today and complete Daily walk')
    ).toBeTruthy();
    fireEvent.press(screen.getByTestId('templates-preview-go-to-today'));

    expect(mockRequestHabitFocus).toHaveBeenCalledWith('habit-1');
    expect(onCloseLibrary).toHaveBeenCalledTimes(1);
  });

  it('focuses template B after importing template A', async () => {
    mockTemplates = [
      { ...defaultTemplate },
      {
        ...defaultTemplate,
        _id: 'template-2',
        description: 'Read before bed.',
        icon: '📚',
        name: 'Evening reading',
      },
    ];
    mockImportedIds = ['template-2'];
    mockImportedTemplateHabits = [
      { habitId: 'habit-b', templateId: 'template-2' },
    ];
    mockImportTemplate.mockResolvedValue({
      habitId: 'habit-a',
      success: true,
    });

    const onCloseLibrary = openPreview();
    fireEvent.press(screen.getByTestId('templates-preview-quick-add'));
    await waitFor(() =>
      expect(screen.getByTestId('templates-preview-added')).toBeTruthy()
    );
    fireEvent.press(screen.getByTestId('templates-preview-keep-exploring'));

    fireEvent.press(screen.getByLabelText('Evening reading habit'));
    fireEvent.press(screen.getByTestId('templates-preview-go-to-today'));

    expect(mockRequestHabitFocus).toHaveBeenCalledTimes(1);
    expect(mockRequestHabitFocus).toHaveBeenCalledWith('habit-b');
    expect(mockRequestHabitFocus).not.toHaveBeenCalledWith('habit-a');
    expect(onCloseLibrary).toHaveBeenCalledTimes(1);
  });

  it('uses truthful status copy when revisiting an added habit', () => {
    mockImportedIds = ['template-1'];
    openPreview();

    // Membership, not an event: this panel also renders on every later visit,
    // so "just added" / "your chain starts now" would be false here.
    expect(screen.getByText('Daily walk is in your habits')).toBeTruthy();
    expect(
      screen.getByText("Complete it from Today when it's due.")
    ).toBeTruthy();
  });

  it('shows one post-add surface, not the old stacked pair', () => {
    mockImportedIds = ['template-1'];
    openPreview();

    // Exactly one confirmation node, and none of the retired surfaces:
    // the "Added" pill, the "Find another habit" link, or an overlay toast
    // repeating the same news on top of the panel.
    const panels = screen.getAllByTestId('templates-preview-added');
    expect(panels).toHaveLength(1);
    expect(screen.queryByTestId('templates-preview-find-another')).toBeNull();
    expect(screen.queryByText('Find another habit')).toBeNull();
    // Scoped to the panel: the catalog has its own "Added" category chip, so a
    // global text query would pass for the wrong reason.
    expect(within(panels[0]).queryByText('Added')).toBeNull();
    expect(screen.queryByTestId('templates-toast')).toBeNull();
    expect(screen.queryByTestId('make-it-stick-sheet')).toBeNull();
  });

  it('keeps the pre-add footer free of the commit panel', () => {
    openPreview();

    expect(screen.queryByTestId('templates-preview-added')).toBeNull();
    expect(screen.queryByTestId('templates-preview-go-to-today')).toBeNull();
    expect(screen.queryByTestId('templates-preview-keep-exploring')).toBeNull();
    expect(screen.getByTestId('templates-preview-quick-add')).toBeTruthy();
    expect(screen.getByTestId('templates-preview-customize')).toBeTruthy();
  });
});
