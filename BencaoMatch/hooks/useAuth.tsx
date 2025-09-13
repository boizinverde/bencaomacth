import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { User, AuthState } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // TODO: Buscar perfil completo do Firestore
          const user: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Usuário',
            email: firebaseUser.email || '',
            age: 25,
            denomination: 'Cristão',
            location: 'Brasil',
            languages: ['Português'],
            verse: 'O amor é paciente, o amor é bondoso.',
            image: firebaseUser.photoURL || 'https://via.placeholder.com/300',
            createdAt: new Date(),
            lastActive: new Date(),
          };
          setState({ user, loading: false, error: null });
        } else {
          setState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setState({ user: null, loading: false, error: 'Erro ao carregar usuário' });
      }
    });

    // Para demo, simular usuário logado
    const loadDemoUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('demo-user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setState({ user, loading: false, error: null });
        } else {
          setState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        setState({ user: null, loading: false, error: null });
      }
    };

    loadDemoUser();
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // TODO: Implementar Google Sign-In real
      // import { GoogleSignin } from '@react-native-google-signin/google-signin';
      
      // Para demo, criar usuário fictício
      const mockUser: User = {
        id: 'demo-user-' + Date.now(),
        name: 'Usuário Demo',
        email: 'usuario@gmail.com',
        age: 28,
        denomination: 'Batista',
        location: 'São Paulo, SP',
        languages: ['Português', 'Inglês'],
        verse: 'Posso todas as coisas em Cristo que me fortalece. - Filipenses 4:13',
        image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Cristão apaixonado por servir a Deus e buscar relacionamentos saudáveis baseados na fé.',
        interests: ['Música Gospel', 'Estudos Bíblicos', 'Oração'],
        lookingFor: 'dating',
        createdAt: new Date(),
        lastActive: new Date(),
      };
      
      await AsyncStorage.setItem('demo-user', JSON.stringify(mockUser));
      setState({ user: mockUser, loading: false, error: null });
    } catch (error) {
      console.error('Google sign in error:', error);
      setState(prev => ({ ...prev, loading: false, error: 'Erro ao fazer login com Google' }));
    }
  };

  const signInWithApple = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // TODO: Implementar Apple Sign-In real
      // import * as AppleAuthentication from 'expo-apple-authentication';
      
      // Para demo, criar usuário fictício
      const mockUser: User = {
        id: 'demo-user-apple-' + Date.now(),
        name: 'Usuário Apple',
        email: 'usuario@icloud.com',
        age: 26,
        denomination: 'Pentecostal',
        location: 'Rio de Janeiro, RJ',
        languages: ['Português'],
        verse: 'O Senhor é o meu pastor, nada me faltará. - Salmos 23:1',
        image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Mulher de Deus em busca de relacionamentos baseados nos valores cristãos.',
        interests: ['Louvor', 'Evangelismo', 'Vida Cristã'],
        lookingFor: 'marriage',
        createdAt: new Date(),
        lastActive: new Date(),
      };
      
      await AsyncStorage.setItem('demo-user', JSON.stringify(mockUser));
      setState({ user: mockUser, loading: false, error: null });
    } catch (error) {
      console.error('Apple sign in error:', error);
      setState(prev => ({ ...prev, loading: false, error: 'Erro ao fazer login com Apple' }));
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      await AsyncStorage.removeItem('demo-user');
      // await signOut(auth); // Para Firebase real
      
      setState({ user: null, loading: false, error: null });
    } catch (error) {
      console.error('Logout error:', error);
      setState(prev => ({ ...prev, loading: false, error: 'Erro ao fazer logout' }));
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (!state.user) throw new Error('Usuário não encontrado');
      
      const updatedUser = { ...state.user, ...data };
      await AsyncStorage.setItem('demo-user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    } catch (error) {
      console.error('Update profile error:', error);
      setState(prev => ({ ...prev, error: 'Erro ao atualizar perfil' }));
    }
  };

  const value: AuthContextType = {
    ...state,
    signInWithGoogle,
    signInWithApple,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};