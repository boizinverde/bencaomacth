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
import { Event } from '../../types';

export default function EventsScreen() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'worship' | 'bible-study' | 'fellowship' | 'service'>('all');

  const filters = [
    { key: 'all', label: 'Todos', icon: 'event' },
    { key: 'worship', label: 'Culto', icon: 'music-note' },
    { key: 'bible-study', label: 'Estudo', icon: 'menu-book' },
    { key: 'fellowship', label: 'Comunhão', icon: 'people' },
    { key: 'service', label: 'Serviço', icon: 'volunteer-activism' },
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
            name: 'Pastor João Silva',
            email: 'pastor@igreja.com',
            age: 45,
            denomination: 'Batista',
            location: 'São Paulo, SP',
            languages: ['Português'],
            verse: 'Porque onde estão dois ou três reunidos em meu nome, aí estou eu no meio deles.',
            image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          attendees: ['user1', 'user2', 'user3'],
          imageUrl: 'https://images.pexels.com/photos/159844/bible-book-reading-read-159844.jpeg?auto=compress&cs=tinysrgb&w=600&h=300',
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
            name: 'Ana Costa',
            email: 'ana@email.com',
            age: 28,
            denomination: 'Pentecostal',
            location: 'Rio de Janeiro, RJ',
            languages: ['Português'],
            verse: 'Posso todas as coisas em Cristo que me fortalece.',
            image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
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
            name: 'Priscila Santos',
            email: 'priscila@email.com',
            age: 24,
            denomination: 'Assembleia de Deus',
            location: 'Belo Horizonte, MG',
            languages: ['Português', 'Inglês'],
            verse: 'O Senhor é o meu pastor, nada me faltará.',
            image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          attendees: ['user1', 'user2', 'user3', 'user4', 'user5'],
          imageUrl: 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=600&h=300',
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
            name: 'Joana Oliveira',
            email: 'joana@email.com',
            age: 30,
            denomination: 'Presbiteriana',
            location: 'Salvador, BA',
            languages: ['Português'],
            verse: 'O amor é paciente, o amor é bondoso.',
            image: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=400',
            createdAt: new Date(),
            lastActive: new Date(),
          },
          attendees: ['user2', 'user3'],
          imageUrl: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600&h=300',
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
      case 'worship': return 'music-note';
      case 'bible-study': return 'menu-book';
      case 'fellowship': return 'people';
      case 'service': return 'volunteer-activism';
      default: return 'event';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'worship': return Theme.colors.primary.blue;
      case 'bible-study': return Theme.colors.primary.gold;
      case 'fellowship': return Theme.colors.primary.pink;
      case 'service': return Theme.colors.status.success;
      default: return Theme.colors.text.dark;
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
              <MaterialIcons 
                name={getEventIcon(item.type) as any} 
                size={16} 
                color={getEventColor(item.type)} 
              />
              <Text style={[styles.eventTypeText, { color: getEventColor(item.type) }]}>
                {filters.find(f => f.key === item.type)?.label || 'Evento'}
              </Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <MaterialIcons name="favorite-border" size={20} color={Theme.colors.text.light} />
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
              <MaterialIcons name="schedule" size={16} color={Theme.colors.text.light} />
              <Text style={styles.detailText}>{formatDate(item.date)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={16} color={Theme.colors.text.light} />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={16} color={Theme.colors.text.light} />
              <Text style={styles.detailText}>
                Organizado por {item.organizer.name}
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
              <MaterialIcons 
                name={isAttending ? 'check' : 'add'} 
                size={18} 
                color={isAttending ? Theme.colors.status.success : 'white'} 
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

  if (filteredEvents.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="event" size={80} color={Theme.colors.text.light} />
          <Text style={styles.emptyTitle}>Nenhum evento encontrado</Text>
          <Text style={styles.emptySubtitle}>
            Seja o primeiro a criar um evento para a comunidade!
          </Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Criar Evento</Text>
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

        {/* Events List */}
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
  eventsList: {
    paddingHorizontal: Theme.spacing.lg,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
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
    top: Theme.spacing.md,
    right: Theme.spacing.md,
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  dateChipText: {
    color: 'white',
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  eventContent: {
    padding: Theme.spacing.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  eventType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTypeText: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '500',
    marginLeft: Theme.spacing.xs,
  },
  favoriteButton: {
    padding: Theme.spacing.xs,
  },
  eventTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  eventDescription: {
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    lineHeight: Theme.typography.lineHeight.body * Theme.typography.fontSize.md,
    marginBottom: Theme.spacing.lg,
  },
  eventDetails: {
    marginBottom: Theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  detailText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
    paddingTop: Theme.spacing.md,
  },
  attendeesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attendeesAvatars: {
    flexDirection: 'row',
    marginRight: Theme.spacing.md,
  },
  attendeeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  moreAttendeesAvatar: {
    backgroundColor: Theme.colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreAttendeesText: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.dark,
    fontWeight: 'bold',
  },
  attendeesText: {
    flex: 1,
  },
  attendeesCount: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    fontWeight: '500',
  },
  spotsLeft: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.light,
  },
  attendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
  },
  attendingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.status.success,
  },
  attendButtonText: {
    color: 'white',
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600',
    marginLeft: Theme.spacing.xs,
  },
  attendingButtonText: {
    color: Theme.colors.status.success,
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