import { useUser } from '@clerk/clerk-expo';
import { act, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { identifyUser, logoutPurchases } from '../../lib/purchases';
import { scheduleWhenIdle } from '../../lib/timing/scheduleWhenIdle';
import { PurchasesProvider } from './Purchases.provider';

jest.mock('@clerk/clerk-expo', () => ({
  useUser: jest.fn(),
}));

jest.mock('../../lib/purchases', () => ({
  identifyUser: jest.fn(() => Promise.resolve()),
  logoutPurchases: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../lib/timing/scheduleWhenIdle', () => ({
  scheduleWhenIdle: jest.fn(),
}));

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockIdentifyUser = identifyUser as jest.MockedFunction<
  typeof identifyUser
>;
const mockLogoutPurchases = logoutPurchases as jest.MockedFunction<
  typeof logoutPurchases
>;
const mockScheduleWhenIdle = scheduleWhenIdle as jest.MockedFunction<
  typeof scheduleWhenIdle
>;

describe('PurchasesProvider', () => {
  let scheduledTask: (() => void) | undefined;
  let cancelScheduledTask: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    scheduledTask = undefined;
    cancelScheduledTask = jest.fn();
    mockScheduleWhenIdle.mockImplementation((task) => {
      scheduledTask = task;
      return cancelScheduledTask;
    });
  });

  it('defers identification for the current signed-in Clerk user', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { id: 'user_a' },
    } as ReturnType<typeof useUser>);

    renderProvider();

    expect(mockScheduleWhenIdle).toHaveBeenCalledTimes(1);
    expect(mockIdentifyUser).not.toHaveBeenCalled();

    act(() => scheduledTask?.());
    expect(mockIdentifyUser).toHaveBeenCalledWith('user_a');
  });

  it('cancels the pending identity task when the Clerk user changes', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { id: 'user_a' },
    } as ReturnType<typeof useUser>);
    const view = renderProvider();

    mockUseUser.mockReturnValue({
      isSignedIn: true,
      user: { id: 'user_b' },
    } as ReturnType<typeof useUser>);
    view.rerender(
      <PurchasesProvider>
        <Text>child</Text>
      </PurchasesProvider>
    );

    expect(cancelScheduledTask).toHaveBeenCalledTimes(1);
    act(() => scheduledTask?.());
    expect(mockIdentifyUser).toHaveBeenCalledWith('user_b');
  });

  it('logs out immediately when Clerk is signed out', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: false,
      user: null,
    } as ReturnType<typeof useUser>);

    renderProvider();

    expect(mockLogoutPurchases).toHaveBeenCalledTimes(1);
    expect(mockScheduleWhenIdle).not.toHaveBeenCalled();
  });

  it('waits while Clerk authentication is unresolved', () => {
    mockUseUser.mockReturnValue({
      isSignedIn: undefined,
      user: undefined,
    } as ReturnType<typeof useUser>);

    renderProvider();

    expect(mockIdentifyUser).not.toHaveBeenCalled();
    expect(mockLogoutPurchases).not.toHaveBeenCalled();
    expect(mockScheduleWhenIdle).not.toHaveBeenCalled();
  });
});

function renderProvider() {
  return render(
    <PurchasesProvider>
      <Text>child</Text>
    </PurchasesProvider>
  );
}
