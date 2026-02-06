import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CellState, CellStatus, GameStatus } from '../../interfaces';
import { GameService } from '../../services/game.service';
import { Observable, of, race, repeat, Subject, switchMap, takeWhile, tap, timer } from 'rxjs';
import { ModalService } from '../../../ui/services/modal.service';
import { GameResults } from '../game-results/game-results';
import { ModalRef } from '../../../ui/injectors/modal-ref';

@Component({
  selector: 'app-game-grid',
  imports: [],
  templateUrl: './game-grid.html',
  styleUrl: './game-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameGrid implements OnInit {

    public gameGrid!: CellState[][];
    private timeInMs: number = 0;
    public selectedCellId: number|null = null;
    public gameStatus!: GameStatus

    private cellClicked$!: Subject<void>;

    constructor(
        private gameService: GameService,
        private modalService: ModalService,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.gameGrid = this.gameService.initGameGrid();
        this.gameService.timeInMs$.subscribe(ms => this.timeInMs = ms);

        this.gameService.gameStatus$.subscribe(status => {
            this.gameStatus = status;
            this.cdr.markForCheck();

            if (status === 'playing') {
                this.startNewGame();
            }
        })
    }

    private startNewGame(): void {
        of({})
            .pipe(
                switchMap(() => this.playNextRound()),
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

    private playNextRound(): Observable<void | number> {
        this.cellClicked$ = new Subject();

        this.selectedCellId = null;
        const activeCellId = this.gameService.chooseRandomCellId();

        this.setCellStatus(activeCellId, 'active');

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

        this.cdr.markForCheck();
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
