/**
 * Tests for purchases.ts __DEV__ guards
 *
 * Verifies that console.log/warn calls are gated behind __DEV__
 * and that console.error calls always fire (legitimate error signals).
 */

import { Platform } from 'react-native';

// Shared mock functions (re-wired after each resetModules via jest.doMock)
let mockConfigure: jest.Mock;
let mockGetAppUserID: jest.Mock;
let mockLogIn: jest.Mock;
let mockLogOut: jest.Mock;
let mockSetLogLevel: jest.Mock;

function setupMocks() {
  mockConfigure = jest.fn().mockResolvedValue(undefined);
  mockGetAppUserID = jest.fn().mockResolvedValue('mock-user-id');
  mockLogIn = jest.fn().mockResolvedValue(undefined);
  mockLogOut = jest.fn().mockResolvedValue(undefined);
  mockSetLogLevel = jest.fn();

  jest.doMock('expo-constants', () => ({
    __esModule: true,
    default: { executionEnvironment: 'standalone' },
    ExecutionEnvironment: { StoreClient: 'storeClient', Standalone: 'standalone' },
  }));

  jest.doMock('react-native-purchases', () => ({
    __esModule: true,
    default: {
      configure: mockConfigure,
      getAppUserID: mockGetAppUserID,
      logIn: mockLogIn,
      logOut: mockLogOut,
      setLogLevel: mockSetLogLevel,
    },
    LOG_LEVEL: { VERBOSE: 'VERBOSE' },
  }));
}

const originalDev = global.__DEV__;
const originalIosKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;

describe('purchases.ts __DEV__ guards', () => {
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
    Platform.OS = 'ios';
    // Provide a fake API key so initializePurchases doesn't bail early
    process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY = 'appl_testkey1234';
    jest.resetModules();
    setupMocks();
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
    global.__DEV__ = originalDev;
    if (originalIosKey === undefined) {
      delete process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
    } else {
      process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY = originalIosKey;
    }
  });

  describe('when __DEV__ is false (production)', () => {
    beforeEach(() => {
      global.__DEV__ = false;
    });

    it('initializePurchases does not call console.log or console.warn', async () => {
      const { initializePurchases } = require('../purchases');
      await initializePurchases('user-123');

      expect(logSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('initializePurchases still calls console.error on failure', async () => {
      mockConfigure.mockRejectedValueOnce(new Error('SDK error'));
      const { initializePurchases } = require('../purchases');
      await initializePurchases('user-123');

      expect(errorSpy).toHaveBeenCalledWith(
        '[Purchases] Failed to initialize:',
        expect.any(Error)
      );
      expect(logSpy).not.toHaveBeenCalled();
    });

    it('identifyUser does not call console.log in production', async () => {
      const { initializePurchases, identifyUser } = require('../purchases');
      await initializePurchases('user-123');
      logSpy.mockClear();

      await identifyUser('user-456');

      expect(logSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('identifyUser still calls console.error on failure', async () => {
      const { initializePurchases, identifyUser } = require('../purchases');
      await initializePurchases('user-123');
      errorSpy.mockClear();
      mockLogIn.mockRejectedValueOnce(new Error('login error'));

      await identifyUser('user-456');

      expect(errorSpy).toHaveBeenCalledWith(
        '[Purchases] Failed to identify user:',
        expect.any(Error)
      );
    });

    it('logoutPurchases does not call console.log in production', async () => {
      const { initializePurchases, logoutPurchases } = require('../purchases');
      await initializePurchases('user-123');
      logSpy.mockClear();

      await logoutPurchases();

      expect(logSpy).not.toHaveBeenCalled();
    });

    it('logoutPurchases still calls console.error on failure', async () => {
      const { initializePurchases, logoutPurchases } = require('../purchases');
      await initializePurchases('user-123');
      errorSpy.mockClear();
      mockLogOut.mockRejectedValueOnce(new Error('logout error'));

      await logoutPurchases();

      expect(errorSpy).toHaveBeenCalledWith(
        '[Purchases] Failed to logout:',
        expect.any(Error)
      );
    });

    it('does not warn when SDK not initialized (identifyUser)', async () => {
      const { identifyUser } = require('../purchases');
      await identifyUser('user-123');

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('does not log when SDK not initialized (logoutPurchases)', async () => {
      const { logoutPurchases } = require('../purchases');
      await logoutPurchases();

      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe('when __DEV__ is true (development)', () => {
    beforeEach(() => {
      global.__DEV__ = true;
    });

    it('initializePurchases logs debug info', async () => {
      const { initializePurchases } = require('../purchases');
      await initializePurchases('user-123');

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Purchases]'),
        expect.anything()
      );
    });

    it('identifyUser logs user login', async () => {
      const { initializePurchases, identifyUser } = require('../purchases');
      await initializePurchases('user-123');
      logSpy.mockClear();

      await identifyUser('user-456');

      expect(logSpy).toHaveBeenCalledWith('[Purchases] User logged in:', 'user-456');
    });

    it('logoutPurchases logs user logout', async () => {
      const { initializePurchases, logoutPurchases } = require('../purchases');
      await initializePurchases('user-123');
      logSpy.mockClear();

      await logoutPurchases();

      expect(logSpy).toHaveBeenCalledWith('[Purchases] User logged out');
    });

    it('warns when SDK not initialized for identify', async () => {
      const { identifyUser } = require('../purchases');
      await identifyUser('user-123');

      expect(warnSpy).toHaveBeenCalledWith(
        '[Purchases] SDK not initialized, skipping identify'
      );
    });
  });
});
