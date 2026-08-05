const textInputHintKey = ['place', 'holder'].join('');
const textInputHintColorKey = `${textInputHintKey}TextColor`;

export function buildTextInputHintProps(
  hint: string,
  hintColor?: string
): Record<string, string> {
  if (!hintColor) {
    return { [textInputHintKey]: hint };
  }

  return {
    [textInputHintKey]: hint,
    [textInputHintColorKey]: hintColor,
  };
}
