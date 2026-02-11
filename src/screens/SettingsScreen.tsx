import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../hooks/useTheme';
import Card from '../components/Card';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/Colors';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { settings, updateSetting } = useSettings();
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with back button */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: colors.backgroundDark }]}>
          <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Appearance Section */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🎨 Appearance</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: colors.textLight }]}>
                {isDark 
                  ? 'Dark theme enabled - easier on the eyes at night'
                  : 'Light theme enabled - bright and vibrant'
                }
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.secondary }}
              thumbColor={isDark ? colors.white : colors.backgroundDark}
              ios_backgroundColor={colors.border}
            />
          </View>
        </Card>

        {/* Spanish Variant Section */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🌍 Spanish Variant</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Include "vosotros/vosotras"</Text>
              <Text style={[styles.settingDescription, { color: colors.textLight }]}>
                {settings.useVosotros 
                  ? 'European Spanish (Spain) - includes vosotros forms'
                  : 'Latin American Spanish - uses "ustedes" instead'
                }
              </Text>
            </View>
            <Switch
              value={settings.useVosotros}
              onValueChange={(value) => updateSetting('useVosotros', value)}
              trackColor={{ false: colors.border, true: colors.secondary }}
              thumbColor={settings.useVosotros ? colors.white : colors.backgroundDark}
              ios_backgroundColor={colors.border}
            />
          </View>

          {/* Info box */}
          <View style={[styles.infoBox, { backgroundColor: isDark ? colors.backgroundDark : COLORS.accent2 }]}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>What's the difference?</Text>
              <Text style={[styles.infoText, { color: colors.text }]}>
                <Text style={styles.infoBold}>European Spanish (Spain):</Text> Uses "vosotros/vosotras" for informal plural "you"
              </Text>
              <Text style={[styles.infoText, { color: colors.text }]}>
                <Text style={styles.infoBold}>Latin American Spanish:</Text> Uses "ustedes" for both formal and informal plural "you"
              </Text>
            </View>
          </View>
        </Card>

        {/* Example Section */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📝 Example</Text>
          </View>

          <View style={styles.exampleContainer}>
            <Text style={[styles.exampleVerb, { color: colors.primary }]}>hablar (to speak)</Text>
            
            <View style={[styles.exampleRow, { borderBottomColor: colors.borderLight }]}>
              <Text style={[styles.examplePronoun, { color: colors.textLight }]}>yo</Text>
              <Text style={[styles.exampleConjugation, { color: colors.text }]}>hablo</Text>
            </View>
            <View style={[styles.exampleRow, { borderBottomColor: colors.borderLight }]}>
              <Text style={[styles.examplePronoun, { color: colors.textLight }]}>tú</Text>
              <Text style={[styles.exampleConjugation, { color: colors.text }]}>hablas</Text>
            </View>
            <View style={[styles.exampleRow, { borderBottomColor: colors.borderLight }]}>
              <Text style={[styles.examplePronoun, { color: colors.textLight }]}>él/ella/usted</Text>
              <Text style={[styles.exampleConjugation, { color: colors.text }]}>habla</Text>
            </View>
            <View style={[styles.exampleRow, { borderBottomColor: colors.borderLight }]}>
              <Text style={[styles.examplePronoun, { color: colors.textLight }]}>nosotros/nosotras</Text>
              <Text style={[styles.exampleConjugation, { color: colors.text }]}>hablamos</Text>
            </View>
            
            {settings.useVosotros ? (
              <>
                <View style={[styles.exampleRow, styles.exampleHighlight, { backgroundColor: isDark ? colors.backgroundDark : COLORS.accent1 }]}>
                  <Text style={[styles.examplePronoun, styles.exampleHighlightText, { color: colors.text }]}>
                    vosotros/vosotras
                  </Text>
                  <Text style={[styles.exampleConjugation, styles.exampleHighlightText, { color: colors.text }]}>
                    habláis
                  </Text>
                </View>
                <View style={[styles.exampleRow, { borderBottomColor: colors.borderLight }]}>
                  <Text style={[styles.examplePronoun, { color: colors.textLight }]}>ellos/ellas/ustedes</Text>
                  <Text style={[styles.exampleConjugation, { color: colors.text }]}>hablan</Text>
                </View>
              </>
            ) : (
              <View style={[styles.exampleRow, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.examplePronoun, { color: colors.textLight }]}>ellos/ellas/ustedes</Text>
                <Text style={[styles.exampleConjugation, { color: colors.text }]}>hablan</Text>
              </View>
            )}
          </View>

          <Text style={[styles.exampleNote, { color: colors.secondary }]}>
            {settings.useVosotros 
              ? '✓ Quizzes will include vosotros/vosotras forms'
              : '✗ Quizzes will skip vosotros/vosotras forms'
            }
          </Text>
        </Card>

        {/* About Section */}
        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>ℹ️ About Tiempo</Text>
          </View>
          
          <Text style={[styles.aboutText, { color: colors.text }]}>
            Tiempo helps you master Spanish verb conjugations with interactive quizzes and comprehensive verb tables.
          </Text>
          
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: colors.background }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>637</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Verbs</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.background }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>67K+</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Conjugations</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.background }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>📴</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>Offline</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.bold,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    marginBottom: SPACING.sm,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent2,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },
  infoBold: {
    fontWeight: FONT_WEIGHTS.bold,
  },
  exampleContainer: {
    marginTop: SPACING.sm,
  },
  exampleVerb: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  exampleHighlight: {
    backgroundColor: COLORS.accent1,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderBottomWidth: 0,
    marginVertical: SPACING.xs,
  },
  examplePronoun: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
  },
  exampleConjugation: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  exampleHighlightText: {
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.bold,
  },
  exampleNote: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
    marginTop: SPACING.md,
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.semibold,
  },
  aboutText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  statNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontWeight: FONT_WEIGHTS.medium,
  },
});
