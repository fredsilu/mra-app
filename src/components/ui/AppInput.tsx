import { TextInput, TextInputProps } from 'react-native';
import { COLORS } from '../../constants/theme';

export function AppInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={COLORS.muted}
      style={[
        {
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 12,
          padding: 14,
          fontSize: 16,
        },
        props.style,
      ]}
    />
  );
}