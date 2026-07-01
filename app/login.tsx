import { router } from 'expo-router';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 12,
            padding: 14,
            fontSize: 16,
          }}
        />

        <TextInput
          placeholder="Mot de passe"
          secureTextEntry
          style={{
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 12,
            padding: 14,
            fontSize: 16,
          }}
        />

        <TouchableOpacity
          onPress={() => router.push('/dashboard')}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 15,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>
            Se connecter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}