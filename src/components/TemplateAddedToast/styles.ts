/**
 * TemplateAddedToast Styles
 */

import { StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';
import { ICON_BADGE_SIZE } from './constants';

export const styles = StyleSheet.create({
  actionPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: {
    color: '#FFFFFF',
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '700',
  },
  container: {
    alignItems: 'center',
    left: 16,
    position: 'absolute',
    right: 16,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: 10,
    height: ICON_BADGE_SIZE,
    justifyContent: 'center',
    width: ICON_BADGE_SIZE,
  },
  iconText: {
    fontSize: 20,
  },
  nameText: {
    color: '#FFFFFF',
    fontFamily: fontFamilies.primary.text,
    fontSize: 15,
    fontWeight: '700',
  },
  toast: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    maxWidth: 400,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
  },
});
