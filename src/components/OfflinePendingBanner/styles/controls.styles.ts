import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors'
import { fontFamilies } from '../../../theme/typography';;

export const controlsStyles = StyleSheet.create({
  progressBar: {
    backgroundColor: '#0EA5E9',
    height: '100%',
  },
  progressContainer: {
    backgroundColor: '#E4E4E7',
    bottom: 0,
    height: 3,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  subtitle: {
    color: '#71717A',
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    marginTop: 2,
  },
  syncButton: {
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
    borderRadius: 16,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  syncButtonText: {
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    color: '#27272A',
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: '600',
  },
});
