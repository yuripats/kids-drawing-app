export interface Stencil {
  id: string;
  name: string;
  category: StencilCategory;
  svgPath: string;
  thumbnail: string;
  description: string;
  viewBox: string; // SVG viewBox for proper scaling
}

export type StencilCategory = 'princess' | 'unicorns' | 'castles' | 'vehicles' | 'animals';

export interface StencilCollection {
  category: StencilCategory;
  name: string;
  emoji: string;
  description: string;
  stencils: Stencil[];
}