import { Component } from '@angular/core';
import { PositionerService } from '../services/positioner.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title = 'chessClientNG';
  
  username: string = '';
  gameId: string = '';
  gameIds: any;

  public positioner: PositionerService;

  constructor(positioner : PositionerService, private router: Router){
    this.positioner = positioner;
  }

  ngOnInit() {
    this.positioner.getGameList().subscribe({
      next: response => {
        console.log('success:', response);
        this.gameIds = response;
      },
      error: error => {
        console.error('Error', error);
      }
    });
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
    });

    this.positioner.getGameList().subscribe({
      next: response => {
        console.log('success:', response);
        this.gameIds = response;
      },
      error: error => {
        console.error('Error', error);
      }
    });
  }

  joinGame(gameId: string) {
    if(!this.username.trim()) {
      console.warn('defaultUser');
    }
    if(!gameId) {
      console.warn('no game id');
      return;
    }
    this.router.navigate(['/game'], { queryParams: { username: this.username.trim(), gameId: gameId }});
  }
}
