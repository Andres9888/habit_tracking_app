/**
 * Handlers for sort and filter operations
 */

import { useCallback } from 'react';
import type { FlatList } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { SortOption } from '../../templates/constants';

interface UseSortHandlersOptions {
  flatListRef: React.RefObject<FlatList<Doc<'templates'>> | null>;
  setShowSortOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
}

export function useSortHandlers(opts: UseSortHandlersOptions) {
  const { flatListRef, setShowSortOptions, setSortOption } = opts;

  const handleOpenSortOptions = useCallback(() => {
    setShowSortOptions(true);
  }, [setShowSortOptions]);

  const handleCloseSortOptions = useCallback(() => {
    setShowSortOptions(false);
  }, [setShowSortOptions]);

  const handleSelectSortOption = useCallback(
    (option: SortOption) => {
      setSortOption(option);
      setShowSortOptions(false);
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    },
    [flatListRef, setShowSortOptions, setSortOption]
  );

  return {
    handleCloseSortOptions,
    handleOpenSortOptions,
    handleSelectSortOption,
  };
}
