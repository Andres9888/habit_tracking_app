import { StyleSheet } from 'react-native';
import { typography } from '../../../../theme/typography';

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
<<<<<<< HEAD
    fontSize: 17,
=======
    ...typography.bodySmall,
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)
  },
  searchSection: {
    paddingHorizontal: 20,
  },
});
