/**
 * EmptyState Styles
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../theme/spacing';
import { typography, fontWeights, fontFamilies} from '../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    width: '100%',
  },
  containerCompact: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    width: '100%',
  },
  description: {
    marginBottom: 16,
    maxWidth: 320,
    textAlign: 'center',
  },
  descriptionCompact: {
    marginBottom: 0,
    maxWidth: 320,
    textAlign: 'center',
  },
  headline: {
    marginBottom: 8,
    textAlign: 'center',
  },
  headlineCompact: {
    marginBottom: 4,
    textAlign: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  iconCompact: {
    fontSize: 34,
    marginBottom: 12,
  },
  // Quick start templates
  quickStartSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    width: '100%',
  },
  templateChip: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  templateChipPressed: {
    transform: [{ scale: 0.98 }],
  },
  templateEmoji: {
    fontSize: typography.body.fontSize,
  },
  templateName: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.medium,
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
});
