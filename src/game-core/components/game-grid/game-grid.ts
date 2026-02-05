import { Component, OnInit } from '@angular/core';
import { CellState, CellStatus } from '../../interfaces';
import { GameService } from '../../services/game.service';
import { delay, of, race, repeat, Subject, switchMap, takeWhile, tap, timer } from 'rxjs';
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
    private selectedCellId!: number;

    private cellClicked$!: Subject<void>;

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
        this.gameGrid = this.initGameGrid();
        console.log(this.gameGrid);

        this.gameService.timeInMs$.subscribe(ms => this.timeInMs = ms);

        this.gameService.gameStatus$.subscribe(status => {
            if (status === 'playing') {
                console.log(status);
                this.startNewGame();
            }
        })
    }

    initGameGrid(): CellState[][] {
        return Array.from({ length: this.GRID_SIZE }, 
                          (_, row) => Array.from({ length: this.GRID_SIZE }, 
                                                 (_, col) => ({id: row * this.GRID_SIZE + col, status: 'disabled'}))
                        ) 
    }

    private startNewGame() {
        of({})
          .pipe(
              switchMap(() => this.startNextRound()),
              repeat({ delay: 200 }),
              takeWhile(() => !this.gameService.isGameOver())
          )
          .subscribe(() => {
              if (this.gameService.isGameOver()) {
                  this.finishGame();
              }
          });
    }

    handleClickOnCell(cell: CellState): void {
        console.log(cell);
        // if (cell.status !== 'active') return;

        this.selectedCellId = cell.id;
        
        this.cellClicked$.next();  
        this.cellClicked$.complete();      
    }

    private startNextRound() {
        console.log('NEXT ROUND START')
        this.cellClicked$ = new Subject();
        const activeCellId = this.gameService.chooseRandomCellId();
        // this.setCellStatus(activeCellId, 'active');
        // console.log(activeCellId);

        // timer(this.timeInMs)
        //     .pipe(
        //         takeUntil(this.cellClicked$)
        //     )
        //     .subscribe(() => {
        //         console.log('failed')
        //         this.gameService.setScore('computer');
        //         this.setCellStatus(activeCellId, 'failed');

        //         this.startNextRound();
        //     })
        this.setCellStatus(activeCellId, 'active')

        return race(
            this.cellClicked$.pipe(
                tap(() => {
                    console.log('CLICKED IN RACE')
                    this.gameService.setScore(this.selectedCellId === activeCellId ? 'player' : 'computer');
                    this.setCellStatus(activeCellId, this.selectedCellId === activeCellId ? 'success' : 'failed');
                })
            ),
            timer(this.timeInMs).pipe(
                tap(() => {
                    this.gameService.setScore('computer');
                    this.setCellStatus(activeCellId, 'failed');
                })
            )
        )
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
