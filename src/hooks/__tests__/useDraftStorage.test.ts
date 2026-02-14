/**
 * useDraftStorage Tests
 * Edge Case Handling: Auto-save drafts for long-form content (Why, Letters, Reflections)
 *
 * Tests:
 * - Draft key generation
 * - Draft storage and retrieval
 * - Draft clearing
 * - Debounced auto-save
 * - Draft recovery on mount
 * - Stale draft cleanup
 * - Error handling
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useDraftStorage,
  getDraftKey,
  getDraft,
  saveDraft,
  clearDraft,
  clearAllDraftsForHabit,
  getAllDraftKeys,
  type DraftContentType,
} from '../useDraftStorage';

jest.mock('@react-native-async-storage/async-storage');

describe('useDraftStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getDraftKey', () => {
    it('generates correct key format for why', () => {
      const key = getDraftKey('habit-123', 'why');
      expect(key).toBe('draft:habit-123:why');
    });

    it('generates correct key format for letter-content', () => {
      const key = getDraftKey('habit-456', 'letter-content');
      expect(key).toBe('draft:habit-456:letter-content');
    });

    it('generates correct key format for reflection-note', () => {
      const key = getDraftKey('habit-789', 'reflection-note');
      expect(key).toBe('draft:habit-789:reflection-note');
    });

    it('handles all content types', () => {
      const contentTypes: DraftContentType[] = [
        'why',
        'identity',
        'letter-title',
        'letter-content',
        'reflection-note',
        'affirmation',
        'woop-wish',
        'woop-outcome',
        'woop-obstacle',
        'woop-plan',
        'viz-success-body',
        'viz-success-mind',
        'viz-success-emotion',
        'viz-failure-body',
        'viz-failure-mind',
        'viz-failure-emotion',
      ];

      contentTypes.forEach((type) => {
        const key = getDraftKey('habit-test', type);
        expect(key).toBe(`draft:habit-test:${type}`);
      });
    });
  });

  describe('getDraft', () => {
    it('returns null when no draft exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getDraft('habit-123', 'why');

      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('draft:habit-123:why');
    });

    it('returns stored draft content', async () => {
      const storedDraft = {
        content: 'My motivation',
        timestamp: Date.now(),
        version: 1,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(storedDraft)
      );

      const result = await getDraft('habit-123', 'why');

      expect(result).toBe('My motivation');
    });

    it('returns null and cleans up stale drafts', async () => {
      const staleDraft = {
        content: 'Old motivation',
        timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
        version: 1,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(staleDraft)
      );

      const result = await getDraft('habit-123', 'why');

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'draft:habit-123:why'
      );
    });

    it('respects custom maxAgeMs', async () => {
      const recentDraft = {
        content: 'My motivation',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        version: 1,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(recentDraft)
      );

      // With 1 day max age, should be stale
      const result = await getDraft(
        'habit-123',
        'why',
        1 * 24 * 60 * 60 * 1000
      );

      expect(result).toBeNull();
    });

    it('handles invalid JSON gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const result = await getDraft('habit-123', 'why');

      expect(result).toBeNull();
    });

    it('returns null and removes malformed draft payloads', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          content: 123,
          timestamp: 'yesterday',
          version: 1,
        })
      );

      const result = await getDraft('habit-123', 'why');

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'draft:habit-123:why'
      );
    });

    it('returns null and removes unsupported draft versions', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          content: 'Old schema',
          timestamp: Date.now(),
          version: 2,
        })
      );

      const result = await getDraft('habit-123', 'why');

      expect(result).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'draft:habit-123:why'
      );
    });

    it('handles AsyncStorage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const result = await getDraft('habit-123', 'why');

      expect(result).toBeNull();
    });
  });

  describe('saveDraft', () => {
    it('saves draft to AsyncStorage', async () => {
      await saveDraft('habit-123', 'why', 'My motivation');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'draft:habit-123:why',
        expect.stringContaining('"content":"My motivation"')
      );
    });

    it('includes timestamp in saved draft', async () => {
      const before = Date.now();
      await saveDraft('habit-123', 'why', 'My motivation');
      const after = Date.now();

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );

      expect(savedData.timestamp).toBeGreaterThanOrEqual(before);
      expect(savedData.timestamp).toBeLessThanOrEqual(after);
    });

    it('includes version in saved draft', async () => {
      await saveDraft('habit-123', 'why', 'My motivation');

      const savedData = JSON.parse(
        (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );

      expect(savedData.version).toBe(1);
    });

    it('removes draft when content is empty', async () => {
      await saveDraft('habit-123', 'why', '');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'draft:habit-123:why'
      );
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('removes draft when content is whitespace only', async () => {
      await saveDraft('habit-123', 'why', '   ');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'draft:habit-123:why'
      );
    });

    it('throws on AsyncStorage error', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      await expect(
        saveDraft('habit-123', 'why', 'My motivation')
      ).rejects.toThrow('Storage error');
    });
  });

  describe('clearDraft', () => {
    it('removes draft from AsyncStorage', async () => {
      await clearDraft('habit-123', 'why');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'draft:habit-123:why'
      );
    });

    it('handles AsyncStorage errors gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Should not throw
      await expect(clearDraft('habit-123', 'why')).resolves.not.toThrow();
    });
  });

  describe('clearAllDraftsForHabit', () => {
    it('removes all drafts for a habit', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        'draft:habit-123:why',
        'draft:habit-123:letter-content',
        'draft:habit-456:why',
        'other-key',
      ]);

      await clearAllDraftsForHabit('habit-123');

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        'draft:habit-123:why',
        'draft:habit-123:letter-content',
      ]);
    });

    it('handles no matching drafts', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(['other-key']);

      await clearAllDraftsForHabit('habit-123');

      expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
    });

    it('handles AsyncStorage errors gracefully', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      await expect(clearAllDraftsForHabit('habit-123')).resolves.not.toThrow();
    });
  });

  describe('getAllDraftKeys', () => {
    it('returns only draft keys', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        'draft:habit-123:why',
        'draft:habit-456:letter-content',
        'other-key',
        '@habit_app:settings',
      ]);

      const result = await getAllDraftKeys();

      expect(result).toEqual([
        'draft:habit-123:why',
        'draft:habit-456:letter-content',
      ]);
    });

    it('returns empty array on error', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const result = await getAllDraftKeys();

      expect(result).toEqual([]);
    });
  });

  describe('useDraftStorage hook', () => {
    const habitId = 'habit-123';
    const contentType: DraftContentType = 'why';

    describe('initialization', () => {
      it('starts with empty draft when no stored draft exists', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('');
          expect(result.current.hasDraft).toBe(false);
          expect(result.current.wasRecovered).toBe(false);
        });
      });

      it('recovers stored draft on mount', async () => {
        const storedDraft = {
          content: 'My recovered motivation',
          timestamp: Date.now(),
          version: 1,
        };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
          JSON.stringify(storedDraft)
        );

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('My recovered motivation');
          expect(result.current.hasDraft).toBe(true);
          expect(result.current.wasRecovered).toBe(true);
        });
      });

      it('calls onDraftRecovered callback when draft is recovered', async () => {
        const storedDraft = {
          content: 'My recovered motivation',
          timestamp: Date.now(),
          version: 1,
        };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
          JSON.stringify(storedDraft)
        );

        const onDraftRecovered = jest.fn();

        renderHook(() =>
          useDraftStorage({ habitId, contentType, onDraftRecovered })
        );

        await waitFor(() => {
          expect(onDraftRecovered).toHaveBeenCalledWith(
            'My recovered motivation'
          );
        });
      });
    });

    describe('setDraft with debouncing', () => {
      it('updates draft state immediately', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('');
        });

        act(() => {
          result.current.setDraft('New content');
        });

        expect(result.current.draft).toBe('New content');
      });

      it('debounces AsyncStorage save', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType, debounceMs: 500 })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('');
        });

        act(() => {
          result.current.setDraft('Content 1');
        });

        // Should not have saved yet
        expect(AsyncStorage.setItem).not.toHaveBeenCalled();

        act(() => {
          result.current.setDraft('Content 2');
        });

        // Still no save
        expect(AsyncStorage.setItem).not.toHaveBeenCalled();

        // Advance past debounce
        act(() => {
          jest.advanceTimersByTime(600);
        });

        await waitFor(() => {
          expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
          expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            'draft:habit-123:why',
            expect.stringContaining('"content":"Content 2"')
          );
        });
      });

      it('clears wasRecovered flag after user edits', async () => {
        const storedDraft = {
          content: 'Recovered content',
          timestamp: Date.now(),
          version: 1,
        };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
          JSON.stringify(storedDraft)
        );

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType })
        );

        await waitFor(() => {
          expect(result.current.wasRecovered).toBe(true);
        });

        act(() => {
          result.current.setDraft('Edited content');
        });

        expect(result.current.wasRecovered).toBe(false);
      });
    });

    describe('saveNow', () => {
      it('saves immediately without debounce', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType, debounceMs: 5000 })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('');
        });

        act(() => {
          result.current.setDraft('Immediate save');
        });

        expect(AsyncStorage.setItem).not.toHaveBeenCalled();

        await act(async () => {
          await result.current.saveNow();
        });

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'draft:habit-123:why',
          expect.stringContaining('"content":"Immediate save"')
        );
      });

      it('cancels pending debounced save', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType, debounceMs: 1000 })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('');
        });

        act(() => {
          result.current.setDraft('Some content');
        });

        // Advance partway through debounce
        act(() => {
          jest.advanceTimersByTime(500);
        });

        // Force save
        await act(async () => {
          await result.current.saveNow();
        });

        // Save count should be 1 from saveNow
        expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);

        // Advance past what would have been debounce timeout
        act(() => {
          jest.advanceTimersByTime(600);
        });

        // Should still be only 1 save (debounced one was cancelled)
        expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      });
    });

    describe('clearDraft', () => {
      it('clears draft from state and storage', async () => {
        const storedDraft = {
          content: 'Draft to clear',
          timestamp: Date.now(),
          version: 1,
        };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
          JSON.stringify(storedDraft)
        );

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('Draft to clear');
        });

        await act(async () => {
          await result.current.clearDraft();
        });

        expect(result.current.draft).toBe('');
        expect(result.current.hasDraft).toBe(false);
        expect(result.current.wasRecovered).toBe(false);
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
          'draft:habit-123:why'
        );
      });

      it('cancels pending debounced save', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType, debounceMs: 1000 })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('');
        });

        act(() => {
          result.current.setDraft('Content to be cleared');
        });

        await act(async () => {
          await result.current.clearDraft();
        });

        // Advance past debounce
        act(() => {
          jest.advanceTimersByTime(1100);
        });

        // setItem should not have been called for the cleared content
        expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      });
    });

    describe('discardRecoveredDraft', () => {
      it('discards recovered draft', async () => {
        const storedDraft = {
          content: 'Recovered draft',
          timestamp: Date.now(),
          version: 1,
        };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
          JSON.stringify(storedDraft)
        );

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType })
        );

        await waitFor(() => {
          expect(result.current.wasRecovered).toBe(true);
        });

        await act(async () => {
          await result.current.discardRecoveredDraft();
        });

        expect(result.current.draft).toBe('');
        expect(result.current.wasRecovered).toBe(false);
        expect(AsyncStorage.removeItem).toHaveBeenCalled();
      });
    });

    describe('enabled option', () => {
      it('does not recover or save when disabled', async () => {
        const storedDraft = {
          content: 'Should not recover',
          timestamp: Date.now(),
          version: 1,
        };
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
          JSON.stringify(storedDraft)
        );

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType, enabled: false })
        );

        // Wait for initialization
        await act(async () => {
          jest.advanceTimersByTime(100);
        });

        // Should not have recovered
        expect(result.current.draft).toBe('');

        // Setting draft should not trigger save
        act(() => {
          result.current.setDraft('New content');
        });

        act(() => {
          jest.advanceTimersByTime(2000);
        });

        expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      });
    });

    describe('isSaving state', () => {
      it('starts false', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType })
        );

        await waitFor(() => {
          expect(result.current.isSaving).toBe(false);
        });
      });

      it('is false after explicit saveNow completes', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('');
        });

        act(() => {
          result.current.setDraft('Content');
        });

        // Use saveNow for explicit save (tests isSaving lifecycle)
        await act(async () => {
          await result.current.saveNow();
        });

        expect(result.current.isSaving).toBe(false);
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });
    });

    describe('error handling', () => {
      it('calls onSaveError when save fails via saveNow', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
          new Error('Save failed')
        );

        const onSaveError = jest.fn();

        const { result } = renderHook(() =>
          useDraftStorage({ habitId, contentType, onSaveError })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('');
        });

        act(() => {
          result.current.setDraft('Content');
        });

        // Use saveNow for explicit save - errors should be caught and reported
        await act(async () => {
          await result.current.saveNow();
        });

        expect(onSaveError).toHaveBeenCalledWith(expect.any(Error));
        expect(onSaveError.mock.calls[0][0].message).toBe('Save failed');
      });
    });

    describe('cleanup on unmount', () => {
      it('cancels debounce timer on unmount', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { result, unmount } = renderHook(() =>
          useDraftStorage({ habitId, contentType, debounceMs: 1000 })
        );

        await waitFor(() => {
          expect(result.current.draft).toBe('');
        });

        act(() => {
          result.current.setDraft('Content');
        });

        // Unmount before debounce completes
        unmount();

        // Advance timers
        act(() => {
          jest.advanceTimersByTime(2000);
        });

        // Save should not have been called
        expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      });
    });
  });
});
