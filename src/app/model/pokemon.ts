export interface Pokemon {
    image: string | null | undefined;
    animatedSprite?: string | null | undefined;
    animatedSpriteShiny?: string | null | undefined;
    number: string;
    types: string[];
    name: string;
    weight: number;
    height: number;
    description: string;
    stats: { name: string; value: number; }[];
    moves: PokemonMovimientos[];
    idCadenaEvolutiva: number;
    triggerEvolucion: string;
    evolucion: Pokemon[];
    detallesEvolucion?: DetallesEvolucion;
}
export interface PokemonMovimientos {
    methodMove: string;
    nameMove: string;
    typeMove: string;
    categoryMove: string;
    powerMove: number;
    accuracyMove: number;
    levelMove: number;
  }

export interface DetallesEvolucion {
    trigger: string;
    evolvesTo: Pokemon[];
    min_level?: number;
  }
