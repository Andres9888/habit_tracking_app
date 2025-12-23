import { Text, TouchableOpacity } from 'react-native';

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export function SubmitButton({
  label,
  loadingLabel,
  isLoading,
  disabled = false,
  onPress,
}: SubmitButtonProps) {
  const isDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      className={`mt-4 items-center rounded-3xl border border-stone-900 bg-stone-900 py-4 ${
        isDisabled ? 'opacity-40' : ''
      }`}
      disabled={isDisabled}
      onPress={onPress}
    >
      <Text className='text-[13px] font-bold tracking-[3px] text-white'>
        {isLoading ? loadingLabel : label}
      </Text>
    </TouchableOpacity>
  );
}
