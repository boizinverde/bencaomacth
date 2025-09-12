/**
 * BençãoMatch Color Palette
 * Design inspirado em cores cristãs com toque moderno
 */

const tintColorLight = '#6B46C1';
const tintColorDark = '#A78BFA';

export const Colors = {
  light: {
    text: '#1F2937',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    cardBackground: '#F9FAFB',
    border: '#E5E7EB',
    primary: '#6B46C1',
    secondary: '#EC4899',
    accent: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient: {
      primary: ['#6B46C1', '#8B5CF6'],
      secondary: ['#EC4899', '#F472B6'],
      gold: ['#F59E0B', '#FBBF24'],
    }
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    cardBackground: '#1F2937',
    border: '#374151',
    primary: '#8B5CF6',
    secondary: '#F472B6',
    accent: '#FBBF24',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    gradient: {
      primary: ['#8B5CF6', '#A78BFA'],
      secondary: ['#F472B6', '#FBBF24'],
      gold: ['#FBBF24', '#FCD34D'],
    }
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
};