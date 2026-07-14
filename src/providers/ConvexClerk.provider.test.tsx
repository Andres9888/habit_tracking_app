import { render, waitFor, act } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ConvexClerkProvider } from './ConvexClerk.provider';
import { useConvexAuthReady } from './ConvexAuthReady.context';
import { convexClient } from '../lib/appConfig';
import { setBackgroundSyncTokenProvider } from '../lib/offline/backgroundSync';

const mockUseAuth = jest.fn();

jest.mock('@clerk/expo', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('convex/react', () => ({
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../lib/appConfig', () => ({
  convexClient: {
    clearAuth: jest.fn(),
    setAuth: jest.fn(),
  },
}));

jest.mock('../lib/offline/backgroundSync', () => ({
  setBackgroundSyncTokenProvider: jest.fn(),
}));

const mockConvexClient = jest.mocked(convexClient);
const mockSetBackgroundSyncTokenProvider = jest.mocked(
  setBackgroundSyncTokenProvider
);

function ReadyState() {
  const isReady = useConvexAuthReady();
  return <Text testID='ready'>{String(isReady)}</Text>;
}

function renderProvider() {
  return render(
    <ConvexClerkProvider>
      <ReadyState />
    </ConvexClerkProvider>
  );
}

const providerElement = (
  <ConvexClerkProvider>
    <ReadyState />
  </ConvexClerkProvider>
);

describe('ConvexClerkProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      getToken: jest.fn(async () => 'convex-token'),
      isSignedIn: true,
    });
  });

  it('fetches Clerk tokens with the Convex template for Convex and background sync', async () => {
    const getToken = jest.fn(async () => 'convex-token');
    mockUseAuth.mockReturnValue({ getToken, isSignedIn: true });

    renderProvider();

    await waitFor(() => expect(mockConvexClient?.setAuth).toHaveBeenCalled());

    const tokenProvider = jest.mocked(mockConvexClient?.setAuth).mock
      .calls[0][0];
    await expect(tokenProvider()).resolves.toBe('convex-token');

    expect(getToken).toHaveBeenCalledWith({ template: 'convex' });
    expect(mockSetBackgroundSyncTokenProvider).toHaveBeenCalledWith(
      tokenProvider
    );
  });

  it('exposes readiness only after the Convex setAuth callback authenticates', async () => {
    const { getByTestId } = renderProvider();

    await waitFor(() => expect(mockConvexClient?.setAuth).toHaveBeenCalled());

    const onAuthChange = jest.mocked(mockConvexClient?.setAuth).mock
      .calls.at(-1)?.[1];

    expect(getByTestId('ready').props.children).toBe('false');

    act(() => {
      onAuthChange?.(true);
    });

    await waitFor(() =>
      expect(getByTestId('ready').props.children).toBe('true')
    );

    act(() => {
      onAuthChange?.(false);
    });

    await waitFor(() =>
      expect(getByTestId('ready').props.children).toBe('false')
    );
  });

  it('ignores stale setAuth readiness callbacks after cleanup', async () => {
    const { getByTestId, rerender } = renderProvider();

    await waitFor(() => expect(mockConvexClient?.setAuth).toHaveBeenCalled());

    const onAuthChange = jest.mocked(mockConvexClient?.setAuth).mock
      .calls[0][1];

    act(() => {
      onAuthChange(true);
    });

    await waitFor(() =>
      expect(getByTestId('ready').props.children).toBe('true')
    );

    mockUseAuth.mockReturnValue({
      getToken: jest.fn(),
      isSignedIn: false,
    });

    rerender(providerElement);

    await waitFor(() =>
      expect(getByTestId('ready').props.children).toBe('false')
    );

    act(() => {
      onAuthChange(true);
    });

    expect(getByTestId('ready').props.children).toBe('false');
  });

  it('clears Convex auth and background token provider when signed out', async () => {
    mockUseAuth.mockReturnValue({
      getToken: jest.fn(),
      isSignedIn: false,
    });

    const { getByTestId } = renderProvider();

    await waitFor(() => expect(mockConvexClient?.clearAuth).toHaveBeenCalled());

    expect(mockConvexClient?.setAuth).not.toHaveBeenCalled();
    expect(mockSetBackgroundSyncTokenProvider).toHaveBeenCalledWith(null);
    expect(getByTestId('ready').props.children).toBe('false');
  });

  it('clears the background token provider on signed-in cleanup', async () => {
    const { unmount } = renderProvider();

    await waitFor(() =>
      expect(mockSetBackgroundSyncTokenProvider).toHaveBeenCalledWith(
        expect.any(Function)
      )
    );

    unmount();

    expect(mockSetBackgroundSyncTokenProvider).toHaveBeenLastCalledWith(null);
  });
});
