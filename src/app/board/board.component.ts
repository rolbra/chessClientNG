import { Component } from '@angular/core';
import { FieldComponent } from '../field/field.component';
import { FieldInfo } from '../classes/fieldInfo';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [FieldComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  public codeA8: string = '&#x265F';
  public empty: string = '&#8192';

  public fields: FieldInfo[][] = [];
  
  constructor(){
    let rows = 8;
    let cols = 8;

    for(let i = 0; i < rows; i++) {
      this.fields[i] = [];
      for(let j = 0; j < cols; j++) {
        let colorType: string;
        
        if( (i%2 == 0 && j%2 == 0) || (i%2 == 1 && j%2 == 1) )
          colorType = 'darkField';
        else
          colorType = 'lightField';

        this.fields[i][j] = new FieldInfo(colorType);
      }
    }

  }
}
