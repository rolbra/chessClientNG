import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './game/game.component';
import { PositionerService } from './services/positioner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  title = 'chessClientNG';

  username: string = '';
  gameId: string = '';

  public positioner: PositionerService;

  constructor(positioner : PositionerService){
    this.positioner = positioner;
  }

  createNewGame(){
    this.positioner.createNewGame(this.username).subscribe({
      next: response => {
        console.log('Success:', response);
        this.gameId = response.gameId;
      },
      error: error => {
        console.error('Error', error);
      }
    })
  }
  
}
