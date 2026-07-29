import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props extends PropsWithChildren { label: string; error?: string; required?: boolean; }

export function FormField({ label, error, required, children }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}{required ? ' *' : ''}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 7 },
  label: { color: '#27324A', fontSize: 14, fontWeight: '700' },
  error: { color: '#C62828', fontSize: 13 },
});
