/**
 * Tests for usePremiumUpsell hook
 */

import { renderHook, act } from '@testing-library/react-native';
import { usePremiumUpsell } from '../usePremiumUpsell';

describe('usePremiumUpsell', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with all modals hidden', () => {
    const { result } = renderHook(() => usePremiumUpsell());

    expect(result.current.showPaywall).toBe(false);
    expect(result.current.showBenefits).toBe(false);
    expect(result.current.triggeredFeature).toBeUndefined();
  });

  describe('triggerPaywall', () => {
    it('shows paywall and sets triggered feature', () => {
      const { result } = renderHook(() => usePremiumUpsell());

      act(() => {
        result.current.triggerPaywall('voiceNotes');
      });

      expect(result.current.showPaywall).toBe(true);
      expect(result.current.triggeredFeature).toBe('voiceNotes');
    });

    it('can trigger with different features', () => {
      const { result } = renderHook(() => usePremiumUpsell());

      act(() => {
        result.current.triggerPaywall('letters');
      });

      expect(result.current.triggeredFeature).toBe('letters');

      act(() => {
        result.current.triggerPaywall('visionBoard');
      });

      expect(result.current.triggeredFeature).toBe('visionBoard');
    });
  });

  describe('dismissPaywall', () => {
    it('hides paywall', () => {
      const { result } = renderHook(() => usePremiumUpsell());

      act(() => {
        result.current.triggerPaywall('voiceNotes');
      });

      expect(result.current.showPaywall).toBe(true);

      act(() => {
        result.current.dismissPaywall();
      });

      expect(result.current.showPaywall).toBe(false);
    });

    it('clears triggered feature after delay', () => {
      const { result } = renderHook(() => usePremiumUpsell());

      act(() => {
        result.current.triggerPaywall('voiceNotes');
      });

      expect(result.current.triggeredFeature).toBe('voiceNotes');

      act(() => {
        result.current.dismissPaywall();
      });

      // Feature should still be set initially (for animation)
      expect(result.current.triggeredFeature).toBe('voiceNotes');

      // After timeout, feature should be cleared
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.triggeredFeature).toBeUndefined();
    });
  });

  describe('triggerBenefits', () => {
    it('shows benefits modal and sets triggered feature', () => {
      const { result } = renderHook(() => usePremiumUpsell());

      act(() => {
        result.current.triggerBenefits('rescueMode');
      });

      expect(result.current.showBenefits).toBe(true);
      expect(result.current.triggeredFeature).toBe('rescueMode');
    });
  });

  describe('dismissBenefits', () => {
    it('hides benefits modal', () => {
      const { result } = renderHook(() => usePremiumUpsell());

      act(() => {
        result.current.triggerBenefits('affirmations');
      });

      expect(result.current.showBenefits).toBe(true);

      act(() => {
        result.current.dismissBenefits();
      });

      expect(result.current.showBenefits).toBe(false);
    });
  });

  describe('benefitsToPaywall', () => {
    it('transitions from benefits to paywall', () => {
      const { result } = renderHook(() => usePremiumUpsell());

      act(() => {
        result.current.triggerBenefits('advancedViz');
      });

      expect(result.current.showBenefits).toBe(true);
      expect(result.current.showPaywall).toBe(false);

      act(() => {
        result.current.benefitsToPaywall();
      });

      // Benefits should be hidden immediately
      expect(result.current.showBenefits).toBe(false);

      // Paywall should show after short delay
      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.showPaywall).toBe(true);
      // Feature should be preserved
      expect(result.current.triggeredFeature).toBe('advancedViz');
    });
  });

  describe('direct setters', () => {
    it('setShowPaywall works directly', () => {
      const { result } = renderHook(() => usePremiumUpsell());

      act(() => {
        result.current.setShowPaywall(true);
      });

      expect(result.current.showPaywall).toBe(true);

      act(() => {
        result.current.setShowPaywall(false);
      });

      expect(result.current.showPaywall).toBe(false);
    });

    it('setShowBenefits works directly', () => {
      const { result } = renderHook(() => usePremiumUpsell());

      act(() => {
        result.current.setShowBenefits(true);
      });

      expect(result.current.showBenefits).toBe(true);
    });
  });

  describe('multiple triggers', () => {
    it('handles rapid triggering', () => {
      const { result } = renderHook(() => usePremiumUpsell());

      act(() => {
        result.current.triggerPaywall('voiceNotes');
        result.current.triggerPaywall('letters');
        result.current.triggerPaywall('visionBoard');
      });

      expect(result.current.showPaywall).toBe(true);
      expect(result.current.triggeredFeature).toBe('visionBoard');
    });
  });
});
