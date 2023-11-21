export interface Pokemon {
    image: string | null | undefined;
    animatedSprite?: string | null | undefined;
    number: string;
    types: string[];
    name: string;
    weight: number;
    height: number;
    description: string;
    stats: { name: string; value: number; }[];
  }