/**
 * Settings row colors (SettingsModal/colors.ts was removed)
 */

import { lightColors } from '@/theme/darkColors';
import { getSettingsRowColors } from '@/components/SettingsModal/SettingsRow/SettingsRow.colors';

describe('SettingsRow colors', () => {
  const rowColors = getSettingsRowColors(false);

  it('uses transparent row fill over the card paper', () => {
    expect(rowColors.background).toBe('transparent');
  });

  it('maps chevron/label/value to light semantic text', () => {
    expect(rowColors.border).toBe(lightColors.cardDivider);
    expect(rowColors.chevron).toBe(lightColors.text.secondary);
    expect(rowColors.label).toBe(lightColors.text.primary);
    expect(rowColors.valueText).toBe(lightColors.text.secondary);
    expect(rowColors.switchThumb).toBe(lightColors.text.inverse);
    expect(rowColors.switchTrackFalse).toBe(lightColors.gray[300]);
    expect(rowColors.switchTrackTrue).toBe(lightColors.primary[500]);
  });
});
