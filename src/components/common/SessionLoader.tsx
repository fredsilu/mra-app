//src/components/common/SessionLoader.tsx
import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

export function SessionLoader() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.light,
        padding: 24,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />

      <Text
        style={{
          marginTop: 16,
          color: COLORS.muted,
          textAlign: 'center',
        }}
      >
        Vérification de la session...
      </Text>
    </View>
  );
}