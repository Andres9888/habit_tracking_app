/**
 * White / card token replacement — banner + toast primitives
 */

import { colors } from '@/theme/colors';
import { layoutStyles } from '@/components/OfflinePendingBanner/styles/layout.styles';
import { controlsStyles } from '@/components/OfflinePendingBanner/styles/controls.styles';

describe('White color replacement', () => {
  it('uses card / inverse tokens on OfflinePendingBanner', () => {
    expect(layoutStyles.iconContainer.backgroundColor).toBe(colors.light.card);
    expect(controlsStyles.syncButtonText.color).toBe(colors.text.inverse);
  });

  it('treats light.card as warm paper, not pure white', () => {
    expect(colors.light.card.toLowerCase()).toBe('#edeae5');
    expect(colors.light.cardElevated.toLowerCase()).toBe('#ffffff');
    expect(colors.text.inverse.toLowerCase()).toBe('#ffffff');
  });

  it('keeps banner layout structure', () => {
    expect(layoutStyles.iconContainer).toMatchObject({
      alignItems: 'center',
      height: 36,
      width: 36,
    });
    expect(controlsStyles.syncButtonText).toMatchObject({
      fontWeight: '600',
    });
  });
});
