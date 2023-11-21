import { Component } from '@angular/core';
import { Pokemon } from '../model/pokemon';
import { ActivatedRoute } from '@angular/router';
import { PokemonsService } from '../pokemons.service';

@Component({
  selector: 'app-detalles-pokemon',
  templateUrl: './detalles-pokemon.component.html',
  styleUrls: ['./detalles-pokemon.component.css']
})
export class DetallesPokemonComponent {
  pokemon: Pokemon | undefined;

  constructor(
    private route: ActivatedRoute,
    private pokemonsService: PokemonsService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
  
    this.pokemonsService.getPokemonUnico(id).subscribe((pokemon) => {
      if (pokemon) {
        this.pokemon = pokemon;
        this.pokemonsService.getPokemonSpriteAnimado(id).subscribe((animatedSprite) => {
          if (this.pokemon) {
            this.pokemon.animatedSprite = animatedSprite!;
          }
        });
      }
    });
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
