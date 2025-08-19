import { Stencil, StencilCollection } from '../types/Stencil';

// Simple SVG path data for stencils (outlines only)
const stencilData: Stencil[] = [
  // Test simple shapes first
  {
    id: 'test-circle',
    name: 'Simple Circle',
    category: 'princess',
    svgPath: 'M 100 50 A 40 40 0 1 1 100 49 Z',
    thumbnail: '⭕',
    description: 'A simple circle to test',
    viewBox: '0 0 200 100'
  },
  // Princess Category
  {
    id: 'princess-1',
    name: 'Pretty Princess',
    category: 'princess',
    svgPath: 'M50 30 L150 30 L150 80 L100 120 L50 80 Z M75 50 C75 45, 80 40, 85 40 C90 40, 95 45, 95 50 M105 50 C105 45, 110 40, 115 40 C120 40, 125 45, 125 50 M85 65 L115 65',
    thumbnail: '👸',
    description: 'A beautiful princess with a crown',
    viewBox: '0 0 200 150'
  },
  {
    id: 'princess-2',
    name: 'Princess Castle',
    category: 'princess',
    svgPath: 'M50 100 L50 60 L70 60 L70 50 L80 50 L80 40 L90 40 L90 30 L110 30 L110 40 L120 40 L120 50 L130 50 L130 60 L150 60 L150 100 Z M75 75 L85 75 L85 90 L75 90 Z M115 75 L125 75 L125 90 L115 90 Z',
    thumbnail: '🏰',
    description: 'A magical princess castle',
    viewBox: '0 0 200 120'
  },

  // Unicorns Category  
  {
    id: 'unicorn-1',
    name: 'Magical Unicorn',
    category: 'unicorns',
    svgPath: 'M100 40 C120 40, 130 60, 130 80 C130 90, 120 100, 110 100 L90 100 C80 100, 70 90, 70 80 C70 60, 80 40, 100 40 Z M100 30 L105 40 L95 40 Z M85 50 C87 52, 89 52, 91 50 M109 50 C111 52, 113 52, 115 50 M90 65 C95 70, 105 70, 110 65',
    thumbnail: '🦄',
    description: 'A beautiful unicorn with horn',
    viewBox: '0 0 200 120'
  },

  // Castles Category
  {
    id: 'castle-1', 
    name: 'Knight Castle',
    category: 'castles',
    svgPath: 'M40 100 L40 50 L50 50 L50 40 L60 40 L60 30 L70 30 L70 40 L80 40 L80 50 L120 50 L120 40 L130 40 L130 30 L140 30 L140 40 L150 40 L150 50 L160 50 L160 100 Z M65 70 L75 70 L75 85 L65 85 Z M125 70 L135 70 L135 85 L125 85 Z M90 60 C90 65, 95 70, 100 70 C105 70, 110 65, 110 60',
    thumbnail: '🏰',
    description: 'A strong castle with towers',
    viewBox: '0 0 200 120'
  },

  // Vehicles Category
  {
    id: 'car-1',
    name: 'Happy Car',
    category: 'vehicles',
    svgPath: 'M40 80 L40 70 C40 65, 45 60, 50 60 L70 60 L70 50 C70 45, 75 40, 80 40 L120 40 C125 40, 130 45, 130 50 L130 60 L150 60 C155 60, 160 65, 160 70 L160 80 L150 80 C150 90, 140 100, 130 100 C120 100, 110 90, 110 80 L90 80 C90 90, 80 100, 70 100 C60 100, 50 90, 50 80 Z M70 85 C75 85, 80 80, 80 75 C80 80, 75 85, 70 85 M130 85 C135 85, 140 80, 140 75 C140 80, 135 85, 130 85',
    thumbnail: '🚗',
    description: 'A cheerful little car',
    viewBox: '0 0 200 120'
  },
  {
    id: 'plane-1',
    name: 'Flying Plane',
    category: 'vehicles', 
    svgPath: 'M100 60 L140 60 C145 60, 150 55, 150 50 C150 45, 145 40, 140 40 L100 40 L80 30 L70 30 L80 40 L60 40 L50 35 L45 35 L50 40 L50 50 L45 55 L50 55 L60 50 L80 50 L70 60 L80 60 Z',
    thumbnail: '✈️', 
    description: 'A plane ready for adventure',
    viewBox: '0 0 200 120'
  },

  // Animals Category
  {
    id: 'cat-1',
    name: 'Cute Cat',
    category: 'animals',
    svgPath: 'M100 70 C120 70, 130 80, 130 90 C130 100, 120 110, 100 110 C80 110, 70 100, 70 90 C70 80, 80 70, 100 70 Z M85 50 L90 65 L95 50 M105 50 L110 65 L115 50 M90 85 C92 87, 94 87, 96 85 M104 85 C106 87, 108 87, 110 85 M100 90 L100 95',
    thumbnail: '🐱',
    description: 'A friendly kitty cat',
    viewBox: '0 0 200 120'
  },
  {
    id: 'dog-1',
    name: 'Happy Dog',
    category: 'animals',
    svgPath: 'M100 75 C115 75, 125 85, 125 95 C125 105, 115 115, 100 115 C85 115, 75 105, 75 95 C75 85, 85 75, 100 75 Z M80 60 L85 70 L90 60 M110 60 L115 70 L120 60 M85 90 C87 92, 89 92, 91 90 M109 90 C111 92, 113 92, 115 90 M100 95 L100 100 M95 100 C97 102, 103 102, 105 100',
    thumbnail: '🐶',
    description: 'A playful puppy dog',
    viewBox: '0 0 200 120'
  }
];

// Group stencils by category
export const stencilCollections: StencilCollection[] = [
  {
    category: 'princess',
    name: 'Princess',
    emoji: '👸',
    description: 'Beautiful princesses and royal things',
    stencils: stencilData.filter(s => s.category === 'princess')
  },
  {
    category: 'unicorns',
    name: 'Unicorns',
    emoji: '🦄',
    description: 'Magical unicorns and fantasy creatures',
    stencils: stencilData.filter(s => s.category === 'unicorns')
  },
  {
    category: 'castles',
    name: 'Castles',
    emoji: '🏰',
    description: 'Medieval castles and fortresses',
    stencils: stencilData.filter(s => s.category === 'castles')
  },
  {
    category: 'vehicles',
    name: 'Vehicles',
    emoji: '🚗',
    description: 'Cars, planes, and fun vehicles',
    stencils: stencilData.filter(s => s.category === 'vehicles')
  },
  {
    category: 'animals',
    name: 'Animals', 
    emoji: '🐱',
    description: 'Cute animals and pets',
    stencils: stencilData.filter(s => s.category === 'animals')
  }
];

export const getAllStencils = (): Stencil[] => stencilData;

export const getStencilsByCategory = (category: string): Stencil[] => 
  stencilData.filter(stencil => stencil.category === category);

export const getStencilById = (id: string): Stencil | undefined =>
  stencilData.find(stencil => stencil.id === id);