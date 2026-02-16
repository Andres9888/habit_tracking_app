import { StyleSheet } from 'react-native';

export const searchStyles = StyleSheet.create({
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e7e5e4',
    borderRadius: 24,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  searchSection: {
    paddingHorizontal: 20,
  },
});
