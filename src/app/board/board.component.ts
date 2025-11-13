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
  private accessableFields: string[] | null = [];

  constructor(positioner: PositionerService){
    this.positioner = positioner;
  }

  private idInAccessableFields(id: string) :boolean {
    if(!this.accessableFields)
      return false;

    for(let index = 0; index < this.accessableFields.length; index++){
      if(this.accessableFields[index] == id)
        return true;
    }

    return false;
  }

  public clickField(event: any){
    if( !event.target.parentElement.id ){
      return;
    }

    if( event.ctrlKey == true ){
      this.ctrlClickField(event);
      return;
    }

    let clickedFieldPos = this.positioner.positionStringToPosition(event.target.parentElement.id);
    console.log( 'board clicked: ', event.target.parentElement.id);

    if(this.positioner.isFieldPopulatedByCurrentPlayer(clickedFieldPos) ) {
      this.accessableFields = null;
      this.positioner.resetAccessableFields();
      this.positioner.sourceField = event.target;
      this.positioner.fields[clickedFieldPos.x][clickedFieldPos.y].selected = true;
      this.accessableFields = this.positioner.getAccessableFields(this.positioner.sourceField.parentElement.id);
    }
    else {
      if( !this.accessableFields || this.accessableFields.length == 0 ) {
        console.log('no source selected.');
        return;
      }

      let posString = event.target.parentElement.id;
      if( this.idInAccessableFields(posString) == false ) {
        console.log('click is not a valid destination');
        return;
      }
      else {
        console.log('click is a valid destination');
        this.positioner.destinationField = event.target;
        this.positioner.fields[clickedFieldPos.x][clickedFieldPos.y].selected = true;
        this.move();
        this.positioner.resetAccessableFields();
        this.accessableFields = null;
      }
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
    this.positioner.getAllPositionsWs();
  }

  public move() {
    //this.positioner.move(this.positioner.sourceField.parentElement.id, this.positioner.destinationField.parentElement.id).subscribe( respsonse => {
    //  this.reply = respsonse;
    //  console.log(this.reply);
    //});
    this.positioner.moveWs(this.positioner.sourceField.parentElement.id, this.positioner.destinationField.parentElement.id);
    
    this.positioner.sourceField = null;
    this.positioner.destinationField = null;
    
    this.positioner.resetAccessableFields();
    this.positioner.resetSelectedFields();
    
    this.setFigures();
  }
}
