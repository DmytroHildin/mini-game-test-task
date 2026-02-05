import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameGrid } from '../game-core/components/game-grid/game-grid';
import { GameStarter } from '../game-core/components/game-starter/game-starter';
import { GameScore } from '../game-core/components/game-score/game-score';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    GameStarter,
    GameGrid,
    GameScore
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'mini-game-test-task';
}
