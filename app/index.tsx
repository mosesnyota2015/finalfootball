import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Users, ChartLine } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }} 
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.title}>Fantasy Football</Text>
          <Text style={styles.subtitle}>Team Builder</Text>
        </View>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Users size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Build Your Dream Team</Text>
              <Text style={styles.featureDescription}>
                Select from the best players across all teams to create your ultimate fantasy squad.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <ChartLine size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Track Performance</Text>
              <Text style={styles.featureDescription}>
                Monitor your team's performance with real-time stats and match results.
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Trophy size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Compete for Glory</Text>
              <Text style={styles.featureDescription}>
                Earn points based on your players' real-world performances and climb the leaderboard.
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 8,
  },
  features: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
});