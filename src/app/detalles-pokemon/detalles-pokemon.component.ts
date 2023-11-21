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
    const id = this.route.snapshot.params['id'];
    this.pokemonsService.getPokemonsId(id).subscribe((pokemon) => {
      this.pokemon = pokemon;
    });
  }
}
