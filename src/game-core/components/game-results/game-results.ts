import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Score } from '../../interfaces';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ModalRef } from '../../../ui/injectors/modal-ref';

@Component({
  selector: 'app-game-results',
  imports: [AsyncPipe],
  templateUrl: './game-results.html',
  styleUrl: './game-results.scss',
})
export class GameResults implements OnInit {

    public results$!: Observable<Score>;

    constructor(
        private gameService: GameService,
        private modalRef: ModalRef
    ) {}
    
    ngOnInit(): void {
        this.results$ = this.gameService.score$;
    }

    restartGame(): void {
        this.gameService.refreshGame();
        this.modalRef.close();
    }
}
