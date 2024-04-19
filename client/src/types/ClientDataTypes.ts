export interface PlayerStats {
  cCorrect: number
  cWrong: number
  cDrinksTaken: number
  cDrinksGiven: number
  cCorrectStreak: number
  cWrongStreak: number
  lastQSkipped: boolean
  lastQCorrect: boolean
  history: {
    [key: string]: boolean
  }
}

type Selection = "rap" | "crap" | "skip" | null

export interface PlayerSelections {
  [playerName: string]: Selection
}

export interface PlayersObject {
  [playerName: string]: PlayerStats
}

export interface InitializedGameInstance {
  _id: string
  userId: string
  gameStartDate: string
  playersObject: PlayersObject
  currentLyric: string
  currentPromptId: string
  currentRound: number
  seenPromptIds: string[]
}

export interface Results {
  game: InitializedGameInstance
  completedPrompt: {
    artistName: string | null
    lyric: string
    youtubeUrl: string | null
    correctAnswer: "rap" | "crap"
  }
}

export interface IGameInstance {
  _id?: string // created by mongoDB
  userId: string // the signed in user who initialized the game
  gameStartDate?: string
  playersObject: PlayersObject
}

export interface UpdateGameStateProps {
  answersObject: PlayerSelections
  gameId: string
  promptId: string
}
