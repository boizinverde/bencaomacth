import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
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

  const isAdmin = user.email === 'admin@bencaomatch.com'; // Simple admin check

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopColor: Colors[colorScheme ?? 'light'].border,
          paddingBottom: 5,
          height: 85,
        },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].tint,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
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
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerTitle: 'Conversas',
          tabBarIcon: ({ color }) => <TabBarIcon name="comment" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Comunidade',
          headerTitle: 'Comunidade Cristã',
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',
          headerTitle: 'Eventos',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: 'Meu Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      {/* Admin Dashboard - só aparece para admins */}
      {isAdmin && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            headerTitle: 'Dashboard Admin',
            tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
          }}
        />
      )}
    </Tabs>
  );
}