import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet, View } from 'react-native';
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
      status: {
        recovery: '#E5893B',
        recoveryLight: '#FBF0E3',
        recoveryText: '#8A5526',
        streak: '#D97706',
      },
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

/** The band's outermost View carries the wash's first stop. */
function washStop(tree: ReturnType<typeof render>): string {
  const [band] = tree.UNSAFE_getAllByType(View);
  return StyleSheet.flatten(band.props.style).backgroundColor as string;
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

  it('keeps the pinned Edit control green and unfilled', () => {
    const { getByLabelText } = renderHeader(true);
    const editButton = getByLabelText('Edit habit');
    const [compactControl] = editButton.findAllByType(View);

    expect(StyleSheet.flatten(compactControl.props.style)).toEqual(
      expect.objectContaining({
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      })
    );
    expect(
      editButton.findAll((node) => node.props.color === '#0C7C59')
    ).not.toHaveLength(0);
  });

  it('follows the hero into the amber recovery wash', () => {
    // The header is fixed while the hero scrolls, so a mint header over an
    // amber hero is a visible seam at the top of the page.
    const rest = renderHeader();
    expect(washStop(rest)).toBe('#E3EDE6');
    rest.unmount();

    const recovery = render(
      <DetailBandHeader
        isRecovery
        isTitlePinned={false}
        title='Opposite Action'
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );
    expect(washStop(recovery)).toBe('#F3E7D8');
    recovery.unmount();

    const done = render(
      <DetailBandHeader
        isCompletedToday
        isTitlePinned={false}
        title='Opposite Action'
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );
    expect(washStop(done)).toBe('#D9EBDF');
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
