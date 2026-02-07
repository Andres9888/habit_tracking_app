/**
 * YouTube section styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';
import { typography } from '../../../theme/typography';

export const youtubeStyles = StyleSheet.create({
  youtubeButton: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  youtubeGradient: {
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  youtubeSubtitle: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
  youtubeTextContainer: {
    flex: 1,
  },
  youtubeTitle: {
    color: '#111827',
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    marginBottom: 2,
  },
});
