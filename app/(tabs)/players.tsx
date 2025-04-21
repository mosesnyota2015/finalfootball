import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/constants/colors';
import { useStore } from '@/store/useStore';
import { PlayerCard } from '@/components/PlayerCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { UserPlus } from 'lucide-react-native';

type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
  AddPlayer: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlayersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  
  const {
    filteredPlayers,
    searchTerm,
    setSearchTerm,
    positionFilter,
    setPositionFilter,
    teamFilter,
    setTeamFilter,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    resetFilters,
    addPlayer,
    canAddPlayer,
    team,
  } = useStore();

  // Get unique teams from players
  const teams = [...new Set(useStore.getState().players.map(player => player.team))].sort();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetFilters();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [resetFilters]);

  const handleAddPlayer = (playerId: string) => {
    const player = filteredPlayers.find(p => p.id === playerId);
    if (player) {
      addPlayer(player);
    }
  };

  const navigateToAddPlayer = () => {
    navigation.navigate('AddPlayer');
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No players found</Text>
      <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SearchBar
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search players by name or team..."
      />
      
      <FilterBar
        positionFilter={positionFilter}
        onPositionChange={setPositionFilter}
        teamFilter={teamFilter}
        onTeamChange={setTeamFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(sortBy, sortOrder) => {
          setSortBy(sortBy);
          setSortOrder(sortOrder);
        }}
        onReset={resetFilters}
        teams={teams}
      />
      
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isInTeam = team.players.some(p => p.id === item.id);
          const isCaptain = team.captain === item.id;
          const canAdd = canAddPlayer(item);
          
          return (
            <PlayerCard
              player={item}
              onAdd={() => handleAddPlayer(item.id)}
              inTeam={isInTeam}
              isCaptain={isCaptain}
              disabled={!canAdd && !isInTeam}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={navigateToAddPlayer}
      >
        <UserPlus size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 80,
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
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});