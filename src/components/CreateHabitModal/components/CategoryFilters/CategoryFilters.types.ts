/**
 * CategoryFilters Type Definitions
 */

import type { Category, CategoryFilter } from '../../types';

export interface CategoryColors {
  bg: string;
  bgSelected: string;
  border: string;
  text: string;
}

export interface CategoryFilterItemProps {
  category: CategoryFilter;
  colors: CategoryColors;
  /** Index for staggered entrance animation */
  index: number;
  onSelect: (category: Category) => void;
  selected: boolean;
}

export interface CategoryFiltersProps {
  categories: CategoryFilter[];
  onSelect: (category: Category) => void;
  selectedCategory: Category;
}
