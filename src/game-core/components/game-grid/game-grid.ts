import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-grid',
  imports: [],
  templateUrl: './game-grid.html',
  styleUrl: './game-grid.scss',
})
export class GameGrid implements OnInit {
    readonly GRID_SIZE = 10;

    public gameGrid: number[][] = [];

    ngOnInit(): void {
        this.gameGrid = this.initGameGrid();
        console.log(this.gameGrid);
    }

    initGameGrid(): number[][] {
        return Array.from({ length: this.GRID_SIZE }, 
                          () => Array(this.GRID_SIZE).fill(0)
                        ) 
    }

    handleClickOnCell(): void {
        console.log('111');
    }
}
