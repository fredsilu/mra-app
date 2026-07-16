//app/dashboard.tsx
import { Text, View } from 'react-native';
import { COLORS } from '../src/constants/theme';
import { useAuth } from '../src/contexts/AuthContext';

export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuth();

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
      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        Tableau de bord MRA
      </Text>

      <Text
        style={{
          marginTop: 8,
          color: COLORS.muted,
          textAlign: 'center',
        }}
      >
        Infrastructure V1.0.0 en cours
      </Text>

      <Text
        style={{
          marginTop: 24,
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        Session : {isAuthenticated ? 'active' : 'inactive'}
      </Text>

      <Text
        style={{
          marginTop: 6,
          color: COLORS.muted,
          textAlign: 'center',
        }}
      >
        {user?.email ?? 'Aucun utilisateur connecté'}
      </Text>
    </View>
  );
}