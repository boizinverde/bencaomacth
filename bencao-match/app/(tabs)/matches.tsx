import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { Match } from '../../types';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function MatchesScreen() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Demo matches
      const demoMatches: Match[] = [
        {
          id: 'match1',
          userId1: user.id,
          userId2: 'user1',
          user1: user,
          user2: {
            id: 'user1',
            email: 'maria@email.com',
            displayName: 'Maria Silva',
            age: 25,
            bio: 'Amo a Deus e busco alguém que compartilhe da mesma fé.',
            photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          lastMessage: {
            id: 'msg1',
            matchId: 'match1',
            senderId: 'user1',
            text: 'Olá! Como você está? 😊',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            read: false,
            type: 'text',
          },
        },
        {
          id: 'match2',
          userId1: user.id,
          userId2: 'user2',
          user1: user,
          user2: {
            id: 'user2',
            email: 'ana@email.com',
            displayName: 'Ana Costa',
            age: 28,
            bio: 'Cristã apaixonada por servir a Deus.',
            photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
        {
          id: 'match3',
          userId1: user.id,
          userId2: 'user3',
          user1: user,
          user2: {
            id: 'user3',
            email: 'priscila@email.com',
            displayName: 'Priscila Santos',
            age: 24,
            bio: 'Busco um relacionamento sério baseado nos princípios cristãos.',
            photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          lastMessage: {
            id: 'msg2',
            matchId: 'match3',
            senderId: user.id,
            text: 'Que bênção conhecer você! 🙏',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            read: true,
            type: 'text',
          },
        },
      ];
      
      setMatches(demoMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);

    if (hours < 1) return 'Agora há pouco';
    if (hours < 24) return `${Math.floor(hours)}h`;
    if (days < 7) return `${Math.floor(days)}d`;
    return date.toLocaleDateString('pt-BR');
  };

  const getOtherUser = (match: Match) => {
    return match.userId1 === user?.id ? match.user2 : match.user1;
  };

  const renderMatch = ({ item }: { item: Match }) => {
    const otherUser = getOtherUser(item);
    const hasUnreadMessage = item.lastMessage && !item.lastMessage.read && item.lastMessage.senderId !== user?.id;

    return (
      <TouchableOpacity style={styles.matchCard}>
        <View style={styles.matchImageContainer}>
          <Image
            source={{ uri: otherUser.photoURL || 'https://via.placeholder.com/60' }}
            style={styles.matchImage}
          />
          {hasUnreadMessage && <View style={styles.unreadIndicator} />}
        </View>

        <View style={styles.matchInfo}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchName}>{otherUser.displayName}</Text>
            <Text style={styles.matchTime}>
              {item.lastMessage 
                ? formatLastSeen(item.lastMessage.timestamp)
                : formatLastSeen(item.createdAt)
              }
            </Text>
          </View>

          <Text style={styles.matchMessage} numberOfLines={2}>
            {item.lastMessage?.text || 'Vocês deram match! Inicie uma conversa 💬'}
          </Text>

          <View style={styles.matchFooter}>
            <Text style={styles.matchAge}>
              {otherUser.age} anos
            </Text>
            {item.lastMessage && (
              <View style={styles.messageStatus}>
                <Ionicons 
                  name={item.lastMessage.read ? 'checkmark-done' : 'checkmark'} 
                  size={16} 
                  color={item.lastMessage.read ? Colors.light.success : Colors.light.tabIconDefault} 
                />
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.chatButton}>
          <Ionicons name="chatbubble" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Carregando seus matches..." />
      </SafeAreaView>
    );
  }

  if (matches.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="Nenhum match ainda"
          subtitle="Continue curtindo perfis para encontrar pessoas que também se interessem por você!"
          icon="heart-outline"
          actionText="Ir para Descobrir"
          onAction={() => {/* Navigate to discover */}}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#FFFFFF']}
        style={styles.gradient}
      >
        {/* Header Stats */}
        <View style={styles.header}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{matches.length}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {matches.filter(m => m.lastMessage && !m.lastMessage.read && m.lastMessage.senderId !== user?.id).length}
              </Text>
              <Text style={styles.statLabel}>Não lidas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {matches.filter(m => {
                  const lastMessage = m.lastMessage;
                  return lastMessage && (new Date().getTime() - lastMessage.timestamp.getTime()) < 24 * 60 * 60 * 1000;
                }).length}
              </Text>
              <Text style={styles.statLabel}>Hoje</Text>
            </View>
          </View>
        </View>

        {/* Matches List */}
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Motivational Quote */}
        <View style={styles.quote}>
          <Text style={styles.quoteText}>
            "O amor é paciente, o amor é bondoso."
          </Text>
          <Text style={styles.quoteReference}>1 Coríntios 13:4</Text>
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
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
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchImageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.secondary,
    borderWidth: 2,
    borderColor: 'white',
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  matchName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
  },
  matchTime: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.6,
  },
  matchMessage: {
    fontSize: Typography.sizes.md,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: Spacing.sm,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchAge: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.6,
  },
  messageStatus: {
    marginLeft: Spacing.sm,
  },
  chatButton: {
    marginLeft: Spacing.md,
    padding: Spacing.sm,
  },
  quote: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
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