export type CellStatus = 'disabled' | 'active' | 'success' | 'failed';

export type GameStatus = 'disabled' | 'playing' | 'gameover';

export interface CellState {
    id: number,
    status: CellStatus
}

export interface Score {
    player: number,
    computer: number
}