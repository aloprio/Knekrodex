import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPokemonComponent } from './lista-pokemon/lista-pokemon.component';
import { DetallesPokemonComponent } from './detalles-pokemon/detalles-pokemon.component';

const routes: Routes = [
  { path: 'lista', component: ListaPokemonComponent },
  { path: 'detalles/:id', component: DetallesPokemonComponent },
  { path: '', redirectTo: '/lista', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
