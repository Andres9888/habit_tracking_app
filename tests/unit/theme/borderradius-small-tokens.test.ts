/**
 * borderRadius.small usage on remaining StyleSheet components
 */

import { borderRadius } from '../../../src/theme/spacing';

describe('borderRadius.small token migration', () => {
  it('uses airy radius values', () => {
    expect(borderRadius.small).toBe(10);
    expect(borderRadius.medium).toBe(14);
    expect(borderRadius.large).toBe(24);
  });

  it('ShareCardGenerator progress bars use small', () => {
    const {
      shareCardContentStyles,
    } = require('../../../src/components/ShareCardGenerator/styles/shareCardContent.styles');
    expect(shareCardContentStyles.progressBarBackground.borderRadius).toBe(
      borderRadius.small
    );
    expect(shareCardContentStyles.progressBarFill.borderRadius).toBe(
      borderRadius.small
    );
  });

  it('BinaryHeatmap toggle uses small', () => {
    const {
      styles,
    } = require('../../../src/components/BinaryHeatmap/TimeRangeToggle.styles');
    expect(styles.button.borderRadius).toBe(borderRadius.small);
    expect(styles.container.borderRadius).toBe(borderRadius.small);
  });

  it('Toast uses small/medium', () => {
    const { styles } = require('../../../src/components/Toast/styles');
    expect(styles.actionButton.borderRadius).toBe(borderRadius.small);
    expect(styles.iconContainer.borderRadius).toBe(borderRadius.medium);
  });

  it('SyncingIndicator uses large/small', () => {
    const {
      styles,
    } = require('../../../src/components/SyncStatus/SyncingIndicator/styles');
    expect(styles.container.borderRadius).toBe(borderRadius.large);
    expect(styles.countBadge.borderRadius).toBe(borderRadius.small);
    expect(styles.iconContainer.borderRadius).toBe(borderRadius.small);
  });
});
