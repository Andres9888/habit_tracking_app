/**
 * Manage expanded/collapsed category state for Templates screen sections.
 */

import { useEffect, useRef, useState } from 'react';

interface CategoryLike {
  id: string;
}

export function useExpandedCategories(categories: CategoryLike[] | undefined) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set()
  );
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!categories?.length) return;

    const categoryIds = categories.map((category) => category.id);

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setExpandedCategories(new Set(categoryIds));
      return;
    }

    setExpandedCategories((prev) => {
      const validIds = new Set(categoryIds);
      const next = new Set(
        [...prev].filter((categoryId) => validIds.has(categoryId))
      );

      for (const categoryId of categoryIds) {
        if (!prev.has(categoryId)) {
          next.add(categoryId);
        }
      }

      return next;
    });
  }, [categories]);

  return {
    expandedCategories,
    setExpandedCategories,
  };
}

