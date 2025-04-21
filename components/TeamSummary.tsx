import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Team } from '@/types';
import { Trophy, Coins, Users } from 'lucide-react-native';

interface TeamSummaryProps {
  team: Team;
}

export const TeamSummary: React.FC<TeamSummaryProps> = ({ team }) => {
  const positionCounts = {
    GK: team.players.filter(p => p.position === 'GK').length,
    DEF: team.players.filter(p => p.position === 'DEF').length,
    MID: team.players.filter(p => p.position === 'MID').length,
    FWD: team.players.filter(p => p.position === 'FWD').length,
  };

  const formation = `${positionCounts.DEF}-${positionCounts.MID}-${positionCounts.FWD}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.teamName}>{team.name}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Trophy size={18} color={colors.primary} />
          <Text style={styles.statValue}>{team.totalPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        
        <View style={styles.statItem}>
          <Users size={18} color={colors.primary} />
          <Text style={styles.statValue}>{team.players.length}/11</Text>
          <Text style={styles.statLabel}>Players</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.formationValue}>{formation}</Text>
          <Text style={styles.statLabel}>Formation</Text>
        </View>
        
        <View style={styles.statItem}>
          <Coins size={18} color={colors.primary} />
          <Text style={styles.statValue}>£{team.budget.toFixed(1)}m</Text>
          <Text style={styles.statLabel}>Budget</Text>
        </View>
      </View>
      
      <View style={styles.positionsContainer}>
        {Object.entries(positionCounts).map(([position, count]) => (
          <View key={position} style={styles.positionItem}>
            <View style={[styles.positionBadge, { backgroundColor: colors.positions[position as keyof typeof colors.positions] }]}>
              <Text style={styles.positionText}>{position}</Text>
            </View>
            <Text style={styles.positionCount}>
              {count}/{position === 'GK' ? 1 : position === 'DEF' ? 4 : position === 'MID' ? 4 : 3}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
  },
  formationValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  positionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 8,
  },
  positionItem: {
    alignItems: 'center',
  },
  positionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  positionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  positionCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});