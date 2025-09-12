import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const { signInWithGoogle, signInWithApple, loading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120' }}
            style={styles.logo}
          />
          <Text style={styles.title}>BençãoMatch</Text>
          <Text style={styles.subtitle}>
            Encontre conexões baseadas na fé
          </Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
            }}
            style={styles.illustration}
          />
          <View style={styles.overlay}>
            <Ionicons name="heart" size={60} color="white" />
          </View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="people" size={24} color="white" />
            <Text style={styles.featureText}>Comunidade Cristã</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="heart" size={24} color="white" />
            <Text style={styles.featureText}>Relacionamentos Saudáveis</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={24} color="white" />
            <Text style={styles.featureText}>Ambiente Seguro</Text>
          </View>
        </View>

        {/* Auth Buttons */}
        <View style={styles.authButtons}>
          <TouchableOpacity
            style={[styles.authButton, styles.googleButton]}
            onPress={signInWithGoogle}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={24} color="#4285F4" />
            <Text style={[styles.authButtonText, styles.googleButtonText]}>
              Continuar com Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authButton, styles.appleButton]}
            onPress={signInWithApple}
            disabled={loading}
          >
            <Ionicons name="logo-apple" size={24} color="white" />
            <Text style={[styles.authButtonText, styles.appleButtonText]}>
              Continuar com Apple
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ao continuar, você concorda com nossos{'\n'}
            <Text style={styles.link}>Termos de Uso</Text> e{' '}
            <Text style={styles.link}>Política de Privacidade</Text>
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
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: 'white',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
    position: 'relative',
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'white',
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.light.gradient.secondary[0],
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  features: {
    marginVertical: Spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  featureText: {
    fontSize: Typography.sizes.md,
    color: 'white',
    marginLeft: Spacing.md,
    fontWeight: Typography.weights.medium,
  },
  authButtons: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  googleButton: {
    backgroundColor: 'white',
  },
  appleButton: {
    backgroundColor: 'black',
  },
  authButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  googleButtonText: {
    color: '#333',
  },
  appleButtonText: {
    color: 'white',
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: Typography.weights.medium,
  },
});