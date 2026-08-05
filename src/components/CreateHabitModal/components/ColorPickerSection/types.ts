export interface ColorPickerSectionProps {
  colors: readonly string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onCustomPress?: () => void; // Optional - if not provided, custom color button is hidden
  hideLabel?: boolean; // Hide section label for cleaner centered modal design
}

export interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
  reduceMotion: boolean;
}

export interface CustomColorButtonProps {
  onPress: () => void;
}
