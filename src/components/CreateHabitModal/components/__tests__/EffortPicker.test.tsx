import { fireEvent, render } from '@testing-library/react-native';
import { EffortPicker } from '../EffortPicker';

describe('EffortPicker', () => {
  it('selects a preset and exposes its full accessible label', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <EffortPicker value={undefined} onChange={onChange} />
    );

    fireEvent.press(getByLabelText('M, 15 minutes'));

    expect(onChange).toHaveBeenCalledWith(15);
  });

  it('clears the selected preset when it is pressed again', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <EffortPicker value={30} onChange={onChange} />
    );

    const largePreset = getByLabelText('L, 30 minutes');
    expect(largePreset.props.accessibilityState).toEqual({ selected: true });

    fireEvent.press(largePreset);

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
