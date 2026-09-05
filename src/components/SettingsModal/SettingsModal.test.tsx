import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  return {
    ...Reanimated,
    getUseOfValueInStyleWarning: () => '',
  };
});

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({
    addListener: jest.fn(),
    play: jest.fn(),
    remove: jest.fn(),
    volume: 1,
  })),
}));

jest.mock('@clerk/clerk-expo', () => ({
  useClerk: () => ({ signOut: jest.fn() }),
  useUser: () => ({
    user: {
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    },
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: require('react-native').View,
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// The permission probe behind the reminder row lazily `import()`s its
// implementation, which Jest's CJS VM cannot resolve. Grant permission so the
// warning banner stays out of the way of the structural assertions.
jest.mock('@/utils/notifications', () => ({
  ...jest.requireActual('@/utils/notifications'),
  hasNotificationPermissions: jest.fn(async () => true),
}));

// Free-tier premium state so conversion surfaces WOULD render if any leaked
// onto the main Settings screen; the no-promo tests below hold the line.
jest.mock('@/hooks/usePremium', () => ({
  usePremium: () => ({
    isPremium: false,
    status: 'free',
    isLoading: false,
    error: null,
    packages: null,
    monthlyPackage: null,
    priceString: '$6.99',
    annualPackage: null,
    annualPriceString: null,
    annualSavingsPercent: null,
    trialDays: null,
    isLoadingOfferings: false,
    purchasePackage: jest.fn(),
    restorePurchases: jest.fn(),
    refreshStatus: jest.fn(),
    expirationDate: null,
    isTrialActive: false,
    managementUrl: null,
    activeProductId: null,
    isAnnualPlan: false,
    customerInfo: null,
  }),
}));

import SettingsModal from './SettingsModal';

/** Depth-first flattened text of the rendered tree — order = on-screen order. */
function getFlattenedTexts(root: ReturnType<typeof render>['toJSON']): string[] {
  const texts: string[] = [];
  const walk = (node: unknown): void => {
    if (typeof node === 'string' && node.length > 0) {
      texts.push(node);
      return;
    }
    if (node == null || typeof node !== 'object') return;
    const element = node as {
      children?: unknown;
      props?: Record<string, unknown>;
    };
    if (
      typeof element.props?.children === 'string' &&
      element.props.children.length > 0
    ) {
      texts.push(element.props.children);
      return;
    }
    const children = Array.isArray(element.children)
      ? element.children
      : [element.children];
    for (const child of children) walk(child);
  };
  walk(root);
  return texts;
}

describe('SettingsModal', () => {
  async function renderSettings(
    extraProps: Partial<React.ComponentProps<typeof SettingsModal>> = {}
  ) {
    const utils = render(<SettingsModal onClose={() => {}} visible {...extraProps} />);
    await waitFor(() => expect(utils.getByText('Appearance')).toBeTruthy());
    return utils;
  }

  it('collapses five section headers into three', async () => {
    const { toJSON, queryByText } = await renderSettings();
    const texts = getFlattenedTexts(toJSON());
    const idx = (label: string) => {
      const at = texts.indexOf(label);
      expect(at).toBeGreaterThanOrEqual(0);
      return at;
    };

    // The account entry point is the profile hero card, which renders the
    // user's name rather than a section header.
    expect(idx('Test User')).toBeLessThan(idx('Appearance'));
    expect(idx('Appearance')).toBeLessThan(idx('Habits'));
    expect(idx('Habits')).toBeLessThan(idx('Data & about'));

    // The headers this restructure merged away.
    expect(queryByText('Behavior')).toBeNull();
    expect(queryByText('Notifications')).toBeNull();
    expect(queryByText('Data & Privacy')).toBeNull();
    expect(queryByText('Help & About')).toBeNull();
  });

  it('gathers ordering, sound, reminder and archive under Habits', async () => {
    const { toJSON } = await renderSettings({ completionSoundEnabled: true });
    const texts = getFlattenedTexts(toJSON());
    const idx = (label: string) => {
      const at = texts.indexOf(label);
      expect(at).toBeGreaterThanOrEqual(0);
      return at;
    };

    expect(idx('Sort order')).toBeLessThan(idx('Completion sound'));
    expect(idx('Completion sound')).toBeLessThan(idx('Streak reminder'));
    expect(idx('Streak reminder')).toBeLessThan(idx('Archived habits'));

    expect(idx('Sort order')).toBeGreaterThan(idx('Habits'));
    expect(idx('Archived habits')).toBeLessThan(idx('Data & about'));
  });

  it('keeps export in the closing Data & about card', async () => {
    const { toJSON } = await renderSettings();
    const texts = getFlattenedTexts(toJSON());
    const idx = (label: string) => {
      const at = texts.indexOf(label);
      expect(at).toBeGreaterThanOrEqual(0);
      return at;
    };

    expect(idx('Export my data')).toBeGreaterThan(idx('Data & about'));
  });

  it('drops the subtitles the density pass removed', async () => {
    const { queryByText } = await renderSettings();

    expect(queryByText('Fit more on screen')).toBeNull();
    expect(queryByText('How habits are ordered')).toBeNull();
    expect(queryByText('View and restore hidden habits')).toBeNull();
    expect(queryByText('Download habits as CSV or JSON')).toBeNull();
  });

  it('does not claim an export started before format selection completes', async () => {
    const onExportHabitsData = jest.fn();
    const { getByLabelText, queryByText } = await renderSettings({
      onExportHabitsData,
    });

    fireEvent.press(getByLabelText('Export my data'));

    expect(onExportHabitsData).toHaveBeenCalledTimes(1);
    expect(queryByText('Export started…')).toBeNull();
  });

  it('shows no promotional surfaces on the main settings screen', async () => {
    const { queryByText, getByText } = await renderSettings();

    // Premium banner / trial card must not appear on the main surface.
    expect(queryByText('Chain Day Premium')).toBeNull();
    expect(queryByText(/Upgrade/)).toBeNull();
    // The reminders upsell row ("Want a different time per habit?") is gone.
    expect(queryByText(/Want a different time per habit\?/)).toBeNull();
    // The editorial header is intentionally kept: kicker + serif title.
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Chain Day')).toBeTruthy();
  });

  it('keeps Account neutral and avoids duplicating profile-photo controls', async () => {
    const { getByLabelText, getByText, queryByText } = await renderSettings();

    fireEvent.press(getByLabelText('Account settings'));
    await waitFor(() => expect(getByText('Free plan')).toBeTruthy());

    expect(queryByText(/Upgrade/)).toBeNull();
    expect(queryByText('Change photo')).toBeNull();
    expect(getByText('Restore purchases')).toBeTruthy();
  });

  // The root used to re-key an Animated.View with `entering={SlideInLeft}`;
  // the remounting tree stranded that layout animation and the root came back
  // frozen ~30pt to the left. The slide is a shared value now, so navigating
  // out and back must land on a fully rendered root.
  it('returns to the settings root when Account is dismissed', async () => {
    const { getByLabelText, getByText, queryByText } = await renderSettings();

    fireEvent.press(getByLabelText('Account settings'));
    // 'Free plan' only exists on the Account page — 'Account' is ambiguous.
    await waitFor(() => expect(getByText('Free plan')).toBeTruthy());
    expect(queryByText('Appearance')).toBeNull();

    fireEvent.press(getByLabelText('Go back'));
    await waitFor(() => expect(getByText('Appearance')).toBeTruthy());
    expect(getByText('Chain Day')).toBeTruthy();
  });

  it('exposes accessible values and expansion state on rows', async () => {
    const { getByLabelText } = await renderSettings({ completionSoundEnabled: true });

    // Toggle rows announce their live value.
    const streakRow = getByLabelText('Streak reminder');
    expect(streakRow.props.accessibilityValue?.text).toBe('Off');

    const sortRow = getByLabelText('Sort order');
    expect(sortRow.props.accessibilityState?.expanded).toBe(false);
    fireEvent.press(sortRow);
    expect(getByLabelText('Sort order').props.accessibilityState?.expanded).toBe(
      true
    );
  });

  it('shows the live reminder value instead of marketing copy', async () => {
    const { getByText, queryByText } = await renderSettings();

    expect(getByText('Streak reminder')).toBeTruthy();
    expect(getByText('Off')).toBeTruthy();
    expect(queryByText('Nudge before an active streak slips')).toBeNull();
  });

  it('carries the reminder time in the row subtitle when reminders are on', async () => {
    const { toJSON } = await renderSettings({
      streakReminderTime: '20:00',
      streakRemindersEnabled: true,
    });

    // The time is an emphasised span nested inside the subtitle, so the two
    // halves are separate text nodes.
    const texts = getFlattenedTexts(toJSON());
    expect(texts).toContain('Every day at ');
    expect(texts).toContain('8:00 PM');
    expect(texts).not.toContain('Off');
  });

  // The switch and the tone picker are now SEPARATE rows. They used to share
  // one row carrying both onToggle and onPress, which nested an
  // accessibilityRole='switch' inside an accessibilityRole='button'.
  it('keeps the sound picker collapsed until the Tone row is tapped', async () => {
    const { getByText, queryByLabelText } = await renderSettings({
      completionSoundEnabled: true,
    });

    expect(getByText('Completion sound')).toBeTruthy();
    expect(getByText('Tone')).toBeTruthy();
    expect(getByText('Chime')).toBeTruthy();
    expect(queryByLabelText('Pop sound')).toBeNull();

    fireEvent.press(getByText('Tone'));
    expect(queryByLabelText('Pop sound')).toBeTruthy();
  });

  it('hides the Tone row entirely when completion sound is off', async () => {
    const { queryByText } = await renderSettings({
      completionSoundEnabled: false,
    });

    expect(queryByText('Tone')).toBeNull();
  });

  it('merges Support advocacy and moves What’s new to the footer', async () => {
    const { getByText, queryByText } = await renderSettings();

    await waitFor(() => expect(getByText('Data & about')).toBeTruthy());
    expect(getByText('Love Chain Day?')).toBeTruthy();
    expect(getByText('Send feedback')).toBeTruthy();
    expect(queryByText('Rate Chain Day')).toBeNull();
    expect(queryByText('Share with a friend')).toBeNull();
    expect(getByText("What's new")).toBeTruthy();
  });

  it('omits surfaces removed by the redesign and the prune pass', async () => {
    const { getByText, queryByText } = await renderSettings();

    await waitFor(() => expect(getByText('Appearance')).toBeTruthy());
    // Stats/streak belong on a future Stats screen, not Settings.
    expect(queryByText(/day streak/i)).toBeNull();
    expect(queryByText('Export habits data')).toBeNull();
    // Growth icons: removal listed in the handoff README.
    expect(queryByText('Default growth icons')).toBeNull();
    // App lock: pulled until biometrics actually gate the app.
    expect(queryByText('App lock')).toBeNull();
  });

  it('keeps the sort picker collapsed until the row is tapped', async () => {
    const { getByText, queryByText } = await renderSettings();

    await waitFor(() => expect(getByText('Sort order')).toBeTruthy());
    // Direction options only exist once the tray is open.
    expect(queryByText('A → Z')).toBeNull();
  });
});
