import { Component, OnInit } from '@angular/core';
import { PokemonsService } from '../pokemons.service';
import { Pokemon } from '../model/pokemon';
import { Router } from '@angular/router';
import { tipoService } from '../tipo.servise';

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
  limitePokemonsCargados: number = 1017;
  debilidadesFortalezas: any = {};

  constructor(private router: Router, private pokemonsService: PokemonsService, private tipoService: tipoService) {}

  ngOnInit(): void {
    this.cargarPokemons();
    this.cargarDebilidadesYFortalezas();
  }

  cargarPokemonsPorGeneracion(limit: number, offset: number): void {
    this.pokemonsService.getPokemonsPorGeneracion(limit, offset).subscribe((data: Pokemon[]) => {
      this.pokemonsarray = data;
      this.pokemonsfiltrados = [...this.pokemonsarray];
      this.filtroPokemons();
    });
  }

  cargarPokemons(): void {
    this.pokemonsService.getPokemonsPorGeneracion(1017, 0).subscribe((data: Pokemon[]) => {
      this.pokemonsarray = data;
      this.pokemonsfiltrados = [...this.pokemonsarray];
    });
  }

  cargarDebilidadesYFortalezas(): void {
    this.tipoService.getDebilidadesFortalezas().subscribe((data) => {
      this.debilidadesFortalezas = data;
    });
  }

  cargarSpriteAnimado(pokemon: Pokemon): void {
    this.pokemonsService.getPokemonSpriteAnimado(+pokemon.number).subscribe((animatedSprite) => {
      pokemon.animatedSprite = animatedSprite!;
    });
  }

  cargarSpriteEstatico(pokemon: Pokemon): void {
    pokemon.animatedSprite = null;
  }

  verDetalles(id: number) {
    this.router.navigate(['/detalles', id]);
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
      if (this.busquedaPorTipo.length === 2) {
        this.busquedaPorTipo.shift();
      }
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

  cambiarFiltroLimitePokemon(nuevaGeneracion: number): void {
    let limiteDePokemonsCargados = 0;
    let inicioPorId = 0;

  switch (nuevaGeneracion) {
    case 151:
      limiteDePokemonsCargados = 151;
      inicioPorId = 0;
    break;

    case 251:
      limiteDePokemonsCargados = 100;
      inicioPorId = 151;
    break;

    case 386:
      limiteDePokemonsCargados = 135;
      inicioPorId = 251;
    break;

    case 493:
      limiteDePokemonsCargados = 107;
      inicioPorId = 386;
    break;

    case 1017:
      limiteDePokemonsCargados = 1017;
      inicioPorId = 0;
    break;    
  }
  
  this.cargarPokemonsPorGeneracion(limiteDePokemonsCargados, inicioPorId);
  
  }
  getDebilidades(type: string): string[] {
    return this.debilidadesFortalezas[type] ? this.debilidadesFortalezas[type].x2 : [];
  }
  getFortalezas(type: string): string[] {
    return this.debilidadesFortalezas[type] ? this.debilidadesFortalezas[type]['x0.5'] : [];
  }
}