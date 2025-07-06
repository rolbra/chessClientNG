import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FieldInfo } from '../classes/fieldInfo';
import { Bishop, Figure, Queen, Rook } from '../classes/figure';
import { Player } from '../classes/player';
import { GameInfo } from '../classes/gameInfo';
import { Directions } from '../classes/directions';
import { Position } from '../classes/position';


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
          switch(figure.type) {
            case 'rook':
              this.fields[figure.x][figure.y].figure = Object.assign(new Rook(), figure);
              console.log('rook detected while parsing incomming JSON');
              break;
            case 'bishop':
              this.fields[figure.x][figure.y].figure = Object.assign(new Bishop(), figure);
              console.log('bishop detected while parsing incomming JSON');
              break;
            case 'queen':
              this.fields[figure.x][figure.y].figure = Object.assign(new Queen(), figure);
              console.log('queen detected while parsing incomming JSON');
              break;
            default:
              this.fields[figure.x][figure.y].figure = Object.assign(new Figure(), figure);
              //console.error('undefined figure type detected while parsing incoming JSON');
          }
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

  public positionToString( pos : Position) : string {
    let x!: string;
    if(pos.x === 0)
      x = 'A';
    if(pos.x === 1)
      x = 'B';
    if(pos.x === 2)
      x = 'C';
    if(pos.x === 3)
      x = 'D';
    if(pos.x === 4)
      x = 'E';
    if(pos.x === 5)
      x = 'F';
    if(pos.x === 6)
      x = 'G';
    if(pos.x === 7)
      x = 'H';

    let y: string = (pos.y + 1).toString();
    return x+y;
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

    if(position.x < 0 || position.x > 7 || position.y < 0 || position.y > 7){
      return null;
    }

    return position;
  }

  public isAccessableField( srcPos : string, direction : Directions ) : any {
    let pos = this.positionStringToPosition(srcPos);

    //get destination field
    let destinationPos = this.getDestination( pos, direction );
    if(destinationPos == null)
      return false;

    //check if there is a figure
    let destinationField = this.fields[destinationPos.x][destinationPos.y];

    //no figure
    if( destinationField.figure.name === '')
      return this.positionToString(destinationPos);

    //figure
    let activePlayerColor = (this.activePlayer.id === this.player0.id) ? 'white' : 'black';
    if(destinationField.figure.color == activePlayerColor)
      return false;
    
    if(destinationField.figure.color != activePlayerColor)
      return this.positionToString(destinationPos);
  }

  public isFieldPopulatedByCurrentPlayer( position: Position ) : boolean {
    let activePlayerColor = (this.activePlayer.id === this.player0.id) ? 'white' : 'black';

    let field = this.fields[position.x][position.y];
    if(field.figure.color == activePlayerColor)
      return true;
    else
      return false;
  }

  public fieldPopulatedByColor( position: Position ) : string {
    return this.fields[position.x][position.y].figure.color;
  }

  public isFieldPopulated( position: Position ) : boolean {
    //check if there is a figure
    let destinationField = this.fields[position.x][position.y];

    //no figure
    if( destinationField.figure.name === '')
      return false;
    else
      return true;
  }

  public resetAccessableFields() {
    for( let i = 0; i < 8; i++ ) {
      for( let j = 0; j < 8; j++) {
        this.fields[i][j].accessable = false;
      }
    }
  }

  public getAccessableFields( id: string ) : FieldInfo[] | null {
    let srcFieldPos: Position = this.positionStringToPosition(id);  //todo: other name for positionStringToPosition()
    
    let srcField : FieldInfo = this.fields[srcFieldPos.x][srcFieldPos.y];
    if(srcField.figure.name == '') {
      console.log('empty field')
      return null;
    }

    //    figure belongs to current player?
      //todo: must be easier to check if player is white or black
    let activePlayerColor = (this.activePlayer.id === this.player0.id) ? 'white' : 'black';
    if(srcField.figure.color != activePlayerColor){
      console.log('TESTING: do not display accessable fields for enemy figures later');
      //return null;
    }

    //    which type of figure is it?
    //    try figure dependend pathes and mark accessable fields
    let accessableFields: FieldInfo[] = [];
    switch(srcField.figure.type) {
      case 'bishop':
      case 'rook':
      case 'queen':
        console.log('search accessable fields for ' + srcField.figure.type);

        for(let direction of srcField.figure.directions) {
          let currentFieldPos = Object.assign(Position, srcFieldPos);

          while(this.getDestination(currentFieldPos, direction) != null) {
            let destPos: Position = this.getDestination(currentFieldPos, direction);
            
            if(!this.isFieldPopulated(destPos)) {
              this.fields[destPos.x][destPos.y].accessable = true;
              accessableFields.push(this.fields[destPos.x][destPos.y]);
              currentFieldPos = Object.assign(Position, destPos); //update field position for next loop
            }
            else if(this.fieldPopulatedByColor(destPos) != srcField.figure.color) {
              this.fields[destPos.x][destPos.y].accessable = true;
              accessableFields.push(this.fields[destPos.x][destPos.y]);
              break;
            }
            else if(this.fieldPopulatedByColor(destPos) == srcField.figure.color) {
              break;
            }
            else {
              console.error('unexpected behavior in finding accessable fields for ' + srcField.figure.color + ' ' + srcField.figure.name);
              break;
            }
          }
        }
        break;
      default:
        console.log(srcField.figure.type + ' not implemented yet');
    }

    return accessableFields;
  }
}
