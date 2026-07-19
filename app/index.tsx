//app/index.tsx

import { Image, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { APP_FULL_NAME, APP_NAME, COLORS } from '../src/constants/theme';

export default function WelcomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Image
        source={require('../src/assets/logo-icc.png')}
        style={{ width: 130, height: 130, resizeMode: 'contain', marginBottom: 20 }}
      />

      <Image
        source={require('../src/assets/logo-mra.jpg')}
        style={{
          width: 150,
          height: 150,
          resizeMode: 'contain',
          marginBottom: 24,
          borderRadius: 20,
        }}
      />

      <Text style={{ color: COLORS.white, fontSize: 30, fontWeight: '800' }}>
        {APP_NAME}
      </Text>

      <Text
        style={{
          color: COLORS.white,
          fontSize: 17,
          textAlign: 'center',
          marginTop: 8,
          marginBottom: 36,
        }}
      >
        {APP_FULL_NAME}
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/login')}
        style={{
          backgroundColor: COLORS.white,
          paddingVertical: 14,
          paddingHorizontal: 32,
          borderRadius: 14,
        }}
      >
        <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 16 }}>
          Accéder à l'application
        </Text>
      </TouchableOpacity>
    </View>
  );
}