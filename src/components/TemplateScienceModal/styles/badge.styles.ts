/**
 * Badge and pill styles for TemplateScienceModal hero section
 */

import { StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';

export const badgeStyles = StyleSheet.create({
  popularBadge: {
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderRadius: 12,
    borderWidth: 1,
    bottom: -4,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    width: 28,
  },
  readingTimePill: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  readingTimePillText: {
    color: '#6B7280',
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '600',
  },
  templateHeader: {
    alignItems: 'center',
  },
  templateName: {
    color: '#111827',
    fontFamily: fontFamilies.primary.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});
