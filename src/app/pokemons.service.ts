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

  getPokemonUnico(id: number): Observable<Pokemon> {
    return this.http.get(`${this.apiURL}/${id}`).pipe(
      mergeMap((data: any) => {
        const pokemon = {
          image: data.sprites?.front_default,
          number: this.formatPokedexNumber(data.id),
          types: data.types.map((tipo: any) => tipo.type.name),
          name: data.name,
          weight: data.weight / 10,
          height: data.height / 10,
          stats: data.stats.map((stat: any) => ({ name: stat.stat.name, value: stat.base_stat })),
        } as Pokemon;
  
        return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`).pipe(
          map((speciesData: any) => {
            const descripcion = speciesData.flavor_text_entries;
            const descripcionEnIngles = descripcion.find((entry: any) => entry.language.name === 'en');
            pokemon.description = descripcionEnIngles ? descripcionEnIngles.flavor_text : '';
            return pokemon;
          })
        );
      })
    );
  }

  getPokemonSpriteAnimado(id: number): Observable<string> {
    return this.http.get(`${this.apiURL}/${id}`).pipe(
      map((data: any) => data.sprites.versions['generation-v']['black-white'].animated.front_default)
    );
  }

  getPokemonSpriteAnimadoShiny(id: number): Observable<string> {
    return this.http.get(`${this.apiURL}/${id}`).pipe(
      map((data: any) => data.sprites.versions['generation-v']['black-white'].animated.front_shiny)
    );
  }

  private formatPokedexNumber(id: number): string {
    return id !== undefined ? id.toString().padStart(3, '0') : '';
  }
}
