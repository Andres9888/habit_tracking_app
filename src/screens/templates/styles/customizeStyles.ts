import { StyleSheet } from 'react-native';
import { typography } from '../../../../theme/typography';

export const customizeStyles = StyleSheet.create({
  customizeSection: {
    marginTop: 4,
  },
  customizeSubtitle: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    color: '#78716c',
<<<<<<< HEAD
    fontSize: 13,
    fontWeight: '500',
=======
    ...typography.tabBar,
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  customizeTitle: {
    color: '#1c1917',
    ...typography.body,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  customizeTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
});
