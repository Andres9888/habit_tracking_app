import { StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';

export const searchStyles = StyleSheet.create({
  searchBar: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 10,
    height: 44,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
  },
  searchSection: {
    paddingHorizontal: 16,
  },
});
