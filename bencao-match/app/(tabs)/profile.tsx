import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout, updateUserProfile } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    Alert.alert('Info', 'Funcionalidade em desenvolvimento');
  };

  const profileStats = [
    { label: 'Matches', value: '12', icon: 'heart' },
    { label: 'Conversas', value: '8', icon: 'chatbubble' },
    { label: 'Eventos', value: '5', icon: 'calendar' },
  ];

  const menuItems = [
    {
      title: 'Editar Perfil',
      subtitle: 'Altere suas informações pessoais',
      icon: 'person',
      onPress: handleEditProfile,
    },
    {
      title: 'Fotos',
      subtitle: 'Gerencie suas fotos do perfil',
      icon: 'camera',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Preferências',
      subtitle: 'Configure seus critérios de busca',
      icon: 'settings',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Privacidade',
      subtitle: 'Controle quem pode ver seu perfil',
      icon: 'shield',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Verificação',
      subtitle: 'Verifique sua conta para mais confiança',
      icon: 'checkmark-circle',
      badge: 'Premium',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Assinatura Premium',
      subtitle: 'Desbloquear recursos exclusivos',
      icon: 'star',
      badge: 'Popular',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
  ];

  const supportItems = [
    {
      title: 'Central de Ajuda',
      icon: 'help-circle',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Reportar Problema',
      icon: 'warning',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Termos de Uso',
      icon: 'document-text',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Política de Privacidade',
      icon: 'lock-closed',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Profile Info */}
        <LinearGradient
          colors={Colors.light.gradient.primary}
          style={styles.header}
        >
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleEditProfile}>
              <Image
                source={{ uri: user?.photoURL || 'https://via.placeholder.com/120' }}
                style={styles.avatar}
              />
              <View style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
              {user?.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.userName}>{user?.displayName || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            
            {user?.bio && (
              <Text style={styles.userBio}>{user.bio}</Text>
            )}

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              {profileStats.map((stat, index) => (
                <TouchableOpacity key={index} style={styles.statItem}>
                  <Ionicons name={stat.icon as any} size={24} color="white" />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Ionicons name="create" size={18} color={Colors.light.primary} />
              <Text style={styles.editProfileText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Settings Toggles */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configurações Rápidas</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color={Colors.light.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notificações</Text>
                <Text style={styles.settingSubtitle}>Receber alertas de matches e mensagens</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="eye-off" size={24} color={Colors.light.secondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Modo Privado</Text>
                <Text style={styles.settingSubtitle}>Ocultar seu perfil temporariamente</Text>
              </View>
            </View>
            <Switch
              value={privateMode}
              onValueChange={setPrivateMode}
              trackColor={{ false: Colors.light.border, true: Colors.light.secondary }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Conta & Perfil</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={24} color={Colors.light.primary} />
                </View>
                
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>

                <View style={styles.menuRight}>
                  {item.badge && (
                    <View style={[
                      styles.badge,
                      item.badge === 'Premium' && styles.premiumBadge,
                      item.badge === 'Popular' && styles.popularBadge,
                    ]}>
                      <Text style={[
                        styles.badgeText,
                        item.badge === 'Premium' && styles.premiumBadgeText,
                        item.badge === 'Popular' && styles.popularBadgeText,
                      ]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Suporte & Informações</Text>
          
          {supportItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={24} color={Colors.light.tabIconDefault} />
                </View>
                
                <Text style={styles.menuTitle}>{item.title}</Text>
                
                <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>BençãoMatch v1.0.0</Text>
          <Text style={styles.appTagline}>Conectando corações cristãos</Text>
          
          <View style={styles.verse}>
            <Text style={styles.verseText}>
              "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho."
            </Text>
            <Text style={styles.verseReference}>Eclesiastes 4:9</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color={Colors.light.error} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.light.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: 'white',
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.md,
  },
  userBio: {
    fontSize: Typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  statValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: 'white',
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: Spacing.xs,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  editProfileText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.primary,
    marginLeft: Spacing.sm,
  },
  settingsSection: {
    backgroundColor: 'white',
    marginTop: -Spacing.lg,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
  },
  settingSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.6,
    marginTop: Spacing.xs,
  },
  menuSection: {
    backgroundColor: 'white',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  menuItem: {
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
  },
  menuSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.6,
    marginTop: Spacing.xs,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
  },
  premiumBadge: {
    backgroundColor: Colors.light.accent,
  },
  popularBadge: {
    backgroundColor: Colors.light.secondary,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  premiumBadgeText: {
    color: 'white',
  },
  popularBadgeText: {
    color: 'white',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  appVersion: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.6,
  },
  appTagline: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.6,
    marginBottom: Spacing.lg,
  },
  verse: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  verseText: {
    fontSize: Typography.sizes.md,
    fontStyle: 'italic',
    textAlign: 'center',
    color: Colors.light.primary,
    marginBottom: Spacing.sm,
  },
  verseReference: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.6,
    fontWeight: Typography.weights.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.error,
  },
  logoutText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.error,
    marginLeft: Spacing.sm,
  },
  bottomSpacing: {
    height: Spacing.xxl,
  },
});