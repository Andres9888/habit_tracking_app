/**
 * TipQuickActionsSheet Styles
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';

export const styles = StyleSheet.create({
  actionItem: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  actionItemPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionLabel: {
    ...typography.bodySmall,
    color: '#1c1917',
    fontWeight: fontWeights.semibold,
  },
  actionsList: {
    gap: 4,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  actionSubtitle: {
    ...typography.caption,
    color: '#78716c',
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
    backgroundColor: '#e7e5e4',
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
    ...typography.bodySmall,
    color: '#78716c',
    marginTop: 4,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  headerTitle: {
    ...typography.body,
    color: '#1c1917',
    fontWeight: fontWeights.bold,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
