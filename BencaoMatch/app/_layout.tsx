import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated/lib/reanimated2/core';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Instalar AsyncStorage para React Native
    const setupAsyncStorage = async () => {
      try {
        // Inicializar AsyncStorage se necessário
        await AsyncStorage.getItem('app-initialized');
      } catch (error) {
        console.error('AsyncStorage setup error:', error);
      }
    };

    setupAsyncStorage();
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style="light" backgroundColor="#6BBBDD" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="modal" 
              options={{ 
                presentation: 'modal',
                headerTitle: 'Modal'
              }} 
            />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}