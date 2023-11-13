import { Component, OnInit } from '@angular/core';
import { PokemonsService } from '../pokemons.service';
import { Pokemon } from '../model/pokemon';

@Component({
  selector: 'app-lista-pokemon',
  templateUrl: './lista-pokemon.component.html',
  styleUrls: ['./lista-pokemon.component.css']
})
export class ListaPokemonComponent implements OnInit {

  pokemonsarray: Pokemon[] = [];
  pokemonsfiltrados: Pokemon[] = [];
  busquedaPorNombre: string = '';
  busquedaPorTipo: string = '';

  constructor(private pokemonsService: PokemonsService) {}

  ngOnInit(): void {
    this.pokemonsService.getPokemons(1017).subscribe((data: Pokemon[]) => {
      this.pokemonsarray = data;
      this.pokemonsfiltrados = [...this.pokemonsarray];
      console.log(this.pokemonsarray);
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
  filtroPokemons(): void {
    this.pokemonsfiltrados = this.pokemonsarray.filter(pokemon => {
      const nameMatches = pokemon.name.toLowerCase().includes(this.busquedaPorNombre.toLowerCase());
      const typeMatches = !this.busquedaPorTipo || pokemon.types.includes(this.busquedaPorTipo);
      return nameMatches && typeMatches;
    });
  }

  filtroPokemonPorNombre(): void {
    this.pokemonsfiltrados = this.pokemonsarray.filter(pokemon =>
      pokemon.name.toLowerCase().includes(this.busquedaPorNombre.toLowerCase())
    );
  }

}
