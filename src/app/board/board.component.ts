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


  public clickField(event: any){
    if( !event.target.parentElement.id ){
      return;
    }
    console.log( 'board clicked: ', event.target.id);

    if( this.positioner.sourceField == null ){
      this.positioner.sourceField = event.target;
      event.target.classList.add('selectedField');
    }
    else if( this.positioner.destinationField == null ){
      this.positioner.destinationField = event.target;
      event.target.classList.add('selectedField');
    }
  }
}
