/**
 * White / semantic tokens on Toast and SyncingIndicator
 */

import { colors } from '@/theme/colors';
import { VARIANT_CONFIG } from '@/components/Toast/constants';
import { styles as toastStyles } from '@/components/Toast/styles';
import { styles as syncStyles } from '@/components/SyncStatus/SyncingIndicator/styles';

describe('White color replacement — components', () => {
  it('uses inverse text on toast variants', () => {
    expect(VARIANT_CONFIG.error.textColor).toBe(colors.text.inverse);
    expect(VARIANT_CONFIG.info.textColor).toBe(colors.text.inverse);
    expect(VARIANT_CONFIG.success.textColor).toBe(colors.text.inverse);
    expect(VARIANT_CONFIG.undo.textColor).toBe(colors.text.inverse);
    expect(VARIANT_CONFIG.warning.textColor).toBe(colors.text.inverse);
  });

  it('uses semantic fills (success is colors.success, not primary.500)', () => {
    expect(VARIANT_CONFIG.error.backgroundColor).toBe(colors.error);
    expect(VARIANT_CONFIG.info.backgroundColor).toBe(colors.secondary[500]);
    expect(VARIANT_CONFIG.success.backgroundColor).toBe(colors.success);
    expect(VARIANT_CONFIG.success.backgroundColor).toBe('#15793C');
    expect(VARIANT_CONFIG.undo.backgroundColor).toBe(colors.gray[700]);
    expect(typeof colors.warning).toBe('string');
    expect(colors.warning).toBe('#9A5504');
  });

  it('uses inverse text on toast icon and sync badge', () => {
    expect(toastStyles.icon.color).toBe(colors.text.inverse);
    expect(syncStyles.countText.color).toBe(colors.text.inverse);
  });
});
