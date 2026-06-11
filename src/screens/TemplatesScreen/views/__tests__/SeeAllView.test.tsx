import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SeeAllView } from '../SeeAllView';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

jest.mock('../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      text: { primary: '#1a1a1a', secondary: '#666' },
    },
  }),
}));

jest.mock('../../components/HabitTemplateCard', () => ({
  HabitTemplateCard: () => null,
}));

const mockTemplate = {
  _id: 'tmpl-1',
  category: 'health',
  description: 'Test desc',
  frequency: 'daily',
  icon: '🏃',
  iconColor: '#f00',
  name: 'Morning Run',
  popularityScore: 100,
  scientificReference: null,
  youtubeLink: null,
} as never;

describe('SeeAllView', () => {
  const baseProps = {
    importedTemplateIds: new Set<string>(),
    importingTemplateId: null,
    onBack: jest.fn(),
    onImport: jest.fn(),
    onPreview: jest.fn(),
    templates: [mockTemplate],
  };

  it('renders the shared ScreenHeader with title', () => {
    const { getByText } = render(<SeeAllView {...baseProps} />);
    expect(getByText('Popular habits')).toBeTruthy();
  });

  it('renders subtitle with template count', () => {
    const { getByText } = render(<SeeAllView {...baseProps} />);
    expect(getByText('1 habit · sorted by popularity')).toBeTruthy();
  });

  it('renders back button via ScreenHeader', () => {
    const { getByLabelText } = render(<SeeAllView {...baseProps} />);
    expect(getByLabelText('Go back')).toBeTruthy();
  });

  it('calls onBack when back button is pressed', () => {
    const onBack = jest.fn();
    const { getByLabelText } = render(
      <SeeAllView {...baseProps} onBack={onBack} />
    );
    fireEvent.press(getByLabelText('Go back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders with testID for view container', () => {
    const { getByTestId } = render(<SeeAllView {...baseProps} />);
    expect(getByTestId('templates-see-all-view')).toBeTruthy();
  });
});
