import { fireEvent, render } from '@testing-library/react-native';
import { EditLifecycleActions } from '../EditLifecycleActions';

describe('EditLifecycleActions', () => {
  it('keeps confirmed lifecycle actions at the bottom of Edit', () => {
    const onArchive = jest.fn();
    const onDelete = jest.fn();
    const { getByLabelText, getByText } = render(
      <EditLifecycleActions onArchive={onArchive} onDelete={onDelete} />
    );

    expect(getByText('Manage habit')).toBeTruthy();
    expect(
      getByText('Hide from your daily list. Restore anytime from Settings.')
    ).toBeTruthy();
    expect(
      getByText('Permanently removes this habit and all its history.')
    ).toBeTruthy();

    fireEvent.press(getByLabelText('Archive habit'));
    fireEvent.press(getByLabelText('Delete habit'));

    expect(onArchive).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
