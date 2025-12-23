import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // New browse mode styles
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  browseContent: {
    paddingBottom: 40,
  },
  categorySections: {
    paddingTop: 4,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  categoryHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Legacy category chip styles (kept for reference)
  categoriesContainer: {
    gap: 8,
    paddingHorizontal: 20,
    paddingRight: 50,
    paddingVertical: 12,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesWrapper: {
    position: 'relative',
  },
  categoryChip: {
    alignItems: 'center',
    elevation: 1,
    flexDirection: 'row',
    gap: 6,
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryColorDot: {
    borderRadius: 999,
    height: 6,
    width: 6,
  },
  categoryCount: {
    borderRadius: 999,
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryCountText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryIcon: {
    fontSize: 17,
  },
  categoryScrollGradient: {
    height: '100%',
    width: 32,
  },
  categoryScrollHintChevrons: {
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0.7,
  },
  categoryScrollHintWrapper: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 8,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f5f1',
  },
  controlButton: {
    alignItems: 'center',
    borderColor: '#e7e5e4',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  controlButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  controlButtonText: {
    color: '#1c1917',
    fontSize: 13,
    fontWeight: '600',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  emptyStateWrapper: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  header: {
    paddingBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  inputLabel: {
    color: '#475467',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
  },
  inputWrapper: {
    marginTop: 8,
    position: 'relative',
  },
  listContent: {
    paddingBottom: 24,
  },
  listWrapper: {
    flex: 1,
    position: 'relative',
  },
  nameInput: {
    backgroundColor: '#fff',
    borderColor: '#e7e5e4',
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  previewActions: {
    marginTop: 32,
  },
  previewCategory: {
    color: '#6b7280',
    marginTop: 6,
  },
  previewHeader: {
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 48,
  },
  previewIconContainer: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  previewModal: {
    paddingBottom: 24,
  },
  previewScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  previewScienceBox: {
    alignItems: 'flex-start',
    borderColor: '#bbf7d0',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  sectionDivider: {
    backgroundColor: '#e5e7eb',
    height: 1,
    marginVertical: 20,
  },
  researchLink: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  scienceIcon: {
    fontSize: 17,
  },
  youtubeIcon: {
    fontSize: 17,
  },
  youtubeIconWrapper: {
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  youtubeLink: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
    padding: 14,
  },
  reminderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  reminderChip: {
    borderColor: '#e7e5e4',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reminderChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  reminderChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  colorSwatch: {
    borderRadius: 999,
    height: 36,
    width: 36,
  },
  colorSwatchActive: {
    borderColor: '#111827',
    borderWidth: 3,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scrollFadeBottom: {
    left: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    right: 0,
    height: 56,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  scrollFadeTop: {
    left: 0,
    position: 'absolute',
    height: 32,
    right: 0,
    top: 0,
  },
  scrollHintChip: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollHintText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e7e5e4',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  searchSection: {
    paddingHorizontal: 20,
  },
  sortButtonWrapper: {
    position: 'relative',
    zIndex: 100,
  },
  sortDropdown: {
    backgroundColor: '#ffffff',
    borderColor: '#e7e5e4',
    borderRadius: 12,
    borderWidth: 1,
    elevation: 8,
    left: 0,
    marginTop: 4,
    minWidth: 140,
    overflow: 'hidden',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    top: '100%',
    zIndex: 101,
  },
  sortDropdownOption: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sortDropdownOptionSelected: {
    backgroundColor: '#f0fdf4',
  },
  sortDropdownOptionText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '500',
  },
  sortDropdownOptionTextSelected: {
    color: '#059669',
    fontWeight: '600',
  },
  dropdownBackdrop: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 99,
  },
  skeletonBadge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    height: 14,
    width: 60,
  },
  skeletonBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
  },
  skeletonIcon: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    height: 48,
    width: 48,
  },
  skeletonLine: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 12,
    marginTop: 8,
    width: '60%',
  },
  skeletonLineLarge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 16,
    marginTop: 16,
    width: '80%',
  },
  skeletonSearch: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    height: 44,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  customizeSection: {
    marginTop: 4,
  },
  customizeSubtitle: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '500',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  customizeTitle: {
    color: '#1c1917',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  customizeTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  charCount: {
    color: '#a8a29e',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  // Tab bar styles
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 12,
    backgroundColor: '#f5f5f4',
    borderRadius: 14,
    padding: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#78716c',
  },
  tabTextActive: {
    color: '#1c1917',
  },
  tabCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#a8a29e',
    marginLeft: 6,
  },
  tabCountActive: {
    color: '#1c1917',
  },
  // All templates grid (for MiniTemplateCard)
  allTemplatesGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  // All templates list (for full TemplateCard)
  allTemplatesList: {
    paddingBottom: 16,
  },
});











