import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingView({ label = 'Chargement...' }: { label?: string }) {
  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color="#1F4B8F" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F5F7FB' },
  label: { color: '#64748B', marginTop: 12 },
});
