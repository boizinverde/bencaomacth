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
import { Event } from '../../types';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function EventsScreen() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'worship' | 'bible-study' | 'fellowship' | 'service'>('all');

  const filters = [
    { key: 'all', label: 'Todos', icon: 'calendar' },
    { key: 'worship', label: 'Culto', icon: 'musical-notes' },
    { key: 'bible-study', label: 'Estudo', icon: 'book' },
    { key: 'fellowship', label: 'Comunhão', icon: 'people' },
    { key: 'service', label: 'Serviço', icon: 'heart' },
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Demo events
      const demoEvents: Event[] = [
        {
          id: 'event1',
          title: 'Culto de Celebração',
          description: 'Venha celebrar conosco com muita música, palavra e comunhão. Será uma noite especial de adoração e louvor ao nosso Deus!',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          location: 'Igreja Batista Central - São Paulo, SP',
          organizer: {
            id: 'org1',
            email: 'pastor@igreja.com',
            displayName: 'Pastor João Silva',
            photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          attendees: ['user1', 'user2', 'user3'],
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300',
          type: 'worship',
          maxAttendees: 200,
        },
        {
          id: 'event2',
          title: 'Estudo Bíblico - Livro de João',
          description: 'Estudo profundo do Evangelho de João. Venha crescer na Palavra e na comunhão com os irmãos.',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          location: 'Casa da Família Santos - Rio de Janeiro, RJ',
          organizer: {
            id: 'org2',
            email: 'ana@email.com',
            displayName: 'Ana Costa',
            photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          attendees: ['user1', 'user4'],
          type: 'bible-study',
          maxAttendees: 15,
        },
        {
          id: 'event3',
          title: 'Encontro de Jovens Cristãos',
          description: 'Tarde de comunhão, jogos, lanche e muito papo sobre fé. Ideal para jovens entre 18 e 30 anos.',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          location: 'Parque Ibirapuera - São Paulo, SP',
          organizer: {
            id: 'org3',
            email: 'priscila@email.com',
            displayName: 'Priscila Santos',
            photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          attendees: ['user1', 'user2', 'user3', 'user4', 'user5'],
          imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=300',
          type: 'fellowship',
          maxAttendees: 50,
        },
        {
          id: 'event4',
          title: 'Ação Social - Distribuição de Alimentos',
          description: 'Vamos levar amor e alimento para famílias carentes. Precisamos de voluntários para organizar e distribuir cestas básicas.',
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          location: 'Centro Comunitário Vila Esperança - Salvador, BA',
          organizer: {
            id: 'org4',
            email: 'joana@email.com',
            displayName: 'Joana Oliveira',
            photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          attendees: ['user2', 'user3'],
          imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=300',
          type: 'service',
          maxAttendees: 30,
        },
      ];
      
      setEvents(demoEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Amanhã';
    if (days > 0) return `Em ${days} dias`;
    return 'Passou';
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'worship': return 'musical-notes';
      case 'bible-study': return 'book';
      case 'fellowship': return 'people';
      case 'service': return 'heart';
      default: return 'calendar';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'worship': return Colors.light.primary;
      case 'bible-study': return Colors.light.accent;
      case 'fellowship': return Colors.light.secondary;
      case 'service': return Colors.light.success;
      default: return Colors.light.text;
    }
  };

  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(event => event.type === activeFilter);

  const renderEvent = ({ item }: { item: Event }) => {
    const isAttending = item.attendees.includes(user?.id || '');
    const attendeeCount = item.attendees.length;
    const spotsLeft = item.maxAttendees ? item.maxAttendees - attendeeCount : null;

    return (
      <TouchableOpacity style={styles.eventCard}>
        {/* Event Image */}
        {item.imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageOverlay}
            />
            <View style={styles.dateChip}>
              <Text style={styles.dateChipText}>{getDaysUntil(item.date)}</Text>
            </View>
          </View>
        )}

        {/* Event Content */}
        <View style={styles.eventContent}>
          {/* Header */}
          <View style={styles.eventHeader}>
            <View style={styles.eventType}>
              <Ionicons 
                name={getEventIcon(item.type)} 
                size={16} 
                color={getEventColor(item.type)} 
              />
              <Text style={[styles.eventTypeText, { color: getEventColor(item.type) }]}>
                {filters.find(f => f.key === item.type)?.label || 'Evento'}
              </Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={20} color={Colors.light.tabIconDefault} />
            </TouchableOpacity>
          </View>

          {/* Title and Description */}
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Event Details */}
          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={16} color={Colors.light.tabIconDefault} />
              <Text style={styles.detailText}>{formatDate(item.date)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color={Colors.light.tabIconDefault} />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="person" size={16} color={Colors.light.tabIconDefault} />
              <Text style={styles.detailText}>
                Organizado por {item.organizer.displayName}
              </Text>
            </View>
          </View>

          {/* Attendees and Action */}
          <View style={styles.eventFooter}>
            <View style={styles.attendeesInfo}>
              <View style={styles.attendeesAvatars}>
                {/* Show first 3 attendee avatars */}
                {item.attendees.slice(0, 3).map((attendeeId, index) => (
                  <Image
                    key={attendeeId}
                    source={{ uri: 'https://via.placeholder.com/24' }}
                    style={[styles.attendeeAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
                  />
                ))}
                {attendeeCount > 3 && (
                  <View style={[styles.attendeeAvatar, styles.moreAttendeesAvatar]}>
                    <Text style={styles.moreAttendeesText}>+{attendeeCount - 3}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.attendeesText}>
                <Text style={styles.attendeesCount}>
                  {attendeeCount} confirmado{attendeeCount !== 1 ? 's' : ''}
                </Text>
                {spotsLeft !== null && spotsLeft > 0 && (
                  <Text style={styles.spotsLeft}>
                    {spotsLeft} vaga{spotsLeft !== 1 ? 's' : ''} restante{spotsLeft !== 1 ? 's' : ''}
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.attendButton,
                isAttending && styles.attendingButton
              ]}
            >
              <Ionicons 
                name={isAttending ? 'checkmark' : 'add'} 
                size={18} 
                color={isAttending ? Colors.light.success : 'white'} 
              />
              <Text style={[
                styles.attendButtonText,
                isAttending && styles.attendingButtonText
              ]}>
                {isAttending ? 'Confirmado' : 'Participar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner text="Carregando eventos..." />
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

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <EmptyState
            title="Nenhum evento encontrado"
            subtitle="Seja o primeiro a criar um evento para a comunidade!"
            icon="calendar-outline"
            actionText="Criar Evento"
            onAction={() => {/* Navigate to create event */}}
          />
        ) : (
          <FlatList
            data={filteredEvents}
            renderItem={renderEvent}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.eventsList}
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
  eventsList: {
    paddingHorizontal: Spacing.lg,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dateChip: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dateChipText: {
    color: 'white',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  eventContent: {
    padding: Spacing.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  eventType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTypeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    marginLeft: Spacing.xs,
  },
  favoriteButton: {
    padding: Spacing.xs,
  },
  eventTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  eventDescription: {
    fontSize: Typography.sizes.md,
    color: Colors.light.text,
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  eventDetails: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.md,
  },
  attendeesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attendeesAvatars: {
    flexDirection: 'row',
    marginRight: Spacing.md,
  },
  attendeeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  moreAttendeesAvatar: {
    backgroundColor: Colors.light.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreAttendeesText: {
    fontSize: Typography.sizes.xs,
    color: Colors.light.text,
    fontWeight: Typography.weights.bold,
  },
  attendeesText: {
    flex: 1,
  },
  attendeesCount: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.text,
    fontWeight: Typography.weights.medium,
  },
  spotsLeft: {
    fontSize: Typography.sizes.xs,
    color: Colors.light.text,
    opacity: 0.6,
  },
  attendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  attendingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.success,
  },
  attendButtonText: {
    color: 'white',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    marginLeft: Spacing.xs,
  },
  attendingButtonText: {
    color: Colors.light.success,
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