import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/Colors';
import { User } from '../../types';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.65;

interface SwipeCardProps {
  user: User;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isPreview?: boolean;
}

export default function SwipeCard({ user, onSwipeLeft, onSwipeRight, isPreview = false }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(0.95);
    },
    onActive: (event) => {
      if (!isPreview) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      }
    },
    onEnd: (event) => {
      scale.value = withSpring(1);
      
      if (isPreview) return;

      const threshold = width * 0.3;
      
      if (Math.abs(event.translationX) > threshold) {
        // Swipe detected
        translateX.value = withSpring(event.translationX > 0 ? width : -width);
        translateY.value = withSpring(event.translationY);
        
        if (event.translationX > 0) {
          runOnJS(onSwipeRight)();
        } else {
          runOnJS(onSwipeLeft)();
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

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, width * 0.3],
      [0, 1]
    ),
  }));

  const passOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-width * 0.3, 0],
      [1, 0]
    ),
  }));

  const calculateAge = (birthDate?: Date) => {
    if (!birthDate) return user.age || 25;
    const today = new Date();
    return today.getFullYear() - birthDate.getFullYear();
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} enabled={!isPreview}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.card}>
          {/* User Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: user.photoURL || 'https://via.placeholder.com/300' }}
              style={styles.image}
            />
            
            {/* Gradient Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.imageOverlay}
            />

            {/* Like/Pass Indicators */}
            {!isPreview && (
              <>
                <Animated.View style={[styles.likeIndicator, likeOpacity]}>
                  <Text style={styles.likeText}>CURTIR</Text>
                </Animated.View>
                <Animated.View style={[styles.passIndicator, passOpacity]}>
                  <Text style={styles.passText}>PASSAR</Text>
                </Animated.View>
              </>
            )}

            {/* Basic Info Overlay */}
            <View style={styles.basicInfo}>
              <Text style={styles.name}>
                {user.displayName}, {calculateAge()}
              </Text>
              {user.location && (
                <Text style={styles.location}>
                  📍 {user.location.city}, {user.location.state}
                </Text>
              )}
            </View>
          </View>

          {/* Details Section */}
          <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
            {/* Bio */}
            {user.bio && (
              <View style={styles.section}>
                <Text style={styles.bio}>{user.bio}</Text>
              </View>
            )}

            {/* Faith Info */}
            <View style={styles.section}>
              <View style={styles.infoRow}>
                <Ionicons name="heart" size={20} color={Colors.light.primary} />
                <Text style={styles.infoText}>
                  {user.denomination || 'Cristão'}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="search" size={20} color={Colors.light.secondary} />
                <Text style={styles.infoText}>
                  Busca: {user.lookingFor === 'dating' ? 'Relacionamento' : 
                          user.lookingFor === 'marriage' ? 'Casamento' : 'Amizade'}
                </Text>
              </View>
            </View>

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interesses</Text>
                <View style={styles.interests}>
                  {user.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons (only for main card) */}
          {!isPreview && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.passButton]}
                onPress={onSwipeLeft}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.likeButton]}
                onPress={onSwipeRight}
              >
                <Ionicons name="heart" size={30} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    height: CARD_HEIGHT * 0.6,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  likeIndicator: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: Colors.light.success,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    transform: [{ rotate: '15deg' }],
  },
  passIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: Colors.light.error,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    transform: [{ rotate: '-15deg' }],
  },
  likeText: {
    color: 'white',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.lg,
  },
  passText: {
    color: 'white',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.lg,
  },
  basicInfo: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  name: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: 'white',
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: Typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  detailsContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  bio: {
    fontSize: Typography.sizes.md,
    color: Colors.light.text,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.sizes.md,
    color: Colors.light.text,
    marginLeft: Spacing.sm,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  interestTag: {
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  interestText: {
    fontSize: Typography.sizes.sm,
    color: Colors.light.primary,
    fontWeight: Typography.weights.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  passButton: {
    backgroundColor: Colors.light.error,
  },
  likeButton: {
    backgroundColor: Colors.light.success,
  },
});