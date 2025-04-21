import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { Gameweek } from '@/types';

interface GameweekSelectorProps {
  gameweeks: Gameweek[];
  currentGameweek: number;
  onGameweekChange: (gameweekId: number) => void;
}

export const GameweekSelector: React.FC<GameweekSelectorProps> = ({
  gameweeks,
  currentGameweek,
  onGameweekChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {gameweeks.map((gameweek) => (
          <Pressable
            key={gameweek.id}
            style={[
              styles.gameweekButton,
              currentGameweek === gameweek.id && styles.activeGameweekButton,
              gameweek.isCompleted && styles.completedGameweekButton,
              gameweek.isActive && styles.liveGameweekButton,
            ]}
            onPress={() => onGameweekChange(gameweek.id)}
          >
            <Text
              style={[
                styles.gameweekText,
                currentGameweek === gameweek.id && styles.activeGameweekText,
              ]}
            >
              {gameweek.name}
            </Text>
            
            {gameweek.isActive && (
              <View style={styles.liveIndicator}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  gameweekButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  activeGameweekButton: {
    backgroundColor: colors.primary,
  },
  completedGameweekButton: {
    borderWidth: 1,
    borderColor: colors.success,
  },
  liveGameweekButton: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  gameweekText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeGameweekText: {
    color: 'white',
  },
  liveIndicator: {
    backgroundColor: colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
});