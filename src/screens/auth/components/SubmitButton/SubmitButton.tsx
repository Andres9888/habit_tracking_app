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
      className={`mt-4 items-center rounded-3xl border border-stone-800 bg-stone-800 py-4 ${
        isDisabled ? 'opacity-40' : ''
      }`}
      disabled={isDisabled}
      onPress={onPress}
    >
      <Text className='text-[15px] font-semibold tracking-[3px] text-white'>
        {isLoading ? loadingLabel : label}
      </Text>
    </TouchableOpacity>
  );
}
