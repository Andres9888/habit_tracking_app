/**
 * Shared styles for TemplatePreviewModal
 * Note: dark mode colors are applied inline via useThemeColors()
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
<<<<<<< HEAD
=======
    backgroundColor: colors.gray[50],
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    borderRadius: 16,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  colorOption: {
    borderRadius: 16,
    height: 44,
    width: 44,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  container: {
<<<<<<< HEAD
=======
    backgroundColor: colors.light.surfaceMuted,
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerTitle: {
<<<<<<< HEAD
=======
    color: colors.gray[800],
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 24,
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
  },
  iconText: {
    fontSize: 40,
  },
  importButton: {
    elevation: 4,
    shadowColor: colors.gray[900],
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
<<<<<<< HEAD
=======
    color: colors.gray[700],
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
});
