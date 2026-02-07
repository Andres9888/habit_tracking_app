/**
 * ShareCardGenerator Color Token Tests (Phase 5 Task 2)
 * Verifies that hardcoded hex colors in ShareCardGenerator
 * have been replaced with theme tokens.
 *
 * Covers:
 * - container.styles.ts: #FFFFFF → colors.light.card, #e7e5e4 → colors.border, #f5f5f4 → colors.gray[100]
 * - controls.styles.ts: #10B981 → colors.primary[500], #f5f5f4 → colors.gray[100],
 *   #e7e5e4 → colors.border, #4B5563 → colors.gray[600], #FFFFFF → colors.text.inverse
 * - shareCardContent.styles.ts: #FFFFFF → colors.text.inverse (share card rendering)
 * - shareCardFooter.styles.ts: #FFFFFF → colors.text.inverse (share card rendering)
 * - UserNameToggle.tsx: #FFFFFF thumbColor → colors.text.inverse
 * - ShareCardGenerator.constants.ts: GRADIENT_PRESETS intentionally hardcoded
 */

import { colors } from '@/theme/colors';
import { containerStyles } from '@/components/ShareCardGenerator/styles/container.styles';
import { controlsStyles } from '@/components/ShareCardGenerator/styles/controls.styles';
import { shareCardContentStyles } from '@/components/ShareCardGenerator/styles/shareCardContent.styles';
import { shareCardFooterStyles } from '@/components/ShareCardGenerator/styles/shareCardFooter.styles';

describe('ShareCardGenerator Color Token Migration - Phase 5 Task 2', () => {
  describe('container.styles uses theme tokens', () => {
    it('container backgroundColor should be colors.light.card', () => {
      expect(containerStyles.container.backgroundColor).toBe(colors.light.card);
    });

    it('customizationSection borderTopColor should be colors.border', () => {
      expect(containerStyles.customizationSection.borderTopColor).toBe(
        colors.border
      );
    });

    it('header borderBottomColor should be colors.border', () => {
      expect(containerStyles.header.borderBottomColor).toBe(colors.border);
    });

    it('previewContainer backgroundColor should be colors.gray[100]', () => {
      expect(containerStyles.previewContainer.backgroundColor).toBe(
        colors.gray[100]
      );
    });
  });

  describe('controls.styles uses theme tokens', () => {
    it('gradientButtonSelected borderColor should be colors.primary[500]', () => {
      expect(controlsStyles.gradientButtonSelected.borderColor).toBe(
        colors.primary[500]
      );
    });

    it('platformButton backgroundColor should be colors.gray[100]', () => {
      expect(controlsStyles.platformButton.backgroundColor).toBe(
        colors.gray[100]
      );
    });

    it('platformButton borderColor should be colors.border', () => {
      expect(controlsStyles.platformButton.borderColor).toBe(colors.border);
    });

    it('platformButtonText color should be colors.gray[600]', () => {
      expect(controlsStyles.platformButtonText.color).toBe(colors.gray[600]);
    });

    it('platformButtonTextActive color should be colors.text.inverse', () => {
      expect(controlsStyles.platformButtonTextActive.color).toBe(
        colors.text.inverse
      );
    });
  });

  describe('shareCardContent.styles uses colors.text.inverse', () => {
    it('habitName color should be colors.text.inverse', () => {
      expect(shareCardContentStyles.habitName.color).toBe(colors.text.inverse);
    });

    it('milestoneLabel color should be colors.text.inverse', () => {
      expect(shareCardContentStyles.milestoneLabel.color).toBe(
        colors.text.inverse
      );
    });

    it('personalMessage color should be colors.text.inverse', () => {
      expect(shareCardContentStyles.personalMessage.color).toBe(
        colors.text.inverse
      );
    });

    it('progressBarFill backgroundColor should be colors.text.inverse', () => {
      expect(shareCardContentStyles.progressBarFill.backgroundColor).toBe(
        colors.text.inverse
      );
    });

    it('strengthPercentage color should be colors.text.inverse', () => {
      expect(shareCardContentStyles.strengthPercentage.color).toBe(
        colors.text.inverse
      );
    });
  });

  describe('shareCardFooter.styles uses colors.text.inverse', () => {
    it('appName color should be colors.text.inverse', () => {
      expect(shareCardFooterStyles.appName.color).toBe(colors.text.inverse);
    });

    it('scienceBadgeText color should be colors.text.inverse', () => {
      expect(shareCardFooterStyles.scienceBadgeText.color).toBe(
        colors.text.inverse
      );
    });
  });

  describe('Source files use theme imports (not hardcoded literals)', () => {
    it('container.styles.ts should not contain hardcoded hex', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/ShareCardGenerator/styles/container.styles.ts'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain("from '@/theme/colors'");
      expect(content).not.toContain("'#FFFFFF'");
      expect(content).not.toContain("'#e7e5e4'");
      expect(content).not.toContain("'#f5f5f4'");
    });

    it('controls.styles.ts should not contain hardcoded hex', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/ShareCardGenerator/styles/controls.styles.ts'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain("from '@/theme/colors'");
      expect(content).not.toContain("'#10B981'");
      expect(content).not.toContain("'#f5f5f4'");
      expect(content).not.toContain("'#e7e5e4'");
      expect(content).not.toContain("'#4B5563'");
      expect(content).not.toContain("'#FFFFFF'");
    });

    it('shareCardContent.styles.ts should not contain hardcoded #FFFFFF', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/ShareCardGenerator/styles/shareCardContent.styles.ts'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain("from '@/theme/colors'");
      expect(content).not.toContain("'#FFFFFF'");
      expect(content).toContain('colors.text.inverse');
    });

    it('shareCardFooter.styles.ts should not contain hardcoded #FFFFFF', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/ShareCardGenerator/styles/shareCardFooter.styles.ts'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain("from '@/theme/colors'");
      expect(content).not.toContain("'#FFFFFF'");
      expect(content).toContain('colors.text.inverse');
    });

    it('UserNameToggle.tsx should not contain hardcoded #FFFFFF', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/ShareCardGenerator/components/UserNameToggle.tsx'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain("from '@/theme/colors'");
      expect(content).not.toContain("'#FFFFFF'");
      expect(content).toContain('colors.text.inverse');
    });

    it('GRADIENT_PRESETS should have intentional comment', () => {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve(
        __dirname,
        '../../../src/components/ShareCardGenerator/ShareCardGenerator.constants.ts'
      );
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain(
        'Intentional: static colors for share card rendering'
      );
    });
  });
});
