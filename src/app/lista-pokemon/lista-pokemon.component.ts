import { Component, OnInit } from '@angular/core';
import { PokemonsService } from '../pokemons.service';

@Component({
  selector: 'app-lista-pokemon',
  templateUrl: './lista-pokemon.component.html',
  styleUrls: ['./lista-pokemon.component.css']
})
export class ListaPokemonComponent implements OnInit {

  pokemonsarray: any[] = []

  constructor(private pokemonsService: PokemonsService) {}

  ngOnInit(): void {
    this.pokemonsService.getPokemons().subscribe((data: any) => {
      this.pokemonsarray = data;
      console.log(this.pokemonsarray);
    });
  }

  formatPokedexNumber(id: number): string {
    if (id !== undefined) {
      return id.toString().padStart(3, '0');
    }
    return '';
  }

  formatPokemonTypes(types: any[]): string {
    if (types && types.length > 0) {
      return types.map(type => type.type.name).join(' ');
    }
    return '';
  }

}
