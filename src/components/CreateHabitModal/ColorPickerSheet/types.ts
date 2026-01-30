export interface ColorPickerSheetProps {
  visible: boolean;
  value: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}
