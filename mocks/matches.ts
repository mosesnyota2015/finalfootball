import { Match, Gameweek } from "@/types";

export const matches: Match[] = [
  {
    id: "m1",
    homeTeam: "Liverpool",
    awayTeam: "Man City",
    date: "2023-08-12",
    score: {
      home: 2,
      away: 2
    },
    playerPerformances: [
      {
        playerId: "p1",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        saves: 5,
        yellowCards: 0,
        redCards: 0,
        points: 3
      },
      {
        playerId: "p2",
        goals: 0,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 5
      },
      {
        playerId: "p3",
        goals: 1,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 8
      },
      {
        playerId: "p6",
        goals: 1,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 8
      },
      {
        playerId: "p8",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        saves: 3,
        yellowCards: 0,
        redCards: 0,
        points: 2
      },
      {
        playerId: "p9",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 1,
        redCards: 0,
        points: 1
      },
      {
        playerId: "p4",
        goals: 1,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 10
      },
      {
        playerId: "p13",
        goals: 1,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 6
      },
      {
        playerId: "p22",
        goals: 0,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 3
      },
      {
        playerId: "p25",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 2
      },
      {
        playerId: "p26",
        goals: 0,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 3
      }
    ],
    isCompleted: true
  },
  {
    id: "m2",
    homeTeam: "Arsenal",
    awayTeam: "Tottenham",
    date: "2023-08-12",
    score: {
      home: 3,
      away: 1
    },
    playerPerformances: [
      {
        playerId: "p16",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        saves: 4,
        yellowCards: 0,
        redCards: 0,
        points: 2
      },
      {
        playerId: "p17",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 2
      },
      {
        playerId: "p14",
        goals: 1,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 10
      },
      {
        playerId: "p18",
        goals: 1,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 10
      },
      {
        playerId: "p15",
        goals: 1,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 6
      },
      {
        playerId: "p11",
        goals: 1,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 6
      },
      {
        playerId: "p23",
        goals: 0,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 1,
        redCards: 0,
        points: 2
      },
      {
        playerId: "p21",
        goals: 0,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 3
      },
      {
        playerId: "p24",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 2
      }
    ],
    isCompleted: true
  },
  {
    id: "m3",
    homeTeam: "Man United",
    awayTeam: "Liverpool",
    date: "2023-08-19",
    score: {
      home: 1,
      away: 3
    },
    playerPerformances: [
      {
        playerId: "p5",
        goals: 1,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 1,
        redCards: 0,
        points: 5
      },
      {
        playerId: "p19",
        goals: 0,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 3
      },
      {
        playerId: "p20",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 1,
        redCards: 0,
        points: 1
      },
      {
        playerId: "p1",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        saves: 6,
        yellowCards: 0,
        redCards: 0,
        points: 3
      },
      {
        playerId: "p2",
        goals: 0,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 5
      },
      {
        playerId: "p3",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 2
      },
      {
        playerId: "p6",
        goals: 2,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 13
      },
      {
        playerId: "p10",
        goals: 0,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 5
      },
      {
        playerId: "p26",
        goals: 1,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 6
      }
    ],
    isCompleted: true
  },
  {
    id: "m4",
    homeTeam: "Chelsea",
    awayTeam: "Aston Villa",
    date: "2023-08-19",
    score: {
      home: 2,
      away: 2
    },
    playerPerformances: [
      {
        playerId: "p27",
        goals: 0,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 5
      },
      {
        playerId: "p28",
        goals: 2,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 13
      },
      {
        playerId: "p29",
        goals: 1,
        assists: 1,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        points: 10
      },
      {
        playerId: "p30",
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        saves: 5,
        yellowCards: 0,
        redCards: 0,
        points: 3
      }
    ],
    isCompleted: true
  }
];

export const gameweeks: Gameweek[] = [
  {
    id: 1,
    name: "Gameweek 1",
    matches: [matches[0], matches[1]],
    isActive: false,
    isCompleted: true
  },
  {
    id: 2,
    name: "Gameweek 2",
    matches: [matches[2], matches[3]],
    isActive: true,
    isCompleted: true
  },
  {
    id: 3,
    name: "Gameweek 3",
    matches: [],
    isActive: false,
    isCompleted: false
  }
];