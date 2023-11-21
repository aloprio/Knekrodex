import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPokemonComponent } from './lista-pokemon/lista-pokemon.component';
import { DetallesPokemonComponent } from './detalles-pokemon/detalles-pokemon.component';

const routes: Routes = [
  { path: '', redirectTo: '/pokemons', pathMatch: 'full' },
  { path: 'pokemons', component: ListaPokemonComponent },
  { path: 'details/:id', component: DetallesPokemonComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
