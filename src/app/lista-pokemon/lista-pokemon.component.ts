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
  busquedaPorTipo: string[] = [];
  limitePokemonsCargados: number = 493;

  constructor(private pokemonsService: PokemonsService) {}

  ngOnInit(): void {
    this.cargarPokemons();
  }

  cargarPokemonsPorGeneracion(limit: number, offset: number): void {
    this.pokemonsService.getPokemonsPorGeneracion(limit, offset).subscribe((data: Pokemon[]) => {
      this.pokemonsarray = data;
      this.pokemonsfiltrados = [...this.pokemonsarray];
    });
  }

  cargarPokemons(): void {
    this.pokemonsService.getPokemonsPorGeneracion(151, 0).subscribe((data: Pokemon[]) => {
      this.pokemonsarray = data;
      this.pokemonsfiltrados = [...this.pokemonsarray];
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

  toggleTipos(tipo: string): void {
    if (this.busquedaPorTipo.includes(tipo)) {
      this.busquedaPorTipo = this.busquedaPorTipo.filter(t => t !== tipo);
    } else {
      this.busquedaPorTipo.push(tipo);
    }
    this.filtroPokemons();
  }

  filtroPokemons(): void {
    this.pokemonsfiltrados = this.pokemonsarray.filter(pokemon => {
      const nameMatches = pokemon.name.toLowerCase().includes(this.busquedaPorNombre.toLowerCase());
      const typeMatches = this.busquedaPorTipo.length === 0 || pokemon.types.some(t => this.busquedaPorTipo.includes(t));
      return nameMatches && typeMatches;
    });
  }

  filtroPokemonPorNombre(): void {
    this.pokemonsfiltrados = this.pokemonsarray.filter(pokemon =>
      pokemon.name.toLowerCase().includes(this.busquedaPorNombre.toLowerCase())
    );
  }

  cambiarFiltroLimitePokemon(nuevaGeneracion: number): void {
    let limit = 0;
    let offset = 0;

  switch (nuevaGeneracion) {
    case 151:
      limit = 151;
      offset = 0;
      break;
    case 251:
      limit = 100;
      offset = 151;
      break;
    case 386:
      limit = 135;
      offset = 251;
      break;
    case 493:
      limit = 107;
      offset = 386;
      break;
  }
  this.cargarPokemonsPorGeneracion(limit, offset);
  }
  
}