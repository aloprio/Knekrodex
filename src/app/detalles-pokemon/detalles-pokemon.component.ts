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
    this.pokemonsService.getPokemonEvolutionChain(id).subscribe((evolutionChain) => {
      if (evolutionChain) {
        this.pokemon!.evolucion = this.extractEvolutionDetails(evolutionChain.chain);
        this.evolutionChain = [...this.pokemon!.evolucion];

        // Llama a la función para mostrar detalles de evolución
        this.verDetallesEvolucion(this.pokemon!);

        // Cargamos la imagen animada de la evolución más cercana
        this.cargarImagenEvolucion(this.pokemon!.evolucion[0]);
      }
    });

    this.cargarDebilidadesYFortalezas();
    if (this.pokemon?.evolucion) {
      this.cargarCadenaEvolutiva(this.pokemon.evolucion);
      this.cargarImagenesEvolucion(this.pokemon.evolucion);
    }
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

  getVisibleEvolutions(evolutions: Pokemon[]): Pokemon[] {
    // Limita la cantidad de evoluciones visibles a 2
    return evolutions.slice(0, 2);
  }

  cargarImagenEvolucion(target: Pokemon | undefined): void {
  if (target) {
    // Cargar imagen animada
    this.pokemonsService.getPokemonSpriteAnimado(+target.number).subscribe((animatedSprite) => {
      target.animatedSprite = animatedSprite!;
    });

    // Cargar imagen estática
    this.pokemonsService.getPokemonSpriteAnimado(+target.number).subscribe((image) => {
      target.image = image!;
    });
  }
}

cargarImagenesEvolucion(evolucion: Pokemon[] | undefined): void {
  if (evolucion) {
    evolucion.forEach(pokemon => {
      this.cargarImagenEvolucion(pokemon);
    });
  }
}

cargarCadenaEvolutiva(chain: any): void {
  if (chain) {
    this.evolutionChain = this.extractEvolutionDetails(chain);
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
    if (chain.species) {
      const subEvolution: Pokemon = {
        name: chain.species.name,
        number: this.pokemonsService.getPokemonNumberFromURL(chain.species.url),
        detallesEvolucion: {
          trigger: 'Unknown',
          evolvesTo: []
        },
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemonsService.getPokemonNumberFromURL(chain.species.url)}.png`, // Asignar la URL de la imagen
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
  
      if (chain.evolution_details && chain.evolution_details.length > 0) {
        const firstEvolutionDetail = chain.evolution_details[0];
  
        if (subEvolution.detallesEvolucion) {
          subEvolution.detallesEvolucion.trigger = this.getTriggerDescription(firstEvolutionDetail.trigger.name);
        }
      }
  
      evolutionArray.push(subEvolution);
  
      if (chain.evolves_to && chain.evolves_to.length > 0) {
        chain.evolves_to.forEach((evolvesTo: any) => {
          this.extractEvolutionDetailsRecursive(evolvesTo, evolutionArray);
        });
      }
    }
  } 

  private getTriggerDescription(triggerName: string): string {
    // Puedes personalizar esta función según las convenciones que prefieras
    switch (triggerName) {
      case 'level-up':
        return 'Subir de nivel';
      case 'trade':
        return 'Intercambio';
      case 'object':
        return 'objeto';
      default:
        return 'Desconocido';
    }
  }
  

  verDetallesEvolucion(pokemon: Pokemon): void {
    if (pokemon.evolucion) {
      console.log('Detalles de Evolución para', pokemon.name);
  
      // Itera sobre cada paso de evolución
      pokemon.evolucion.forEach(evolutionStep => {
        console.log('Nombre:', evolutionStep.name);
        console.log('Número:', evolutionStep.number);
  
        // Verifica si hay detalles de evolución disponibles
        if (evolutionStep.detallesEvolucion) {
          console.log('Detalles de Evolución:', evolutionStep.detallesEvolucion);
  
          // Itera sobre las evoluciones dentro de la evolución actual
          console.log('Evoluciones:');
          evolutionStep.detallesEvolucion.evolvesTo.forEach(subEvolution => {
            console.log(subEvolution);
          });
        } else {
          console.log('No hay detalles de evolución disponibles para', evolutionStep.name);
        }
  
        console.log('--------------------------------------------');
      });
    } else {
      console.log('No hay detalles de evolución disponibles para', pokemon.name);
    }
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
