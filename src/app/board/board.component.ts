import { Component } from '@angular/core';
import { FieldComponent } from '../field/field.component';
import { PositionerService } from '../services/positioner.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [FieldComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  
  public positioner: PositionerService;
  
  constructor(positioner: PositionerService){
    this.positioner = positioner;
  }

}
