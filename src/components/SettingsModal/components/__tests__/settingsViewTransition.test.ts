import { act, renderHook } from '@testing-library/react-native';

jest.mock('convex/react', () => ({
  useMutation: () => jest.fn(async () => undefined),
  useQuery: () => undefined,
}));

import { SCREEN_WIDTH } from '@/components/Modal/Modal.constants';
import { useSettingsModalLogic } from '../../SettingsModal.hooks';
import {
  parkSettingsView,
  settingsViewOffset,
} from '../settingsViewTransition';

// The jest reanimated mock resolves `withTiming` synchronously to its target,
// so the settle animation is untestable here. What matters is the parking:
// the offset must reach the UI runtime before the new page commits.
describe('parkSettingsView', () => {
  beforeEach(() => {
    settingsViewOffset.value = 0;
  });

  it('parks off the leading edge for back navigation', () => {
    parkSettingsView('back');
    expect(settingsViewOffset.value).toBe(-SCREEN_WIDTH);
  });

  it('parks off the trailing edge for forward navigation', () => {
    parkSettingsView('forward');
    expect(settingsViewOffset.value).toBe(SCREEN_WIDTH);
  });

  it('rests at zero when there is no direction', () => {
    settingsViewOffset.value = SCREEN_WIDTH;
    parkSettingsView('none');
    expect(settingsViewOffset.value).toBe(0);
  });
});

describe('useSettingsModalLogic setView', () => {
  const renderLogic = () =>
    renderHook(() =>
      useSettingsModalLogic({ onClose: () => {}, visible: true })
    );

  it('parks the incoming sub-page off the trailing edge', () => {
    const { result } = renderLogic();
    settingsViewOffset.value = 0;

    act(() => result.current.setView('account'));

    expect(settingsViewOffset.value).toBe(SCREEN_WIDTH);
    expect(result.current.view).toBe('account');
  });

  it('parks the root off the leading edge on back navigation', () => {
    const { result } = renderLogic();
    act(() => result.current.setView('account'));
    settingsViewOffset.value = 0;

    act(() => result.current.setView('settings'));

    expect(settingsViewOffset.value).toBe(-SCREEN_WIDTH);
    expect(result.current.view).toBe('settings');
  });
});
