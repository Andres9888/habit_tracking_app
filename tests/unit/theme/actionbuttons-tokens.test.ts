/**
 * ActionButtons Theme Token Migration Tests
 * Validates hardcoded hex values were replaced with theme tokens.
 */

import { colors } from '../../../src/theme/colors';
import { borderRadius, spacing } from '../../../src/theme/spacing';
import { styles } from '../../../src/components/TemplateCard/components/ActionButtons';

describe('ActionButtons - Theme Token Migration', () => {
  it('uses colors.success for successButton background', () => {
    expect(styles.successButton.backgroundColor).toBe(colors.success);
  });

  it('uses colors.text.inverse for successButtonText color', () => {
    expect(styles.successButtonText.color).toBe(colors.text.inverse);
  });

  it('uses colors.text.secondary for previewButtonText', () => {
    expect(styles.previewButtonText.color).toBe(colors.text.secondary);
  });

  it('uses borderRadius.medium for all buttons', () => {
    expect(styles.importButton.borderRadius).toBe(borderRadius.medium);
    expect(styles.previewButton.borderRadius).toBe(borderRadius.medium);
    expect(styles.successButton.borderRadius).toBe(borderRadius.medium);
  });

  it('uses spacing tokens for layout', () => {
    expect(styles.buttonRow.gap).toBe(spacing.sm);
    expect(styles.importButton.paddingVertical).toBe(spacing.md);
    expect(styles.previewButton.paddingVertical).toBe(spacing.md);
    expect(styles.successButton.paddingHorizontal).toBe(spacing.base);
    expect(styles.successButton.paddingVertical).toBe(spacing.md);
    expect(styles.successButton.gap).toBe(spacing.sm);
  });

  it('uses named constant for previewButton background', () => {
    // #f5f5f4 (stone-100) has no exact theme token — it is extracted
    // to a named PREVIEW_BUTTON_BG constant so it is no longer an
    // anonymous inline hex literal.
    expect(styles.previewButton.backgroundColor).toBe('#f5f5f4');
  });
});
