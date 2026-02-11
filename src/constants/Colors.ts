// Tiempo color palette - Modern, vibrant Spanish-inspired colors

import { themeStore } from '../store/themeStore';

// Light theme colors (original)
const LIGHT_COLORS = {
  // Primary palette - Vibrant and energetic
  primary: '#FF6B6B',        // Coral red (energetic, fun)
  primaryDark: '#EE5A52',    // Darker coral
  secondary: '#4ECDC4',      // Turquoise (fresh, modern)
  secondaryDark: '#45B8B0',  // Darker turquoise
  accent1: '#FFE66D',        // Sunny yellow (highlights, success)
  accent2: '#A8E6CF',        // Mint green (correct answers)
  accent3: '#FF8B94',        // Light coral (gentle errors)
  
  // Gradient colors
  gradientStart: '#FF6B6B',
  gradientEnd: '#FF8B94',
  
  // Backgrounds
  background: '#F7F9FC',     // Very light blue-gray
  backgroundDark: '#E8EDF4', // Slightly darker
  backgroundLight: '#F0F3F7', // Very light
  card: '#FFFFFF',           // Pure white for cards
  
  // Text colors
  text: '#2C3E50',           // Dark blue-gray (readable)
  textLight: '#7F8C8D',      // Medium gray
  textDark: '#1A252F',       // Almost black
  
  // Borders
  border: '#E1E8ED',         // Light border
  borderLight: '#F0F3F7',    // Very light border
  
  // Semantic colors
  success: '#4ECDC4',        // Turquoise
  error: '#FF6B6B',          // Coral red
  warning: '#FFE66D',        // Yellow
  info: '#A8E6CF',           // Mint
  
  // Utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Dark theme colors
const DARK_COLORS = {
  // Primary palette - Same vibrant colors work well on dark
  primary: '#FF6B6B',
  primaryDark: '#EE5A52',
  secondary: '#4ECDC4',
  secondaryDark: '#45B8B0',
  accent1: '#FFE66D',
  accent2: '#A8E6CF',
  accent3: '#FF8B94',
  
  // Gradient colors
  gradientStart: '#FF6B6B',
  gradientEnd: '#FF8B94',
  
  // Backgrounds - Dark theme with better contrast
  background: '#000000',     // Pure black background
  backgroundDark: '#1C1C1C', // Lighter for elevated elements
  backgroundLight: '#2A2A2A', // Even lighter
  card: '#1C1C1C',           // Cards slightly elevated from background
  
  // Text colors - High contrast for readability
  text: '#FFFFFF',           // Pure white for main text
  textLight: '#999999',      // Medium gray for secondary text
  textDark: '#FFFFFF',       // Pure white
  
  // Borders - Visible but subtle
  border: '#404040',         // Visible borders
  borderLight: '#2A2A2A',    // Subtle borders
  
  // Semantic colors - Same as light theme
  success: '#4ECDC4',
  error: '#FF6B6B',
  warning: '#FFE66D',
  info: '#A8E6CF',
  
  // Utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.7)', // Darker overlay for dark mode
};

// Function to get current theme colors
export const getThemeColors = () => {
  return themeStore.isDark() ? DARK_COLORS : LIGHT_COLORS;
};

// Export default as light colors for backward compatibility
export const COLORS = LIGHT_COLORS;

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  colored: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  huge: 48,
};

export const FONT_WEIGHTS = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
