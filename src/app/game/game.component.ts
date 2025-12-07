import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { PositionerService } from '../services/positioner.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BoardComponent, NgClass],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  public themes: string[] = ['coffee', 'forest'];
  public themeIndex: number = 0;

  private reply: any;

  public positioner: PositionerService;

  constructor(positioner : PositionerService){
    this.positioner = positioner;
  }

  public switchTheme() {
    this.themeIndex = ++this.themeIndex % this.themes.length;
  }

  public setFigures() {
    this.positioner.getAllPositionsWs();
  }

  public resetGame(){
    console.warn('game reset');
    this.positioner.resetGameWs();
  }

  public connect(){
    this.positioner.connectWebSocket();
  }
}
