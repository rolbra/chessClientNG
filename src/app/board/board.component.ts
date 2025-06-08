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

    if( event.ctrlKey == true ){
      this.ctrlClickField(event);
      return;
    }    
    console.log( 'board clicked: ', event.target.parentElement.id);

    if( this.positioner.sourceField == null ){
      this.positioner.sourceField = event.target;
      event.target.classList.add('selectedField');
    }
    else if( this.positioner.destinationField == null ){
      this.positioner.destinationField = event.target;
      event.target.classList.add('selectedField');
    }
  }

  public ctrlClickField(event: any){
    if( !event.target.parentElement.id ){
      return;
    }
    let position = event.target.parentElement.id;
    console.log( 'board ctrl clicked: ', position);
    //validate source
    let coordinate = this.positioner.positionStringToPosition( position );
    //is there a figure?
    let field = this.positioner.fields[coordinate.x][coordinate.y];
    if( field.figure.name != "" ){
      console.log( "Here is a " + field.figure.name + " standing" );
    }
    else {
      console.log( "field " + coordinate.x + coordinate.y + " is empty" );
    }
    //figure belongs to player?
    //which kind of figure is it?
    this.positioner.isAccessableField(event.target.parentElement.id, 0);
  }
}
