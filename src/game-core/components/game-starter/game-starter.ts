import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { GameService } from '../../services/game.service';
import { GameStatus } from '../../interfaces';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-game-starter',
  imports: [
      ReactiveFormsModule,
      AsyncPipe
  ],
  templateUrl: './game-starter.html',
  styleUrl: './game-starter.scss',
})
export class GameStarter implements OnInit {

    public gameStatus$: Observable<GameStatus>|null = null

    constructor(private gameService: GameService) {}

    ngOnInit(): void {
        this.gameStatus$ = this.gameService.gameStatus$;
    }

    public gameStarterForm = new FormGroup({
        time: new FormControl('', [Validators.required, 
                                   Validators.min(1000),
                                   Validators.max(1500)])
    });

    get time() {
        return this.gameStarterForm.get('time');
    }

    public startGame(): void {
        console.log('start');
        this.gameService.setTime(+(this.time?.value ?? 0));
        this.gameService.refreshGame();
    }
}
