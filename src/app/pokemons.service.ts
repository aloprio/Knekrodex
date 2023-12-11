import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, mergeMap } from 'rxjs';
import { EvolutionChain, EvolutionDetails, Pokemon, PokemonMovimientos, Trigger } from './model/pokemon';
@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  private apiURL: string ='https://pokeapi.co/api/v2/pokemon';
  sanitizer: any;

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

  getPokemonMovimientosPorNivel(id: number): Observable<PokemonMovimientos[]> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`).pipe(
      mergeMap((data: any) => {
        const movimientosDatos = data.moves.filter((move: any) => 
          move.version_group_details.some((detail: any) => 
            detail.move_learn_method.name === 'level-up'));

        const movimientosSolicitud: Observable<PokemonMovimientos>[] = movimientosDatos.map((move: any) =>
          this.http.get(move.move.url).pipe(
            map((moveDetails: any) => {
              return {
                methodMove: move.version_group_details[0].move_learn_method.name,
                nameMove: moveDetails.name,
                typeMove: moveDetails.type.name,
                categoryMove: moveDetails.damage_class.name,
                powerMove: moveDetails.power,
                accuracyMove: moveDetails.accuracy,
                levelMove: move.version_group_details[0].level_learned_at
              } as PokemonMovimientos;
            })
          )
        );
        return forkJoin(movimientosSolicitud);
      })
    );
  }

  getPokemonMovimientosPorMTMO(id: number): Observable<PokemonMovimientos[]> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`).pipe(
      mergeMap((data: any) => {
        const movimientosDatos = data.moves.filter((move: any) => 
          move.version_group_details.some((detail: any) => 
            detail.move_learn_method.name === 'machine'));

        const movimientosSolicitud: Observable<PokemonMovimientos>[] = movimientosDatos.map((move: any) =>
          this.http.get(move.move.url).pipe(
            map((moveDetails: any) => {
              return {
                methodMove: move.version_group_details[0].move_learn_method.name,
                nameMove: moveDetails.name,
                typeMove: moveDetails.type.name,
                categoryMove: moveDetails.damage_class.name,
                powerMove: moveDetails.power,
                accuracyMove: moveDetails.accuracy,
              } as PokemonMovimientos;
            })
          )
        );
        return forkJoin(movimientosSolicitud);
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

  getPokemonEvolutionChain(id: number): Observable<EvolutionChain> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`).pipe(
      mergeMap((speciesData: any) => this.http.get(speciesData.evolution_chain.url)),
      map((evolutionChain: any) => {
        return {
          id: evolutionChain.id,
          evolutionDetails: this.mapToEvolutionDetails(evolutionChain.chain),
        } as EvolutionChain;
      })
    );
  }
  
  private mapToEvolutionDetails(chain: any): EvolutionDetails[] {
    const evolutionDetailsArray: EvolutionDetails[] = [];
  
    const traverseChain = (chain: any) => {
      if (chain && chain.species && chain.evolution_details) {
        const evolutionDetails: EvolutionDetails = {
          species: chain.species,
          evolves_to: Array.isArray(chain.evolves_to) ? [] : chain.evolves_to,
          evolution_details: chain.evolution_details.map((detail: any) => {
            const triggerType = detail.trigger && detail.trigger.name ? detail.trigger.name : 'unknown';

            console.log('Trigger:', detail.trigger);

            return {
              type: detail.trigger.name,
              description: this.getTriggerDescription(detail),
              level: detail.min_level,
              item: detail.item ? detail.item.name : undefined,
              happiness: detail.happiness,
              time_of_day: detail.time_of_day,
              gender: detail.gender,
              move: detail.move,
            } as Trigger;
          }),
        };
        
        evolutionDetailsArray.push(evolutionDetails);
        
        console.log('Detalles de la evolucion: ',evolutionDetails)

        if (Array.isArray(chain.evolves_to)) {
          chain.evolves_to.forEach((evolvesTo: any) => {
            traverseChain(evolvesTo);
          });
        }
      }
    };
  
    traverseChain(chain);
  
    console.log(evolutionDetailsArray);
  
    return evolutionDetailsArray;
  }
  
  
  
  
  private getTriggerDescription(trigger: Trigger): string {

    console.log('Trigger type:', trigger.type);
    switch (trigger.type) {
      case "level-up":
        console.log('Level-up trigger. Level:', trigger.level);
        return `Level up: at level ${trigger.level}.`;
      case "use-item":
        console.log('Evolution stone: with stone', trigger.item);
        return `Evolution stone: with stone (${trigger.item}).`;
      case "high-friendship":
        return `Friendship: with happiness: (${trigger.happiness})`;
      case "trade":
        return `Trade: Trading with another trainer.`;
      case "time-of-day":
        return `Time of the day: At time: (${trigger.time_of_day})`;
      case "gender":
        return `Gender: With gender: (${trigger.gender})`;
      case 'know-move':
        return `Certain move: Learning the move: (${trigger.move}).`;
      case "level-up-with-item":
        return `Level up with object: Level up to (${trigger.level}) with item (${trigger.item}).`;
      default:
        return "unknown";
    }
  }

  getPokemonNumberFromURL(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}