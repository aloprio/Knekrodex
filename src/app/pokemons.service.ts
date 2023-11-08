import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  private apiURL='https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemons(): Observable<any> {
    return this.http.get(`${this.apiURL}?limit=1017`).pipe(
      mergeMap((data: any) => {
        const requests = data.results.map((pokemon: any) => 
          this.http.get(pokemon.url)
        );
        return forkJoin(requests);
      })
    );
  }
}
