import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FieldInfo } from '../classes/fieldInfo';
import { Figure } from '../classes/figure';
import { Player } from '../classes/player';
import { GameInfo } from '../classes/gameInfo';


enum Directions {
  bottomLeft,
  left,
  topLeft,
  top,
  topRight,
  right,
  bottomRight,
  bottom
}

class Position {
  x : number = -1;
  y : number = -1;
}

@Injectable({
  providedIn: 'root'
})
export class PositionerService {

  public empty: string = '&#8192';
  public testCode: string = '&#x265F';

  public positions!: Object;

  public player0: Player;
  public player1: Player;
  public activePlayer: Player;

  public sourceField: any = null;
  public destinationField: any = null;

  public fields: FieldInfo[][] = [];

  private readonly httpClient = inject(HttpClient);

  constructor(){
    let rows = 8;
    let cols = 8;

    this.player0 = new Player;
    this.player1 = new Player;
    this.activePlayer = new Player;

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

    let transferData = JSON.stringify(this.positions);
    console.log(transferData);

    type parsedType = {
      gameInfo: GameInfo,
      playerBlack: Player,
      playerWhite: Player,
      activePlayer: Player,
      figures: Figure[]
    }

    const parsedStr = JSON.parse(transferData) as parsedType;

    try{
      parsedStr.figures.forEach(figure => {
        if(figure.x < 0 || figure.x > 7 || figure.y < 0 || figure.y > 7){
          console.log(figure.name + ' is out of range');
        }
        // else if(!figure.x || !figure.y){
        //   console.log(figure.name + ' invalid position');
        // }
        else{
          this.fields[figure.x][figure.y].figure = figure;
        }
      });

      this.player0.id = parsedStr.playerWhite.id;
      this.player0.name = parsedStr.playerWhite.name;

      this.player1.id = parsedStr.playerBlack.id;
      this.player1.name = parsedStr.playerBlack.name;

      this.activePlayer.id = parsedStr.activePlayer.id;
      this.activePlayer.name = parsedStr.activePlayer.name;
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
        this.fields[i][j].figure.name = '';
        this.fields[i][j].figure.type = '';
        this.fields[i][j].figure.color = '';
        this.fields[i][j].figure.code = this.empty;
        this.fields[i][j].figure.x = -1;
        this.fields[i][j].figure.y = -1;
      }
    }
  }

  private charToInt( c : string ) : number {
    if( c == 'A' )
      return 0;
    if( c == 'B' )
      return 1;
    if( c == 'C' )
      return 2;
    if( c == 'D' )
      return 3;
    if( c == 'E' )
      return 4;
    if( c == 'F' )
      return 5;
    if( c == 'G' )
      return 6;
    if( c == 'H' )
      return 7;
    return -1;
  }
  
  public positionStringToPosition( posString : string) : Position{
    let pos = new Position;
    
    //posX is A, B, C,... charToInt returns 0, 1, 2,...
    let posX = posString.at(0);
    if(posX) {
      pos.x = this.charToInt(posX);
    }
    
    //posY is 1, 2, 3,... charToInt returns 1, 2, 3,... Subtract 1 to get a 0,0 based position
    let posY = posString.at(1); 
    if(posY) {
      pos.y = parseInt(posY) - 1;
    }

    return pos;
  }

  private getDestination( pos : Position, direction : Directions ) : any {
    let position = Object.assign({}, pos);
    switch (direction) {
      case Directions.bottomLeft:
        position.x--;
        position.y--;
        break;
      case Directions.left:
        position.x--;
        break;
      case Directions.topLeft:
        position.x--;
        position.y++;
        break;
      case Directions.top:
        position.y++;
        break;
      case Directions.topRight:
        position.x++;
        position.y++;
        break;
      case Directions.right:
        position.x++;
        break;
      case Directions.bottomRight:
        position.x++;
        position.y--;
        break;
      case Directions.bottom:
        position.y--;
        break;
      default:
        console.error("unmanaged direction");
        return -1;
    }

    if(position.x < 0 || position.y < 0){
      return null;
    }

    return position;
  }

  public isAccessableField( srcPos : string, direction : Directions ) : boolean {
    let pos = this.positionStringToPosition(srcPos);

    let destinationPos0 = this.getDestination( pos, Directions.bottom );
    let destinationPos1 = this.getDestination( pos, Directions.bottomLeft );
    let destinationPos2 = this.getDestination( pos, Directions.left );
    let destinationPos3 = this.getDestination( pos, Directions.topLeft );
    let destinationPos4 = this.getDestination( pos, Directions.top );
    let destinationPos5 = this.getDestination( pos, Directions.topRight );
    let destinationPos6 = this.getDestination( pos, Directions.right );
    let destinationPos7 = this.getDestination( pos, Directions.bottomRight );
    return false;
  }
}
