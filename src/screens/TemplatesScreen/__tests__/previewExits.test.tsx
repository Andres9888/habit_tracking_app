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
} from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import { queryCacheStore } from '../../../lib/queryCache/store/state';
import TemplatesScreen from '../TemplatesScreen';

const mockImportTemplate = jest.fn();

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: () => mockImportTemplate,
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mocked per-query rather than blanket-mocking useQuery: the added-state test
// needs getImportedTemplateIds to return an id while templates.list returns a
// row, and those two cannot be the same value.
let mockImportedIds: string[] = [];
let mockImportedHabitIds: { templateId: string; habitId: string }[] = [];
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
    if (options?.entryName === 'templates.getImportedTemplateHabitIds') {
      return mockImportedHabitIds;
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
function openPreview(onGoToHabit?: jest.Mock) {
  const onCloseLibrary = jest.fn();
  render(
    <TemplatesScreen
      onCloseLibrary={onCloseLibrary}
      onGoToHabit={onGoToHabit}
    />
  );
  // An added habit renders twice — once on its category shelf, once mirrored
  // under "Added" — so take the first card rather than asserting uniqueness.
  fireEvent.press(screen.getAllByLabelText('Daily walk habit')[0]!);
  return onCloseLibrary;
}

describe('template detail exits', () => {
  beforeEach(() => {
    mockImportedIds = [];
    mockImportedHabitIds = [];
    mockUseQuery.mockImplementation(() => mockTemplates);
    mockImportTemplate.mockResolvedValue({
      habitId: 'habit-1',
      success: true,
    });
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

    fireEvent.press(screen.getByTestId('templates-preview-keep-exploring'));

    expect(onCloseLibrary).not.toHaveBeenCalled();
    expect(screen.getByTestId('templates-catalog-view')).toBeTruthy();
  });

  it('keeps list Add out of the drill-down and shows a dismissible panel', async () => {
    render(<TemplatesScreen />);

    fireEvent.press(screen.getByLabelText('Add Daily walk habit'));

    await waitFor(() => {
      expect(screen.getByTestId('templates-toast')).toBeTruthy();
    });
    expect(screen.getByText('Daily walk is in your habits')).toBeTruthy();
    expect(screen.getByText('Go to Daily walk')).toBeTruthy();
    expect(screen.queryByTestId('templates-preview-added')).toBeNull();
    expect(screen.queryByTestId('templates-preview-back')).toBeNull();
    expect(screen.queryByTestId('make-it-stick-sheet')).toBeNull();
    expect(mockImportTemplate).toHaveBeenCalledWith({
      templateId: 'template-1',
    });

    fireEvent.press(screen.getByText('Keep exploring habits'));
    await waitFor(() => {
      expect(screen.queryByTestId('templates-toast')).toBeNull();
    });
    expect(screen.getByTestId('templates-catalog-view')).toBeTruthy();
  });
  it('sends the list-add toast primary to the habit it just created', async () => {
    const onGoToHabit = jest.fn();
    const onCloseLibrary = jest.fn();
    render(
      <TemplatesScreen
        onCloseLibrary={onCloseLibrary}
        onGoToHabit={onGoToHabit}
      />
    );

    fireEvent.press(screen.getByLabelText('Add Daily walk habit'));
    await waitFor(() => {
      expect(screen.getByText('Go to Daily walk')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Go to Daily walk'));

    // The toast dismisses first and hands off after a short delay.
    await waitFor(() => {
      expect(onGoToHabit).toHaveBeenCalledWith('habit-1');
    });
    expect(onCloseLibrary).not.toHaveBeenCalled();
  });

  it('sends the post-add primary action to the habit it just created', async () => {
    const onGoToHabit = jest.fn();
    const onCloseLibrary = openPreview(onGoToHabit);

    fireEvent.press(screen.getByTestId('templates-preview-quick-add'));
    await waitFor(() => {
      expect(screen.getByTestId('templates-preview-added')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('templates-preview-go-to-today'));

    // Home focuses the habit; it must not also take the plain exit path.
    expect(onGoToHabit).toHaveBeenCalledTimes(1);
    expect(onGoToHabit).toHaveBeenCalledWith('habit-1');
    expect(onCloseLibrary).not.toHaveBeenCalled();
  });

  it('resolves the habit for a template imported in an earlier session', () => {
    mockImportedIds = ['template-1'];
    mockImportedHabitIds = [{ habitId: 'habit-1', templateId: 'template-1' }];
    const onGoToHabit = jest.fn();
    const onCloseLibrary = openPreview(onGoToHabit);

    fireEvent.press(screen.getByTestId('templates-preview-go-to-today'));

    expect(onGoToHabit).toHaveBeenCalledWith('habit-1');
    expect(onCloseLibrary).not.toHaveBeenCalled();
  });

  it('falls back to plain exit-to-home when the habit is unknown', () => {
    mockImportedIds = ['template-1'];
    const onGoToHabit = jest.fn();
    const onCloseLibrary = openPreview(onGoToHabit);

    fireEvent.press(screen.getByTestId('templates-preview-go-to-today'));

    expect(onGoToHabit).not.toHaveBeenCalled();
    expect(onCloseLibrary).toHaveBeenCalledTimes(1);
  });

  it('falls back to plain exit-to-home with no onGoToHabit handler', () => {
    mockImportedIds = ['template-1'];
    mockImportedHabitIds = [{ habitId: 'habit-1', templateId: 'template-1' }];
    const onCloseLibrary = openPreview();

    fireEvent.press(screen.getByTestId('templates-preview-go-to-today'));

    expect(onCloseLibrary).toHaveBeenCalledTimes(1);
  });
});
