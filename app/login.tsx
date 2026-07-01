//app/login.tsx
import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { AppButton } from '../src/components/ui/AppButton';
import { AppInput } from '../src/components/ui/AppInput';
import { APP_FULL_NAME, COLORS } from '../src/constants/theme';

export default function LoginScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Image
          source={require('../src/assets/logo-mra.jpg')}
          style={{
            width: 120,
            height: 120,
            resizeMode: 'contain',
            borderRadius: 18,
            marginBottom: 16,
          }}
        />

        <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.text }}>
          Connexion
        </Text>

        <Text style={{ marginTop: 6, color: COLORS.muted, textAlign: 'center' }}>
          {APP_FULL_NAME}
        </Text>
      </View>

      <View style={{ gap: 14 }}>
        <AppInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppInput placeholder="Mot de passe" secureTextEntry />

        <View style={{ marginTop: 8 }}>
          <AppButton title="Se connecter" onPress={() => router.push('/dashboard')} />
        </View>
      </View>
    </View>
  );
}