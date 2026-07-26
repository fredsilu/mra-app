//src/components/ui/AppButton.tsx
import { Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AppButton({
  title,
  onPress,
  disabled = false,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}