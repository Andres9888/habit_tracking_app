export interface SmartSuggestionsProps {
  onPick: (emoji: string | null, name: string, color?: string) => void;
  query: string;
}

export interface Suggestion {
  color: string;
  emoji: string;
  keywords: string[];
  name: string;
}

export interface SuggestionChipProps {
  color: string;
  emoji: string;
  isHighlighted: boolean;
  name: string;
  onPick: (emoji: string, name: string, color: string) => void;
}
