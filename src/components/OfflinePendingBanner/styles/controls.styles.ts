import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors'
import { borderRadius } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';

export const controlsStyles = StyleSheet.create({
  progressBar: {
    backgroundColor: colors.info,
    height: '100%',
  },
  progressContainer: {
    backgroundColor: colors.gray[200],
    bottom: 0,
    height: 3,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  subtitle: {
    ...typography.caption,
    color: colors.gray[500],
    marginTop: 2,
  },
  syncButton: {
    alignItems: 'center',
    backgroundColor: colors.info,
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  syncButtonText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: fontWeights.semibold,
    marginLeft: 4,
  },
  title: {
    ...typography.button,
    color: colors.gray[800],
  },
});
