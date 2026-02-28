import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { PositionerService } from '../services/positioner.service';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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

  username: string = '';
  gameId: string = '';

  public positioner: PositionerService;

  constructor(positioner : PositionerService, private route: ActivatedRoute, private router: Router){
    this.positioner = positioner;
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.username = params.get('username')?? '';
      this.gameId = params.get('gameId')?? '';
    });
    console.log(this.username + ' is here');
    this.positioner.connectWebSocket(this.gameId, this.username);
  }

  returnHome() {
    this.positioner.leaveGame(this.gameId, this.username);
    this.positioner.ws.close();
    this.router.navigate(['']);
  }

  public switchTheme() {
    this.themeIndex = ++this.themeIndex % this.themes.length;
  }

  public setFigures() {
    this.positioner.getAllPositionsWs(this.gameId);
  }

  public resetGame(){
    console.warn('game reset');
    this.positioner.resetGameWs();
  }

  public connect(){
  }

  public disconnect() {
  }
}
