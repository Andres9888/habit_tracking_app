/**
 * MilestoneCelebration Color Token Tests (Phase 5 Task 3)
 * Verifies that hardcoded hex colors in MilestoneCelebration
 * have been replaced with theme tokens.
 *
 * Covers:
 * - New color token: colors.primary[300]
 * - CONFETTI_COLORS array → colors.primary[300-700] + milestoneColors.amber
 * - styles.glow.shadowColor → milestoneColors.amber
 * - StrengthDisplay, MilestoneBadge, MilestoneContent already use theme hooks
 */

import { colors } from '@/theme/colors';
import { milestoneColors } from '@/theme/milestone-colors';
import { CONFETTI_COLORS } from '@/components/MilestoneCelebration/constants';
import { styles } from '@/components/MilestoneCelebration/styles';

describe('MilestoneCelebration Color Token Migration - Phase 5 Task 3', () => {
  describe('New color token: primary.300', () => {
    it('colors.primary[300] should be #86EFAC (emerald-300)', () => {
      expect(colors.primary[300]).toBe('#86EFAC');
    });

    it('primary palette should have 300, 400, 500, 600, 700 shades', () => {
      expect(colors.primary[300]).toBeDefined();
      expect(colors.primary[400]).toBeDefined();
      expect(colors.primary[500]).toBeDefined();
      expect(colors.primary[600]).toBeDefined();
      expect(colors.primary[700]).toBeDefined();
    });
  });

  describe('CONFETTI_COLORS uses theme tokens', () => {
    it('should contain 6 colors', () => {
      expect(CONFETTI_COLORS).toHaveLength(6);
    });

    it('first color should be colors.primary[300] (light green)', () => {
      expect(CONFETTI_COLORS[0]).toBe(colors.primary[300]);
    });

    it('second color should be colors.primary[400]', () => {
      expect(CONFETTI_COLORS[1]).toBe(colors.primary[400]);
    });

    it('third color should be colors.primary[500] (brand green)', () => {
      expect(CONFETTI_COLORS[2]).toBe(colors.primary[500]);
    });

    it('fourth color should be colors.primary[600]', () => {
      expect(CONFETTI_COLORS[3]).toBe(colors.primary[600]);
    });

    it('fifth color should be colors.primary[700]', () => {
      expect(CONFETTI_COLORS[4]).toBe(colors.primary[700]);
    });

    it('sixth color should be milestoneColors.amber (gold)', () => {
      expect(CONFETTI_COLORS[5]).toBe(milestoneColors.amber);
    });

    it('all colors should be valid hex strings', () => {
      for (const color of CONFETTI_COLORS) {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });
  });

  describe('Glow shadow uses milestoneColors.amber', () => {
    it('glow shadowColor should be milestoneColors.amber', () => {
      expect(styles.glow.shadowColor).toBe(milestoneColors.amber);
    });

    it('glow shadowColor should be #F59E0B', () => {
      expect(styles.glow.shadowColor).toBe('#F59E0B');
    });
  });

  describe('Source files use theme imports (not hardcoded hex)', () => {
    it('constants.ts should import colors from theme', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/MilestoneCelebration/constants.ts'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain("from '../../theme/colors'");
      expect(content).toContain("from '../../theme/milestone-colors'");
      expect(content).toContain('colors.primary[300]');
      expect(content).toContain('colors.primary[500]');
      expect(content).toContain('milestoneColors.amber');
      expect(content).not.toContain("'#86EFAC'");
      expect(content).not.toContain("'#34D399'");
      expect(content).not.toContain("'#10B981'");
      expect(content).not.toContain("'#059669'");
      expect(content).not.toContain("'#047857'");
      expect(content).not.toContain("'#F59E0B'");
    });

    it('styles.ts should import milestoneColors from theme', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/MilestoneCelebration/styles.ts'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain("from '../../theme/milestone-colors'");
      expect(content).toContain('milestoneColors.amber');
      expect(content).not.toContain("'#F59E0B'");
    });

    it('StrengthDisplay.tsx should use theme hook (no hardcoded hex)', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/MilestoneCelebration/StrengthDisplay.tsx'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain('useAppTheme');
      expect(content).toContain('theme.custom.colors');
      expect(content).not.toMatch(/'#[0-9a-fA-F]{6}'/);
    });

    it('MilestoneBadge.tsx should use theme hook (no hardcoded hex)', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/MilestoneCelebration/MilestoneBadge.tsx'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain('useAppTheme');
      expect(content).toContain('theme.custom.colors');
      expect(content).not.toMatch(/'#[0-9a-fA-F]{6}'/);
    });

    it('MilestoneContent.tsx should use theme hook (no hardcoded hex)', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/MilestoneCelebration/MilestoneContent.tsx'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain('useAppTheme');
      expect(content).toContain('theme.custom.colors');
      expect(content).not.toMatch(/'#[0-9a-fA-F]{6}'/);
    });
  });
});
