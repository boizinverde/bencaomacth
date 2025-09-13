import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';
import { useAuth } from '../../hooks/useAuth';
import { User, SwipeAction } from '../../types';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = height * 0.65;

// Demo profiles data
const DEMO_PROFILES: User[] = [
  {
    id: '1',
    name: 'Mariana',
    email: 'mariana@email.com',
    age: 28,
    denomination: 'Batista',
    distance: 5,
    location: 'São Paulo, SP',
    languages: ['Português', 'Inglês'],
    verse: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. - 1 Coríntios 13:4',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Cristã apaixonada por servir a Deus. Busco relacionamentos baseados na fé.',
    interests: ['Música Gospel', 'Oração', 'Estudos Bíblicos'],
    lookingFor: 'dating',
    createdAt: new Date(),
    lastActive: new Date(),
  },
  {
    id: '2',
    name: 'João',
    email: 'joao@email.com',
    age: 30,
    denomination: 'Católico',
    distance: 8,
    location: 'Rio de Janeiro, RJ',
    languages: ['Português', 'Espanhol'],
    verse: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito. - João 3:16',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Homem de fé em busca de relacionamentos sérios baseados nos valores cristãos.',
    interests: ['Evangelização', 'Família', 'Serviço Cristão'],
    lookingFor: 'marriage',
    createdAt: new Date(),
    lastActive: new Date(),
  },
  {
    id: '3',
    name: 'Ana',
    email: 'ana@email.com',
    age: 26,
    denomination: 'Pentecostal',
    distance: 3,
    location: 'Brasília, DF',
    languages: ['Português'],
    verse: 'Posso todas as coisas em Cristo que me fortalece. - Filipenses 4:13',
    image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Mulher de Deus que ama adorar e busca um companheiro para a vida.',
    interests: ['Adoração', 'Ministério', 'Vida Cristã'],
    lookingFor: 'marriage',
    createdAt: new Date(),
    lastActive: new Date(),
  },
  {
    id: '4',
    name: 'Priscila',
    email: 'priscila@email.com',
    age: 24,
    denomination: 'Assembleia de Deus',
    distance: 7,
    location: 'Belo Horizonte, MG',
    languages: ['Português', 'Inglês'],
    verse: 'O Senhor é o meu pastor, nada me faltará. - Salmos 23:1',
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Serva do Senhor em busca de relacionamentos que honrem a Deus.',
    interests: ['Missões', 'Juventude', 'Crescimento Espiritual'],
    lookingFor: 'dating',
    createdAt: new Date(),
    lastActive: new Date(),
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState<User[]>(DEMO_PROFILES);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(0.95);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      scale.value = withSpring(1);
      
      const threshold = width * 0.3;
      
      if (Math.abs(event.translationX) > threshold) {
        // Swipe detected
        translateX.value = withSpring(event.translationX > 0 ? width : -width);
        translateY.value = withSpring(event.translationY);
        
        if (event.translationX > 0) {
          runOnJS(handleLike)();
        } else {
          runOnJS(handlePass)();
        }
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-width, 0, width],
      [-15, 0, 15]
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, width * 0.5],
      [1, 0.8]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation}deg` },
      ],
      opacity,
    };
  });

  const likeIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, width * 0.3],
      [0, 1]
    ),
  }));

  const passIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-width * 0.3, 0],
      [1, 0]
    ),
  }));

  const handleLike = async () => {
    if (currentIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentIndex];
    
    // Record swipe
    const swipeAction: SwipeAction = {
      userId: user?.id || '',
      targetUserId: currentProfile.id,
      action: 'like',
      timestamp: new Date(),
    };

    // Simulate match (30% chance)
    const isMatch = Math.random() < 0.3;
    
    if (isMatch) {
      Alert.alert(
        '🎉 É um Match!',
        `Você e ${currentProfile.name} deram match! Que Deus abençoe esta conexão! 💕`,
        [{ text: 'Continuar', style: 'default' }]
      );
    }

    // Move to next profile
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      resetCard();
    }, 300);
  };

  const handlePass = () => {
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      resetCard();
    }, 300);
  };

  const resetCard = () => {
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
  };

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={80} color={Theme.colors.text.light} />
          <Text style={styles.emptyTitle}>Não há mais perfis</Text>
          <Text style={styles.emptySubtitle}>
            Tente novamente mais tarde ou ajuste suas preferências
          </Text>
          <TouchableOpacity 
            style={styles.reloadButton}
            onPress={() => setCurrentIndex(0)}
          >
            <Text style={styles.reloadButtonText}>Recarregar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.background.light, Theme.colors.background.white]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Descubra pessoas que compartilham da sua fé
          </Text>
        </View>

        {/* Card Container */}
        <View style={styles.cardContainer}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.card, animatedStyle]}>
              <Image source={{ uri: currentProfile.image }} style={styles.cardImage} />
              
              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardOverlay}
              >
                {/* Like/Pass Indicators */}
                <Animated.View style={[styles.likeIndicator, likeIndicatorStyle]}>
                  <Text style={styles.likeText}>CURTIR</Text>
                </Animated.View>
                <Animated.View style={[styles.passIndicator, passIndicatorStyle]}>
                  <Text style={styles.passText}>PASSAR</Text>
                </Animated.View>

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {currentProfile.name}, {currentProfile.age}
                  </Text>
                  
                  <View style={styles.profileDenomination}>
                    <MaterialIcons name="church" size={16} color={Theme.colors.primary.lilac} />
                    <Text style={styles.profileDenominationText}>
                      {currentProfile.denomination}
                    </Text>
                  </View>

                  <View style={styles.profileDetails}>
                    <View style={styles.profileDetailItem}>
                      <MaterialIcons name="location-on" size={16} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.profileDetailText}>
                        {currentProfile.distance} km • {currentProfile.location}
                      </Text>
                    </View>
                    <View style={styles.profileDetailItem}>
                      <MaterialIcons name="language" size={16} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.profileDetailText}>
                        {currentProfile.languages.join(', ')}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.profileVerse}>
                    "{currentProfile.verse}"
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </PanGestureHandler>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={handlePass}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={handleLike}
          >
            <MaterialIcons name="favorite" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profiles.length - currentIndex}</Text>
            <Text style={styles.statLabel}>Restantes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentIndex}</Text>
            <Text style={styles.statLabel}>Vistos</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.white,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  headerText: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.large,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: Theme.spacing.lg,
  },
  likeIndicator: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: Theme.colors.status.success,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    transform: [{ rotate: '15deg' }],
  },
  passIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: Theme.colors.status.error,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    transform: [{ rotate: '-15deg' }],
  },
  likeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: Theme.typography.fontSize.lg,
  },
  passText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: Theme.typography.fontSize.lg,
  },
  profileInfo: {
    marginBottom: Theme.spacing.lg,
  },
  profileName: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Theme.spacing.xs,
  },
  profileDenomination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  profileDenominationText: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.lilac,
    fontWeight: '600',
    marginLeft: Theme.spacing.xs,
  },
  profileDetails: {
    marginBottom: Theme.spacing.md,
  },
  profileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  profileDetailText: {
    fontSize: Theme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: Theme.spacing.xs,
  },
  profileVerse: {
    fontSize: Theme.typography.fontSize.md,
    fontStyle: 'italic',
    color: 'white',
    lineHeight: Theme.typography.lineHeight.body * Theme.typography.fontSize.md,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: Theme.borderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
  },
  passButton: {
    backgroundColor: Theme.colors.status.error,
  },
  likeButton: {
    backgroundColor: Theme.colors.primary.pink,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.primary.blue,
  },
  statLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.text.dark,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  emptySubtitle: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    lineHeight: Theme.typography.lineHeight.body * Theme.typography.fontSize.md,
    marginBottom: Theme.spacing.xl,
  },
  reloadButton: {
    backgroundColor: Theme.colors.primary.blue,
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  reloadButtonText: {
    color: 'white',
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
});