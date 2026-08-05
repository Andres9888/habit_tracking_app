/**
 * Shadow Token Migration Tests (Phase 3 Task 2)
 * Verifies that component shadow styles use theme shadow tokens
 * instead of hardcoded shadow definitions.
 */

import fs from 'fs';
import path from 'path';
import { shadows } from '@/theme/spacing';
import { styles as calendarGridStyles } from '@/components/BinaryHeatmap/MonthlyCalendarGrid/styles';
import { styles as timeRangeToggleStyles } from '@/components/BinaryHeatmap/TimeRangeToggle.styles';
import { cardStyles as weeklySummaryCardStyles } from '@/components/ProgressSectionConsolidated/WeeklySummaryStrip/cardStyles';
import { cardStyles as todaysFocusCardStyles } from '@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/cardStyles';
import { elementStyles } from '@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/elementStyles';
import { scienceWhyStyles } from '@/components/FullsizeTemplatePreview/styles/scienceWhy.styles';
import { actionPillsStyles } from '@/components/FullsizeTemplatePreview/styles/actionPills.styles';
import { footerStyles as ftpFooterStyles } from '@/components/FullsizeTemplatePreview/styles/footer.styles';
import { styles as categoryPillsStyles } from '@/components/EmojiPickerV2/CategoryPills.styles';
import { TODAY_SHADOW } from '@/components/CalendarTimeline/CalendarTimeline.styles';

const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), 'src', relativePath), 'utf-8');

describe('Shadow Token Migration - Phase 3 Task 2', () => {
  describe('shadows token definitions', () => {
    it('shadows.subtle (Level 0) should have correct values', () => {
      expect(shadows.subtle.elevation).toBe(1);
      expect(shadows.subtle.shadowColor).toBe('#2D2A26');
      expect(shadows.subtle.shadowOffset).toEqual({ height: 1, width: 0 });
      expect(shadows.subtle.shadowOpacity).toBe(0.04);
      expect(shadows.subtle.shadowRadius).toBe(3);
    });

    it('shadows.card (Level 1) should have correct values', () => {
      expect(shadows.card.elevation).toBe(3);
      expect(shadows.card.shadowColor).toBe('#2D2A26');
      expect(shadows.card.shadowOffset).toEqual({ height: 2, width: 0 });
      expect(shadows.card.shadowOpacity).toBe(0.06);
      expect(shadows.card.shadowRadius).toBe(8);
    });

    it('shadows.floatingActionButton (Level 2) should have correct values', () => {
      expect(shadows.floatingActionButton.elevation).toBe(6);
      expect(shadows.floatingActionButton.shadowColor).toBe('#2D2A26');
      expect(shadows.floatingActionButton.shadowOffset).toEqual({
        height: 4,
        width: 0,
      });
      expect(shadows.floatingActionButton.shadowOpacity).toBe(0.08);
      expect(shadows.floatingActionButton.shadowRadius).toBe(16);
    });

    it('shadows.modal (Level 3) should have correct values', () => {
      expect(shadows.modal.elevation).toBe(8);
      expect(shadows.modal.shadowColor).toBe('#2D2A26');
      expect(shadows.modal.shadowOffset).toEqual({ height: 8, width: 0 });
      expect(shadows.modal.shadowOpacity).toBe(0.1);
      expect(shadows.modal.shadowRadius).toBe(24);
    });

    it('shadows.alert (Level 4) should have correct values', () => {
      expect(shadows.alert.elevation).toBe(12);
      expect(shadows.alert.shadowColor).toBe('#2D2A26');
      expect(shadows.alert.shadowOffset).toEqual({ height: 12, width: 0 });
      expect(shadows.alert.shadowOpacity).toBe(0.14);
      expect(shadows.alert.shadowRadius).toBe(32);
    });
  });

  describe('ArchiveUndoToast uses shadows.alert', () => {
    it('toast elevation should match shadows.alert', () => {
      const source = readSource('components/ArchiveUndoToast/styles.ts');
      expect(source).toContain('...shadows.alert');
    });

    it('toast shadowRadius should match shadows.alert', () => {
      const source = readSource('components/ArchiveUndoToast/styles.ts');
      expect(source).not.toMatch(/toast:\s*\{[^}]*shadowRadius:/s);
    });
  });

  describe('DeleteUndoToast uses shadows.alert', () => {
    it('toast elevation should match shadows.alert', () => {
      const source = readSource('components/DeleteUndoToast/styles.ts');
      expect(source).toContain('...shadows.alert');
    });

    it('toast shadowRadius should match shadows.alert', () => {
      const source = readSource('components/DeleteUndoToast/styles.ts');
      expect(source).not.toMatch(/toast:\s*\{[^}]*shadowRadius:/s);
    });
  });

  describe('MonthlyCalendarGrid uses shadows.card', () => {
    it('container elevation should match shadows.card', () => {
      expect(calendarGridStyles.container.elevation).toBe(
        shadows.card.elevation
      );
    });

    it('container shadowRadius should match shadows.card', () => {
      expect(calendarGridStyles.container.shadowRadius).toBe(
        shadows.card.shadowRadius
      );
    });
  });

  describe('TimeRangeToggle uses shadows.subtle', () => {
    it('active button elevation should match shadows.subtle', () => {
      expect(timeRangeToggleStyles.buttonActive.elevation).toBe(
        shadows.subtle.elevation
      );
    });

    it('active button shadowOffset should match shadows.subtle', () => {
      expect(timeRangeToggleStyles.buttonActive.shadowOffset).toEqual(
        shadows.subtle.shadowOffset
      );
    });
  });

  describe('WeeklySummaryStrip cardStyles uses shadows.card', () => {
    it('card elevation should match shadows.card', () => {
      expect(weeklySummaryCardStyles.card.elevation).toBe(
        shadows.card.elevation
      );
    });

    it('card shadowOffset should match shadows.card', () => {
      expect(weeklySummaryCardStyles.card.shadowOffset).toEqual(
        shadows.card.shadowOffset
      );
    });
  });

  describe('TodaysFocusCard uses shadows.card', () => {
    it('container elevation should match shadows.card', () => {
      expect(todaysFocusCardStyles.container.elevation).toBe(
        shadows.card.elevation
      );
    });

    it('container shadowRadius should match shadows.card', () => {
      expect(todaysFocusCardStyles.container.shadowRadius).toBe(
        shadows.card.shadowRadius
      );
    });
  });

  describe('TodaysFocusCard confettiParticle uses shadows.subtle', () => {
    it('confettiParticle elevation should match shadows.subtle', () => {
      expect(elementStyles.confettiParticle.elevation).toBe(
        shadows.subtle.elevation
      );
    });

    it('confettiParticle shadowOffset should match shadows.subtle', () => {
      expect(elementStyles.confettiParticle.shadowOffset).toEqual(
        shadows.subtle.shadowOffset
      );
    });
  });

  describe('Fullsize preview science card uses shadows.card', () => {
    it('whyCard elevation should match shadows.card', () => {
      expect(scienceWhyStyles.whyCard.elevation).toBe(shadows.card.elevation);
    });

    it('whyCard shadowRadius should match shadows.card', () => {
      expect(scienceWhyStyles.whyCard.shadowRadius).toBe(
        shadows.card.shadowRadius
      );
    });
  });

  describe('Fullsize preview action pill uses shadows.subtle', () => {
    it('outline elevation should match shadows.subtle', () => {
      expect(actionPillsStyles.outline.elevation).toBe(shadows.subtle.elevation);
    });

    it('outline shadowRadius should match shadows.subtle', () => {
      expect(actionPillsStyles.outline.shadowRadius).toBe(
        shadows.subtle.shadowRadius
      );
    });
  });

  describe('FullsizeTemplatePreview importButton uses shadows.modal', () => {
    it('importButton elevation should match shadows.modal', () => {
      expect(ftpFooterStyles.importButton.elevation).toBe(
        shadows.modal.elevation
      );
    });

    it('importButton shadowRadius should match shadows.modal', () => {
      expect(ftpFooterStyles.importButton.shadowRadius).toBe(
        shadows.modal.shadowRadius
      );
    });
  });

  describe('EmojiPickerV2 CategoryPills uses shadows.card', () => {
    it('categoryPillActive elevation should match shadows.card', () => {
      expect(categoryPillsStyles.categoryPillActive.elevation).toBe(
        shadows.card.elevation
      );
    });

    it('categoryPillActive shadowRadius should match shadows.card', () => {
      expect(categoryPillsStyles.categoryPillActive.shadowRadius).toBe(
        shadows.card.shadowRadius
      );
    });
  });

  describe('CalendarTimeline TODAY_SHADOW uses shadows.subtle', () => {
    it('TODAY_SHADOW elevation should match shadows.subtle', () => {
      expect(TODAY_SHADOW.elevation).toBe(shadows.subtle.elevation);
    });

    it('TODAY_SHADOW only overrides opacity', () => {
      expect(TODAY_SHADOW.shadowRadius).toBe(shadows.subtle.shadowRadius);
      expect(TODAY_SHADOW.shadowOpacity).toBe(0.08);
    });
  });
});
