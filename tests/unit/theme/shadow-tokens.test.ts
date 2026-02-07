/**
 * Shadow Token Migration Tests (Phase 3 Task 2)
 * Verifies that component shadow styles use theme shadow tokens
 * instead of hardcoded shadow definitions.
 */

import { shadows } from '@/theme/spacing';
import { styles as archiveToastStyles } from '@/components/ArchiveUndoToast/styles';
import { styles as deleteToastStyles } from '@/components/DeleteUndoToast/styles';
import { styles as calendarGridStyles } from '@/components/BinaryHeatmap/MonthlyCalendarGrid/styles';
import { styles as templateCardStyles } from '@/components/TemplateCard/TemplateCard.styles';
import { styles as categoryChipStyles } from '@/components/CategoryChip/CategoryChip.styles';
import { cardStyles as weeklySummaryCardStyles } from '@/components/ProgressSectionConsolidated/WeeklySummaryStrip/cardStyles';
import { cardStyles as todaysFocusCardStyles } from '@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/cardStyles';
import { elementStyles } from '@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/elementStyles';
import { styles as quickCompleteStyles } from '@/components/QuickCompleteButton/QuickCompleteButton.styles';
import { sectionStyles } from '@/components/TemplateScienceModal/styles/section.styles';
import { footerStyles as tsFooterStyles } from '@/components/TemplateScienceModal/styles/footer.styles';
import { footerStyles as ftpFooterStyles } from '@/components/FullsizeTemplatePreview/styles/footer.styles';
import { styles as categoryPillsStyles } from '@/components/EmojiPickerV2/CategoryPills.styles';
import { CONTAINER_SHADOW } from '@/components/CalendarTimeline/CalendarTimeline.styles';

describe('Shadow Token Migration - Phase 3 Task 2', () => {
  describe('shadows token definitions', () => {
    it('shadows.card should have correct values', () => {
      expect(shadows.card.elevation).toBe(2);
      expect(shadows.card.shadowColor).toBe('#000000');
      expect(shadows.card.shadowOffset).toEqual({ height: 2, width: 0 });
      expect(shadows.card.shadowOpacity).toBe(0.1);
      expect(shadows.card.shadowRadius).toBe(8);
    });

    it('shadows.modal should have correct values', () => {
      expect(shadows.modal.elevation).toBe(4);
      expect(shadows.modal.shadowColor).toBe('#000000');
      expect(shadows.modal.shadowOffset).toEqual({ height: 4, width: 0 });
      expect(shadows.modal.shadowOpacity).toBe(0.12);
      expect(shadows.modal.shadowRadius).toBe(16);
    });

    it('shadows.floatingActionButton should have correct values', () => {
      expect(shadows.floatingActionButton.elevation).toBe(6);
      expect(shadows.floatingActionButton.shadowColor).toBe('#000000');
      expect(shadows.floatingActionButton.shadowOffset).toEqual({
        height: 6,
        width: 0,
      });
      expect(shadows.floatingActionButton.shadowOpacity).toBe(0.15);
      expect(shadows.floatingActionButton.shadowRadius).toBe(12);
    });

    it('shadows.subtle should have correct values', () => {
      expect(shadows.subtle.elevation).toBe(1);
      expect(shadows.subtle.shadowColor).toBe('#000000');
      expect(shadows.subtle.shadowOffset).toEqual({ height: 1, width: 0 });
      expect(shadows.subtle.shadowOpacity).toBe(0.05);
      expect(shadows.subtle.shadowRadius).toBe(3);
    });
  });

  describe('ArchiveUndoToast uses shadows.modal', () => {
    it('toast elevation should match shadows.modal', () => {
      expect(archiveToastStyles.toast.elevation).toBe(shadows.modal.elevation);
    });

    it('toast shadowRadius should match shadows.modal', () => {
      expect(archiveToastStyles.toast.shadowRadius).toBe(
        shadows.modal.shadowRadius
      );
    });
  });

  describe('DeleteUndoToast uses shadows.modal', () => {
    it('toast elevation should match shadows.modal', () => {
      expect(deleteToastStyles.toast.elevation).toBe(shadows.modal.elevation);
    });

    it('toast shadowRadius should match shadows.modal', () => {
      expect(deleteToastStyles.toast.shadowRadius).toBe(
        shadows.modal.shadowRadius
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

  describe('TemplateCard uses shadows.card', () => {
    it('card elevation should match shadows.card', () => {
      expect(templateCardStyles.card.elevation).toBe(shadows.card.elevation);
    });

    it('card shadowRadius should match shadows.card', () => {
      expect(templateCardStyles.card.shadowRadius).toBe(
        shadows.card.shadowRadius
      );
    });
  });

  describe('CategoryChip uses shadows.subtle', () => {
    it('container elevation should match shadows.subtle', () => {
      expect(categoryChipStyles.container.elevation).toBe(
        shadows.subtle.elevation
      );
    });

    it('container shadowOffset should match shadows.subtle', () => {
      expect(categoryChipStyles.container.shadowOffset).toEqual(
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

  describe('QuickCompleteButton confettiParticle uses shadows.subtle', () => {
    it('confettiParticle elevation should match shadows.subtle', () => {
      expect(quickCompleteStyles.confettiParticle.elevation).toBe(
        shadows.subtle.elevation
      );
    });

    it('confettiParticle shadowOffset should match shadows.subtle', () => {
      expect(quickCompleteStyles.confettiParticle.shadowOffset).toEqual(
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
