import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/Colors';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({ text = 'Carregando...', size = 'large' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.light.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  text: {
    marginTop: Spacing.lg,
    fontSize: Typography.sizes.md,
    color: Colors.light.text,
    textAlign: 'center',
    opacity: 0.7,
  },
});