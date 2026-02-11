import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../constants/Colors';

interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'icon' | 'full'; // 'icon' = just logo, 'full' = logo + text
}

export default function Logo({ size = 64, showText = false, variant = 'icon' }: LogoProps) {
  // Set to false to use your actual logo image
  const usePlaceholder = false; // Changed to use the actual logo!
  
  if (usePlaceholder) {
    // Temporary emoji placeholder until you add your logo
    return (
      <View style={styles.placeholderContainer}>
        <View style={[styles.emojiContainer, { width: size, height: size }]}>
          <Text style={[styles.emojiPlaceholder, { fontSize: size * 0.6 }]}>🇪🇸</Text>
        </View>
        {showText && (
          <Text style={[styles.brandText, { fontSize: size * 0.3 }]}>Tiempo</Text>
        )}
      </View>
    );
  }

  // Actual logo image with white background container
  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { width: size, height: size }]}>
        <Image
          source={require('../../assets/dice.png')}
          style={[styles.logo, { width: size * 0.75, height: size * 0.75 }]}
          resizeMode="contain"
        />
      </View>
      {showText && (
        <Text style={[styles.brandText, { fontSize: size * 0.3 }]}>Tiempo</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  emojiContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emojiPlaceholder: {
    textAlign: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    // Logo is smaller than container to have padding
  },
  brandText: {
    fontWeight: FONT_WEIGHTS.extrabold as any,
    color: COLORS.text,
    marginTop: 8,
  },
});
