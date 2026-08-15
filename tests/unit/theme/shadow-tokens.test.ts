/**
 * Shadow Token Migration Tests (Phase 3 Task 2)
 * Verifies that component shadow styles use theme shadow tokens
 * instead of hardcoded shadow definitions.
 */

import { shadows } from '@/theme/spacing';
import { styles as archiveToastStyles } from '@/components/ArchiveUndoToast/styles';
import { styles as deleteToastStyles } from '@/components/DeleteUndoToast/styles';
import { styles as calendarGridStyles } from '@/components/BinaryHeatmap/MonthlyCalendarGrid/styles';
import { cardStyles as weeklySummaryCardStyles } from '@/components/ProgressSectionConsolidated/WeeklySummaryStrip/cardStyles';
import { cardStyles as todaysFocusCardStyles } from '@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/cardStyles';
import { elementStyles } from '@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/elementStyles';
import { sectionStyles } from '@/components/TemplateScienceModal/styles/section.styles';
import { footerStyles as tsFooterStyles } from '@/components/TemplateScienceModal/styles/footer.styles';
import { footerStyles as ftpFooterStyles } from '@/components/FullsizeTemplatePreview/styles/footer.styles';
import { styles as categoryPillsStyles } from '@/components/EmojiPickerV2/CategoryPills.styles';
import { CONTAINER_SHADOW } from '@/components/CalendarTimeline/CalendarTimeline.styles';

describe('Shadow Token Migration - Phase 3 Task 2', () => {
  describe('shadows token definitions', () => {
    it('shadows.subtle (Level 0) should have correct values', () => {
      expect(shadows.subtle.elevation).toBe(1);
      expect(shadows.subtle.shadowColor).toBe('#1c1917');
      expect(shadows.subtle.shadowOffset).toEqual({ height: 1, width: 0 });
      expect(shadows.subtle.shadowOpacity).toBe(0.05);
      expect(shadows.subtle.shadowRadius).toBe(4);
    });

    it('shadows.card (Level 1) should have correct values', () => {
      expect(shadows.card.elevation).toBe(3);
      expect(shadows.card.shadowColor).toBe('#1c1917');
      expect(shadows.card.shadowOffset).toEqual({ height: 4, width: 0 });
      expect(shadows.card.shadowOpacity).toBe(0.08);
      expect(shadows.card.shadowRadius).toBe(16);
    });

    it('shadows.floatingActionButton (Level 2) should have correct values', () => {
      expect(shadows.floatingActionButton.elevation).toBe(6);
      expect(shadows.floatingActionButton.shadowColor).toBe('#1c1917');
      expect(shadows.floatingActionButton.shadowOffset).toEqual({
        height: 6,
        width: 0,
      });
      expect(shadows.floatingActionButton.shadowOpacity).toBe(0.1);
      expect(shadows.floatingActionButton.shadowRadius).toBe(20);
    });

    it('shadows.modal (Level 3) should have correct values', () => {
      expect(shadows.modal.elevation).toBe(8);
      expect(shadows.modal.shadowColor).toBe('#1c1917');
      expect(shadows.modal.shadowOffset).toEqual({ height: 8, width: 0 });
      expect(shadows.modal.shadowOpacity).toBe(0.12);
      expect(shadows.modal.shadowRadius).toBe(24);
    });

    it('shadows.alert (Level 4) should have correct values', () => {
      expect(shadows.alert.elevation).toBe(12);
      expect(shadows.alert.shadowColor).toBe('#1c1917');
      expect(shadows.alert.shadowOffset).toEqual({ height: 12, width: 0 });
      expect(shadows.alert.shadowOpacity).toBe(0.16);
      expect(shadows.alert.shadowRadius).toBe(32);
    });
  });

  describe('ArchiveUndoToast uses shadows.alert', () => {
    it('toast elevation should match shadows.alert', () => {
      expect(archiveToastStyles.toast.elevation).toBe(shadows.alert.elevation);
    });

    it('toast shadowRadius should match shadows.alert', () => {
      expect(archiveToastStyles.toast.shadowRadius).toBe(
        shadows.alert.shadowRadius
      );
    });
  });

  describe('DeleteUndoToast uses shadows.alert', () => {
    it('toast elevation should match shadows.alert', () => {
      expect(deleteToastStyles.toast.elevation).toBe(shadows.alert.elevation);
    });

    it('toast shadowRadius should match shadows.alert', () => {
      expect(deleteToastStyles.toast.shadowRadius).toBe(
        shadows.alert.shadowRadius
      );
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

  describe('TemplateScienceModal sectionCard uses shadows.card', () => {
    it('sectionCard elevation should match shadows.card', () => {
      expect(sectionStyles.sectionCard.elevation).toBe(shadows.card.elevation);
    });

    it('sectionCard shadowRadius should match shadows.card', () => {
      expect(sectionStyles.sectionCard.shadowRadius).toBe(
        shadows.card.shadowRadius
      );
    });
  });

  describe('TemplateScienceModal useButton uses shadows.modal', () => {
    it('useButton elevation should match shadows.modal', () => {
      expect(tsFooterStyles.useButton.elevation).toBe(shadows.modal.elevation);
    });

    it('useButton shadowRadius should match shadows.modal', () => {
      expect(tsFooterStyles.useButton.shadowRadius).toBe(
        shadows.modal.shadowRadius
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

  describe('CalendarTimeline CONTAINER_SHADOW uses shadows.subtle', () => {
    it('CONTAINER_SHADOW elevation should match shadows.subtle', () => {
      expect(CONTAINER_SHADOW.elevation).toBe(shadows.subtle.elevation);
    });

    it('CONTAINER_SHADOW shadowRadius should be 8 (custom override)', () => {
      expect(CONTAINER_SHADOW.shadowRadius).toBe(8);
    });
  });
});
