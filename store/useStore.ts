import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player, Team, Position, Gameweek, Match } from '@/types';
import { players } from '@/mocks/players';
import { gameweeks } from '@/mocks/matches';

interface PlayerState {
  players: Player[];
  filteredPlayers: Player[];
  searchTerm: string;
  positionFilter: Position | 'ALL';
  teamFilter: string;
  priceRange: [number, number];
  sortBy: 'price' | 'points' | 'name';
  sortOrder: 'asc' | 'desc';
}

interface TeamState {
  team: Team;
  setTeamName: (name: string) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setCaptain: (playerId: string) => void;
  clearTeam: () => void;
  canAddPlayer: (player: Player) => boolean;
}

interface FilterState {
  setSearchTerm: (term: string) => void;
  setPositionFilter: (position: Position | 'ALL') => void;
  setTeamFilter: (team: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sortBy: 'price' | 'points' | 'name') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  resetFilters: () => void;
}

interface GameweekState {
  gameweeks: Gameweek[];
  currentGameweek: number;
  setCurrentGameweek: (gameweekId: number) => void;
}

interface CustomPlayerState {
  addCustomPlayer: (player: Omit<Player, 'id'>) => void;
}

type StoreState = PlayerState & TeamState & FilterState & GameweekState & CustomPlayerState;

// Get min and max price from players
const minPrice = Math.min(...players.map(p => p.price));
const maxPrice = Math.max(...players.map(p => p.price));

// Initial team state
const initialTeam: Team = {
  id: '1',
  name: 'My Fantasy Team',
  players: [],
  formation: '4-4-2',
  totalPoints: 0,
  budget: 100.0,
};

// Apply filters and sorting to players
const applyFilters = (
  allPlayers: Player[],
  searchTerm: string,
  positionFilter: Position | 'ALL',
  teamFilter: string,
  priceRange: [number, number],
  sortBy: 'price' | 'points' | 'name',
  sortOrder: 'asc' | 'desc'
): Player[] => {
  let filtered = [...allPlayers];

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply position filter
  if (positionFilter !== 'ALL') {
    filtered = filtered.filter(player => player.position === positionFilter);
  }

  // Apply team filter
  if (teamFilter) {
    filtered = filtered.filter(player => player.team === teamFilter);
  }

  // Apply price range filter
  filtered = filtered.filter(player => 
    player.price >= priceRange[0] && player.price <= priceRange[1]
  );

  // Apply sorting
  filtered.sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });

  return filtered;
};

// Calculate team points
const calculateTeamPoints = (team: Team, gameweeks: Gameweek[]): number => {
  let totalPoints = 0;
  
  // Get all player performances from completed gameweeks
  const completedGameweeks = gameweeks.filter(gw => gw.isCompleted);
  
  completedGameweeks.forEach((gameweek: Gameweek) => {
    gameweek.matches.forEach((match: Match) => {
      match.playerPerformances.forEach((performance) => {
        // Check if player is in team
        const isInTeam = team.players.some(player => player.id === performance.playerId);
        if (isInTeam) {
          // Add points
          totalPoints += performance.points;
          
          // Add captain bonus (if applicable)
          if (team.captain === performance.playerId) {
            totalPoints += performance.points; // Double points for captain
          }
        }
      });
    });
  });
  
  return totalPoints;
};

// Count positions in team
const countPositions = (players: Player[]): Record<Position, number> => {
  return players.reduce((counts, player) => {
    counts[player.position] = (counts[player.position] || 0) + 1;
    return counts;
  }, { GK: 0, DEF: 0, MID: 0, FWD: 0 } as Record<Position, number>);
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Player state
      players,
      filteredPlayers: players,
      searchTerm: '',
      positionFilter: 'ALL',
      teamFilter: '',
      priceRange: [minPrice, maxPrice],
      sortBy: 'points',
      sortOrder: 'desc',

      // Team state
      team: initialTeam,
      setTeamName: (name: string) => set(state => ({
        team: { ...state.team, name }
      })),
      addPlayer: (player: Player) => set(state => {
        if (!get().canAddPlayer(player)) return state;

        const newPlayers = [...state.team.players, player];
        const newBudget = state.team.budget - player.price;
        const newTotalPoints = calculateTeamPoints({ ...state.team, players: newPlayers }, state.gameweeks);

        return {
          team: {
            ...state.team,
            players: newPlayers,
            budget: newBudget,
            totalPoints: newTotalPoints
          }
        };
      }),
      removePlayer: (playerId: string) => set(state => {
        const playerToRemove = state.team.players.find(p => p.id === playerId);
        if (!playerToRemove) return state;

        const newPlayers = state.team.players.filter(p => p.id !== playerId);
        const newBudget = state.team.budget + playerToRemove.price;
        const newTotalPoints = calculateTeamPoints({ ...state.team, players: newPlayers }, state.gameweeks);
        
        // If removing captain, unset captain
        const newCaptain = state.team.captain === playerId ? undefined : state.team.captain;

        return {
          team: {
            ...state.team,
            players: newPlayers,
            budget: newBudget,
            totalPoints: newTotalPoints,
            captain: newCaptain
          }
        };
      }),
      setCaptain: (playerId: string) => set(state => {
        const isInTeam = state.team.players.some(p => p.id === playerId);
        if (!isInTeam) return state;

        const newTotalPoints = calculateTeamPoints({ ...state.team, captain: playerId }, state.gameweeks);

        return {
          team: {
            ...state.team,
            captain: playerId,
            totalPoints: newTotalPoints
          }
        };
      }),
      clearTeam: () => set(state => ({
        team: {
          ...initialTeam,
          name: state.team.name // Preserve the team name
        }
      })),
      canAddPlayer: (player: Player) => {
        const { team } = get();
        
        // Check if player is already in team
        if (team.players.some(p => p.id === player.id)) {
          return false;
        }
        
        // Check if team has enough budget
        if (team.budget < player.price) {
          return false;
        }
        
        // Check if team has reached max size (11 players)
        if (team.players.length >= 11) {
          return false;
        }
        
        // Check position limits
        const positions = countPositions(team.players);
        
        switch (player.position) {
          case 'GK':
            return positions.GK < 1;
          case 'DEF':
            return positions.DEF < 4;
          case 'MID':
            return positions.MID < 4;
          case 'FWD':
            return positions.FWD < 3;
          default:
            return false;
        }
      },

      // Filter state
      setSearchTerm: (searchTerm: string) => set(state => {
        const filteredPlayers = applyFilters(
          state.players,
          searchTerm,
          state.positionFilter,
          state.teamFilter,
          state.priceRange,
          state.sortBy,
          state.sortOrder
        );
        return { searchTerm, filteredPlayers };
      }),
      setPositionFilter: (positionFilter: Position | 'ALL') => set(state => {
        const filteredPlayers = applyFilters(
          state.players,
          state.searchTerm,
          positionFilter,
          state.teamFilter,
          state.priceRange,
          state.sortBy,
          state.sortOrder
        );
        return { positionFilter, filteredPlayers };
      }),
      setTeamFilter: (teamFilter: string) => set(state => {
        const filteredPlayers = applyFilters(
          state.players,
          state.searchTerm,
          state.positionFilter,
          teamFilter,
          state.priceRange,
          state.sortBy,
          state.sortOrder
        );
        return { teamFilter, filteredPlayers };
      }),
      setPriceRange: (priceRange: [number, number]) => set(state => {
        const filteredPlayers = applyFilters(
          state.players,
          state.searchTerm,
          state.positionFilter,
          state.teamFilter,
          priceRange,
          state.sortBy,
          state.sortOrder
        );
        return { priceRange, filteredPlayers };
      }),
      setSortBy: (sortBy: 'price' | 'points' | 'name') => set(state => {
        const filteredPlayers = applyFilters(
          state.players,
          state.searchTerm,
          state.positionFilter,
          state.teamFilter,
          state.priceRange,
          sortBy,
          state.sortOrder
        );
        return { sortBy, filteredPlayers };
      }),
      setSortOrder: (sortOrder: 'asc' | 'desc') => set(state => {
        const filteredPlayers = applyFilters(
          state.players,
          state.searchTerm,
          state.positionFilter,
          state.teamFilter,
          state.priceRange,
          state.sortBy,
          sortOrder
        );
        return { sortOrder, filteredPlayers };
      }),
      resetFilters: () => set(state => {
        const filteredPlayers = applyFilters(
          state.players,
          '',
          'ALL',
          '',
          [minPrice, maxPrice],
          'points',
          'desc'
        );
        return {
          searchTerm: '',
          positionFilter: 'ALL',
          teamFilter: '',
          priceRange: [minPrice, maxPrice],
          sortBy: 'points',
          sortOrder: 'desc',
          filteredPlayers
        };
      }),

      // Gameweek state
      gameweeks,
      currentGameweek: gameweeks.find((gw: Gameweek) => gw.isActive)?.id || 1,
      setCurrentGameweek: (gameweekId: number) => set({
        currentGameweek: gameweekId
      }),

      // Custom player state
      addCustomPlayer: (playerData: Omit<Player, 'id'>) => set(state => {
        const newId = `custom-${Date.now()}`;
        const newPlayer: Player = {
          id: newId,
          ...playerData
        };
        
        const newPlayers = [...state.players, newPlayer];
        const filteredPlayers = applyFilters(
          newPlayers,
          state.searchTerm,
          state.positionFilter,
          state.teamFilter,
          state.priceRange,
          state.sortBy,
          state.sortOrder
        );
        
        return {
          players: newPlayers,
          filteredPlayers
        };
      })
    }),
    {
      name: 'fantasy-football-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        team: state.team,
        players: state.players,
        currentGameweek: state.currentGameweek
      }),
    }
  )
);