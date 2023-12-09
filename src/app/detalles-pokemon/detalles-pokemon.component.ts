import { Component } from '@angular/core';
import { Pokemon } from '../model/pokemon';
import { ActivatedRoute } from '@angular/router';
import { PokemonsService } from '../pokemons.service';
import { tipoService } from '../tipo.servise';

@Component({
  selector: 'app-detalles-pokemon',
  templateUrl: './detalles-pokemon.component.html',
  styleUrls: ['./detalles-pokemon.component.css']
})
export class DetallesPokemonComponent {
  pokemon: Pokemon | undefined;
  debilidadesFortalezas: any = {};
  isShiny = false;
  evolutionChain: Pokemon[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokemonsService: PokemonsService,
    private tipoService: tipoService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
  
    this.pokemonsService.getPokemonUnico(id).subscribe((pokemon) => {
      if (pokemon) {
        this.pokemon = pokemon;
        console.log('Pokemon:', this.pokemon);
        this.pokemonsService.getPokemonSpriteAnimado(id).subscribe((animatedSprite) => {
          if (this.pokemon) {
            this.pokemon.animatedSprite = animatedSprite!;
          }

        this.pokemonsService.getPokemonMovimientosPorNivel(id).subscribe((moves) => {
          if (this.pokemon)
          this.pokemon.moves = moves;
          });

        this.pokemonsService.getPokemonMovimientosPorMTMO(id).subscribe((moves) => {
          if (this.pokemon)
          this.pokemon.moves = moves;
          });
        });
      }
    });
    this.pokemonsService.getPokemonEvolutionChain(id).subscribe((evolutionChain: any) => {
      if (evolutionChain) {
        this.pokemon!.evolucion = this.extractEvolutionDetails(evolutionChain.chain);

        // Log adicional para verificar la evolución del Pokémon
        console.log('Pokemon Evolution:', this.pokemon!.evolucion);
      }
    });
    this.cargarDebilidadesYFortalezas();
   
    this.pokemonsService.getPokemonEvolutionChain(id).subscribe((evolutionChain: any) => {
      if (evolutionChain) {
        this.pokemon!.evolucion = this.extractEvolutionDetails(evolutionChain.chain);
        this.evolutionChain = [this.pokemon!, ...this.pokemon!.evolucion];
        console.log('Evolution Chain:', this.evolutionChain);
      }
    });
    console.log('Componente inicializado');
    console.log('Pokemon Evolution:', this.pokemon?.detallesEvolucion?.evolvesTo);
  }
  
  ngAfterViewInit(): void {
    console.log('Vista del componente inicializada');
  }


  cargarSpriteAnimadoShiny(): void {
    if (this.pokemon) {
      const id = +this.pokemon.number;
      if (this.isShiny) {
        this.pokemonsService.getPokemonSpriteAnimado(id).subscribe((animatedSprite) => {
          if (this.pokemon) {
          this.pokemon.animatedSprite = animatedSprite!;
          }
        });
      } else {
        this.pokemonsService.getPokemonSpriteAnimadoShiny(id).subscribe((animatedSpriteShiny) => {
          if (this.pokemon){
          this.pokemon.animatedSprite = animatedSpriteShiny!;
          }
        });
      }
      this.isShiny = !this.isShiny;
    }
  }

  cargarDebilidadesYFortalezas(): void {
    this.tipoService.getDebilidadesFortalezas().subscribe((data) => {
      this.debilidadesFortalezas = data;
    });
  }

  extractEvolutionDetails(chain: any): Pokemon[] {
    const evolutionArray: Pokemon[] = [];
    this.extractEvolutionDetailsRecursive(chain, evolutionArray);
    return evolutionArray;
  }

  private extractEvolutionDetailsRecursive(chain: any, evolutionArray: Pokemon[]): void {
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      for (const subChain of chain.evolves_to) {
        const subEvolution: Pokemon = {
          name: subChain.species.name,
          number: this.pokemonsService.getPokemonNumberFromURL(subChain.species.url),
          detallesEvolucion: {
            trigger: subChain.evolution_details.length > 0 ? subChain.evolution_details[0].trigger.name : 'Unknown',
            evolvesTo: []
          },
          image: undefined,
          types: [],
          weight: 0,
          height: 0,
          description: '',
          stats: [],
          moves: [],
          idCadenaEvolutiva: 0,
          triggerEvolucion: '',
          evolucion: []
        };
  
        evolutionArray.push(subEvolution);
        this.extractEvolutionDetailsRecursive(subChain, subEvolution.evolucion);
      }
    }
  }

  verDetallesEvolucion(pokemon: Pokemon): void {
    // Implementa la lógica para mostrar detalles de evolución según tus necesidades
    console.log('Detalles de Evolución', pokemon.evolucion);
  }
  
  getDebilidades(type: string): string[] {
    return this.debilidadesFortalezas[type] ? this.debilidadesFortalezas[type].x2 : [];
  }
  getFortalezas(type: string): string[] {
    return this.debilidadesFortalezas[type] ? this.debilidadesFortalezas[type]['x0.5'] : [];
  }

  getInmunidad(type: string): string[] {
    return this.debilidadesFortalezas[type] ? this.debilidadesFortalezas[type].x0 : [];
  }

  getTipos(type: string): string {
    switch (type) {
      case 'grass':
        return 'grass';
      case 'poison':
        return 'poison';
      case 'fire':
        return 'fire';
      case 'water':
        return 'water';
      case 'normal':
        return 'normal';
      case 'flying':
        return 'flying';
      case 'steel':
        return 'steel';
      case 'dragon':
        return 'dragon';
      case 'bug':
        return 'bug';
      case 'electric':
        return 'electric';
      case 'ground':
        return 'ground';
      case 'fairy':
        return 'fairy';
      case 'fighting':
        return 'fighting';
      case 'ice':
        return 'ice';
      case 'psychic':
        return 'psychic';
      case 'ghost':
        return 'ghost';
      case 'rock':
        return 'rock';
      case 'dark':
        return 'dark';
      default:
        return '';
    }
  }
}
