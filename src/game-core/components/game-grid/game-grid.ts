import { Component, OnInit } from '@angular/core';
import { CellState, CellStatus, GameStatus } from '../../interfaces';
import { GameService } from '../../services/game.service';
import { delay, of, race, repeat, Subject, switchMap, takeWhile, tap, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../../ui/services/modal.service';
import { GameScore } from '../game-score/game-score';
import { GameResults } from '../game-results/game-results';
import { ModalRef } from '../../../ui/injectors/modal-ref';

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
    public selectedCellId: number|null = null;
    public gameStatus!: GameStatus

    private cellClicked$!: Subject<void>;

    constructor(
        private gameService: GameService,
        private modalService: ModalService
    ) {
    }

    ngOnInit(): void {
        this.gameGrid = this.initGameGrid();

        this.gameService.timeInMs$.subscribe(ms => this.timeInMs = ms);

        this.gameService.gameStatus$.subscribe(status => {
            this.gameStatus = status;

            if (status === 'playing') {
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
                repeat({ delay: 300 }),
                takeWhile(() => !this.gameService.isGameOver())
            )
            .subscribe({
                complete: () => this.finishGame()
            });
    }

    handleClickOnCell(cell: CellState): void {
        if (this.gameStatus === 'disabled') return;

        this.selectedCellId = cell.id;
        
        this.cellClicked$.next();  
        this.cellClicked$.complete();      
    }

    private startNextRound() {
        this.cellClicked$ = new Subject();

        this.selectedCellId = null;
        const activeCellId = this.gameService.chooseRandomCellId();

        this.setCellStatus(activeCellId, 'active')

        return race(
            this.cellClicked$.pipe(
                tap(() => {
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

    private finishGame(): void {
        this.gameService.setGameStatus('gameover');
        const modalRef: ModalRef = this.modalService.open(GameResults);

        modalRef.onClose().subscribe(source => {
            if (source !== 'content') {
                this.gameService.resetGame();
            }            
        })
    }
}
