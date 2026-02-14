/**
 * WelcomeScreen styles — uses typography tokens from theme
 */

<<<<<<< HEAD
import { StyleSheet, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '@/theme/typography';
=======
import { StyleSheet } from 'react-native';
import { typography } from '../../theme/typography';
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)

export const styles = StyleSheet.create({
  actionSection: {
    gap: 12,
  },
  backButton: {
    left: 16,
    position: 'absolute',
    zIndex: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  container: {
    backgroundColor: '#FAF8F5',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#f5f5f4',
    borderRadius: 16,
    elevation: 4,
    height: 80,
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 80,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    elevation: 4,
    paddingVertical: 16,
    shadowColor: colors.primary[600],
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  primaryButtonText: {
    ...typography.button,
    color: '#ffffff',
<<<<<<< HEAD
  } as TextStyle,
=======
  },
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)
  subtitle: {
    ...typography.body,
    color: '#57534e',
    textAlign: 'center',
  } as TextStyle,
  textLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  textLinkAction: {
    ...typography.bodySmall,
<<<<<<< HEAD
    color: colors.primary[700],
=======
    color: '#047857',
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)
    fontWeight: '600',
  } as TextStyle,
  textLinkLabel: {
    ...typography.bodySmall,
    color: '#57534e',
<<<<<<< HEAD
  } as TextStyle,
=======
  },
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)
  title: {
    ...typography.displayLarge,
    color: '#1c1917',
    textAlign: 'center',
  } as TextStyle,
});
