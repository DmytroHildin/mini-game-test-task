import { Component, OnInit } from '@angular/core';
import { CellState } from '../../interfaces';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-grid',
  imports: [],
  templateUrl: './game-grid.html',
  styleUrl: './game-grid.scss',
})
export class GameGrid implements OnInit {
    readonly GRID_SIZE = 10;

    public gameGrid: CellState[][] = [];

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
        this.gameGrid = this.initGameGrid();
        console.log(this.gameGrid);

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
    }

    private startNextRound() {
        const activeCellId = this.gameService.chooseRandomCellId();
        console.log(activeCellId);
    }
}
