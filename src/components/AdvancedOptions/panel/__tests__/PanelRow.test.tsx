import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PanelRow } from '../PanelRow';

const base = {
  hue: 'streak' as const,
  icon: <Text>icon</Text>,
  title: 'Streak goal',
  hint: 'A target to aim for. Missing it costs nothing.',
};

describe('PanelRow', () => {
  it('renders a filled value chip when the value is set', () => {
    const { getByText } = render(
      <PanelRow {...base} open={false} value={{ label: '7 days', set: true }} />
    );

    expect(getByText('7 days')).toBeTruthy();
  });

  it('renders the unset verb chip when the value is not set', () => {
    const { getByText } = render(
      <PanelRow {...base} open={false} value={{ label: 'Set', set: false }} />
    );

    expect(getByText('Set')).toBeTruthy();
  });

  it('calls onToggle when the head is pressed and reports expanded state', () => {
    const onToggle = jest.fn();
    const { getByLabelText, rerender } = render(
      <PanelRow {...base} open={false} onToggle={onToggle} />
    );

    const head = getByLabelText('Streak goal');
    expect(head.props.accessibilityState.expanded).toBe(false);

    fireEvent.press(head);
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(<PanelRow {...base} open onToggle={onToggle} />);
    expect(
      getByLabelText('Streak goal').props.accessibilityState.expanded
    ).toBe(true);
  });

  it('is not pressable when onToggle is omitted', () => {
    const { queryByLabelText } = render(<PanelRow {...base} open={false} />);

    expect(queryByLabelText('Streak goal')).toBeNull();
  });
});
