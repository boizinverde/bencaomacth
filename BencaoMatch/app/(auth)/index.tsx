import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Theme } from '../../constants/Theme';
import { useAuth } from '../../hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const { signInWithGoogle, signInWithApple, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login com Google');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login com Apple');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={[Theme.colors.primary.blue, Theme.colors.primary.pink, Theme.colors.primary.lilac]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://customer-assets.emergentagent.com/job_faith-blessing/artifacts/0bw8xrrs_logomarca_app_namoro_cristao.png' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>BençãoMatch</Text>
          <Text style={styles.subtitle}>
            Encontre conexões baseadas na fé
          </Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Bem-vindo ao maior aplicativo de relacionamento cristão do Brasil! 💕
          </Text>
        </View>

        {/* Auth Buttons */}
        <View style={styles.authButtons}>
          <TouchableOpacity
            style={[styles.authButton, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <MaterialIcons name="search" size={22} color="#4285F4" />
            <Text style={[styles.authButtonText, styles.googleButtonText]}>
              Continuar com Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authButton, styles.appleButton]}
            onPress={handleAppleSignIn}
            disabled={loading}
          >
            <MaterialIcons name="apple" size={22} color="white" />
            <Text style={[styles.authButtonText, styles.appleButtonText]}>
              Continuar com Apple
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <MaterialIcons name="people" size={24} color="white" />
            <Text style={styles.featureText}>Comunidade Cristã Ativa</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="favorite" size={24} color="white" />
            <Text style={styles.featureText}>Relacionamentos Saudáveis</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="security" size={24} color="white" />
            <Text style={styles.featureText}>Ambiente Seguro</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="church" size={24} color="white" />
            <Text style={styles.featureText}>Valores Cristãos</Text>
          </View>
        </View>

        {/* Verse */}
        <View style={styles.verse}>
          <Text style={styles.verseText}>
            "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho."
          </Text>
          <Text style={styles.verseReference}>Eclesiastes 4:9</Text>
        </View>

        {/* Terms */}
        <View style={styles.terms}>
          <Text style={styles.termsText}>
            Ao continuar, você concorda com nossos{'\n'}
            <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
            <Text style={styles.termsLink}>Política de Privacidade</Text>
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Theme.spacing.xxl,
    marginBottom: Theme.spacing.xl,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.large,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Theme.spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  authButtons: {
    marginBottom: Theme.spacing.xxl,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: 16,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.medium,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  googleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  appleButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  authButtonText: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: Theme.spacing.md,
  },
  googleButtonText: {
    color: Theme.colors.text.dark,
  },
  appleButtonText: {
    color: 'white',
  },
  features: {
    marginBottom: Theme.spacing.xxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureText: {
    fontSize: Theme.typography.fontSize.md,
    color: 'white',
    marginLeft: Theme.spacing.md,
    fontWeight: '500',
  },
  verse: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.xl,
    borderRadius: 20,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  verseText: {
    fontSize: Theme.typography.fontSize.md,
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'white',
    marginBottom: Theme.spacing.sm,
    lineHeight: 24,
  },
  verseReference: {
    fontSize: Theme.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  terms: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  termsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});