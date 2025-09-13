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
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout, updateUserProfile } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);
  const [showLocation, setShowLocation] = useState(true);

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
    Alert.alert('Info', 'Funcionalidade em desenvolvimento');
  };

  const profileStats = [
    { label: 'Matches', value: '12', icon: 'favorite' },
    { label: 'Conversas', value: '8', icon: 'chat' },
    { label: 'Eventos', value: '5', icon: 'event' },
  ];

  const menuItems = [
    {
      title: 'Editar Perfil',
      subtitle: 'Altere suas informações pessoais',
      icon: 'edit',
      onPress: handleEditProfile,
    },
    {
      title: 'Fotos',
      subtitle: 'Gerencie suas fotos do perfil',
      icon: 'photo-camera',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Preferências',
      subtitle: 'Configure seus critérios de busca',
      icon: 'tune',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Verificação',
      subtitle: 'Verifique sua conta para mais confiança',
      icon: 'verified',
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
      icon: 'help',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Reportar Problema',
      icon: 'report',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Termos de Uso',
      icon: 'description',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Política de Privacidade',
      icon: 'privacy-tip',
      onPress: () => Alert.alert('Info', 'Funcionalidade em desenvolvimento'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Profile Info */}
        <LinearGradient
          colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac]}
          style={styles.header}
        >
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleEditProfile}>
              <Image
                source={{ uri: user?.image || 'https://via.placeholder.com/120' }}
                style={styles.avatar}
              />
              <View style={styles.editAvatarButton}>
                <MaterialIcons name="photo-camera" size={16} color="white" />
              </View>
              {user?.isVerified && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            
            {user?.bio && (
              <Text style={styles.userBio}>{user.bio}</Text>
            )}

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              {profileStats.map((stat, index) => (
                <TouchableOpacity key={index} style={styles.statItem}>
                  <MaterialIcons name={stat.icon as any} size={24} color="white" />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <MaterialIcons name="edit" size={18} color={Theme.colors.primary.blue} />
              <Text style={styles.editProfileText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Settings Toggles */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configurações Rápidas</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="notifications" size={24} color={Theme.colors.primary.blue} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notificações</Text>
                <Text style={styles.settingSubtitle}>Receber alertas de matches e mensagens</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Theme.colors.ui.disabled, true: Theme.colors.primary.blue }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="visibility-off" size={24} color={Theme.colors.primary.pink} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Modo Privado</Text>
                <Text style={styles.settingSubtitle}>Ocultar seu perfil temporariamente</Text>
              </View>
            </View>
            <Switch
              value={privateMode}
              onValueChange={setPrivateMode}
              trackColor={{ false: Theme.colors.ui.disabled, true: Theme.colors.primary.pink }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="location-on" size={24} color={Theme.colors.status.success} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Mostrar Localização</Text>
                <Text style={styles.settingSubtitle}>Permitir que outros vejam sua distância</Text>
              </View>
            </View>
            <Switch
              value={showLocation}
              onValueChange={setShowLocation}
              trackColor={{ false: Theme.colors.ui.disabled, true: Theme.colors.status.success }}
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
                  <MaterialIcons name={item.icon as any} size={24} color={Theme.colors.primary.blue} />
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
                  <MaterialIcons name="chevron-right" size={20} color={Theme.colors.text.light} />
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
                  <MaterialIcons name={item.icon as any} size={24} color={Theme.colors.text.medium} />
                </View>
                
                <Text style={styles.menuTitle}>{item.title}</Text>
                
                <MaterialIcons name="chevron-right" size={20} color={Theme.colors.text.light} />
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
              "O amor é paciente, o amor é bondoso."
            </Text>
            <Text style={styles.verseReference}>1 Coríntios 13:4</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color={Theme.colors.status.error} />
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
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xxl,
    paddingHorizontal: Theme.spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Theme.spacing.lg,
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
    backgroundColor: Theme.colors.primary.blue,
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
    backgroundColor: Theme.colors.status.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Theme.spacing.xs,
  },
  userEmail: {
    fontSize: Theme.typography.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Theme.spacing.md,
  },
  userBio: {
    fontSize: Theme.typography.fontSize.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Theme.spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  statValue: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: 'white',
    marginTop: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: Theme.spacing.xs,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
  },
  editProfileText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.sm,
  },
  settingsSection: {
    backgroundColor: 'white',
    marginTop: -Theme.spacing.lg,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    paddingTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: Theme.spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '500',
    color: Theme.colors.text.dark,
  },
  settingSubtitle: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.xs,
  },
  menuSection: {
    backgroundColor: 'white',
    marginTop: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
  },
  menuItem: {
    paddingVertical: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: Theme.spacing.md,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '500',
    color: Theme.colors.text.dark,
  },
  menuSubtitle: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.xs,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.sm,
  },
  premiumBadge: {
    backgroundColor: Theme.colors.primary.gold,
  },
  popularBadge: {
    backgroundColor: Theme.colors.primary.pink,
  },
  badgeText: {
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: 'bold',
  },
  premiumBadgeText: {
    color: 'white',
  },
  popularBadgeText: {
    color: 'white',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
  },
  appVersion: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  appTagline: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.lg,
  },
  verse: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.xl,
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.lg,
  },
  verseText: {
    fontSize: Theme.typography.fontSize.md,
    fontStyle: 'italic',
    textAlign: 'center',
    color: Theme.colors.primary.blue,
    marginBottom: Theme.spacing.sm,
  },
  verseReference: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    paddingVertical: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.status.error,
  },
  logoutText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.status.error,
    marginLeft: Theme.spacing.sm,
  },
  bottomSpacing: {
    height: Theme.spacing.xxl,
  },
});