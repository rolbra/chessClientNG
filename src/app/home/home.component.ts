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

  public positioner: PositionerService;

  constructor(positioner : PositionerService, private router: Router){
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

  joinGame() {
    if(this.username.trim()) {
      this.router.navigate(['/game'], { queryParams: { username: this.username.trim(), gameId: this.gameId }});
    }
  }
}
