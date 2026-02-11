import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import CustomButton from '../components/CustomButton';
import Logo from '../components/Logo';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, getThemeColors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { BlurView } from 'expo-blur';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const [verbCount, setVerbCount] = useState(0);
  const [formsCount, setFormsCount] = useState(0);
  
  const { colors, isDark } = useTheme();

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Wiggle animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(wiggleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: -1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
      ])
    ).start();

    // Floating blob animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for stats
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animated counting for stats
    const verbInterval = setInterval(() => {
      setVerbCount((prev) => {
        if (prev >= 637) {
          clearInterval(verbInterval);
          return 637;
        }
        return prev + 13;
      });
    }, 20);

    const formsInterval = setInterval(() => {
      setFormsCount((prev) => {
        if (prev >= 67) {
          clearInterval(formsInterval);
          return 67;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(verbInterval);
      clearInterval(formsInterval);
    };
  }, []);

  const wiggleRotation = wiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-8deg', '8deg'],
  });

  const float1Y = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const float2Y = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const float3Y = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const gradientColors: readonly [string, string, string, string] = isDark
    ? ['#FF6B6B', '#FF8B94', '#FFE66D', '#4ECDC4']
    : ['#FF6B6B', '#FF8B94', '#FFE66D', '#4ECDC4'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🎨 PLAYFUL ANIMATED HEADER */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={gradientColors}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Floating blob shapes */}
            <Animated.View 
              style={[
                styles.blob1,
                { 
                  transform: [{ translateY: float1Y }],
                  opacity: fadeAnim,
                },
              ]}
            />
            <Animated.View 
              style={[
                styles.blob2,
                { 
                  transform: [{ translateY: float2Y }],
                  opacity: fadeAnim,
                },
              ]}
            />
            <Animated.View 
              style={[
                styles.blob3,
                { 
                  transform: [{ translateY: float3Y }],
                  opacity: fadeAnim,
                },
              ]}
            />
            
            {/* Main Header Content */}
            <Animated.View 
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim },
                  ],
                },
              ]}
            >
              {/* Logo with wiggle animation */}
              <Animated.View
                style={[
                  styles.logoContainer,
                  { transform: [{ rotate: wiggleRotation }] },
                ]}
              >
                <Logo size={80} showText={false} />
              </Animated.View>
              
              {/* Title with emojis */}
              <View style={styles.titleContainer}>
                <Text style={styles.titleEmoji}>✨</Text>
                <Text style={styles.title}>Tiempo</Text>
                <Text style={styles.titleEmoji}>✨</Text>
              </View>
              
              {/* Fun subtitle */}
              <Text style={styles.subtitle}>Let's Get Fluent! 🚀</Text>
              
              {/* Animated Stats with glassmorphism */}
              <BlurView intensity={40} tint="light" style={styles.statsContainer}>
                <Animated.View style={[styles.statsRow, { transform: [{ scale: pulseAnim }] }]}>
                  <View style={styles.statBubble}>
                    <Text style={styles.statNumber}>{verbCount}</Text>
                    <Text style={styles.statLabel}>Verbs 📚</Text>
                  </View>
                  
                  <View style={styles.statBubble}>
                    <Text style={styles.statNumber}>{formsCount}K+</Text>
                    <Text style={styles.statLabel}>Forms 💪</Text>
                  </View>
                  
                  <View style={styles.statBubble}>
                    <Text style={styles.statNumber}>100%</Text>
                    <Text style={styles.statLabel}>Offline 📱</Text>
                  </View>
                </Animated.View>
              </BlurView>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* 🎯 ACTION CARDS */}
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.buttonContainer,
              { opacity: fadeAnim },
            ]}
          >
            {/* Search Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Search')}
              style={styles.cardTouchable}
            >
              <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.cardBlur}>
                <LinearGradient
                  colors={isDark ? ['rgba(255, 107, 107, 0.3)', 'rgba(255, 139, 148, 0.3)'] : ['rgba(255, 107, 107, 0.15)', 'rgba(255, 139, 148, 0.15)']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardIcon}>🔍</Text>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Search Verbs</Text>
                    <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                      Find any verb instantly
                    </Text>
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            {/* Common Verbs Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('CommonVerbs')}
              style={styles.cardTouchable}
            >
              <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.cardBlur}>
                <LinearGradient
                  colors={isDark ? ['rgba(78, 205, 196, 0.3)', 'rgba(168, 230, 207, 0.3)'] : ['rgba(78, 205, 196, 0.15)', 'rgba(168, 230, 207, 0.15)']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardIcon}>⭐</Text>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Top Verbs</Text>
                    <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                      Master the essentials
                    </Text>
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            {/* Favorites Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Favorites')}
              style={styles.cardTouchable}
            >
              <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.cardBlur}>
                <LinearGradient
                  colors={isDark ? ['rgba(255, 230, 109, 0.3)', 'rgba(255, 139, 148, 0.3)'] : ['rgba(255, 230, 109, 0.15)', 'rgba(255, 139, 148, 0.15)']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardIcon}>💛</Text>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>My Favorites</Text>
                    <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                      Your saved verbs
                    </Text>
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            {/* Quiz Card - Extra Special! */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('QuizSetup', {})}
              style={[styles.cardTouchable, styles.quizCardSpecial]}
            >
              <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.cardBlur}>
                <LinearGradient
                  colors={['rgba(168, 230, 207, 0.4)', 'rgba(78, 205, 196, 0.4)']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardIcon}>🎲</Text>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Practice Quiz 🔥</Text>
                    <Text style={[styles.cardDescription, { color: colors.textLight }]}>
                      Test your skills now!
                    </Text>
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Settings */}
          <Animated.View 
            style={[
              styles.settingsSection,
              { opacity: fadeAnim },
            ]}
          >
            <TouchableOpacity 
              onPress={() => navigation.navigate('Settings')} 
              style={[styles.settingsButton, { backgroundColor: colors.card }]}
              activeOpacity={0.8}
            >
              <View style={styles.settingsContent}>
                <View style={[styles.settingsIconContainer, { backgroundColor: isDark ? colors.backgroundDark : COLORS.backgroundLight }]}>
                  <Text style={styles.settingsIcon}>⚙️</Text>
                </View>
                <View style={styles.settingsTextContainer}>
                  <Text style={[styles.settingsTitle, { color: colors.text }]}>Settings</Text>
                  <Text style={[styles.settingsDescription, { color: colors.textLight }]}>
                    Customize your experience
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
  
  // 🎨 HEADER STYLES
  headerContainer: {
    marginBottom: SPACING.xl,
  },
  headerGradient: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: BORDER_RADIUS.xxl + 10,
    borderBottomRightRadius: BORDER_RADIUS.xxl + 10,
    overflow: 'hidden',
    position: 'relative',
  },
  
  // Blob shapes - organic floating elements
  blob1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    top: -50,
    right: -50,
  },
  blob2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    bottom: 50,
    left: -30,
  },
  blob3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: 100,
    left: '40%',
  },
  
  header: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    position: 'relative',
    zIndex: 10,
  },
  
  logoContainer: {
    marginBottom: SPACING.sm,
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },
  
  titleEmoji: {
    fontSize: 32,
  },
  
  title: {
    fontSize: FONT_SIZES.huge + 4,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  
  subtitle: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  // Stats container with glassmorphism
  statsContainer: {
    borderRadius: BORDER_RADIUS.xxl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  
  statBubble: {
    alignItems: 'center',
    flex: 1,
  },
  
  statNumber: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
  },
  
  // 🎯 CONTENT STYLES
  content: {
    paddingHorizontal: SPACING.lg,
  },
  
  buttonContainer: {
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  
  cardTouchable: {
    borderRadius: BORDER_RADIUS.xxl,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  
  cardBlur: {
    borderRadius: BORDER_RADIUS.xxl,
    overflow: 'hidden',
  },
  
  cardGradient: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xxl,
  },
  
  quizCardSpecial: {
    borderWidth: 3,
    borderColor: 'rgba(168, 230, 207, 0.8)',
  },
  
  cardContent: {
    alignItems: 'center',
  },
  
  cardIcon: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  
  cardTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  
  cardDescription: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.medium,
  },
  
  // Settings
  settingsSection: {
    marginTop: SPACING.lg,
  },
  
  settingsButton: {
    borderRadius: BORDER_RADIUS.xxl,
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
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  settingsIcon: {
    fontSize: 26,
  },
  
  settingsTextContainer: {
    flex: 1,
  },
  
  settingsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  
  settingsDescription: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
  },
  
  settingsArrow: {
    fontSize: 36,
    fontWeight: FONT_WEIGHTS.medium,
  },
});
