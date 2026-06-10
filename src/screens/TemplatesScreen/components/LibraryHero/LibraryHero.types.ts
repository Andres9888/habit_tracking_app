export interface LibraryHeroProps {
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  searchQuery: string;
}

export interface HeroCopyProps {
  subtitle: string;
  title: string;
}
