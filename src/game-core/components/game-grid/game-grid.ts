import { Component, OnInit } from '@angular/core';
import { CellState, CellStatus } from '../../interfaces';
import { GameService } from '../../services/game.service';
import { Subject, takeUntil, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-game-grid',
  imports: [],
  templateUrl: './game-grid.html',
  styleUrl: './game-grid.scss',
})
export class GameGrid implements OnInit {
    readonly GRID_SIZE = 10;

    public gameGrid: CellState[][] = [];
    private timeInMs: number = 0;

    private cellClicked$ = new Subject<void>();

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
        this.gameGrid = this.initGameGrid();
        console.log(this.gameGrid);

        this.gameService.timeInMs$.subscribe(ms => this.timeInMs = ms);

        this.gameService.gameStatus$.subscribe(status => {
            if (status === 'playing') {
                console.log(status);
                this.startNextRound();
            }
        })
    }

    initGameGrid(): CellState[][] {
        return Array.from({ length: this.GRID_SIZE }, 
                          (_, row) => Array.from({ length: this.GRID_SIZE }, 
                                                 (_, col) => ({id: row * this.GRID_SIZE + col, status: 'disabled'}))
                        ) 
    }

    handleClickOnCell(cell: CellState): void {
        console.log(cell);
        if (cell.status !== 'active') return;
        
        this.cellClicked$.next();
        this.gameService.setScore('player');
        this.setCellStatus(cell.id, 'success');

        timer(500).subscribe(() => this.startNextRound());        
    }

    private startNextRound() {
        if (this.gameService.isGameOver()) {
            this.finishGame();
            return;
        }

        const activeCellId = this.gameService.chooseRandomCellId();
        this.setCellStatus(activeCellId, 'active');
        console.log(activeCellId);

        timer(this.timeInMs)
            .pipe(
                takeUntil(this.cellClicked$)
            )
            .subscribe(() => {
                console.log('failed')
                this.gameService.setScore('computer');
                this.setCellStatus(activeCellId, 'failed');

                this.startNextRound();
            })
    }

    private setCellStatus(id: number, status: CellStatus): void {
        this.gameGrid = this.gameGrid.map(row =>
            row.map(cell =>
                cell.id === id
                    ? { ...cell, status }
                    : { ...cell, status: 'disabled' }
            )
          )
    }

    private finishGame() {
        this.gameService.setGameStatus('gameover');
    }
}
