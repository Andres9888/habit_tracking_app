/**
 * Tests for Celebration Tiers System
 */

import {
  getCelebrationConfig,
  getCelebrationTier,
  getParticleCount,
  isMilestone,
  shouldShowModal,
  shouldShowToast,
} from '../celebrationTiers';

describe('celebrationTiers', () => {
  describe('isMilestone', () => {
    it('returns true for defined milestones', () => {
      expect(isMilestone(3)).toBe(true);
      expect(isMilestone(7)).toBe(true);
      expect(isMilestone(30)).toBe(true);
      expect(isMilestone(100)).toBe(true);
      expect(isMilestone(365)).toBe(true);
    });

    it('returns false for non-milestone days', () => {
      expect(isMilestone(1)).toBe(false);
      expect(isMilestone(5)).toBe(false);
      expect(isMilestone(15)).toBe(false);
      expect(isMilestone(50)).toBe(false);
    });
  });

  describe('getCelebrationTier', () => {
    it('returns "small" for early milestones (3, 7, 14)', () => {
      expect(getCelebrationTier(3)).toBe('small');
      expect(getCelebrationTier(7)).toBe('small');
      expect(getCelebrationTier(14)).toBe('small');
    });

    it('returns "medium" for mid-range milestones (21, 30, 60)', () => {
      expect(getCelebrationTier(21)).toBe('medium');
      expect(getCelebrationTier(30)).toBe('medium');
      expect(getCelebrationTier(60)).toBe('medium');
    });

    it('returns "large" for major milestones (90, 100, 365)', () => {
      expect(getCelebrationTier(90)).toBe('large');
      expect(getCelebrationTier(100)).toBe('large');
      expect(getCelebrationTier(365)).toBe('large');
    });

    it('returns "small" for non-milestone days', () => {
      expect(getCelebrationTier(1)).toBe('small');
      expect(getCelebrationTier(50)).toBe('small');
    });
  });

  describe('getParticleCount', () => {
    it('returns 8 particles for small tier', () => {
      expect(getParticleCount(3)).toBe(8);
      expect(getParticleCount(7)).toBe(8);
      expect(getParticleCount(14)).toBe(8);
    });

    it('returns 16 particles for medium tier', () => {
      expect(getParticleCount(21)).toBe(16);
      expect(getParticleCount(30)).toBe(16);
      expect(getParticleCount(60)).toBe(16);
    });

    it('returns 24 particles for large tier', () => {
      expect(getParticleCount(90)).toBe(24);
      expect(getParticleCount(100)).toBe(24);
      expect(getParticleCount(365)).toBe(24);
    });
  });

  describe('shouldShowToast', () => {
    it('returns false for small tier milestones', () => {
      expect(shouldShowToast(3)).toBe(false);
      expect(shouldShowToast(7)).toBe(false);
      expect(shouldShowToast(14)).toBe(false);
    });

    it('returns true for medium and large tier milestones', () => {
      expect(shouldShowToast(21)).toBe(true);
      expect(shouldShowToast(30)).toBe(true);
      expect(shouldShowToast(100)).toBe(true);
      expect(shouldShowToast(365)).toBe(true);
    });
  });

  describe('shouldShowModal', () => {
    it('returns false for small and medium tier milestones', () => {
      expect(shouldShowModal(3)).toBe(false);
      expect(shouldShowModal(7)).toBe(false);
      expect(shouldShowModal(30)).toBe(false);
    });

    it('returns true for large tier milestones', () => {
      expect(shouldShowModal(90)).toBe(true);
      expect(shouldShowModal(100)).toBe(true);
      expect(shouldShowModal(365)).toBe(true);
    });
  });

  describe('getCelebrationConfig', () => {
    it('returns complete config for small tier', () => {
      const config = getCelebrationConfig(7);
      expect(config).toEqual({
        tier: 'small',
        particleCount: 8,
        duration: 800,
        hapticType: 'light',
        showToast: false,
        showModal: false,
        soundEffect: 'small',
      });
    });

    it('returns complete config for medium tier', () => {
      const config = getCelebrationConfig(30);
      expect(config).toEqual({
        tier: 'medium',
        particleCount: 16,
        duration: 1200,
        hapticType: 'medium',
        showToast: true,
        showModal: false,
        soundEffect: 'medium',
      });
    });

    it('returns complete config for large tier', () => {
      const config = getCelebrationConfig(100);
      expect(config).toEqual({
        tier: 'large',
        particleCount: 24,
        duration: 2000,
        hapticType: 'heavy',
        showToast: true,
        showModal: true,
        soundEffect: 'large',
      });
    });
  });

  describe('celebration proportionality', () => {
    it('ensures 100-day celebration is more intense than 7-day', () => {
      const day7 = getCelebrationConfig(7);
      const day100 = getCelebrationConfig(100);

      expect(day100.particleCount).toBeGreaterThan(day7.particleCount);
      expect(day100.duration).toBeGreaterThan(day7.duration);
      expect(day100.showToast).toBe(true);
      expect(day100.showModal).toBe(true);
      expect(day7.showToast).toBe(false);
      expect(day7.showModal).toBe(false);
    });

    it('ensures 365-day is the most intense celebration', () => {
      const day365 = getCelebrationConfig(365);

      expect(day365.tier).toBe('large');
      expect(day365.particleCount).toBe(24);
      expect(day365.duration).toBe(2000);
      expect(day365.hapticType).toBe('heavy');
      expect(day365.showToast).toBe(true);
      expect(day365.showModal).toBe(true);
    });
  });
});
