//app/login.tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { AppButton } from '../src/components/ui/AppButton';
import { AppInput } from '../src/components/ui/AppInput';
import { APP_FULL_NAME, COLORS } from '../src/constants/theme';
import { loginWithEmail } from '../src/services/auth.service';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    try {
      setIsLoading(true);
      await loginWithEmail(email, password);
      router.replace('/dashboard');
    } catch (error) {
      Alert.alert('Connexion impossible', 'Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  }

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
          value={email}
          onChangeText={setEmail}
        />

        <AppInput
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={{ marginTop: 8 }}>
          <AppButton
            title={isLoading ? 'Connexion...' : 'Se connecter'}
            onPress={handleLogin}
          />
        </View>
      </View>
    </View>
  );
}