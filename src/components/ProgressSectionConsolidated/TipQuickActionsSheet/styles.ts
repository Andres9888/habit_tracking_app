/**
 * TipQuickActionsSheet Styles
 *
 * Layout-only styles. Colors are applied dynamically via useThemeColors()
 * to support dark mode.
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const styles = StyleSheet.create({
  actionItem: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  actionsList: {
    gap: 4,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  actionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  actionTextContainer: {
    flex: 1,
  },
  bottomPadding: {
    height: 8,
  },
  closeButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  headerSubtitle: {
    fontSize: typography.bodySmall.fontSize,
    marginTop: 4,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
