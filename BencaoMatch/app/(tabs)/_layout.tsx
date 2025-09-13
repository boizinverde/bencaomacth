import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={24} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Show loading screen
  }

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  const isAdmin = user.email === 'admin@bencaomatch.com';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary.blue,
        tabBarInactiveTintColor: Theme.colors.text.light,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: Theme.colors.background.white,
          borderTopColor: Theme.colors.ui.border,
          paddingBottom: 5,
          height: 85,
          ...Theme.shadows.small,
        },
        headerStyle: {
          backgroundColor: Theme.colors.primary.blue,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: Theme.typography.fontSize.lg,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Descobrir',
          headerTitle: 'BençãoMatch',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          headerTitle: 'Seus Matches',
          tabBarIcon: ({ color }) => <TabBarIcon name="favorite" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerTitle: 'Conversas',
          tabBarIcon: ({ color }) => <TabBarIcon name="chat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Comunidade',
          headerTitle: 'Comunidade Cristã',
          tabBarIcon: ({ color }) => <TabBarIcon name="people" color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',
          headerTitle: 'Eventos',
          tabBarIcon: ({ color }) => <TabBarIcon name="event" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: 'Meu Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
      {isAdmin && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            headerTitle: 'Dashboard Admin',
            tabBarIcon: ({ color }) => <TabBarIcon name="admin-panel-settings" color={color} />,
          }}
        />
      )}
    </Tabs>
  );
}