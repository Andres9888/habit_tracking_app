import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { DetailBandHeader } from '../DetailBandHeader';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

jest.mock('../../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({
    colors: {
      accent: '#059669',
      background: '#F5F1ED',
      border: '#DDD8D2',
      card: '#EDEAE5',
      gray: { 900: '#1A1816' },
      primary: { 500: '#10b981', 600: '#059669', 700: '#047857' },
      status: { streak: '#D97706' },
      text: {
        inverse: '#fff',
        primary: '#2D2A26',
        secondary: '#6B6560',
        tertiary: '#6E6660',
      },
    },
    isDark: false,
  }),
}));

function renderHeader(isTitlePinned = false) {
  return render(
    <DetailBandHeader
      isTitlePinned={isTitlePinned}
      title='Opposite Action'
      onClose={jest.fn()}
      onEdit={jest.fn()}
    />
  );
}

describe('DetailBandHeader', () => {
  it('keeps the habit name out of the chrome at rest', () => {
    const { getByLabelText, getByText, queryByText } = renderHeader();
    expect(getByLabelText('Close')).toBeTruthy();
    expect(StyleSheet.flatten(getByLabelText('Close').props.style)).toEqual(
      expect.objectContaining({ height: 44, width: 44 })
    );
    expect(StyleSheet.flatten(getByText('Edit').props.style)).toEqual(
      expect.objectContaining({ color: '#0C7C59' })
    );
    expect(queryByText('Home')).toBeNull();
    expect(queryByText('Today')).toBeNull();
    expect(queryByText('Opposite Action')).toBeNull();
  });

  it('pins the habit name only after the hero has scrolled away', () => {
    const { getByText, queryByText } = renderHeader(true);
    expect(getByText('Opposite Action')).toBeTruthy();
    expect(queryByText('Today')).toBeNull();
  });

  it('closes to Home and opens Edit', () => {
    const onClose = jest.fn();
    const onEdit = jest.fn();
    const { getByLabelText } = render(
      <DetailBandHeader
        isTitlePinned={false}
        title='Opposite Action'
        onClose={onClose}
        onEdit={onEdit}
      />
    );
    fireEvent.press(getByLabelText('Close'));
    fireEvent.press(getByLabelText('Edit habit'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
