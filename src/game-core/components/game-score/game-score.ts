import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Observable } from 'rxjs';
import { Score } from '../../interfaces';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-game-score',
  imports: [AsyncPipe],
  templateUrl: './game-score.html',
  styleUrl: './game-score.scss',
})
export class GameScore implements OnInit {

    public gameScore$: Observable<Score>|null = null;;

    constructor(private gameService: GameService) {}

    ngOnInit(): void {
        this.gameScore$ = this.gameService.score$;
    }

}
