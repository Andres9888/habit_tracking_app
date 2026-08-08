/** Settings search — shared query context so rows/sections self-filter live */
import { createContext, useContext, useMemo, type ReactNode } from 'react';

interface SettingsSearchValue {
  /** Normalized (trimmed + lowercased) query. Empty string = not searching. */
  query: string;
}

const SettingsSearchContext = createContext<SettingsSearchValue>({ query: '' });

interface ProviderProps {
  /** Raw query from the search field; normalized here. */
  query: string;
  children: ReactNode;
}

export function SettingsSearchProvider({ query, children }: ProviderProps) {
  const value = useMemo<SettingsSearchValue>(
    () => ({ query: query.trim().toLowerCase() }),
    [query]
  );
  return (
    <SettingsSearchContext.Provider value={value}>
      {children}
    </SettingsSearchContext.Provider>
  );
}

export function useSettingsSearch() {
  const { query } = useContext(SettingsSearchContext);
  return { query, isSearching: query.length > 0 };
}

/** True when there is no active query, or the label contains it (case-insensitive).
 *  There is no search entry point today, so the empty-query short-circuit is the
 *  path every row actually takes — keep it ahead of any string work. */
export function rowMatchesQuery(query: string, label: string): boolean {
  if (!query) return true;
  return label.toLowerCase().includes(query);
}
