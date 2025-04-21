import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useStore } from '@/store/useStore';
import { PlayerCard } from '@/components/PlayerCard';
import { TeamSummary } from '@/components/TeamSummary';
import { Position } from '@/types';
import { Edit2, Save, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function TeamScreen() {
  const { team, setTeamName, removePlayer, setCaptain, clearTeam } = useStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [teamName, setTeamNameLocal] = useState(team.name);
  
  const handleSaveTeamName = () => {
    if (teamName.trim()) {
      setTeamName(teamName);
      setIsEditingName(false);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };
  
  const handleRemovePlayer = (playerId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    removePlayer(playerId);
  };
  
  const handleSetCaptain = (playerId: string) => {
    setCaptain(playerId);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
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
  
  const renderEmptyTeam = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Your team is empty</Text>
      <Text style={styles.emptySubtext}>Go to the Players tab to add players to your team</Text>
    </View>
  );
  
  // Group players by position
  const groupedPlayers = {
    GK: team.players.filter(p => p.position === 'GK'),
    DEF: team.players.filter(p => p.position === 'DEF'),
    MID: team.players.filter(p => p.position === 'MID'),
    FWD: team.players.filter(p => p.position === 'FWD'),
  };
  
  // Flatten the grouped players for rendering
  const positionOrder: Position[] = ['GK', 'DEF', 'MID', 'FWD'];
  const sortedPlayers = positionOrder.flatMap(pos => groupedPlayers[pos]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.teamNameContainer}>
          {isEditingName ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.teamNameInput}
                value={teamName}
                onChangeText={setTeamNameLocal}
                autoFocus
                selectTextOnFocus
                maxLength={30}
              />
              <Pressable 
                style={styles.saveButton}
                onPress={handleSaveTeamName}
              >
                <Save size={20} color={colors.primary} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.displayNameContainer}>
              <Text style={styles.teamNameText}>{team.name}</Text>
              <Pressable 
                style={styles.editButton}
                onPress={() => setIsEditingName(true)}
              >
                <Edit2 size={18} color={colors.primary} />
              </Pressable>
            </View>
          )}
        </View>
        
        {team.players.length > 0 && (
          <Pressable 
            style={styles.clearButton}
            onPress={handleClearTeam}
          >
            <Trash2 size={18} color={colors.error} />
            <Text style={styles.clearButtonText}>Clear</Text>
          </Pressable>
        )}
      </View>
      
      <TeamSummary team={team} />
      
      {team.players.length === 0 ? (
        renderEmptyTeam()
      ) : (
        <FlatList
          data={sortedPlayers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlayerCard
              player={item}
              inTeam={true}
              isCaptain={team.captain === item.id}
              onRemove={() => handleRemovePlayer(item.id)}
              onSetCaptain={() => handleSetCaptain(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <Text style={styles.sectionTitle}>Team Players</Text>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  teamNameContainer: {
    flex: 1,
  },
  displayNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  editButton: {
    padding: 8,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamNameInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 4,
  },
  saveButton: {
    padding: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.error,
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});