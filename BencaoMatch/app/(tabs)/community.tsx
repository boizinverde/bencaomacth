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
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';
import { useAuth } from '../../hooks/useAuth';
import { CommunityPost } from '../../types';

export default function CommunityScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'text' | 'verse' | 'prayer' | 'testimony'>('all');

  const filters = [
    { key: 'all', label: 'Todos', icon: 'apps' },
    { key: 'text', label: 'Posts', icon: 'chat' },
    { key: 'verse', label: 'Versículos', icon: 'menu-book' },
    { key: 'prayer', label: 'Oração', icon: 'favorite' },
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
            name: 'Maria Silva',
            email: 'maria@email.com',
            age: 25,
            denomination: 'Batista',
            location: 'São Paulo, SP',
            languages: ['Português'],
            verse: 'O amor é paciente, o amor é bondoso.',
            image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
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
          content: 'Testemunho: Há 2 anos eu estava sem emprego e muito desanimada. Hoje, pela graça de Deus, trabalho numa empresa cristã maravilhosa e encontrei meu propósito! Deus nunca nos abandona! ✨',
          type: 'testimony',
          likes: ['user1', 'user2', 'user3', 'user5'],
          comments: [
            {
              id: 'comment2',
              userId: 'user1',
              user: {
                id: 'user1',
                name: 'Maria Silva',
                email: 'maria@email.com',
                age: 25,
                denomination: 'Batista',
                location: 'São Paulo, SP',
                languages: ['Português'],
                verse: 'O amor é paciente, o amor é bondoso.',
                image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
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
      case 'verse': return 'menu-book';
      case 'prayer': return 'favorite';
      case 'testimony': return 'star';
      default: return 'chat';
    }
  };

  const getPostColor = (type: string) => {
    switch (type) {
      case 'verse': return Theme.colors.primary.blue;
      case 'prayer': return Theme.colors.primary.pink;
      case 'testimony': return Theme.colors.primary.gold;
      default: return Theme.colors.text.dark;
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
            source={{ uri: item.user.image }}
            style={styles.userAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <View style={styles.postMeta}>
              <MaterialIcons 
                name={getPostIcon(item.type) as any} 
                size={14} 
                color={getPostColor(item.type)} 
              />
              <Text style={styles.postTime}>{formatTime(item.createdAt)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-horiz" size={20} color={Theme.colors.text.light} />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{item.content}</Text>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={[styles.actionButton, isLiked && styles.likedButton]}
          >
            <MaterialIcons 
              name={isLiked ? 'favorite' : 'favorite-border'} 
              size={20} 
              color={isLiked ? Theme.colors.primary.pink : Theme.colors.text.light} 
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {item.likes.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons 
              name="chat-bubble-outline" 
              size={20} 
              color={Theme.colors.text.light} 
            />
            <Text style={styles.actionText}>{item.comments.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons 
              name="share" 
              size={20} 
              color={Theme.colors.text.light} 
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
                  source={{ uri: comment.user.image }}
                  style={styles.commentAvatar}
                />
                <Text style={styles.commentText}>
                  <Text style={styles.commentAuthor}>{comment.user.name}</Text>
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

  if (filteredPosts.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="people" size={80} color={Theme.colors.text.light} />
          <Text style={styles.emptyTitle}>Nenhum post encontrado</Text>
          <Text style={styles.emptySubtitle}>
            Seja o primeiro a compartilhar algo com a comunidade!
          </Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Criar Post</Text>
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
              <MaterialIcons 
                name={filter.icon as any} 
                size={18} 
                color={activeFilter === filter.key ? 'white' : Theme.colors.primary.blue} 
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
  filtersContainer: {
    maxHeight: 80,
  },
  filtersContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.circle,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.ui.border,
    ...Theme.shadows.small,
  },
  activeFilterButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderColor: Theme.colors.primary.blue,
  },
  filterText: {
    marginLeft: Theme.spacing.xs,
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '500',
    color: Theme.colors.primary.blue,
  },
  activeFilterText: {
    color: 'white',
  },
  postsList: {
    paddingHorizontal: Theme.spacing.lg,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Theme.spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text.dark,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
  },
  postTime: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.light,
    marginLeft: Theme.spacing.xs,
  },
  moreButton: {
    padding: Theme.spacing.sm,
  },
  postContent: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: Theme.typography.lineHeight.body * Theme.typography.fontSize.md,
    marginBottom: Theme.spacing.lg,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
    paddingTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.sm,
  },
  likedButton: {
    // Could add background color for liked state
  },
  actionText: {
    marginLeft: Theme.spacing.xs,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.light,
    fontWeight: '500',
  },
  likedText: {
    color: Theme.colors.primary.pink,
  },
  commentsPreview: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
    paddingTop: Theme.spacing.md,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: Theme.spacing.sm,
  },
  commentText: {
    flex: 1,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
  },
  commentAuthor: {
    fontWeight: '600',
  },
  viewMoreComments: {
    paddingLeft: 36,
  },
  viewMoreText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.light,
    fontWeight: '500',
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
  actionButtonText: {
    color: 'white',
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
});