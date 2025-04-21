# Fantasy Football App

A React Native application for managing fantasy football teams, tracking player performances, and recording match results.

## System Architecture

The application follows a modern React Native architecture with the following key components:

### State Management

The application uses Zustand for state management, providing a simple and efficient way to manage global state. The store is defined in `store/useStore.ts` and includes:

- **Player State**: Manages available players, filtered players, search terms, and position filters
- **Team State**: Manages the user's team, including players, formation, budget, and captain
- **Gameweek State**: Manages gameweeks, matches, and the current active gameweek

### Data Models

The application uses TypeScript interfaces to define its data models in `types/index.ts`:

- **Player**: Represents a football player with properties like id, name, position, team, price, points, and stats
- **Team**: Represents a user's team with properties like id, name, players, formation, totalPoints, budget, and captain
- **Match**: Represents a football match with properties like id, date, homeTeam, awayTeam, score, playerPerformances, and isCompleted
- **PlayerPerformance**: Represents a player's performance in a match with properties like playerId, goals, assists, cleanSheets, saves, yellowCards, redCards, and points
- **Gameweek**: Represents a gameweek with properties like id, name, matches, isActive, and isCompleted

### Mock Data

The application includes mock data for testing and development:

- **Players**: Defined in `mocks/players.ts`
- **Matches and Gameweeks**: Defined in `mocks/matches.ts`

## Data Flow

### Player Management

1. **Player Selection**: Users can browse available players, filter by position, team, and price range
2. **Player Addition**: Users can add players to their team, which updates the team state
3. **Player Removal**: Users can remove players from their team
4. **Captain Selection**: Users can set a team captain, which affects point calculations

### Match Management

1. **Match Creation**: Users can create new matches by specifying teams, scores, and player performances
2. **Match Editing**: Users can edit existing matches to update scores or player performances
3. **Performance Tracking**: The system calculates points based on player performances in matches
4. **Gameweek Organization**: Matches are organized into gameweeks for better management

## Data Persistence

The application uses AsyncStorage for data persistence, implemented through Zustand's persist middleware:

```typescript
const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Store implementation
    }),
    {
      name: 'fantasy-football-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

This ensures that the user's team, matches, and other state data are preserved between app sessions.

## Key Features

### Team Management

- Add and remove players from your team
- Set a team captain for bonus points
- View team formation and statistics
- Track team budget and total points

### Player Management

- Browse available players with filtering options
- View player statistics and performance history
- Add custom players with custom images

### Match Results

- Record match results with scores
- Track player performances in matches
- View top performers for each match
- Edit match results and player performances

### Gameweek Management

- Organize matches into gameweeks
- Track active and completed gameweeks
- View gameweek standings and statistics

## Technical Implementation

### Components

The application is built using reusable React Native components:

- **PlayerCard**: Displays player information and stats
- **MatchCard**: Displays match information and top performers
- **TeamSummary**: Displays team information and statistics

### Screens

The application includes several screens:

- **Team Screen**: For managing your team
- **Results Screen**: For recording and viewing match results
- **Add Player Screen**: For adding custom players

### Navigation

The application uses React Navigation for screen navigation, with a tab-based navigation structure.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Run on a device or emulator with `npm run android` or `npm run ios`

## Dependencies

- React Native
- Zustand (State Management)
- React Navigation
- AsyncStorage (Data Persistence)
- date-fns (Date Formatting)
- lucide-react-native (Icons)
- expo-haptics (Haptic Feedback)
- expo-image-picker (Image Selection)

## Future Enhancements

- User authentication and multiple teams
- Real-time updates for live matches
- League management and standings
- Player transfer market
- Historical statistics and trends 