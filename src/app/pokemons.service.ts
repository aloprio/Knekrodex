import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, mergeMap } from 'rxjs';
import { Pokemon } from './model/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  private apiURL: string ='https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemonsPorGeneracion(limit: number, offset: number): Observable<Pokemon[]> {
    const peticionesApi: Observable<Pokemon>[] = [];
  
    for (let i = offset + 1; i <= offset + limit; i++) {
      const peticion = this.http.get(`${this.apiURL}/${i}`).pipe(
        map((data: any) => ({
          image: data.sprites?.front_default,
          number: this.formatPokedexNumber(data.id),
          types: data.types.map((tipo: any) => tipo.type.name),
          name: data.name
        } as Pokemon))
      );
      peticionesApi.push(peticion);
    }
  
    return forkJoin(peticionesApi);
  }

  private formatPokedexNumber(id: number): string {
    return id !== undefined ? id.toString().padStart(3, '0') : '';
  }
}
