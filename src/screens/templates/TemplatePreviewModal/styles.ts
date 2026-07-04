/**
 * Shared styles for TemplatePreviewModal
 * Note: dark mode colors are applied inline via useThemeColors()
 */

import { StyleSheet } from 'react-native';
import { borderRadius, shadows } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

export const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  colorOption: {
    borderRadius: borderRadius.card,
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
    fontSize: typography.heading1.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.5,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
  },
  iconText: {
    fontSize: typography.displayLarge.fontSize,
  },
  importButton: {
    ...shadows.modal,
  },
  input: {
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
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

/** Styles local to the TemplatePreviewModal bottom sheet shell */
export const localStyles = StyleSheet.create({
  dragHandle: { borderRadius: borderRadius.xs, height: 5, width: 36 },
  dragHandleRow: { alignItems: 'center', paddingBottom: 4, paddingTop: 8 },
  sheet: StyleSheet.absoluteFillObject,
});
