import { fireEvent, render } from '@testing-library/react-native';
import { TemplateAddedToast } from '../TemplateAddedToast';

describe('TemplateAddedToast pending action', () => {
  it('keeps Go to disabled until the real habit id is ready', () => {
    const onViewHabit = jest.fn();
    const { getByRole } = render(
      <TemplateAddedToast
        actionReady={false}
        templateData={{ color: '#7C3AED', icon: '✍️', name: 'Creative Writing' }}
        visible
        onViewHabit={onViewHabit}
      />
    );
    const button = getByRole('button', { name: 'Go to Creative Writing' });

    expect(button.props.accessibilityState).toEqual({ disabled: true });
    fireEvent.press(button);
    expect(onViewHabit).not.toHaveBeenCalled();
  });
});
