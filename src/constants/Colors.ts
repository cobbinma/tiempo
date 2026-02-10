// Tiempo color palette - from coolors.co/264653-2a9d8f-e9c46a-f4a261-e76f51

export const COLORS = {
  // Primary palette
  primary: '#264653',      // Deep blue-green (headers, primary actions)
  secondary: '#2A9D8F',    // Teal (interactive elements, correct answers)
  accent1: '#E9C46A',      // Warm yellow (highlights)
  accent2: '#F4A261',      // Orange (attention, warnings)
  accent3: '#E76F51',      // Coral red (errors, incorrect answers)
  
  // Derived colors
  background: '#F8F9FA',   // Light gray for backgrounds
  card: '#FFFFFF',         // White for cards
  text: '#264653',         // Primary text (same as primary)
  textLight: '#6C757D',    // Secondary text
  textDark: '#212529',     // Darker text for emphasis
  border: '#DEE2E6',       // Light borders
  
  // Semantic colors
  success: '#2A9D8F',      // Correct answers (same as secondary)
  error: '#E76F51',        // Incorrect answers (same as accent3)
  warning: '#F4A261',      // Warnings (same as accent2)
  info: '#264653',         // Info messages (same as primary)
  
  // Utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const FONT_WEIGHTS = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
