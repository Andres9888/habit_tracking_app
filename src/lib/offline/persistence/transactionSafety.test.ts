/**
 * Transaction Safety Tests
 *
 * Tests for checksum calculation, envelope creation, and recovery functions.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  calculateChecksum,
  createEnvelope,
  getBackupKey,
  getPendingKey,
  isValidEnvelope,
  recoverFromPending,
  TRANSACTION_KEYS,
  verifyChecksum,
} from './transactionSafety';

jest.mock('@react-native-async-storage/async-storage');

describe('transactionSafety', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TRANSACTION_KEYS', () => {
    it('has correct key suffixes', () => {
      expect(TRANSACTION_KEYS.PENDING).toBe('_pending');
      expect(TRANSACTION_KEYS.BACKUP).toBe('_backup');
    });
  });

  describe('calculateChecksum', () => {
    it('returns a checksum string prefixed with cs_', () => {
      const result = calculateChecksum('test data');
      expect(result).toMatch(/^cs_[a-z0-9]+$/);
    });

    it('returns consistent checksum for same input', () => {
      const data = 'hello world';
      const checksum1 = calculateChecksum(data);
      const checksum2 = calculateChecksum(data);
      expect(checksum1).toBe(checksum2);
    });

    it('returns different checksums for different inputs', () => {
      const checksum1 = calculateChecksum('data1');
      const checksum2 = calculateChecksum('data2');
      expect(checksum1).not.toBe(checksum2);
    });

    it('handles empty string', () => {
      const result = calculateChecksum('');
      expect(result).toMatch(/^cs_[a-z0-9]+$/);
    });

    it('handles unicode characters', () => {
      const result = calculateChecksum('Hello 世界 🌍');
      expect(result).toMatch(/^cs_[a-z0-9]+$/);
    });

    it('handles large strings', () => {
      const largeString = 'x'.repeat(100000);
      const result = calculateChecksum(largeString);
      expect(result).toMatch(/^cs_[a-z0-9]+$/);
    });
  });

  describe('verifyChecksum', () => {
    it('returns true for matching checksum', () => {
      const data = 'test data';
      const checksum = calculateChecksum(data);
      expect(verifyChecksum(data, checksum)).toBe(true);
    });

    it('returns false for non-matching checksum', () => {
      expect(verifyChecksum('test data', 'cs_wrong')).toBe(false);
    });

    it('returns false for modified data', () => {
      const originalData = 'original data';
      const checksum = calculateChecksum(originalData);
      expect(verifyChecksum('modified data', checksum)).toBe(false);
    });
  });

  describe('createEnvelope', () => {
    it('wraps data with metadata', () => {
      const data = { test: 'value' };
      const envelope = createEnvelope(data);

      expect(envelope.data).toEqual(data);
      expect(envelope.envelopeVersion).toBe(1);
      expect(typeof envelope.checksum).toBe('string');
      expect(typeof envelope.timestamp).toBe('number');
    });

    it('calculates correct checksum for data', () => {
      const data = { test: 'value' };
      const envelope = createEnvelope(data);

      const expectedChecksum = calculateChecksum(JSON.stringify(data));
      expect(envelope.checksum).toBe(expectedChecksum);
    });

    it('sets timestamp to current time', () => {
      const before = Date.now();
      const envelope = createEnvelope({ test: 'data' });
      const after = Date.now();

      expect(envelope.timestamp).toBeGreaterThanOrEqual(before);
      expect(envelope.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('getPendingKey', () => {
    it('appends _pending suffix', () => {
      expect(getPendingKey('@mykey')).toBe('@mykey_pending');
    });
  });

  describe('getBackupKey', () => {
    it('appends _backup suffix', () => {
      expect(getBackupKey('@mykey')).toBe('@mykey_backup');
    });
  });

  describe('isValidEnvelope', () => {
    it('returns true for valid envelope', () => {
      const envelope = {
        data: { test: 'value' },
        checksum: 'cs_12345',
        timestamp: Date.now(),
        envelopeVersion: 1,
      };
      expect(isValidEnvelope(envelope)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isValidEnvelope(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidEnvelope(undefined)).toBe(false);
    });

    it('returns false for primitive', () => {
      expect(isValidEnvelope('string')).toBe(false);
      expect(isValidEnvelope(123)).toBe(false);
    });

    it('returns false for wrong envelopeVersion', () => {
      const envelope = {
        data: {},
        checksum: 'cs_12345',
        timestamp: Date.now(),
        envelopeVersion: 2,
      };
      expect(isValidEnvelope(envelope)).toBe(false);
    });

    it('returns false for missing checksum', () => {
      const envelope = {
        data: {},
        timestamp: Date.now(),
        envelopeVersion: 1,
      };
      expect(isValidEnvelope(envelope)).toBe(false);
    });

    it('returns false for missing timestamp', () => {
      const envelope = {
        data: {},
        checksum: 'cs_12345',
        envelopeVersion: 1,
      };
      expect(isValidEnvelope(envelope)).toBe(false);
    });

    it('returns false for missing data', () => {
      const envelope = {
        checksum: 'cs_12345',
        timestamp: Date.now(),
        envelopeVersion: 1,
      };
      expect(isValidEnvelope(envelope)).toBe(false);
    });
  });

  describe('recoverFromPending', () => {
    it('returns null when no pending key exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await recoverFromPending('@mykey');

      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@mykey_pending');
    });

    it('recovers valid pending data', async () => {
      const data = { test: 'recovered value' };
      const envelope = createEnvelope(data);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(envelope)
      );

      const result = await recoverFromPending<typeof data>('@mykey');

      expect(result).toEqual(data);
    });

    it('returns null and cleans up invalid envelope', async () => {
      const invalidEnvelope = { invalid: 'data' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(invalidEnvelope)
      );

      const result = await recoverFromPending('@mykey');

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@mykey_pending');
    });

    it('returns null and cleans up corrupted checksum', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const envelope = {
        data: { test: 'value' },
        checksum: 'cs_wrong',
        timestamp: Date.now(),
        envelopeVersion: 1,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(envelope)
      );

      const result = await recoverFromPending('@mykey');

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@mykey_pending');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[transactionSafety] Corrupted pending write detected'
      );

      consoleWarnSpy.mockRestore();
    });

    it('returns null on parse error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('not json');

      const result = await recoverFromPending('@mykey');

      expect(result).toBeNull();
    });

    it('returns null on AsyncStorage error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const result = await recoverFromPending('@mykey');

      expect(result).toBeNull();
    });
  });
});
