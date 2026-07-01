import { Text, View } from 'react-native';
import { COLORS } from '../src/constants/theme';

export default function DashboardScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.light,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.text }}>
        Tableau de bord MRA
      </Text>

      <Text style={{ marginTop: 8, color: COLORS.muted, textAlign: 'center' }}>
        Infrastructure V1.0.0 en cours
      </Text>
    </View>
  );
}