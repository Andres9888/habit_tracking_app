import { StyleSheet } from 'react-native';

export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyStateWrapper: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  header: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
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
    height: 1,
    marginVertical: 20,
  },
});
