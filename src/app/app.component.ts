import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { PositionerService } from './services/positioner.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoardComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  title = 'chessClientNG';

  player0: string = 'player 0';
  player1: string = 'player 1';
  activePlayer: string = '';
  
  public themes: string[] = ['coffee', 'forest', 'neon', 'ice', 'barbie', 'jewel'];
  public themeIndex: number = 0;

  private reply: any;

  private positioner: PositionerService;

  constructor(positioner : PositionerService){
    this.positioner = positioner;
  }

  public switchTheme() {
    this.themeIndex = ++this.themeIndex % this.themes.length;
  }

  public setFigures() {
    this.positioner.getAllPositions().subscribe( respsonse => {
      this.positioner.positions = respsonse;
      this.positioner.updateFields();
      this.player0 = this.positioner.player0.name;
      this.player1 = this.positioner.player1.name;
      this.activePlayer = this.positioner.activePlayer.name;
      
    });
  }

  public move() {
    this.positioner.move(this.positioner.sourceField.parentElement.id, this.positioner.destinationField.parentElement.id).subscribe( respsonse => {
      this.reply = respsonse;
      console.log(this.reply);
    });

    this.positioner.sourceField.classList.remove('selectedField');
    this.positioner.sourceField = null;
    this.positioner.destinationField.classList.remove('selectedField');;
    this.positioner.destinationField = null;
    
    this.setFigures();
  }

  public async resetGame(){
    console.warn('game reset');
    await this.positioner.resetGame().subscribe( respsonse => {
      this.reply = respsonse;
      console.log(this.reply);
    });

    this.setFigures();
  }
}
