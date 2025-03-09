import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FieldInfo } from '../classes/fieldInfo';
import { Figure } from '../classes/figure';

@Injectable({
  providedIn: 'root'
})
export class PositionerService {

  public empty: string = '&#8192';
  public testCode: string = '&#x265F';

  public positions!: Object;

  public sourceField: any = null;
  public destinationField: any = null;

  public fields: FieldInfo[][] = [];

  private readonly httpClient = inject(HttpClient);

  constructor(){
    let rows = 8;
    let cols = 8;

    //init 2d-array and set field as dark field or light field
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
  
  getAllPositions():Observable<any>{
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    const body = {gameId:"A489-78D1"};
    
    return this.httpClient.post('http://lx-roland:8080/api/positions', JSON.stringify(body), {headers});
  }

  move(moveFrom: string, moveTo: string):Observable<any>{
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    const body = {from:moveFrom, to:moveTo};
    
    return this.httpClient.post('http://lx-roland:8080/api/moveFigure', JSON.stringify(body), {headers});
  }

  resetGame():Observable<any>{
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
      const body = {gameId:"A489-78D1"};
    
    return this.httpClient.post('http://lx-roland:8080/api/resetGame', JSON.stringify(body), {headers});
  }

  public updateFields() {
    this.clearFields();

    let positionString = JSON.stringify(this.positions);
    console.log(positionString);

    const parsedStr = JSON.parse(positionString) as Figure[];

    try{
      parsedStr.forEach(figure => {
        if(figure.x < 0 || figure.x > 7 || figure.y < 0 || figure.y > 7){
          console.log(figure.name + ' is out of range');
        }
        else if(!figure.x || !figure.y){
          console.log(figure.name + ' invalid position');
        }
        else{
          this.fields[figure.x][figure.y].figure = figure;
        }
      });
    }
    catch(error){
      console.warn("unexpected response from server for 'positions'");
    }
  }

  private clearFields() {
    let rows = 8;
    let cols = 8;

    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < cols; j++) {
        this.fields[i][j].figure.code = this.empty;
        
      }
    }
  }
}
