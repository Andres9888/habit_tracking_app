/**
 * Shadow tokens and remaining StyleSheet consumers
 */

import { shadows } from '@/theme/spacing';
import { styles as calendarGridStyles } from '@/components/BinaryHeatmap/MonthlyCalendarGrid/styles';
import { cardStyles as weeklySummaryCardStyles } from '@/components/ProgressSectionConsolidated/WeeklySummaryStrip/cardStyles';
import { cardStyles as todaysFocusCardStyles } from '@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/cardStyles';
import { elementStyles } from '@/components/ProgressSectionConsolidated/TodaysFocusCard/styles/elementStyles';
import { styles as categoryPillsStyles } from '@/components/EmojiPickerV2/CategoryPills.styles';
import { TODAY_SHADOW } from '@/components/CalendarTimeline/CalendarTimeline.styles';

describe('Shadow tokens', () => {
  it('matches current warm-paper elevations', () => {
    expect(shadows.subtle).toMatchObject({
      elevation: 1,
      shadowColor: '#2D2A26',
      shadowOffset: { height: 1, width: 0 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
    });
    expect(shadows.card).toMatchObject({
      elevation: 3,
      shadowColor: '#2D2A26',
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    });
    expect(shadows.floatingActionButton).toMatchObject({
      elevation: 6,
      shadowColor: '#2D2A26',
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
    });
    expect(shadows.modal).toMatchObject({
      elevation: 8,
      shadowColor: '#2D2A26',
      shadowOffset: { height: 8, width: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
    });
    expect(shadows.alert).toMatchObject({
      elevation: 12,
      shadowColor: '#2D2A26',
      shadowOffset: { height: 12, width: 0 },
      shadowOpacity: 0.14,
      shadowRadius: 32,
    });
  });

  it('spreads shadows.card on calendar / weekly / focus cards', () => {
    expect(calendarGridStyles.container.elevation).toBe(shadows.card.elevation);
    expect(calendarGridStyles.container.shadowRadius).toBe(
      shadows.card.shadowRadius
    );
    expect(weeklySummaryCardStyles.card.elevation).toBe(shadows.card.elevation);
    expect(todaysFocusCardStyles.container.elevation).toBe(
      shadows.card.elevation
    );
  });

  it('uses subtle on confetti and today highlight', () => {
    expect(elementStyles.confettiParticle.elevation).toBe(
      shadows.subtle.elevation
    );
    expect(TODAY_SHADOW.elevation).toBe(shadows.subtle.elevation);
    expect(TODAY_SHADOW.shadowRadius).toBe(shadows.subtle.shadowRadius);
  });

  it('uses card shadow on active category pills', () => {
    expect(categoryPillsStyles.categoryPillActive.elevation).toBe(
      shadows.card.elevation
    );
  });
});
