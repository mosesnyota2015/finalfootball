export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: string;
  name: string;
  position: Position;
  team: string;
  price: number;
  points: number;
  image: string;
  stats: {
    goals: number;
    assists: number;
    cleanSheets: number;
    saves?: number;
    yellowCards: number;
    redCards: number;
  };
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  formation: string;
  totalPoints: number;
  budget: number;
  captain?: string;
}

export interface PlayerPerformance {
  playerId: string;
  goals: number;
  assists: number;
  cleanSheets: number;
  saves?: number;
  yellowCards: number;
  redCards: number;
  points: number;
}

export interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: {
    home: number;
    away: number;
  };
  playerPerformances: PlayerPerformance[];
  isCompleted: boolean;
}

export interface Gameweek {
  id: number;
  name: string;
  matches: Match[];
  isActive: boolean;
  isCompleted: boolean;
}