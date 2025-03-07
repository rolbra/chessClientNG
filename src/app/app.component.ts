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
  
  public themes: string[] = ['coffee', 'forest', 'neon', 'barbie', 'jewel'];
  public themeIndex: number = 0;

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
    });
  }

  public test() {
    this.positioner.updateFields();
  }
}
