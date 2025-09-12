import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithCredential, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase.config';
import { User, AuthState } from '../types';
import { getUserProfile, createUserProfile } from '../services/userService';
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
          // Usuário logado, buscar perfil completo
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setState({ user: userProfile, loading: false, error: null });
          } else {
            // Criar perfil se não existir
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || undefined,
              createdAt: new Date(),
              lastActive: new Date(),
            };
            await createUserProfile(newUser);
            setState({ user: newUser, loading: false, error: null });
          }
        } else {
          // Usuário não logado
          setState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setState({ user: null, loading: false, error: 'Erro ao carregar usuário' });
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Para demo, vamos simular um login Google
      // Em produção, usar @react-native-google-signin/google-signin
      const mockUser: User = {
        id: 'demo-user-google',
        email: 'usuario@gmail.com',
        displayName: 'Usuário Demo',
        photoURL: 'https://via.placeholder.com/150',
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
      
      // Para demo, vamos simular um login Apple
      // Em produção, usar @react-native-apple-authentication
      const mockUser: User = {
        id: 'demo-user-apple',
        email: 'usuario@icloud.com',
        displayName: 'Usuário Apple',
        photoURL: 'https://via.placeholder.com/150',
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
      
      // Limpar demo user
      await AsyncStorage.removeItem('demo-user');
      
      // Em produção, usar: await signOut(auth);
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

  // Carregar usuário do AsyncStorage na inicialização (para demo)
  useEffect(() => {
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
  }, []);

  const value: AuthContextType = {
    ...state,
    signInWithGoogle,
    signInWithApple,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};