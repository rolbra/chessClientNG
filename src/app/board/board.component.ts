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

  private reply: any;

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

    if( this.positioner.sourceField == null ) {
      if( this.positioner.preselectedField == null ){
        this.positioner.preselectedField = event.target;
        event.target.classList.add('preselectedField');
        this.onMouseOver(event);
      }
      else if( this.positioner.preselectedField != event.target ) {
        this.positioner.preselectedField.classList.remove('preselectedField');
        this.positioner.preselectedField = event.target;
        this.positioner.preselectedField.classList.add('preselectedField');
        this.onMouseOver(event);
      }
      else if( this.positioner.preselectedField == event.target ) {
        this.positioner.sourceField = event.target;
        this.positioner.sourceField.classList.remove('preselectedField');
        this.positioner.sourceField.classList.add('selectedField');
      }
    }
    else if( this.positioner.destinationField == null ){
      this.positioner.destinationField = event.target;
      this.move();
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
      console.log( "Here is a " + field.figure.color + " " + field.figure.type + " standing" );
    }
    else {
      console.log( "field " + coordinate.x + coordinate.y + " is empty" );
      return;
    }

    //figure belongs to player?
    
    //which kind of figure is it?
    this.positioner.isAccessableField(event.target.parentElement.id, 0);
  }

  public onMouseOver(event: any) {
    let id = event.target.parentElement.id;
    
    //keep markers for accessable fields if the source field is already selected
    if(this.positioner.sourceField != null) {
      return;
    }

    this.positioner.resetAccessableFields();
    let accessableFields = this.positioner.getAccessableFields(id);
    
    //console.log(accessableFields);
  }

  public setFigures() {
    this.positioner.getAllPositions().subscribe( respsonse => {
      this.positioner.positions = respsonse;
      this.positioner.updateFields();
    });
  }

  public move() {
    //this.positioner.move(this.positioner.sourceField.parentElement.id, this.positioner.destinationField.parentElement.id).subscribe( respsonse => {
    //  this.reply = respsonse;
    //  console.log(this.reply);
    //});
    this.positioner.moveWs(this.positioner.sourceField.parentElement.id, this.positioner.destinationField.parentElement.id);

    this.positioner.sourceField.classList.remove('selectedField');
    this.positioner.sourceField = null;
    this.positioner.destinationField.classList.remove('selectedField');
    this.positioner.destinationField = null;
    
    this.positioner.resetAccessableFields();
    
    this.setFigures();
  }
}
