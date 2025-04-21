import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { Match, Team } from '@/types';
import { format } from 'date-fns';
import { Edit2 } from 'lucide-react-native';

interface MatchCardProps {
  match: Match;
  team: Team;
  onEdit?: (match: Match) => void;
}

export function MatchCard({ match, team, onEdit }: MatchCardProps) {
  const getPlayerName = (playerId: string) => {
    const player = team.players.find(p => p.id === playerId);
    return player?.name || 'Unknown Player';
  };

  const sortedPerformances = [...match.playerPerformances].sort((a, b) => b.points - a.points);
  const topPerformers = sortedPerformances.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{format(new Date(match.date), 'MMM d, yyyy')}</Text>
        {onEdit && (
          <Pressable onPress={() => onEdit(match)} style={styles.editButton}>
            <Edit2 size={16} color={colors.primary} />
          </Pressable>
        )}
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>
          {match.score.home} - {match.score.away}
        </Text>
        <Text style={styles.teams}>
          {match.homeTeam} vs {match.awayTeam}
        </Text>
      </View>

      <View style={styles.performanceContainer}>
        <Text style={styles.performanceTitle}>Top Performances</Text>
        {topPerformers.map((performance) => (
          <View key={performance.playerId} style={styles.performanceItem}>
            <Text style={styles.playerName}>{getPlayerName(performance.playerId)}</Text>
            <Text style={styles.points}>{performance.points} pts</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    padding: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  teams: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  performanceContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerName: {
    fontSize: 14,
    color: colors.text,
  },
  points: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});