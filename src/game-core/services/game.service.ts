import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { GameStatus, Score } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class GameService {
  
    readonly WIN_SCORE: number = 10;

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

    setTime(ms: number) {
        this.timeInMs.next(ms);
    }

    setScore(scorer: 'player' | 'computer'): void {
        const currentScore: Score = this.score.value;
        
        this.score.next({
            ...currentScore, 
            [scorer]: ++currentScore[scorer]
        })
    }

    resetScore() {
        this.score.next({player: 0, computer: 0});
    }

    setGameStatus(status: GameStatus): void {
        this.gameStatus.next(status);
    }

    chooseRandomCellId(): number {
        return Math.floor(Math.random() * 100);
    }

    isGameOver(): boolean {
        const { player, computer } = this.score.value;
        return player === this.WIN_SCORE || computer === this.WIN_SCORE;
    }
}
