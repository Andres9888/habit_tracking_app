/**
 * Styles for TrendingCard badge overlays (rank, momentum, stick rate, NEW)
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';

const RANK_BADGE_SIZE = 22;

export const badgeStyles = StyleSheet.create({
  featuredCard: {
    borderColor: colors.primary[600],
    shadowColor: 'rgba(5,150,105,0.15)',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    width: 180,
  },
  rankBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: RANK_BADGE_SIZE / 2,
    height: RANK_BADGE_SIZE,
    justifyContent: 'center',
    left: 10,
    position: 'absolute',
    top: 10,
    width: RANK_BADGE_SIZE,
  },
  rankText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  momentumBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  momentumText: { color: '#B45309', fontSize: 10, fontWeight: '700' },
  stickRate: {
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stickRateText: { color: '#065F46', fontSize: 10, fontWeight: '700' },
  newBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    elevation: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    position: 'absolute',
    right: -6,
    shadowColor: '#EF4444',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    top: -6,
  },
  newText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
});
