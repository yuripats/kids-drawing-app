import { Stencil, StencilCollection } from '../types/Stencil';

// Detailed SVG path data for stencils (outlines only)
const stencilData: Stencil[] = [
  // Princess Category
  {
    id: 'princess-1',
    name: 'Princess Belle',
    category: 'princess',
    svgPath: `
      M100 20 L90 15 L80 20 L75 30 L80 35 L90 30 L100 35 L110 30 L120 35 L125 30 L120 20 L110 15 Z
      M100 35 C85 35, 75 45, 75 60 C75 65, 77 70, 80 74 L85 80 C90 85, 95 88, 100 88 C105 88, 110 85, 115 80 L120 74 C123 70, 125 65, 125 60 C125 45, 115 35, 100 35 Z
      M85 50 C87 48, 90 48, 92 50 M108 50 C110 48, 113 48, 115 50
      M95 65 C97 67, 103 67, 105 65
      M100 88 L95 95 L85 105 C80 110, 75 120, 75 130 L75 180 C75 185, 80 190, 85 190 L115 190 C120 190, 125 185, 125 180 L125 130 C125 120, 120 110, 115 105 L105 95 Z
      M75 130 C65 130, 55 135, 50 145 L50 165 C50 170, 55 175, 60 175 L140 175 C145 175, 150 170, 150 165 L150 145 C145 135, 135 130, 125 130
      M70 95 C65 100, 60 110, 65 120 L75 125
      M130 95 C135 100, 140 110, 135 120 L125 125
    `,
    thumbnail: '👸',
    description: 'A beautiful princess in a flowing gown',
    viewBox: '0 0 200 200'
  },
  {
    id: 'princess-2',
    name: 'Fairy Tale Castle',
    category: 'princess',
    svgPath: `
      M30 160 L30 100 L40 100 L40 80 L50 80 L50 60 L60 60 L60 40 L70 40 L70 20 L80 20 L80 10 L85 5 L90 10 L90 20 L100 20 L100 40 L110 40 L110 20 L120 20 L120 10 L125 5 L130 10 L130 20 L140 20 L140 40 L150 40 L150 60 L160 60 L160 80 L170 80 L170 100 L180 100 L180 160 Z
      M45 75 L55 75 L55 85 L45 85 Z
      M75 35 L85 35 L85 45 L75 45 Z
      M115 35 L125 35 L125 45 L115 45 Z
      M155 75 L165 75 L165 85 L155 85 Z
      M95 120 C95 115, 100 110, 105 110 C110 110, 115 115, 115 120 L115 145 L95 145 Z
      M65 15 L75 15 L75 25 L65 25 Z
      M135 15 L145 15 L145 25 L135 25 Z
      M20 165 L190 165
      M40 140 L50 140 L50 150 L40 150 Z
      M160 140 L170 140 L170 150 L160 150 Z
    `,
    thumbnail: '🏰',
    description: 'A magical fairy tale castle with towers',
    viewBox: '0 0 210 170'
  },

  // Unicorns Category  
  {
    id: 'unicorn-1',
    name: 'Magical Unicorn',
    category: 'unicorns',
    svgPath: `
      M100 20 L105 5 L110 20 L108 35 L102 35 Z
      M100 35 C120 35, 140 50, 140 70 C140 75, 138 80, 135 84 L130 90 C125 95, 118 98, 110 98 L90 98 C82 98, 75 95, 70 90 L65 84 C62 80, 60 75, 60 70 C60 50, 80 35, 100 35 Z
      M80 55 C82 53, 85 53, 87 55 C87 57, 85 59, 82 59 C80 59, 78 57, 80 55 Z
      M113 55 C115 53, 118 53, 120 55 C120 57, 118 59, 115 59 C113 59, 111 57, 113 55 Z
      M88 70 C92 74, 108 74, 112 70
      M100 78 L100 82
      M100 98 L95 105 L85 115 L85 140 L90 145 L95 140 L95 120 L100 115 L105 120 L105 140 L110 145 L115 140 L115 115 L105 105 Z
      M70 95 L60 105 L60 125 L65 130 L70 125 L70 110 Z
      M130 95 L140 105 L140 125 L135 130 L130 125 L130 110 Z
      M95 15 C90 10, 85 8, 80 12 C85 15, 90 18, 95 15 Z
      M105 15 C110 10, 115 8, 120 12 C115 15, 110 18, 105 15 Z
      M100 12 C95 8, 90 10, 88 15 C90 12, 95 10, 100 12 Z
      M88 88 C83 93, 75 100, 70 110 L75 112 C80 105, 85 95, 88 88 Z
      M112 88 C117 93, 125 100, 130 110 L125 112 C120 105, 115 95, 112 88 Z
    `,
    thumbnail: '🦄',
    description: 'A beautiful unicorn with horn and mane',
    viewBox: '0 0 200 150'
  },

  // Castles Category
  {
    id: 'castle-1', 
    name: 'Medieval Fortress',
    category: 'castles',
    svgPath: `
      M20 140 L20 80 L30 80 L30 60 L40 60 L40 40 L50 40 L50 20 L55 15 L60 20 L60 40 L70 40 L70 60 L80 60 L80 80 L120 80 L120 60 L130 60 L130 40 L140 40 L140 20 L145 15 L150 20 L150 40 L160 40 L160 60 L170 60 L170 80 L180 80 L180 140 Z
      M35 70 L45 70 L45 85 L35 85 Z
      M65 50 L75 50 L75 65 L65 65 Z
      M125 50 L135 50 L135 65 L125 65 Z
      M155 70 L165 70 L165 85 L155 85 Z
      M90 95 C90 90, 95 85, 100 85 C105 85, 110 90, 110 95 L110 125 L90 125 Z
      M15 145 L185 145
      M25 110 L35 110 L35 125 L25 125 Z
      M165 110 L175 110 L175 125 L165 125 Z
      M45 25 L55 25 L55 35 L45 35 Z
      M145 25 L155 25 L155 35 L145 35 Z
      M85 65 L95 65 L95 75 L85 75 Z
      M105 65 L115 65 L115 75 L105 75 Z
      M40 100 C35 100, 30 105, 30 110 L30 115 L50 115 L50 110 C50 105, 45 100, 40 100 Z
      M160 100 C155 100, 150 105, 150 110 L150 115 L170 115 L170 110 C170 105, 165 100, 160 100 Z
    `,
    thumbnail: '🏰',
    description: 'A mighty medieval fortress',
    viewBox: '0 0 200 150'
  },

  // Vehicles Category
  {
    id: 'car-1',
    name: 'Race Car',
    category: 'vehicles',
    svgPath: `
      M30 90 L30 80 C30 75, 35 70, 40 70 L60 70 L65 60 C68 55, 73 50, 78 50 L122 50 C127 50, 132 55, 135 60 L140 70 L160 70 C165 70, 170 75, 170 80 L170 90 L160 90 C160 100, 150 110, 140 110 C130 110, 120 100, 120 90 L80 90 C80 100, 70 110, 60 110 C50 110, 40 100, 40 90 Z
      M60 95 C65 95, 70 90, 70 85 C70 80, 65 75, 60 75 C55 75, 50 80, 50 85 C50 90, 55 95, 60 95 Z
      M140 95 C145 95, 150 90, 150 85 C150 80, 145 75, 140 75 C135 75, 130 80, 130 85 C130 90, 135 95, 140 95 Z
      M85 60 L115 60 L115 70 L85 70 Z
      M45 75 L55 75 L55 85 L45 85 Z
      M145 75 L155 75 L155 85 L145 85 Z
      M95 45 L105 45 L105 55 L95 55 Z
      M75 65 C78 62, 82 62, 85 65
      M115 65 C118 62, 122 62, 125 65
      M25 95 L35 95
      M165 95 L175 95
    `,
    thumbnail: '🚗',
    description: 'A speedy race car with details',
    viewBox: '0 0 200 120'
  },
  {
    id: 'plane-1',
    name: 'Jet Airplane',
    category: 'vehicles', 
    svgPath: `
      M30 75 C25 75, 20 70, 20 65 C20 60, 25 55, 30 55 L90 55 L95 45 C98 40, 103 35, 108 35 L150 35 C155 35, 160 40, 160 45 C160 50, 155 55, 150 55 L108 55 C103 55, 98 60, 95 65 L90 75 Z
      M70 60 L40 40 L35 40 L38 45 L45 50 L40 55 L35 55 L40 65 L70 65 Z
      M70 60 L40 90 L35 90 L38 85 L45 80 L40 75 L35 75 L40 65 L70 65 Z
      M150 55 L150 65 L145 70 L140 65 L140 55 Z
      M120 45 L130 45 L130 50 L120 50 Z
      M110 40 C112 38, 115 38, 117 40 C117 42, 115 44, 112 44 C110 44, 108 42, 110 40 Z
      M25 90 L70 90 L75 95 L70 100 L25 100 C20 100, 15 95, 15 90 C15 85, 20 80, 25 80 L70 80 L75 85 L70 90 Z
      M25 20 L70 20 L75 15 L70 10 L25 10 C20 10, 15 15, 15 20 C15 25, 20 30, 25 30 L70 30 L75 25 L70 20 Z
    `,
    thumbnail: '✈️', 
    description: 'A modern jet airplane',
    viewBox: '0 0 180 110'
  },

  // Animals Category
  {
    id: 'cat-1',
    name: 'Playful Kitten',
    category: 'animals',
    svgPath: `
      M100 65 C120 65, 135 75, 135 90 C135 105, 120 115, 100 115 C80 115, 65 105, 65 90 C65 75, 80 65, 100 65 Z
      M85 45 L90 35 L95 45 L92 60 L88 60 Z
      M105 45 L110 35 L115 45 L112 60 L108 60 Z
      M85 80 C87 78, 90 78, 92 80 C92 82, 90 84, 87 84 C85 84, 83 82, 85 80 Z
      M108 80 C110 78, 113 78, 115 80 C115 82, 113 84, 110 84 C108 84, 106 82, 108 80 Z
      M95 90 C97 92, 103 92, 105 90
      M100 95 L100 100 L95 105 L105 105 Z
      M80 95 C75 100, 70 110, 75 120 L80 125 L85 120 L85 110 Z
      M120 95 C125 100, 130 110, 125 120 L120 125 L115 120 L115 110 Z
      M100 115 C95 120, 90 130, 95 140 L100 145 L105 140 L105 130 Z
      M100 115 C105 120, 110 130, 105 140 L100 145 L95 140 L95 130 Z
      M87 38 C85 35, 82 33, 79 35 C82 37, 85 40, 87 38 Z
      M113 38 C115 35, 118 33, 121 35 C118 37, 115 40, 113 38 Z
      M78 85 C73 85, 68 80, 68 75 L70 77 C72 82, 75 85, 78 85 Z
      M122 85 C127 85, 132 80, 132 75 L130 77 C128 82, 125 85, 122 85 Z
    `,
    thumbnail: '🐱',
    description: 'A playful kitten with whiskers',
    viewBox: '0 0 200 150'
  },
  {
    id: 'dog-1',
    name: 'Friendly Puppy',
    category: 'animals',
    svgPath: `
      M100 70 C120 70, 135 80, 135 95 C135 110, 120 120, 100 120 C80 120, 65 110, 65 95 C65 80, 80 70, 100 70 Z
      M80 55 C75 50, 70 45, 65 50 C70 55, 75 60, 80 65 L85 70 Z
      M120 55 C125 50, 130 45, 135 50 C130 55, 125 60, 120 65 L115 70 Z
      M85 85 C87 83, 90 83, 92 85 C92 87, 90 89, 87 89 C85 89, 83 87, 85 85 Z
      M108 85 C110 83, 113 83, 115 85 C115 87, 113 89, 110 89 C108 89, 106 87, 108 85 Z
      M100 95 C95 98, 90 98, 88 95 L92 100 L100 105 L108 100 L112 95 C110 98, 105 98, 100 95 Z
      M100 105 L100 110
      M80 105 C75 110, 70 120, 75 130 L80 135 L85 130 L85 120 Z
      M120 105 C125 110, 130 120, 125 130 L120 135 L115 130 L115 120 Z
      M95 120 C90 125, 85 135, 90 145 L95 150 L100 145 L100 135 Z
      M105 120 C110 125, 115 135, 110 145 L105 150 L100 145 L100 135 Z
      M100 40 C105 35, 110 30, 115 35 C110 40, 105 45, 100 50 L95 55 C90 60, 85 65, 80 70 L85 72 C90 67, 95 62, 100 55 L105 50 C110 45, 115 40, 120 45 C115 50, 110 55, 105 60 L100 55 C95 50, 90 45, 85 50 C90 55, 95 60, 100 65 Z
    `,
    thumbnail: '🐶',
    description: 'A friendly puppy with floppy ears',
    viewBox: '0 0 200 155'
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