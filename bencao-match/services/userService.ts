import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';
import { User, SwipeAction } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Para demo, vamos usar AsyncStorage. Em produção, usar Firestore
const USERS_COLLECTION = 'users';
const SWIPES_COLLECTION = 'swipes';

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    // Demo: buscar do AsyncStorage
    const storedUser = await AsyncStorage.getItem('demo-user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    // Em produção:
    // const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    // return userDoc.exists() ? userDoc.data() as User : null;
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const createUserProfile = async (user: User): Promise<void> => {
  try {
    // Demo: salvar no AsyncStorage
    await AsyncStorage.setItem('demo-user', JSON.stringify(user));
    
    // Em produção:
    // await setDoc(doc(db, USERS_COLLECTION, user.id), user);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    // Demo: atualizar AsyncStorage
    const storedUser = await AsyncStorage.getItem('demo-user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const updatedUser = { ...user, ...data };
      await AsyncStorage.setItem('demo-user', JSON.stringify(updatedUser));
    }
    
    // Em produção:
    // await updateDoc(doc(db, USERS_COLLECTION, userId), data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getPotentialMatches = async (userId: string, limit: number = 10): Promise<User[]> => {
  try {
    // Demo: retornar usuários fictícios
    const demoUsers: User[] = [
      {
        id: 'user1',
        email: 'maria@email.com',
        displayName: 'Maria Silva',
        age: 25,
        bio: 'Amo a Deus e busco alguém que compartilhe da mesma fé. Gosto de ler a Bíblia e participar de grupos de oração.',
        denomination: 'Batista',
        location: { city: 'São Paulo', state: 'SP' },
        interests: ['Música Gospel', 'Leitura Bíblica', 'Oração'],
        lookingFor: 'dating',
        photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=400',
        createdAt: new Date(),
        lastActive: new Date(),
      },
      {
        id: 'user2',
        email: 'ana@email.com',
        displayName: 'Ana Costa',
        age: 28,
        bio: 'Cristã apaixonada por servir a Deus. Trabalho com crianças na igreja e amo evangelizar.',
        denomination: 'Pentecostal',
        location: { city: 'Rio de Janeiro', state: 'RJ' },
        interests: ['Ministério Infantil', 'Evangelismo', 'Louvor'],
        lookingFor: 'marriage',
        photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        createdAt: new Date(),
        lastActive: new Date(),
      },
      {
        id: 'user3',
        email: 'priscila@email.com',
        displayName: 'Priscila Santos',
        age: 24,
        bio: 'Busco um relacionamento sério baseado nos princípios cristãos. Amo adorar a Deus e estudar Sua palavra.',
        denomination: 'Assembleia de Deus',
        location: { city: 'Belo Horizonte', state: 'MG' },
        interests: ['Estudos Bíblicos', 'Adoração', 'Missões'],
        lookingFor: 'dating',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        createdAt: new Date(),
        lastActive: new Date(),
      },
      {
        id: 'user4',
        email: 'joana@email.com',
        displayName: 'Joana Oliveira',
        age: 30,
        bio: 'Mulher de Deus em busca de um homem temente ao Senhor para formar uma família cristã.',
        denomination: 'Presbiteriana',
        location: { city: 'Salvador', state: 'BA' },
        interests: ['Família', 'Devocionais', 'Aconselhamento'],
        lookingFor: 'marriage',
        photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        createdAt: new Date(),
        lastActive: new Date(),
      },
      {
        id: 'user5',
        email: 'rebeca@email.com',
        displayName: 'Rebeca Lima',
        age: 26,
        bio: 'Serva do Altíssimo, apaixonada por Jesus. Procuro alguém para caminhar junto na fé e no amor.',
        denomination: 'Metodista',
        location: { city: 'Fortaleza', state: 'CE' },
        interests: ['Vida Cristã', 'Comunhão', 'Crescimento Espiritual'],
        lookingFor: 'dating',
        photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
        createdAt: new Date(),
        lastActive: new Date(),
      },
    ];
    
    return demoUsers;
    
    // Em produção:
    // const swipesQuery = query(
    //   collection(db, SWIPES_COLLECTION),
    //   where('userId', '==', userId)
    // );
    // const swipesSnap = await getDocs(swipesQuery);
    // const swipedUserIds = swipesSnap.docs.map(doc => doc.data().targetUserId);
    
    // const usersQuery = query(
    //   collection(db, USERS_COLLECTION),
    //   where('id', 'not-in', [...swipedUserIds, userId]),
    //   limit(limit)
    // );
    // const usersSnap = await getDocs(usersQuery);
    // return usersSnap.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error getting potential matches:', error);
    return [];
  }
};

export const recordSwipe = async (swipe: SwipeAction): Promise<void> => {
  try {
    // Demo: apenas log
    console.log('Swipe recorded:', swipe);
    
    // Em produção:
    // await setDoc(doc(db, SWIPES_COLLECTION, `${swipe.userId}_${swipe.targetUserId}`), swipe);
  } catch (error) {
    console.error('Error recording swipe:', error);
    throw error;
  }
};

export const checkForMatch = async (userId: string, targetUserId: string): Promise<boolean> => {
  try {
    // Demo: simular match (50% de chance)
    return Math.random() > 0.5;
    
    // Em produção:
    // const swipeQuery = query(
    //   collection(db, SWIPES_COLLECTION),
    //   where('userId', '==', targetUserId),
    //   where('targetUserId', '==', userId),
    //   where('action', '==', 'like')
    // );
    // const swipeSnap = await getDocs(swipeQuery);
    // return !swipeSnap.empty;
  } catch (error) {
    console.error('Error checking for match:', error);
    return false;
  }
};