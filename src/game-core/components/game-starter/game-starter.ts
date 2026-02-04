import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-game-starter',
  imports: [
      ReactiveFormsModule
  ],
  templateUrl: './game-starter.html',
  styleUrl: './game-starter.scss',
})
export class GameStarter {

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
    }
}
