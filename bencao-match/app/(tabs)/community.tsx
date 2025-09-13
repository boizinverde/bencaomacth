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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { CommunityPost } from '../../types';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CommunityScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'text' | 'verse' | 'prayer' | 'testimony'>('all');

  const filters = [
    { key: 'all', label: 'Todos', icon: 'apps' },
    { key: 'text', label: 'Posts', icon: 'chatbubble' },
    { key: 'verse', label: 'Versículos', icon: 'book' },
    { key: 'prayer', label: 'Oração', icon: 'heart' },
    { key: 'testimony', label: 'Testemunho', icon: 'star' },
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Demo posts
      const demoPosts: CommunityPost[] = [
        {
          id: 'post1',
          userId: 'user1',
          user: {
            id: 'user1',
            email: 'maria@email.com',
            displayName: 'Maria Silva',
            photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          content: '"Porque para Deus nada é impossível." - Lucas 1:37\n\nEssa palavra tem me fortalecido todos os dias. Mesmo nas dificuldades, Deus é fiel! 🙏',
          type: 'verse',
          likes: ['user2', 'user3', 'user4'],
          comments: [
            {
              id: 'comment1',
              userId: 'user2',
              user: {
                id: 'user2',
                email: 'ana@email.com',
                displayName: 'Ana Costa',
                photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                createdAt: new Date(),
                lastActive: new Date(),
              },
              text: 'Amém, irmã! Deus é maravilhoso! 💕',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            }
          ],
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
        {
          id: 'post2',
          userId: 'user3',
          user: {
            id: 'user3',
            email: 'priscila@email.com',
            displayName: 'Priscila Santos',
            photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          content: 'Oração pelos nossos irmãos que estão passando por dificuldades financeiras. Que Deus os abençoe e proveja todas as suas necessidades. Em nome de Jesus, amém! 🙏💙',
          type: 'prayer',
          likes: ['user1', 'user4', 'user5'],
          comments: [],
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        },
        {
          id: 'post3',
          userId: 'user4',
          user: {
            id: 'user4',
            email: 'joana@email.com',
            displayName: 'Joana Oliveira',
            photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          content: 'Testemunho: Há 2 anos eu estava sem emprego e muito desanimada. Hoje, pela graça de Deus, trabalho numa empresa cristã maravilhosa e encontrei meu propósito! Deus nunca nos abandona! ✨',
          type: 'testimony',
          likes: ['user1', 'user2', 'user3', 'user5'],
          comments: [
            {
              id: 'comment2',
              userId: 'user1',
              user: {
                id: 'user1',
                email: 'maria@email.com',
                displayName: 'Maria Silva',
                photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=400',
                createdAt: new Date(),
                lastActive: new Date(),
              },
              text: 'Que testemunho lindo! Glória a Deus! 🙌',
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            },
            {
              id: 'comment3',
              userId: 'user2',
              user: {
                id: 'user2',
                email: 'ana@email.com',
                displayName: 'Ana Costa',
                photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                createdAt: new Date(),
                lastActive: new Date(),
              },
              text: 'Deus é fiel sempre! Aleluia! 🎉',
              createdAt: new Date(Date.now() - 30 * 60 * 1000),
            }
          ],
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
      ];
      
      setPosts(demoPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);

    if (hours < 1) return 'Agora há pouco';
    if (hours < 24) return `${Math.floor(hours)}h`;
    if (days < 7) return `${Math.floor(days)}d`;
    return date.toLocaleDateString('pt-BR');
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'verse': return 'book';
      case 'prayer': return 'heart';
      case 'testimony': return 'star';
      default: return 'chatbubble';
    }
  };

  const getPostColor = (type: string) => {
    switch (type) {
      case 'verse': return Colors.light.primary;
      case 'prayer': return Colors.light.secondary;
      case 'testimony': return Colors.light.accent;
      default: return Colors.light.text;
    }
  };

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.type === activeFilter);

  const renderPost = ({ item }: { item: CommunityPost }) => {
    const isLiked = item.likes.includes(user?.id || '');

    return (
      <View style={styles.postCard}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <Image
            source={{ uri: item.user.photoURL || 'https://via.placeholder.com/40' }}
            style={styles.userAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user.displayName}</Text>
            <View style={styles.postMeta}>
              <Ionicons 
                name={getPostIcon(item.type)} 
                size={14} 
                color={getPostColor(item.type)} 
              />
              <Text style={styles.postTime}>{formatTime(item.createdAt)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={Colors.light.tabIconDefault} />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{item.content}</Text>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={[styles.actionButton, isLiked && styles.likedButton]}
          >
            <Ionicons 
              name={isLiked ? 'heart' : 'heart-outline'} 
              size={20} 
              color={isLiked ? Colors.light.secondary : Colors.light.tabIconDefault} 
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {item.likes.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons 
              name="chatbubble-outline" 
              size={20} 
              color={Colors.light.tabIconDefault} 
            />
            <Text style={styles.actionText}>{item.comments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons 
              name="share-outline" 
              size={20} 
              color={Colors.light.tabIconDefault} 
            />
            <Text style={styles.actionText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Preview */}
        {item.comments.length > 0 && (
          <View style={styles.commentsPreview}>
            {item.comments.slice(0, 2).map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Image
                  source={{ uri: comment.user.photoURL || 'https://via.placeholder.com/24' }}
                  style={styles.commentAvatar}
                />
                <Text style={styles.commentText}>
                  <Text style={styles.commentAuthor}>{comment.user.displayName}</Text>
                  {' '}{comment.text}
                </Text>
              </View>
            ))}
            {item.comments.length > 2 && (
              <TouchableOpacity style={styles.viewMoreComments}>
                <Text style={styles.viewMoreText}>
                  Ver todos os {item.comments.length} comentários
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Carregando comunidade..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#FFFFFF']}
        style={styles.gradient}
      >
        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter.key}
              style={[
                styles.filterButton, 
                activeFilter === filter.key && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter(filter.key as any)}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={18} 
                color={activeFilter === filter.key ? 'white' : Colors.light.primary} 
              />
              <Text style={[
                styles.filterText,
                activeFilter === filter.key && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <EmptyState
            title="Nenhum post encontrado"
            subtitle="Seja o primeiro a compartilhar algo com a comunidade!"
            icon="people-outline"
            actionText="Criar Post"
            onAction={() => {/* Navigate to create post */}}
          />
        ) : (
          <FlatList
            data={filteredPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.postsList}
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
  filtersContainer: {
    maxHeight: 80,
  },
  filtersContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  activeFilterButton: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.light.primary,
  },
  activeFilterText: {
    color: 'white',
  },
  postsList: {
    paddingHorizontal: Spacing.lg,
  },
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  postTime: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    opacity: 0.6,
    marginLeft: Spacing.xs,
  },
  moreButton: {
    padding: Spacing.sm,
  },
  postContent: {
    fontSize: Typography.sizes.md,
    color: Colors.light.text,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  likedButton: {
    // Could add background color for liked state
  },
  actionText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.sizes.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: Typography.weights.medium,
  },
  likedText: {
    color: Colors.light.secondary,
  },
  commentsPreview: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.md,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: Spacing.sm,
  },
  commentText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    lineHeight: 18,
  },
  commentAuthor: {
    fontWeight: Typography.weights.semibold,
  },
  viewMoreComments: {
    paddingLeft: 36,
  },
  viewMoreText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: Typography.weights.medium,
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