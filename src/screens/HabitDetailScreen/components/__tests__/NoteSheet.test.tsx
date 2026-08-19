import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { NoteSheet } from '../NoteSheet';

describe('NoteSheet', () => {
  it('keeps the sheet open when save fails', async () => {
    const onClose = jest.fn();
    const onSave = jest.fn().mockResolvedValue(false);
    const { getByText } = render(
      <NoteSheet
        date='2026-08-18'
        existing=''
        hint='Optional.'
        onClose={onClose}
        onSave={onSave}
      />
    );
    fireEvent.press(getByText('Save note'));
    await waitFor(() => expect(onSave).toHaveBeenCalledWith(''));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes after a successful save', async () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <NoteSheet
        date='2026-08-18'
        existing=''
        hint='Optional.'
        onClose={onClose}
        onSave={jest.fn().mockResolvedValue(true)}
      />
    );
    fireEvent.press(getByText('Save note'));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
