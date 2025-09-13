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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { Match, Message } from '../../types';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ChatScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
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
            email: 'maria@email.com',
            displayName: 'Maria Silva',
            age: 25,
            photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=400',
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
            email: 'ana@email.com',
            displayName: 'Ana Costa',
            age: 28,
            photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
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
            email: 'priscila@email.com',
            displayName: 'Priscila Santos',
            age: 24,
            photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
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
    return otherUser.displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderConversation = ({ item }: { item: Match }) => {
    const otherUser = getOtherUser(item);
    const hasUnreadMessage = item.lastMessage && !item.lastMessage.read && item.lastMessage.senderId !== user?.id;
    const isOnline = getOnlineStatus(otherUser.lastActive || new Date());

    return (
      <TouchableOpacity style={styles.conversationCard}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: otherUser.photoURL || 'https://via.placeholder.com/60' }}
            style={styles.avatar}
          />
          {isOnline && <View style={styles.onlineIndicator} />}
          {hasUnreadMessage && <View style={styles.unreadBadge} />}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.userName, hasUnreadMessage && styles.unreadText]}>
              {otherUser.displayName}
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
              <Ionicons name="book" size={16} color={Colors.light.primary} style={styles.messageIcon} />
            )}
            {item.lastMessage?.type === 'prayer' && (
              <Ionicons name="heart" size={16} color={Colors.light.secondary} style={styles.messageIcon} />
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
            <Ionicons 
              name={item.lastMessage.read ? 'checkmark-done' : 'checkmark'} 
              size={16} 
              color={item.lastMessage.read ? Colors.light.success : Colors.light.tabIconDefault} 
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Carregando conversas..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#FFFFFF']}
        style={styles.gradient}
      >
        {/* Search Header */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={Colors.light.tabIconDefault} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.light.tabIconDefault}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={Colors.light.tabIconDefault} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="people" size={24} color={Colors.light.primary} />
            <Text style={styles.quickActionText}>Grupos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="heart" size={24} color={Colors.light.secondary} />
            <Text style={styles.quickActionText}>Oração</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="book" size={24} color={Colors.light.accent} />
            <Text style={styles.quickActionText}>Versículos</Text>
          </TouchableOpacity>
        </View>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <EmptyState
            title={searchQuery ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
            subtitle={searchQuery ? "Tente buscar por outro nome" : "Comece fazendo matches e inicie conversas!"}
            icon="chatbubbles-outline"
            actionText={!searchQuery ? "Ir para Descobrir" : undefined}
            onAction={!searchQuery ? () => {/* Navigate to discover */} : undefined}
          />
        ) : (
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
        )}

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.sizes.md,
    color: Colors.light.text,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    marginTop: Spacing.xs,
    fontWeight: Typography.weights.medium,
  },
  conversationsList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
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
    backgroundColor: Colors.light.success,
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
    backgroundColor: Colors.light.secondary,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: Colors.light.text,
  },
  unreadText: {
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.6,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: Typography.sizes.md,
    color: Colors.light.text,
    opacity: 0.7,
  },
  messageIcon: {
    marginLeft: Spacing.sm,
  },
  conversationActions: {
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  unreadCount: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  unreadCountText: {
    color: 'white',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});