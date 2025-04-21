import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useStore } from '@/store/useStore';
import { 
  Trash2, 
  Info, 
  Shield, 
  Bell,
  RefreshCw,
  ChevronRight
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { clearTeam } = useStore();
  
  const handleClearTeam = () => {
    Alert.alert(
      "Clear Team",
      "Are you sure you want to remove all players from your team?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear", 
          onPress: () => {
            clearTeam();
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "This will reset all your data including your team, custom players, and settings. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Reset", 
          onPress: () => {
            // In a real app, we would clear AsyncStorage here
            clearTeam();
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            Alert.alert("Data Reset", "All data has been reset successfully.");
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team</Text>
          
          <Pressable 
            style={styles.settingItem}
            onPress={handleClearTeam}
          >
            <View style={styles.settingIcon}>
              <Trash2 size={20} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>Clear Team</Text>
              <Text style={styles.settingDescription}>Remove all players from your team</Text>
            </View>
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.settingDescription}>Get updates about matches and points</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.inactive, true: colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => {}}
          >
            <View style={styles.settingIcon}>
              <Info size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>App Info</Text>
              <Text style={styles.settingDescription}>Version 1.0.0</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => {}}
          >
            <View style={styles.settingIcon}>
              <Shield size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>All data is stored locally on your device</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <Pressable 
            style={styles.settingItem}
            onPress={handleResetData}
          >
            <View style={styles.settingIcon}>
              <RefreshCw size={20} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>Reset All Data</Text>
              <Text style={styles.settingDescription}>Clear all app data and start fresh</Text>
            </View>
          </Pressable>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Fantasy Football by JohnStanley</Text>
          <Text style={styles.footerSubtext}>© 2025 All Rights Reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});