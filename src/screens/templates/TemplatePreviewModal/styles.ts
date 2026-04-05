/**
 * Shared styles for TemplatePreviewModal
 * Note: dark mode colors are applied inline via useThemeColors()
 */

import { StyleSheet } from 'react-native';
import { shadows } from '@/theme/spacing';
import { fontFamilies, fontWeights } from '@/theme/typography';

export const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
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
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
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
    fontFamily: fontFamilies.primary.display,
    fontSize: 22,
    fontWeight: fontWeights.bold,
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
    fontSize: 34,
  },
  importButton: {
    ...shadows.modal,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.semibold,
    marginBottom: 8,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 20,
  },
});
