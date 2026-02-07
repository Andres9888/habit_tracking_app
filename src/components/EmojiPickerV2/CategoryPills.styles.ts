import { StyleSheet } from 'react-native';

import { shadows } from '../../theme/spacing';

export const styles = StyleSheet.create({
  categoriesContent: {
    gap: 8,
    paddingHorizontal: 20,
  },
  categoriesScroll: {
    flexGrow: 0,
    marginBottom: 12,
  },
  categoryPill: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 9999,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryPillActive: {
    ...shadows.card,
    backgroundColor: '#1c1917',
    shadowOpacity: 0.15,
  },
  categoryPillIcon: {
    fontSize: 14,
  },
  categoryPillText: {
    color: '#57534e',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  categoryPillTextActive: {
    color: '#ffffff',
  },
});
