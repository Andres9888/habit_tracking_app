import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors'
import { fontFamilies } from '../../../theme/typography';;

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
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    marginTop: 2,
  },
  syncButton: {
    alignItems: 'center',
    backgroundColor: colors.info,
    borderRadius: 16,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  syncButtonText: {
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: '600',
  },
});
