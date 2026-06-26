/**
 * Styles for the template Share bottom sheet.
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { fontFamilies, typography } from '@/theme/typography';

export const shareSheetStyles = StyleSheet.create({
  action: { alignItems: 'center', flex: 1, gap: 8 },
  actionIcon: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  actionLabel: {
    color: colors.gray[600],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
  },
  actions: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  body: { paddingBottom: 8, paddingHorizontal: 16, paddingTop: 4 },
  brand: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    padding: 12,
  },
  cardEmoji: { fontSize: 24 },
  cardIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  cardName: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.text,
    fontSize: 15.5,
    fontWeight: '700',
  },
  cardText: { flex: 1, minWidth: 0 },
  cardUrl: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    marginTop: 1,
  },
  close: {
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  title: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.text,
    fontSize: 18,
    fontWeight: '700',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
