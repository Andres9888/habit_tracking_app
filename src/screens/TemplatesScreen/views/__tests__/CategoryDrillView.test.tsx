import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoryDrillView } from '../CategoryDrillView';

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

jest.mock('../../../../components/TemplateCard', () => ({
  TemplateCard: () => null,
}));

jest.mock('../../data/categoryMeta', () => ({
  getCategoryMeta: (id: string) => ({ icon: '🌅', label: 'Morning' }),
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

  it('renders the shared ScreenHeader with category title', () => {
    const { getByText } = render(<CategoryDrillView {...baseProps} />);
    expect(getByText('🌅 Morning')).toBeTruthy();
  });

  it('renders subtitle with template and science counts', () => {
    const { getByText } = render(<CategoryDrillView {...baseProps} />);
    expect(getByText('1 templates · 1 science-backed')).toBeTruthy();
  });

  it('renders back button via ScreenHeader', () => {
    const { getByLabelText } = render(
      <CategoryDrillView {...baseProps} />
    );
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
    const { getByTestId } = render(
      <CategoryDrillView {...baseProps} />
    );
    expect(getByTestId('templates-category-view')).toBeTruthy();
  });
});
