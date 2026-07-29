// src/components/common/SessionLoader.tsx

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/theme';

export function SessionLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />

      <Text style={styles.text}>
        Chargement de votre espace...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light,
    padding: 24,
  },
  text: {
    marginTop: 14,
    color: COLORS.text,
    fontSize: 15,
    textAlign: 'center',
  },
});