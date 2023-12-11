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
  evolucion: EvolutionDetails[];
  detallesEvolucion?: EvolutionDetails[];
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

export interface EvolutionChain {
  id: number;
  evolutionDetails: EvolutionDetails[];
}

export interface Trigger {
  type: string;
  description: string;
  level?: number;
  item?: string;
  happiness?: number;
  time_of_day?: string;
  gender?: string;
  move?: string;
}

export interface EvolutionDetails {
  species: { name: string; url: string; image?: string };
  evolves_to: EvolutionDetails[];
  evolution_details: Trigger[];
}