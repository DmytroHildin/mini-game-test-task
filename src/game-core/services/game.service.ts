import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { GameStatus, Score } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class GameService {
  
    private score = new BehaviorSubject<Score>({player: 0, computer: 0});
    private gameStatus = new BehaviorSubject<GameStatus>('disabled');

    get score$(): Observable<Score> {
        return this.score.asObservable();
    }

    get gameStatus$(): Observable<GameStatus> {
        return this.gameStatus.asObservable();
    }

    setScore(scorer: 'player' | 'computer'): void {
        const currentScore: Score = this.score.value;
        this.score.next({
            ...currentScore, 
            [scorer]: currentScore[scorer]++
        })
    }

    setGameStatus(status: GameStatus): void {
        this.gameStatus.next(status);
    }

    chooseRandomCellId(): number {
        return Math.floor(Math.random() * 101);
    }
}
