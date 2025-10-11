import { Checkbox } from '../Checkbox';

interface SettingItemProps {
  label: string;
  ariaLabel: string;
  checked: boolean;
  onToggle: () => void;
}

export function SettingItem({ label, ariaLabel, checked, onToggle }: SettingItemProps) {
  return (
    <label className='flex w-full items-center justify-between rounded-lg py-2'>
      <span className='text-foreground'>{label}</span>
      <Checkbox aria-label={ariaLabel} checked={checked} variant='primary' onPress={onToggle} />
    </label>
  );
}
