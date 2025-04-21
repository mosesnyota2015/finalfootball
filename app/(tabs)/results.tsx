import React, { useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Text, 
  TextInput, 
  Pressable, 
  Alert,
  Modal,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useStore } from '@/store/useStore';
import { MatchCard } from '@/components/MatchCard';
import { Plus, Save, X } from 'lucide-react-native';
import { Match, PlayerPerformance } from '@/types';
import * as Haptics from 'expo-haptics';

export default function ResultsScreen() {
  const { team } = useStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    homeTeam: team.name,
    awayTeam: '',
    score: { home: 0, away: 0 },
    playerPerformances: [],
    isCompleted: false
  });
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState<Partial<PlayerPerformance>>({
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    saves: 0,
    yellowCards: 0,
    redCards: 0
  });

  const calculatePoints = (stats: PlayerPerformance): number => {
    let points = 0;
    
    // Base points for playing
    points += 2;
    
    // Points for goals
    if (team.players.find(p => p.id === stats.playerId)?.position === 'GK' || 
        team.players.find(p => p.id === stats.playerId)?.position === 'DEF') {
      points += stats.goals * 6;
    } else if (team.players.find(p => p.id === stats.playerId)?.position === 'MID') {
      points += stats.goals * 5;
    } else {
      points += stats.goals * 4;
    }
    
    // Points for assists
    points += stats.assists * 3;
    
    // Points for clean sheets
    if (team.players.find(p => p.id === stats.playerId)?.position === 'GK' || 
        team.players.find(p => p.id === stats.playerId)?.position === 'DEF') {
      points += stats.cleanSheets * 4;
    } else if (team.players.find(p => p.id === stats.playerId)?.position === 'MID') {
      points += stats.cleanSheets * 1;
    }
    
    // Points for saves (GK only)
    if (team.players.find(p => p.id === stats.playerId)?.position === 'GK' && stats.saves) {
      points += Math.floor(stats.saves / 3);
    }
    
    // Deductions for cards
    points -= stats.yellowCards;
    points -= stats.redCards * 3;
    
    return Math.max(0, points);
  };

  const handleSaveMatch = () => {
    if (!newMatch.awayTeam?.trim()) {
      Alert.alert('Error', 'Please enter the opponent team name');
      return;
    }

    const match: Match = {
      id: editingMatch?.id || Date.now().toString(),
      date: editingMatch?.date || new Date().toISOString(),
      homeTeam: newMatch.homeTeam || team.name,
      awayTeam: newMatch.awayTeam,
      score: newMatch.score || { home: 0, away: 0 },
      playerPerformances: newMatch.playerPerformances || [],
      isCompleted: true
    };

    if (editingMatch) {
      setMatches(matches.map(m => m.id === match.id ? match : m));
    } else {
      setMatches([match, ...matches]);
    }

    setShowMatchModal(false);
    setEditingMatch(null);
    setNewMatch({
      homeTeam: team.name,
      awayTeam: '',
      score: { home: 0, away: 0 },
      playerPerformances: [],
      isCompleted: false
    });
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    setNewMatch({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      score: match.score,
      playerPerformances: match.playerPerformances,
      isCompleted: match.isCompleted
    });
    setShowMatchModal(true);
  };

  const handleAddPlayerPerformance = () => {
    if (!selectedPlayer) {
      Alert.alert('Error', 'Please select a player');
      return;
    }

    const performance: PlayerPerformance = {
      playerId: selectedPlayer,
      goals: playerStats.goals || 0,
      assists: playerStats.assists || 0,
      cleanSheets: playerStats.cleanSheets || 0,
      saves: playerStats.saves,
      yellowCards: playerStats.yellowCards || 0,
      redCards: playerStats.redCards || 0,
      points: calculatePoints({
        playerId: selectedPlayer,
        goals: playerStats.goals || 0,
        assists: playerStats.assists || 0,
        cleanSheets: playerStats.cleanSheets || 0,
        saves: playerStats.saves,
        yellowCards: playerStats.yellowCards || 0,
        redCards: playerStats.redCards || 0,
        points: 0
      })
    };

    setNewMatch(prev => ({
      ...prev,
      playerPerformances: [...(prev.playerPerformances || []), performance]
    }));

    setSelectedPlayer(null);
    setPlayerStats({
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      saves: 0,
      yellowCards: 0,
      redCards: 0
    });
  };

  const handleRemovePerformance = (playerId: string) => {
    setNewMatch(prev => ({
      ...prev,
      playerPerformances: prev.playerPerformances?.filter(p => p.playerId !== playerId) || []
    }));
  };

  const renderMatchModal = () => (
    <Modal
      visible={showMatchModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setShowMatchModal(false);
        setEditingMatch(null);
        setNewMatch({
          homeTeam: team.name,
          awayTeam: '',
          score: { home: 0, away: 0 },
          playerPerformances: [],
          isCompleted: false
        });
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingMatch ? 'Edit Match Result' : 'Add Match Result'}
            </Text>
            <Pressable onPress={() => {
              setShowMatchModal(false);
              setEditingMatch(null);
              setNewMatch({
                homeTeam: team.name,
                awayTeam: '',
                score: { home: 0, away: 0 },
                playerPerformances: [],
                isCompleted: false
              });
            }}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Opponent Team</Text>
              <TextInput
                style={styles.input}
                value={newMatch.awayTeam}
                onChangeText={(text) => setNewMatch(prev => ({ ...prev, awayTeam: text }))}
                placeholder="Enter opponent team name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.scoreContainer}>
              <View style={styles.scoreInput}>
                <Text style={styles.label}>Home Score</Text>
                <TextInput
                  style={styles.input}
                  value={newMatch.score?.home?.toString()}
                  onChangeText={(text) => setNewMatch(prev => ({
                    ...prev,
                    score: { ...prev.score!, home: parseInt(text) || 0 }
                  }))}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <Text style={styles.scoreSeparator}>-</Text>
              <View style={styles.scoreInput}>
                <Text style={styles.label}>Away Score</Text>
                <TextInput
                  style={styles.input}
                  value={newMatch.score?.away?.toString()}
                  onChangeText={(text) => setNewMatch(prev => ({
                    ...prev,
                    score: { ...prev.score!, away: parseInt(text) || 0 }
                  }))}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.playerStatsContainer}>
              <Text style={styles.sectionTitle}>Player Performances</Text>
              
              <View style={styles.playerSelector}>
                <Text style={styles.label}>Select Player</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {team.players.map(player => (
                    <Pressable
                      key={player.id}
                      style={[
                        styles.playerChip,
                        selectedPlayer === player.id && styles.selectedPlayerChip
                      ]}
                      onPress={() => setSelectedPlayer(player.id)}
                    >
                      <Text style={[
                        styles.playerChipText,
                        selectedPlayer === player.id && styles.selectedPlayerChipText
                      ]}>
                        {player.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {selectedPlayer && (
                <View style={styles.statsGrid}>
                  <View style={styles.statInput}>
                    <Text style={styles.statLabel}>Goals</Text>
                    <TextInput
                      style={styles.input}
                      value={playerStats.goals?.toString()}
                      onChangeText={(text) => setPlayerStats(prev => ({
                        ...prev,
                        goals: parseInt(text) || 0
                      }))}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.statInput}>
                    <Text style={styles.statLabel}>Assists</Text>
                    <TextInput
                      style={styles.input}
                      value={playerStats.assists?.toString()}
                      onChangeText={(text) => setPlayerStats(prev => ({
                        ...prev,
                        assists: parseInt(text) || 0
                      }))}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.statInput}>
                    <Text style={styles.statLabel}>Clean Sheets</Text>
                    <TextInput
                      style={styles.input}
                      value={playerStats.cleanSheets?.toString()}
                      onChangeText={(text) => setPlayerStats(prev => ({
                        ...prev,
                        cleanSheets: parseInt(text) || 0
                      }))}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  {team.players.find(p => p.id === selectedPlayer)?.position === 'GK' && (
                    <View style={styles.statInput}>
                      <Text style={styles.statLabel}>Saves</Text>
                      <TextInput
                        style={styles.input}
                        value={playerStats.saves?.toString()}
                        onChangeText={(text) => setPlayerStats(prev => ({
                          ...prev,
                          saves: parseInt(text) || 0
                        }))}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor={colors.textSecondary}
                      />
                    </View>
                  )}

                  <View style={styles.statInput}>
                    <Text style={styles.statLabel}>Yellow Cards</Text>
                    <TextInput
                      style={styles.input}
                      value={playerStats.yellowCards?.toString()}
                      onChangeText={(text) => setPlayerStats(prev => ({
                        ...prev,
                        yellowCards: parseInt(text) || 0
                      }))}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>

                  <View style={styles.statInput}>
                    <Text style={styles.statLabel}>Red Cards</Text>
                    <TextInput
                      style={styles.input}
                      value={playerStats.redCards?.toString()}
                      onChangeText={(text) => setPlayerStats(prev => ({
                        ...prev,
                        redCards: parseInt(text) || 0
                      }))}
                      keyboardType="number-pad"
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
              )}

              {selectedPlayer && (
                <Pressable
                  style={styles.addPerformanceButton}
                  onPress={handleAddPlayerPerformance}
                >
                  <Text style={styles.addPerformanceButtonText}>Add Performance</Text>
                </Pressable>
              )}
            </View>

            {newMatch.playerPerformances && newMatch.playerPerformances.length > 0 && (
              <View style={styles.performancesList}>
                <Text style={styles.sectionTitle}>Added Performances</Text>
                {newMatch.playerPerformances.map((performance) => {
                  const player = team.players.find(p => p.id === performance.playerId);
                  return (
                    <View key={performance.playerId} style={styles.performanceItem}>
                      <View style={styles.performanceInfo}>
                        <Text style={styles.performancePlayerName}>{player?.name}</Text>
                        <Text style={styles.performanceStats}>
                          {performance.goals > 0 && `⚽ ${performance.goals} `}
                          {performance.assists > 0 && `🎯 ${performance.assists} `}
                          {performance.cleanSheets > 0 && `🛡️ ${performance.cleanSheets} `}
                          {performance.saves && performance.saves > 0 && `🧤 ${performance.saves} `}
                          {performance.yellowCards > 0 && `🟨 ${performance.yellowCards} `}
                          {performance.redCards > 0 && `🟥 ${performance.redCards}`}
                        </Text>
                      </View>
                      <View style={styles.performanceActions}>
                        <Text style={styles.performancePoints}>{performance.points} pts</Text>
                        <Pressable
                          style={styles.removeButton}
                          onPress={() => handleRemovePerformance(performance.playerId)}
                        >
                          <X size={16} color={colors.error} />
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable
              style={styles.saveButton}
              onPress={handleSaveMatch}
            >
              <Save size={20} color="white" />
              <Text style={styles.saveButtonText}>
                {editingMatch ? 'Update Match' : 'Save Match'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Match Results</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => setShowMatchModal(true)}
        >
          <Plus size={24} color="white" />
        </Pressable>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard 
            match={item} 
            team={team}
            onEdit={() => handleEditMatch(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matches recorded</Text>
            <Text style={styles.emptySubtext}>Add a match result to get started</Text>
          </View>
        )}
      />

      {renderMatchModal()}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 48,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  scoreInput: {
    flex: 1,
  },
  scoreSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 16,
  },
  playerStatsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  playerSelector: {
    marginBottom: 16,
  },
  playerChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  selectedPlayerChip: {
    backgroundColor: colors.primary,
  },
  playerChipText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedPlayerChipText: {
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statInput: {
    width: '48%',
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  addPerformanceButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addPerformanceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  performancesList: {
    marginTop: 24,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  performanceInfo: {
    flex: 1,
  },
  performancePlayerName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  performanceStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  performanceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  performancePoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  removeButton: {
    padding: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});