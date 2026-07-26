/**
 * Current streak-badge token contracts.
 *
 * The former StreakIndicator was removed; streak UI now lives in HabitCard's
 * StreakBadge and consumes milestone/theme tokens directly.
 */

import fs from 'fs';
import path from 'path';
import { colors, milestoneColors } from '@/theme/colors';
import { streakStyles } from '@/components/HabitCard/HabitCard.streakStyles';

const source = fs.readFileSync(
  path.resolve(
    __dirname,
    '../../../src/components/HabitCard/components/StreakBadge.tsx'
  ),
  'utf8'
);

describe('HabitCard StreakBadge token contracts', () => {
  describe('milestone tiers remain stable', () => {
    it('uses amber for the primary achievement accent', () => {
      expect(milestoneColors.amber).toBe('#F59E0B');
    });

    it('uses yellow for the alternate achievement tier', () => {
      expect(milestoneColors.yellow).toBe('#EAB308');
    });

    it('uses violet for special achievements', () => {
      expect(milestoneColors.violet).toBe('#8B5CF6');
    });
  });

  describe('StreakBadge consumes centralized tokens', () => {
    it('imports milestoneColors', () => {
      expect(source).toContain("import { milestoneColors }");
    });

    it('uses amberLight for the light-mode badge background', () => {
      expect(source).toContain('milestoneColors.amberLight');
    });

    it('uses amberBorder for the record badge border', () => {
      expect(source).toContain('milestoneColors.amberBorder');
    });

    it('uses amberText for record badge text', () => {
      expect(source).toContain('milestoneColors.amberText');
    });

    it('uses theme-aware secondary text for zero streaks', () => {
      expect(source).toContain('themeColors.text.secondary');
    });

    it('uses the centralized streak style sheet', () => {
      expect(source).toContain("from '../HabitCard.streakStyles'");
    });

    it('uses the burnished-gold streak token for the ripple', () => {
      expect(streakStyles.rippleOverlay.backgroundColor).toBe(colors.streak[500]);
    });
  });
});
