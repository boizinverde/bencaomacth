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
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';
import { useAuth } from '../../hooks/useAuth';
import { Match } from '../../types';

export default function MatchesScreen() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
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
            name: 'Ana Costa',
            email: 'ana@email.com',
            age: 28,
            denomination: 'Pentecostal',
            location: 'Rio de Janeiro, RJ',
            languages: ['Português'],
            verse: 'Posso todas as coisas em Cristo que me fortalece.',
            image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          lastMessage: {
            id: 'msg1',
            matchId: 'match1',
            senderId: 'user1',
            text: 'Olá! Como você está? Que Deus te abençoe! 😊🙏',
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
            name: 'Priscila Santos',
            email: 'priscila@email.com',
            age: 24,
            denomination: 'Assembleia de Deus',
            location: 'Belo Horizonte, MG',
            languages: ['Português', 'Inglês'],
            verse: 'O Senhor é o meu pastor, nada me faltará.',
            image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          lastMessage: {
            id: 'msg2',
            matchId: 'match2',
            senderId: user.id,
            text: 'Que bênção conhecer você! Vamos orar juntos? 🙏',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            read: true,
            type: 'text',
          },
        },
        {
          id: 'match3',
          userId1: user.id,
          userId2: 'user3',
          user1: user,
          user2: {
            id: 'user3',
            name: 'Joana Oliveira',
            email: 'joana@email.com',
            age: 30,
            denomination: 'Presbiteriana',
            location: 'Salvador, BA',
            languages: ['Português'],
            verse: 'O amor é paciente, o amor é bondoso.',
            image: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=100',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
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
            source={{ uri: otherUser.image }}
            style={styles.matchImage}
          />
          {hasUnreadMessage && <View style={styles.unreadIndicator} />}
        </View>

        <View style={styles.matchInfo}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchName}>{otherUser.name}</Text>
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
              {otherUser.age} anos • {otherUser.denomination}
            </Text>
            {item.lastMessage && (
              <View style={styles.messageStatus}>
                <MaterialIcons 
                  name={item.lastMessage.read ? 'done-all' : 'done'} 
                  size={16} 
                  color={item.lastMessage.read ? Theme.colors.status.success : Theme.colors.text.light} 
                />
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.chatButton}>
          <MaterialIcons name="chat" size={24} color={Theme.colors.primary.blue} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (matches.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={80} color={Theme.colors.text.light} />
          <Text style={styles.emptyTitle}>Nenhum match ainda</Text>
          <Text style={styles.emptySubtitle}>
            Continue curtindo perfis para encontrar pessoas que também se interessem por você!
          </Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Ir para Descobrir</Text>
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  statCard: {
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
  listContainer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  matchImageContainer: {
    position: 'relative',
    marginRight: Theme.spacing.md,
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
    backgroundColor: Theme.colors.primary.pink,
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
    marginBottom: Theme.spacing.xs,
  },
  matchName: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.text.dark,
  },
  matchTime: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.light,
  },
  matchMessage: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.sm,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchAge: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.light,
  },
  messageStatus: {
    marginLeft: Theme.spacing.sm,
  },
  chatButton: {
    marginLeft: Theme.spacing.md,
    padding: Theme.spacing.sm,
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
  actionButton: {
    backgroundColor: Theme.colors.primary.blue,
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
  },
  actionButtonText: {
    color: 'white',
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
});