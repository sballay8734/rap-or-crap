export interface PlayerStats {
  cCorrect: number
  cWrong: number
  cDrinksTaken: number
  cDrinksGiven: number
  cCorrectStreak: number
  cWrongStreak: number
  lastQSkipped: boolean
  lastQCorrect: boolean
}

export interface PlayersObject {
  [playerName: string]: PlayerStats
}
