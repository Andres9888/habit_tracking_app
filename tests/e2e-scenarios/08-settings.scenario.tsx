/**
 * Scenario S15: Settings — appearance, theme and reminders.
 *
 * PASS when the settings surface renders the appearance/notifications sections
 * and changing the theme to Dark persists via the settings:update mutation.
 */
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import SettingsModal from '../../src/components/SettingsModal/SettingsModal';
import {
  getMutation,
  renderScreen,
  resetConvex,
  seedCommonQueries,
  setQuery,
} from './harness';

describe('S15 Settings', () => {
  beforeEach(() => {
    resetConvex();
    seedCommonQueries();
    setQuery('users:currentUser', {
      _id: 'u1',
      email: 'test@example.com',
      name: 'Test',
    });
    getMutation('settings:update');
  });

  it('shows settings sections and persists a theme change', async () => {
    renderScreen(<SettingsModal visible onClose={() => {}} />);
    expect(await screen.findByText('Settings')).toBeTruthy();
    expect(screen.getByText('Appearance')).toBeTruthy();
    expect(screen.getByText('Notifications')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Dark'));
    await waitFor(() =>
      expect(getMutation('settings:update')).toHaveBeenCalled()
    );
  });
});
