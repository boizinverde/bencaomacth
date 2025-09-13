import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';
import { useAuth } from '../../hooks/useAuth';
import { Match, Message } from '../../types';

export default function ChatScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Demo conversations
      const demoConversations: Match[] = [
        {
          id: 'match1',
          userId1: user.id,
          userId2: 'user1',
          user1: user,
          user2: {
            id: 'user1',
            name: 'Maria Silva',
            email: 'maria@email.com',
            age: 25,
            denomination: 'Batista',
            location: 'São Paulo, SP',
            languages: ['Português'],
            verse: 'O amor é paciente, o amor é bondoso.',
            image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
            createdAt: new Date(),
            lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          lastMessage: {
            id: 'msg1',
            matchId: 'match1',
            senderId: 'user1',
            text: 'Amém! Que Deus abençoe nosso dia hoje 🙏 Como você está?',
            timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
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
            name: 'Ana Costa',
            email: 'ana@email.com',
            age: 28,
            denomination: 'Pentecostal',
            location: 'Rio de Janeiro, RJ',
            languages: ['Português'],
            verse: 'Posso todas as coisas em Cristo que me fortalece.',
            image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
            createdAt: new Date(),
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          lastMessage: {
            id: 'msg2',
            matchId: 'match2',
            senderId: user.id,
            text: 'Que lindo testemunho! Deus é fiel mesmo 💕',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
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
            name: 'Priscila Santos',
            email: 'priscila@email.com',
            age: 24,
            denomination: 'Assembleia de Deus',
            location: 'Belo Horizonte, MG',
            languages: ['Português', 'Inglês'],
            verse: 'O Senhor é o meu pastor, nada me faltará.',
            image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
            createdAt: new Date(),
            lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          },
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          lastMessage: {
            id: 'msg3',
            matchId: 'match3',
            senderId: 'user3',
            text: 'Oi! Qual é o seu versículo favorito da Bíblia?',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            read: false,
            type: 'text',
          },
        },
      ];
      
      setConversations(demoConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = diff / (1000 * 60);
    const hours = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${Math.floor(minutes)}min`;
    if (hours < 24) return `${Math.floor(hours)}h`;
    if (days < 7) return `${Math.floor(days)}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getOnlineStatus = (lastActive: Date) => {
    const diff = new Date().getTime() - lastActive.getTime();
    const minutes = diff / (1000 * 60);
    return minutes < 5; // Online if last active within 5 minutes
  };

  const getOtherUser = (match: Match) => {
    return match.userId1 === user?.id ? match.user2 : match.user1;
  };

  const filteredConversations = conversations.filter(conversation => {
    const otherUser = getOtherUser(conversation);
    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderConversation = ({ item }: { item: Match }) => {
    const otherUser = getOtherUser(item);
    const hasUnreadMessage = item.lastMessage && !item.lastMessage.read && item.lastMessage.senderId !== user?.id;
    const isOnline = getOnlineStatus(otherUser.lastActive || new Date());

    return (
      <TouchableOpacity style={styles.conversationCard}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: otherUser.image }}
            style={styles.avatar}
          />
          {isOnline && <View style={styles.onlineIndicator} />}
          {hasUnreadMessage && <View style={styles.unreadBadge} />}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.userName, hasUnreadMessage && styles.unreadText]}>
              {otherUser.name}
            </Text>
            <Text style={styles.timestamp}>
              {item.lastMessage ? formatTime(item.lastMessage.timestamp) : formatTime(item.createdAt)}
            </Text>
          </View>

          <View style={styles.messagePreview}>
            <Text 
              style={[styles.lastMessage, hasUnreadMessage && styles.unreadText]} 
              numberOfLines={1}
            >
              {item.lastMessage?.senderId === user?.id && 'Você: '}
              {item.lastMessage?.text || 'Vocês deram match! Diga olá 👋'}
            </Text>
            
            {item.lastMessage?.type === 'verse' && (
              <MaterialIcons name="menu-book" size={16} color={Theme.colors.primary.blue} style={styles.messageIcon} />
            )}
            {item.lastMessage?.type === 'prayer' && (
              <MaterialIcons name="favorite" size={16} color={Theme.colors.primary.pink} style={styles.messageIcon} />
            )}
          </View>
        </View>

        <View style={styles.conversationActions}>
          {hasUnreadMessage && (
            <View style={styles.unreadCount}>
              <Text style={styles.unreadCountText}>1</Text>
            </View>
          )}
          
          {item.lastMessage?.senderId === user?.id && (
            <MaterialIcons 
              name={item.lastMessage.read ? 'done-all' : 'done'} 
              size={16} 
              color={item.lastMessage.read ? Theme.colors.status.success : Theme.colors.text.light} 
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (filteredConversations.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="chat" size={80} color={Theme.colors.text.light} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? "Tente buscar por outro nome" : "Comece fazendo matches e inicie conversas!"}
          </Text>
          {!searchQuery && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Ir para Descobrir</Text>
            </TouchableOpacity>
          )}
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
        {/* Search Header */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={20} color={Theme.colors.text.light} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Theme.colors.text.light}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={20} color={Theme.colors.text.light} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <MaterialIcons name="people" size={24} color={Theme.colors.primary.blue} />
            <Text style={styles.quickActionText}>Grupos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <MaterialIcons name="favorite" size={24} color={Theme.colors.primary.pink} />
            <Text style={styles.quickActionText}>Oração</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <MaterialIcons name="menu-book" size={24} color={Theme.colors.primary.gold} />
            <Text style={styles.quickActionText}>Versículos</Text>
          </TouchableOpacity>
        </View>

        {/* Conversations List */}
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conversationsList}
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
  searchContainer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    minWidth: 80,
    ...Theme.shadows.small,
  },
  quickActionText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginTop: Theme.spacing.xs,
    fontWeight: '500',
  },
  conversationsList: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Theme.spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Theme.colors.status.success,
    borderWidth: 2,
    borderColor: 'white',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary.pink,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  userName: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '500',
    color: Theme.colors.text.dark,
  },
  unreadText: {
    fontWeight: '600',
    color: Theme.colors.text.dark,
  },
  timestamp: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.light,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
  },
  messageIcon: {
    marginLeft: Theme.spacing.sm,
  },
  conversationActions: {
    alignItems: 'center',
    marginLeft: Theme.spacing.sm,
  },
  unreadCount: {
    backgroundColor: Theme.colors.primary.pink,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  unreadCountText: {
    color: 'white',
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: 'bold',
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