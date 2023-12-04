import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { PrincipalComponent } from './principal/principal.component';
import { PiedepaginaComponent } from './piedepagina/piedepagina.component';
import { ListaPokemonComponent } from './lista-pokemon/lista-pokemon.component';
import { DetallesPokemonComponent } from './detalles-pokemon/detalles-pokemon.component';
import { FiltroMovimientosPorNivelPipe } from './filtro-movimientos-por-nivel.pipe';
import { FiltroMovimientoPorMTMOPipe } from './filtro-movimiento-por-mtmo.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    PrincipalComponent,
    PiedepaginaComponent,
    ListaPokemonComponent,
    DetallesPokemonComponent,
    FiltroMovimientosPorNivelPipe,
    FiltroMovimientoPorMTMOPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
