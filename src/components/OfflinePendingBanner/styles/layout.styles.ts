import { StyleSheet } from 'react-native';

export const layoutStyles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  container: {
    backgroundColor: '#F4F4F5',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
});
