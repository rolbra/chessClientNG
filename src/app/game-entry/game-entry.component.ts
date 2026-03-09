import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-entry',
  standalone: true,
  imports: [],
  templateUrl: './game-entry.component.html',
  styleUrl: './game-entry.component.scss'
})
export class GameEntryComponent {
  @Input() gameId!: string;

  ngOnInit() {
    //load information wiht gameId
    console.log(this.gameId);
  }
}
