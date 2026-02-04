import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameGrid } from '../game-core/components/game-grid/game-grid';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    GameGrid
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'mini-game-test-task';
}
