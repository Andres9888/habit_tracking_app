import { ForwardedRef, forwardRef } from 'react';
import { TextInput, View } from 'react-native';
import { AnimatedEntrance } from './AnimatedEntrance';
import { ENTRANCE_DELAYS } from './animations';
import { HabitInput } from './HabitInput';

interface InputSectionProps {
  inputValue: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onSubmitEditing: () => void;
}

export const InputSection = forwardRef(function InputSection(
  { inputValue, onChangeText, onClear, onSubmitEditing }: InputSectionProps,
  ref: ForwardedRef<TextInput>
) {
  return (
    <View style={{ marginBottom: 16, maxWidth: 343, width: '100%' }}>
      <AnimatedEntrance delay={ENTRANCE_DELAYS.input}>
        <HabitInput
          ref={ref}
          value={inputValue}
          onChangeText={onChangeText}
          onClear={onClear}
          onSubmitEditing={onSubmitEditing}
        />
      </AnimatedEntrance>
    </View>
  );
});
