import React from 'react';
import { render } from '@testing-library/react-native';
import AnalyticsScreen from './AnalyticsScreen';

jest.mock('./AnalyticsScreen.hooks', () => ({
  useAnalyticsScreen: jest.fn(),
}));

jest.mock('../../components/RevenueCatPaywall', () => ({
  RevenueCatPaywall: ({
    dismissible,
    visible,
  }: {
    dismissible?: boolean;
    visible: boolean;
  }) => {
    const { Text } = require('react-native');
    return visible ? (
      <Text>{`Unlock Your Full Potential dismissible=${String(!!dismissible)}`}</Text>
    ) : null;
  },
}));

jest.mock('../../components/SkeletonLoader', () => ({
  AnalyticsScreenSkeleton: () => null,
}));

jest.mock('../../components/ErrorBoundary', () => ({
  ScreenErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../components/ScreenHeader', () => ({
  ScreenHeader: ({ title }: { title: string }) => {
    const { Text } = require('react-native');
    return <Text>{title}</Text>;
  },
}));

jest.mock('./components', () => {
  const { Text } = require('react-native');
  return {
    ChartSections: () => null,
    EmptyState: () => <Text>empty</Text>,
    ExportButton: () => null,
    ExportMenu: () => null,
    InsightsSections: () => null,
    OverviewStats: () => null,
  };
});

const { useAnalyticsScreen } = jest.requireMock('./AnalyticsScreen.hooks') as {
  useAnalyticsScreen: jest.Mock;
};

const freeReturn = {
  cacheSavedAt: undefined,
  complianceData: undefined,
  handleExport: jest.fn(),
  handleExportPress: jest.fn(),
  handleHabitPress: jest.fn(),
  isLoading: false,
  isPremiumUser: false,
  onRefresh: jest.fn(),
  overviewStats: undefined,
  refreshing: false,
  setShowExportMenu: jest.fn(),
  showExportMenu: false,
  strengthDistribution: undefined,
  trendData: undefined,
  weeklyInsights: undefined,
};

describe('AnalyticsScreen premium gate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the single paywall for free users and never the dashboard', () => {
    useAnalyticsScreen.mockReturnValue(freeReturn);
    const { getByText, queryByText } = render(<AnalyticsScreen />);
    expect(getByText(/Unlock Your Full Potential/)).toBeTruthy();
    expect(queryByText('Analytics')).toBeNull();
  });

  it('is dismissible when opened from Settings with onBack', () => {
    useAnalyticsScreen.mockReturnValue(freeReturn);
    const { getByText } = render(<AnalyticsScreen onBack={jest.fn()} />);
    expect(getByText(/dismissible=true/)).toBeTruthy();
  });

  it('renders the dashboard for premium users', () => {
    useAnalyticsScreen.mockReturnValue({
      ...freeReturn,
      isPremiumUser: true,
      overviewStats: { rankedHabits: [], totalHabits: 0 },
    });
    const { getByText, queryByText } = render(<AnalyticsScreen />);
    expect(getByText('Analytics')).toBeTruthy();
    expect(queryByText(/Unlock Your Full Potential/)).toBeNull();
  });
});
