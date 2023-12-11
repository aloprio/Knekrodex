import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonsService } from '../pokemons.service';
import { tipoService } from '../tipo.servise';
import { Pokemon} from '../model/pokemon';

@Component({
  selector: 'app-detalles-pokemon',
  templateUrl: './detalles-pokemon.component.html',
  styleUrls: ['./detalles-pokemon.component.css']
})
export class DetallesPokemonComponent implements OnInit {
  pokemon: Pokemon | undefined;
  debilidadesFortalezas: any = {};
  isShiny = false;

  constructor(
    private route: ActivatedRoute,
    private pokemonsService: PokemonsService,
    private tipoService: tipoService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
  
    this.pokemonsService.getPokemonUnico(id).subscribe((pokemon) => {
      if (pokemon) {
        this.pokemon = { ...pokemon, detallesEvolucion: [] };
        this.pokemonsService.getPokemonSpriteAnimado(id).subscribe((animatedSprite) => {
          if (this.pokemon) {
            this.pokemon.animatedSprite = animatedSprite!;
          }
  
          this.pokemonsService.getPokemonMovimientosPorNivel(id).subscribe((moves) => {
            if (this.pokemon) this.pokemon.moves = moves;
          });
  
          this.pokemonsService.getPokemonMovimientosPorMTMO(id).subscribe((moves) => {
            if (this.pokemon) this.pokemon.moves = moves;
          });
          this.pokemonsService.getPokemonEvolutionChain(id).subscribe((evolutionChain) => {
            if (this.pokemon && this.pokemon.detallesEvolucion) {
              this.pokemon.detallesEvolucion = evolutionChain.evolutionDetails;
              this.pokemon.detallesEvolucion.forEach((evolution) => {
                const evolutionId = parseInt(this.pokemonsService.getPokemonNumberFromURL(evolution.species.url));
                this.pokemonsService.getPokemonSpriteAnimado(evolutionId).subscribe((sprite) => {
                  evolution.species.image = sprite;
                });
              });
            }
          });
        });
      }
    });
    this.cargarDebilidadesYFortalezas();
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
          if (this.pokemon) {
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
