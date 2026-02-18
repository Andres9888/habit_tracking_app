/**
 * Shared styles for TemplatePreviewModal
 * Note: dark mode colors are applied inline via useThemeColors()
 */

import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RESPONSIVE_BUTTON_SIZE = Math.max(SCREEN_WIDTH * 0.1, 44);
const RESPONSIVE_ICON_SIZE = Math.min(SCREEN_WIDTH * 0.2, 80);

export const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: RESPONSIVE_BUTTON_SIZE,
    justifyContent: 'center',
    width: RESPONSIVE_BUTTON_SIZE,
  },
  colorOption: {
    borderRadius: 16,
    height: RESPONSIVE_BUTTON_SIZE,
    width: RESPONSIVE_BUTTON_SIZE,
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
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 24,
    height: RESPONSIVE_ICON_SIZE,
    justifyContent: 'center',
    marginBottom: 16,
    width: RESPONSIVE_ICON_SIZE,
  },
  iconText: {
    fontSize: 40,
  },
  importButton: {
    elevation: 4,
    shadowColor: '#1c1917',
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
