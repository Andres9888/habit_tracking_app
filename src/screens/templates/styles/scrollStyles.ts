import { StyleSheet } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

export const scrollStyles = StyleSheet.create({
  scrollFadeBottom: {
    alignItems: 'center',
    bottom: 0,
    height: 56,
    justifyContent: 'flex-end',
    left: 0,
    paddingBottom: 8,
    position: 'absolute',
    right: 0,
  },
  scrollFadeTop: {
    height: 32,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scrollHintChip: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    elevation: 2,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#2D2A26',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  scrollHintText: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
    marginLeft: 8,
  },
});
