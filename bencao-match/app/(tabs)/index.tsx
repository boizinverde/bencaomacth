import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { getPotentialMatches, recordSwipe, checkForMatch } from '../../services/userService';
import { User, SwipeAction } from '../../types';
import SwipeCard from '../../components/matching/SwipeCard';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  const loadPotentialMatches = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const matches = await getPotentialMatches(user.id);
      setPotentialMatches(matches);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading potential matches:', error);
      Alert.alert('Erro', 'Não foi possível carregar os perfis');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!user || currentIndex >= potentialMatches.length) return;

    const currentUser = potentialMatches[currentIndex];
    const action = direction === 'right' ? 'like' : 'pass';

    try {
      // Registrar o swipe
      const swipeAction: SwipeAction = {
        userId: user.id,
        targetUserId: currentUser.id,
        action,
        timestamp: new Date(),
      };
      
      await recordSwipe(swipeAction);

      // Se foi like, verificar se houve match
      if (action === 'like') {
        const isMatch = await checkForMatch(user.id, currentUser.id);
        if (isMatch) {
          Alert.alert(
            '🎉 É um Match!',
            `Você e ${currentUser.displayName} deram match! Que a bênção de Deus seja sobre vocês!`,
            [
              {
                text: 'Continuar',
                style: 'default',
              },
            ]
          );
        }
      }

      // Avançar para o próximo perfil
      setCurrentIndex(prev => prev + 1);

    } catch (error) {
      console.error('Error handling swipe:', error);
      Alert.alert('Erro', 'Não foi possível processar a ação');
    }
  };

  const currentUser = potentialMatches[currentIndex];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="Nenhum perfil encontrado"
          subtitle="Não há mais perfis para mostrar no momento. Tente novamente mais tarde!"
          actionText="Recarregar"
          onAction={loadPotentialMatches}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F3F4F6', '#FFFFFF']}
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
          <SwipeCard
            user={currentUser}
            onSwipeLeft={() => handleSwipe('left')}
            onSwipeRight={() => handleSwipe('right')}
          />
          
          {/* Preview of next card */}
          {potentialMatches[currentIndex + 1] && (
            <View style={styles.nextCardPreview}>
              <SwipeCard
                user={potentialMatches[currentIndex + 1]}
                onSwipeLeft={() => {}}
                onSwipeRight={() => {}}
                isPreview
              />
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{potentialMatches.length - currentIndex}</Text>
            <Text style={styles.statLabel}>Perfis restantes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentIndex}</Text>
            <Text style={styles.statLabel}>Perfis vistos</Text>
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quote}>
          <Text style={styles.quoteText}>
            "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho."
          </Text>
          <Text style={styles.quoteReference}>Eclesiastes 4:9</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  headerText: {
    fontSize: Typography.sizes.md,
    color: Colors.light.text,
    textAlign: 'center',
    opacity: 0.7,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    position: 'relative',
  },
  nextCardPreview: {
    position: 'absolute',
    top: 10,
    left: Spacing.lg + 10,
    right: Spacing.lg + 10,
    bottom: 10,
    opacity: 0.3,
    transform: [{ scale: 0.95 }],
    zIndex: -1,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.7,
    marginTop: Spacing.xs,
  },
  quote: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: Typography.sizes.md,
    fontStyle: 'italic',
    textAlign: 'center',
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },
  quoteReference: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.6,
    fontWeight: Typography.weights.medium,
  },
});