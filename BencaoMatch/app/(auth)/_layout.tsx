import { Stack } from 'expo-router';
import { Theme } from '../../constants/Theme';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="setup-profile"
        options={{
          title: 'Completar Perfil',
          headerStyle: {
            backgroundColor: Theme.colors.primary.blue,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}