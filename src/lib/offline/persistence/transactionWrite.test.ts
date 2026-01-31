/**
 * Transaction Write Tests
 *
 * Tests for transaction-safe write, recovery, and cleanup operations.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createEnvelope,
  getPendingKey,
  getBackupKey,
} from './transactionSafety';
import {
  cleanupTransaction,
  recoverTransaction,
  transactionSafeWrite,
  verifyStorageIntegrity,
} from './transactionWrite';

jest.mock('@react-native-async-storage/async-storage');

describe('transactionWrite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('transactionSafeWrite', () => {
    it('writes to pending key first', async () => {
      const data = { test: 'value' };
      const key = '@mykey';

      await transactionSafeWrite(key, data);

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      // First call should be to pending key
      expect(calls[0][0]).toBe(getPendingKey(key));
    });

    it('writes envelope with checksum to pending key', async () => {
      const data = { test: 'value' };
      const key = '@mykey';

      await transactionSafeWrite(key, data);

      const pendingCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const envelope = JSON.parse(pendingCall[1]);

      expect(envelope.envelopeVersion).toBe(1);
      expect(envelope.checksum).toBeDefined();
      expect(envelope.data).toEqual(data);
    });

    it('writes data to main key after pending', async () => {
      const data = { test: 'value' };
      const key = '@mykey';

      await transactionSafeWrite(key, data);

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      // Second call should be to main key
      expect(calls[1][0]).toBe(key);
      expect(JSON.parse(calls[1][1])).toEqual(data);
    });

    it('removes pending key after successful write', async () => {
      const data = { test: 'value' };
      const key = '@mykey';

      await transactionSafeWrite(key, data);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(getPendingKey(key));
    });

    it('creates backup when option enabled', async () => {
      const data = { test: 'value' };
      const key = '@mykey';
      const existingData = { old: 'data' };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingData)
      );

      await transactionSafeWrite(key, data, { createBackup: true });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        getBackupKey(key),
        JSON.stringify(existingData)
      );
    });

    it('skips backup when no existing data', async () => {
      const data = { test: 'value' };
      const key = '@mykey';

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await transactionSafeWrite(key, data, { createBackup: true });

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const backupCall = calls.find(
        (c: string[]) => c[0] === getBackupKey(key)
      );
      expect(backupCall).toBeUndefined();
    });

    it('throws error when main write fails', async () => {
      const data = { test: 'value' };
      const key = '@mykey';

      (AsyncStorage.setItem as jest.Mock)
        .mockResolvedValueOnce(undefined) // pending write succeeds
        .mockRejectedValueOnce(new Error('Write failed')); // main write fails

      await expect(transactionSafeWrite(key, data)).rejects.toThrow(
        'Write failed'
      );
    });

    it('preserves pending key when main write fails (for recovery)', async () => {
      const data = { test: 'value' };
      const key = '@mykey';

      (AsyncStorage.setItem as jest.Mock)
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Write failed'));

      try {
        await transactionSafeWrite(key, data);
      } catch {
        // Expected to fail
      }

      // Pending key should NOT be removed when main write fails
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('recoverTransaction', () => {
    const validator = (data: unknown): data is { test: string } => {
      return (
        typeof data === 'object' &&
        data !== null &&
        'test' in data &&
        typeof (data as { test: unknown }).test === 'string'
      );
    };

    it('returns not recovered when no pending key', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await recoverTransaction('@mykey', validator);

      expect(result.recovered).toBe(false);
      expect(result.data).toBeNull();
    });

    it('recovers valid pending data', async () => {
      const data = { test: 'recovered' };
      const envelope = createEnvelope(data);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(envelope)
      );

      const result = await recoverTransaction('@mykey', validator);

      expect(result.recovered).toBe(true);
      expect(result.data).toEqual(data);
    });

    it('writes recovered data to main key', async () => {
      const data = { test: 'recovered' };
      const envelope = createEnvelope(data);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(envelope)
      );

      await recoverTransaction('@mykey', validator);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@mykey',
        JSON.stringify(data)
      );
    });

    it('cleans up after recovery', async () => {
      const data = { test: 'recovered' };
      const envelope = createEnvelope(data);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(envelope)
      );

      await recoverTransaction('@mykey', validator);

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@mykey_pending',
        '@mykey_backup',
      ]);
    });

    it('returns not recovered when validation fails', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const invalidData = { wrong: 'shape' };
      const envelope = createEnvelope(invalidData);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(envelope)
      );

      const result = await recoverTransaction('@mykey', validator);

      expect(result.recovered).toBe(false);
      expect(result.data).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[transactionWrite] Recovered data failed validation'
      );

      consoleWarnSpy.mockRestore();
    });

    it('cleans up when validation fails', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      const invalidData = { wrong: 'shape' };
      const envelope = createEnvelope(invalidData);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(envelope)
      );

      await recoverTransaction('@mykey', validator);

      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
    });

    it('logs success on recovery', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const data = { test: 'recovered' };
      const envelope = createEnvelope(data);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(envelope)
      );

      await recoverTransaction('@mykey', validator);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[transactionWrite] Successfully recovered pending write'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('cleanupTransaction', () => {
    it('removes pending and backup keys', async () => {
      await cleanupTransaction('@mykey');

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@mykey_pending',
        '@mykey_backup',
      ]);
    });
  });

  describe('verifyStorageIntegrity', () => {
    it('returns true when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await verifyStorageIntegrity('@mykey');

      expect(result).toBe(true);
    });

    it('returns true for valid JSON', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ valid: 'json' })
      );

      const result = await verifyStorageIntegrity('@mykey');

      expect(result).toBe(true);
    });

    it('returns false for invalid JSON', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('not valid json {');

      const result = await verifyStorageIntegrity('@mykey');

      expect(result).toBe(false);
    });

    it('returns false on storage error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Read error')
      );

      const result = await verifyStorageIntegrity('@mykey');

      expect(result).toBe(false);
    });
  });
});
