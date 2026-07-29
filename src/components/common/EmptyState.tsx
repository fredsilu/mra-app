import { StyleSheet, Text, View } from 'react-native';

interface Props { title: string; message: string; }

export function EmptyState({ title, message }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.symbol}><Text style={styles.symbolText}>♡</Text></View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', padding: 36 },
  symbol: { alignItems: 'center', backgroundColor: '#EEF4FF', borderRadius: 28, height: 56, justifyContent: 'center', width: 56 },
  symbolText: { color: '#1F4B8F', fontSize: 28, fontWeight: '700' },
  title: { color: '#17213B', fontSize: 17, fontWeight: '800', marginTop: 14 },
  message: { color: '#64748B', lineHeight: 21, marginTop: 6, maxWidth: 420, textAlign: 'center' },
});
