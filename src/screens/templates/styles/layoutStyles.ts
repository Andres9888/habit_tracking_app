import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const layoutStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.surfaceMuted,
    flex: 1,
  },
  emptyStateWrapper: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  header: {
    paddingBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  listContent: {
    paddingBottom: 24,
  },
  listWrapper: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  sectionDivider: {
    backgroundColor: colors.gray[200],
    height: 1,
    marginVertical: 20,
  },
});
