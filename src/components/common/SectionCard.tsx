import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props extends PropsWithChildren {
  title?: string;
  subtitle?: string;
}

export function SectionCard({ title, subtitle, children }: Props) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E3E8F0',
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#17213B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  title: { color: '#17213B', fontSize: 18, fontWeight: '800' },
  subtitle: { color: '#64748B', fontSize: 14, lineHeight: 20, marginTop: 4 },
  content: { gap: 14, marginTop: 16 },
});
