import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-starter',
  imports: [
      ReactiveFormsModule
  ],
  templateUrl: './game-starter.html',
  styleUrl: './game-starter.scss',
})
export class GameStarter {

    constructor(private gameService: GameService) {

    }

    public gameStarterForm = new FormGroup({
        time: new FormControl('', [Validators.required, 
                                   Validators.min(1500),
                                   Validators.max(3000)])
    });

    get time() {
        return this.gameStarterForm.get('time');
    }

    public startGame() {
        console.log('start');

        this.gameService.setGameStatus('playing');
    }
}
