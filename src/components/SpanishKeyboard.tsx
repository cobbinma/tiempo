import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/Colors';

interface SpanishKeyboardProps {
  onCharacterPress: (char: string) => void;
}

const SPANISH_CHARACTERS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¡', '¿'];

export default function SpanishKeyboard({ onCharacterPress }: SpanishKeyboardProps) {
  return (
    <View style={styles.container}>
      {SPANISH_CHARACTERS.map((char) => (
        <TouchableOpacity
          key={char}
          style={styles.key}
          onPress={() => onCharacterPress(char)}
          activeOpacity={0.7}
        >
          <Text style={styles.keyText}>{char}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  key: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  keyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    fontWeight: '600',
  },
});
