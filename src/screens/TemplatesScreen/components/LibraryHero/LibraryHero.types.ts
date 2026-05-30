export interface LibraryHeroProps {
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  searchQuery: string;
  sessionImportCount: number;
}

export interface HeroCopyProps {
  subtitle: string;
  title: string;
}

