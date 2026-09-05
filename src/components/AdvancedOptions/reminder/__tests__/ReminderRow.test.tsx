/**
 * Daily reminder row — spec 2a §5.
 * Off state, Switch-on opening the row, preset commits, permission denial.
 */
import { useState } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { ReminderRow } from '../ReminderRow';

const getPermissions = Notifications.getPermissionsAsync as jest.Mock;
const TIME = new Date(2026, 0, 1, 18, 45);

interface HarnessProps {
  onToggle: (enabled: boolean) => void;
  onTimeChange?: (time: Date) => void;
  initialEnabled?: boolean;
  initialOpen?: boolean;
}

function Harness({
  onToggle,
  onTimeChange = jest.fn(),
  initialEnabled = false,
  initialOpen = false,
}: HarnessProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [open, setOpen] = useState(initialOpen);

  return (
    <ReminderRow
      divided={false}
      open={open}
      reminder={{
        enabled,
        onTimeChange,
        onToggle: (value) => {
          onToggle(value);
          setEnabled(value);
        },
        reminderTime: TIME,
      }}
      onToggleOpen={() => setOpen((current) => !current)}
    />
  );
}

describe('ReminderRow', () => {
  beforeEach(() => {
    getPermissions.mockResolvedValue({ granted: true, status: 'granted' });
  });

  it('reads "Off" and has no pressable head while disabled', () => {
    const { getByText, queryByLabelText, queryByTestId } = render(
      <Harness onToggle={jest.fn()} />
    );

    expect(getByText('Off')).toBeTruthy();
    // No chevron / no head press target while the switch is off.
    expect(queryByLabelText('Daily reminder')).toBeNull();
    expect(queryByTestId('preset-morning')).toBeNull();
  });

  it('enables and opens the row from the switch', async () => {
    const onToggle = jest.fn();
    const { getByLabelText, getByTestId } = render(
      <Harness onToggle={onToggle} />
    );

    fireEvent(getByTestId('reminder-toggle'), 'valueChange', true);

    expect(onToggle).toHaveBeenCalledWith(true);
    await waitFor(() => {
      expect(getByTestId('preset-morning')).toBeTruthy();
    });
    expect(
      getByLabelText('Daily reminder').props.accessibilityState.expanded
    ).toBe(true);
  });

  it('commits the preset hour when a preset chip is pressed', async () => {
    const onTimeChange = jest.fn();
    const { getByTestId } = render(
      <Harness initialEnabled initialOpen onTimeChange={onTimeChange} onToggle={jest.fn()} />
    );

    fireEvent.press(getByTestId('preset-evening'));

    await waitFor(() => expect(onTimeChange).toHaveBeenCalled());
    expect(onTimeChange.mock.calls[0][0].getHours()).toBe(20);
  });

  it('shows the time chip in the head while enabled and closed', () => {
    const { getByText } = render(
      <Harness initialEnabled onToggle={jest.fn()} />
    );

    expect(getByText('6:45 PM')).toBeTruthy();
  });

  it('warns and disables the chips when permission is denied', async () => {
    getPermissions.mockResolvedValue({ granted: false, status: 'denied' });
    const { getByTestId, getByText } = render(<Harness onToggle={jest.fn()} />);

    fireEvent(getByTestId('reminder-toggle'), 'valueChange', true);

    await waitFor(() => {
      expect(getByText('Notifications are off for this app')).toBeTruthy();
    });
    expect(getByTestId('reminder-permission-banner')).toBeTruthy();
    expect(
      getByTestId('preset-morning').props.accessibilityState.disabled
    ).toBe(true);
  });
});
