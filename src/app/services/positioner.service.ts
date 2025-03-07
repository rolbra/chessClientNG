import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionerService {

  private readonly httpClient = inject(HttpClient);

  constructor(){}
  
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
}
