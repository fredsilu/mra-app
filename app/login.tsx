import { Text, View } from 'react-native';
import { COLORS } from '../src/constants/theme';

export default function LoginScreen() {
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
        Connexion MRA
      </Text>
    </View>
  );
}