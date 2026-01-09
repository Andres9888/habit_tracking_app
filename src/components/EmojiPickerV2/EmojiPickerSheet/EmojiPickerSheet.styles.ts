/**
 * EmojiPickerSheet Styles
 */

import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  handle: {
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    height: 4,
    width: 40,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 12,
  },
  noIconButton: {
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: '100%',
  },
  noIconContainer: {
    borderTopColor: '#f3f4f6',
    borderTopWidth: 1,
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  noIconText: {
    color: '#78716c',
    fontSize: 14,
    fontWeight: '500',
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderColor: '#e7e5e4',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 16,
  },
  searchContainer: {
    marginBottom: 12,
    marginHorizontal: 20,
  },
  searchInput: {
    color: '#1c1917',
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    height: SHEET_HEIGHT,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { height: -4, width: 0 },
    elevation: 20,
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
});
