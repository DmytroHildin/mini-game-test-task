import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { CellState, GameStatus, Score } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class GameService {
  
    readonly GRID_SIZE = 10;
    readonly WIN_SCORE: number = 10;

    private lastRandomCellId: number | null = null;

    private timeInMs = new BehaviorSubject<number>(0);
    private score = new BehaviorSubject<Score>({player: 0, computer: 0});
    private gameStatus = new BehaviorSubject<GameStatus>('disabled');

    get score$(): Observable<Score> {
        return this.score.asObservable();
    }

    get gameStatus$(): Observable<GameStatus> {
        return this.gameStatus.asObservable();
    }

    get timeInMs$(): Observable<number> {
        return this.timeInMs.asObservable();
    }

    setTime(ms: number): void {
        this.timeInMs.next(ms);
    }

    setScore(scorer: 'player' | 'computer'): void {
        const currentScore: Score = this.score.value;
        
        this.score.next({
            ...currentScore, 
            [scorer]: ++currentScore[scorer]
        })
    }

    initGameGrid(): CellState[][] {
        return Array.from({ length: this.GRID_SIZE }, 
                            (_, row) => Array.from({ length: this.GRID_SIZE }, 
                                                    (_, col) => ({id: row * this.GRID_SIZE + col, status: 'disabled'}))
                        ) 
    }

    resetScore(): void {
        this.score.next({player: 0, computer: 0});
    }

    setGameStatus(status: GameStatus): void {
        this.gameStatus.next(status);
    }

    resetGame(): void {
        this.resetScore();
        this.setGameStatus('disabled');
    }

    refreshGame(): void {
        this.resetScore();
        this.setGameStatus('playing');
    }

    chooseRandomCellId(): number {
        let newNumber: number;

        do {
            newNumber = Math.floor(Math.random() * 100);
        } while (newNumber === this.lastRandomCellId);

        this.lastRandomCellId = newNumber;
        return newNumber;
    }

    isGameOver(): boolean {
        const { player, computer } = this.score.value;
        return player === this.WIN_SCORE || computer === this.WIN_SCORE;
    }
}
