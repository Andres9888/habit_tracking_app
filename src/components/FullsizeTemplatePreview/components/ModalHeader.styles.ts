import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';

export const modalHeaderStyles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  handle: {
    backgroundColor: colors.gray[300],
    borderRadius: borderRadius.xs,
    height: 4,
    width: 40,
  },
  handleRow: { alignItems: 'center', paddingTop: 8 },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
