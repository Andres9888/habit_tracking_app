/**
 * Tips box styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography, fontFamilies} from '@/theme/typography';

export const tipsStyles = StyleSheet.create({
  tipIconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  tipItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  tipNumber: {
    fontFamily: fontFamilies.monospace,
    fontSize: 13,
    fontWeight: '700',
  },
  tipsBox: {
    backgroundColor: '#fefce8',
    borderColor: '#fef08a',
    borderRadius: borderRadius.large,
    borderWidth: 2,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
  },
  tipsDivider: {
    backgroundColor: '#fef08a',
    height: 1,
    marginBottom: 12,
  },
  tipsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tipsLabel: {
    color: '#854d0e',
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tipText: {
    color: '#713f12',
    flex: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    lineHeight: 22,
  },
});
