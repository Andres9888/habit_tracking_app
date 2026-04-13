import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoryDrillView } from '../CategoryDrillView';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

jest.mock('../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      background: '#F5F1ED',
      card: '#EDEAE5',
      border: '#DDD8D2',
      primary: { 500: '#10b981', 600: '#059669', 700: '#047857' },
      text: {
        primary: '#1a1a1a',
        secondary: '#666',
        tertiary: '#6e6660',
        inverse: '#fff',
      },
    },
  }),
}));

jest.mock('../TemplateListCard', () => ({
  TemplateListCard: () => null,
}));

jest.mock('../../data/categoryMeta', () => ({
  getCategoryMeta: (_id: string) => ({
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A',
    icon: '🌅',
    isPremium: false,
    label: 'Morning',
    subtitle: 'Build energy and momentum before 9am',
    textColor: '#9A5504',
  }),
}));

const mockTemplate = {
  _id: 'tmpl-1',
  category: 'morning_routine',
  description: 'Test desc',
  frequency: 'daily',
  icon: '🌅',
  iconColor: '#f00',
  name: 'Morning Routine',
  popularityScore: 100,
  scientificReference: 'Smith et al. 2023',
  youtubeLink: null,
} as never;

describe('CategoryDrillView', () => {
  const baseProps = {
    categoryId: 'morning_routine',
    importedTemplateIds: new Set<string>(),
    importingTemplateId: null,
    onBack: jest.fn(),
    onImport: jest.fn(),
    onPreview: jest.fn(),
    templates: [mockTemplate],
  };

  it('renders the category title in the hero header', () => {
    const { getByText } = render(<CategoryDrillView {...baseProps} />);
    expect(getByText('Morning')).toBeTruthy();
  });

  it('renders habit count and science count as separate badges', () => {
    const { getByText } = render(<CategoryDrillView {...baseProps} />);
    expect(getByText('📋 1 habit')).toBeTruthy();
    expect(getByText('🔬 1 science-backed')).toBeTruthy();
  });

  it('renders back button via ScreenHeader', () => {
    const { getByLabelText } = render(<CategoryDrillView {...baseProps} />);
    expect(getByLabelText('Go back')).toBeTruthy();
  });

  it('calls onBack when back button is pressed', () => {
    const onBack = jest.fn();
    const { getByLabelText } = render(
      <CategoryDrillView {...baseProps} onBack={onBack} />
    );
    fireEvent.press(getByLabelText('Go back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders with testID for view container', () => {
    const { getByTestId } = render(<CategoryDrillView {...baseProps} />);
    expect(getByTestId('templates-category-view')).toBeTruthy();
  });
});
