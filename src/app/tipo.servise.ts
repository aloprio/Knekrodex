import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, mergeMap } from 'rxjs';
import { Pokemon } from './model/pokemon';

@Injectable({
  providedIn: 'root'
})
export class tipoService {

private apiURL: string ='https://pokeapi.co/api/v2/pokemon';
constructor(private http: HttpClient) { }

getDebilidadesFortalezas(): Observable<any> {
    return this.http.get('assets/tablaTipos.json');
  }
}