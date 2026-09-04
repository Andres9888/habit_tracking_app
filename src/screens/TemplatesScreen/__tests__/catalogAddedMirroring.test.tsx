/**
 * Added habits stay on their category shelf and are mirrored under "Added".
 *
 * The unit tests cover the grouping; this one covers what the user reported —
 * what is actually on screen. Moving added habits out of their category used
 * to delete the category's chip and section entirely, so a heavy user saw the
 * catalog shrink to three chips and read it as lost data.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useQuery } from 'convex/react';
import { queryCacheStore } from '../../../lib/queryCache/store/state';
import TemplatesScreen from '../TemplatesScreen';

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: () => jest.fn(),
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
}));

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
    if (options?.entryName === 'templates.getImportedTemplateHabitIds') return [];
    if (options?.entryName === 'settings.get') return { hasPremium: false };
    return [];
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: require('react-native').View,
}));

jest.mock('@/utils/haptics', () => ({ triggerHaptic: jest.fn() }));

const mockTemplates = [
  {
    _id: 'template-1',
    _creationTime: 0,
    category: 'health_fitness',
    description: 'Walk after lunch.',
    name: 'Daily walk',
  },
];

const mockUseQuery = useQuery as jest.Mock;

describe('catalog added mirroring', () => {
  beforeEach(() => {
    mockImportedIds = [];
    mockUseQuery.mockImplementation(() => mockTemplates);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryCacheStore.reset();
  });

  it('renders an added habit on its category shelf and under Added', () => {
    mockImportedIds = ['template-1'];

    render(<TemplatesScreen />);

    // The Health chip survives even though its only habit is added — this is
    // the chip that used to vanish along with its section.
    expect(screen.getByText('💪 Health')).toBeTruthy();
    expect(screen.getByText('✅ Added')).toBeTruthy();
    // Once on the Health shelf, once mirrored under Added.
    expect(screen.getAllByLabelText('Daily walk habit')).toHaveLength(2);
  });

  it('omits the Added chip and shelf entirely when nothing is added', () => {
    render(<TemplatesScreen />);

    expect(screen.getByText('💪 Health')).toBeTruthy();
    expect(screen.queryByText('✅ Added')).toBeNull();
    expect(screen.getAllByLabelText('Daily walk habit')).toHaveLength(1);
  });
});
