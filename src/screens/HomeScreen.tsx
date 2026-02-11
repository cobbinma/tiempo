import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import CustomButton from '../components/CustomButton';
import Logo from '../components/Logo';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, getThemeColors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const { colors } = useTheme();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Logo size={100} showText={false} />
            <Text style={styles.title}>Tiempo</Text>
            <Text style={styles.subtitle}>Spanish Verb Conjugations</Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={styles.cardIcon}>🔍</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Search Verbs</Text>
              <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                Look up any Spanish verb and see all conjugations
              </Text>
              <CustomButton
                title="Start Searching"
                onPress={() => navigation.navigate('Search')}
                variant="primary"
                size="large"
                style={styles.button}
              />
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={styles.cardIcon}>⭐</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Common Verbs</Text>
              <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                Master the most frequently used verbs in Spanish
              </Text>
              <CustomButton
                title="View Common Verbs"
                onPress={() => navigation.navigate('CommonVerbs')}
                variant="primary"
                size="large"
                style={styles.button}
              />
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={styles.cardIcon}>💛</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Favorite Verbs</Text>
              <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                Access your saved verbs and practice them anytime
              </Text>
              <CustomButton
                title="View Favorites"
                onPress={() => navigation.navigate('Favorites')}
                variant="primary"
                size="large"
                style={styles.button}
              />
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={styles.cardIcon}>🎲</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Practice Quiz</Text>
              <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                Test your knowledge with interactive quizzes
              </Text>
              <CustomButton
                title="Start Quiz"
                onPress={() => navigation.navigate('QuizSetup', {})}
                variant="secondary"
                size="large"
                style={styles.button}
              />
            </View>
          </Animated.View>

          <Animated.View 
            style={[
              styles.settingsSection,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <TouchableOpacity 
              onPress={() => navigation.navigate('Settings')} 
              style={[styles.settingsButton, { backgroundColor: colors.card }]}
              activeOpacity={0.8}
            >
              <View style={styles.settingsContent}>
                <View style={styles.settingsIconContainer}>
                  <Text style={styles.settingsIcon}>⚙️</Text>
                </View>
                <View style={styles.settingsTextContainer}>
                  <Text style={[styles.settingsTitle, { color: colors.text }]}>Settings</Text>
                  <Text style={[styles.settingsDescription, { color: colors.textLight }]}>
                    Customize your learning experience
                  </Text>
                </View>
                <Text style={[styles.settingsArrow, { color: colors.textLight }]}>›</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  headerGradient: {
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.huge,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.white,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.95,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  buttonContainer: {
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  card: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  button: {
    width: '100%',
  },
  settingsSection: {
    marginTop: SPACING.lg,
  },
  settingsButton: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  settingsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: SPACING.xs,
  },
  settingsDescription: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
  },
  settingsArrow: {
    fontSize: 32,
    fontWeight: FONT_WEIGHTS.light,
  },
});
