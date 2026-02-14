/**
 * StreakCalendar Styles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  monthHeader: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1917',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'center',
  },
  headerCell: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716c',
    letterSpacing: 0.5,
  },
  dayWrapper: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e7e5e4',
    backgroundColor: '#ffffff',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1c1917',
  },
  todayText: {
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    bottom: 4,
    right: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f4',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1917',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1917',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#78716c',
  },
  notesContainer: {
    flex: 1,
  },
  emptyNotesText: {
    fontSize: 14,
    color: '#a8a29e',
    textAlign: 'center',
    marginVertical: 24,
  },
  noteItem: {
    backgroundColor: '#fafaf8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  noteText: {
    fontSize: 14,
    color: '#1c1917',
    lineHeight: 20,
  },
});
