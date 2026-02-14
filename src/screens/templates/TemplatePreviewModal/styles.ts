/**
 * Shared styles for TemplatePreviewModal
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    height: 40,
    justifyContent: 'center',
    width: 40,
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
    backgroundColor: '#FAFAF9',
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
    color: '#111827',
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
    color: '#374151',
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
