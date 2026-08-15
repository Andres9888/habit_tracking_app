import { Platform } from 'react-native';

const mockClient = {
  configure: jest.fn(),
  logIn: jest.fn(),
  logOut: jest.fn(),
};
const mockPurchasesState = {
  client: mockClient,
  initialized: false,
  module: null,
};
const mockGetPurchasesClient = jest.fn(() => mockClient);
const mockGetPurchasesInitializationContext = jest.fn(() => ({
  apiKey: 'test_api_key',
  client: mockClient,
}));

jest.mock('../client', () => ({
  getPurchasesClient: mockGetPurchasesClient,
  state: mockPurchasesState,
}));

jest.mock('../getPurchasesInitializationContext', () => ({
  getPurchasesInitializationContext: mockGetPurchasesInitializationContext,
}));

describe('RevenueCat purchase identity lifecycle', () => {
  let purchases: typeof import('../init');

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    Platform.OS = 'ios';
    mockPurchasesState.initialized = false;
    mockGetPurchasesClient.mockReturnValue(mockClient);
    mockGetPurchasesInitializationContext.mockReturnValue({
      apiKey: 'test_api_key',
      client: mockClient,
    });
    mockClient.configure.mockImplementation(() => undefined);
    mockClient.logIn.mockResolvedValue({ created: false, customerInfo: {} });
    mockClient.logOut.mockResolvedValue({});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    purchases = jest.requireActual<typeof import('../init')>('../init');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('configures a signed-in launch with the Clerk user ID', async () => {
    await purchases.identifyUser('user_a');

    expect(mockClient.configure).toHaveBeenCalledWith({
      apiKey: 'test_api_key',
      appUserID: 'user_a',
    });
    expect(mockClient.logIn).not.toHaveBeenCalled();
  });

  it('logs in after an existing anonymous initialization', async () => {
    await purchases.initializePurchases();
    await purchases.identifyUser('user_a');

    expect(mockClient.configure).toHaveBeenCalledWith({
      apiKey: 'test_api_key',
      appUserID: undefined,
    });
    expect(mockClient.logIn).toHaveBeenCalledWith('user_a');
  });

  it('does not identify the same user twice', async () => {
    await purchases.identifyUser('user_a');
    await purchases.identifyUser('user_a');

    expect(mockClient.configure).toHaveBeenCalledTimes(1);
    expect(mockClient.logIn).not.toHaveBeenCalled();
  });

  it('allows initialization to retry after configure fails', async () => {
    mockClient.configure.mockImplementationOnce(() => {
      throw new Error('temporary configure failure');
    });

    await expect(purchases.initializePurchases('user_a')).resolves.toBe(false);
    await expect(purchases.initializePurchases('user_a')).resolves.toBe(true);

    expect(mockClient.configure).toHaveBeenCalledTimes(2);
    expect(mockPurchasesState.initialized).toBe(true);
  });

  it('retries identification after a login failure', async () => {
    await purchases.initializePurchases();
    mockClient.logIn.mockRejectedValueOnce(new Error('temporary login failure'));

    await purchases.identifyUser('user_a');
    await purchases.identifyUser('user_a');

    expect(mockClient.logIn).toHaveBeenCalledTimes(2);
  });

  it('serializes account changes so the latest Clerk user wins', async () => {
    await purchases.initializePurchases();
    const firstLogin = createDeferred<void>();
    mockClient.logIn
      .mockImplementationOnce(() => firstLogin.promise)
      .mockResolvedValueOnce({ created: false, customerInfo: {} });

    const identifyA = purchases.identifyUser('user_a');
    const identifyB = purchases.identifyUser('user_b');
    await flushMicrotasks();

    expect(mockClient.logIn).toHaveBeenCalledTimes(1);
    expect(mockClient.logIn).toHaveBeenLastCalledWith('user_a');

    firstLogin.resolve();
    await identifyA;
    await identifyB;

    expect(mockClient.logIn).toHaveBeenNthCalledWith(2, 'user_b');
  });

  it('runs logout after an in-flight identification completes', async () => {
    await purchases.initializePurchases();
    const login = createDeferred<void>();
    mockClient.logIn.mockImplementationOnce(() => login.promise);

    const identify = purchases.identifyUser('user_a');
    const logout = purchases.logoutPurchases();
    await flushMicrotasks();

    expect(mockClient.logOut).not.toHaveBeenCalled();
    login.resolve();
    await identify;
    await logout;

    expect(mockClient.logOut).toHaveBeenCalledTimes(1);
  });

  it('does not initialize the native SDK on web', async () => {
    Platform.OS = 'web';

    await expect(purchases.initializePurchases('user_a')).resolves.toBe(false);
    expect(mockClient.configure).not.toHaveBeenCalled();
  });
});

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}
