import { Pipe, PipeTransform } from '@angular/core';
import { PokemonMovimientos } from './model/pokemon';

@Pipe({
  name: 'filtroMovimientosPorNivel'
})
export class FiltroMovimientosPorNivelPipe implements PipeTransform {

  transform(moves: PokemonMovimientos[] | undefined): PokemonMovimientos[] | undefined {
    if (!moves) {
      return moves;
    }
    
    return moves.filter(move => move.methodMove === 'level-up');
  }
}
