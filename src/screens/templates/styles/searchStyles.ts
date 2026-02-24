import { StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';

export const searchStyles = StyleSheet.create({
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e7e5e4',
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
  },
  searchSection: {
    paddingHorizontal: 20,
  },
});
