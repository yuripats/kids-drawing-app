import { Stencil, StencilCollection } from '../types/Stencil';

// Detailed SVG path data for stencils (outlines only)
const stencilData: Stencil[] = [
  // Princess Category
  {
    id: 'princess-1',
    name: 'Princess Belle',
    category: 'princess',
    svgPath: `
      M100 15 L95 10 L90 8 L85 10 L80 12 L75 18 L70 25 L68 32 L70 38 L75 42 L82 45 L88 47 L95 46 L100 42 L105 46 L112 47 L118 45 L125 42 L130 38 L132 32 L130 25 L125 18 L120 12 L115 10 L110 8 L105 10 Z
      M100 42 C82 42, 70 52, 70 65 C70 72, 72 78, 75 84 L78 88 L82 92 C88 98, 94 102, 100 102 C106 102, 112 98, 118 92 L122 88 L125 84 C128 78, 130 72, 130 65 C130 52, 118 42, 100 42 Z
      M82 58 C84 55, 87 54, 90 56 C91 57, 92 58, 91 59 C90 60, 88 59, 87 58 M113 58 C115 55, 118 54, 121 56 C122 57, 123 58, 122 59 C121 60, 119 59, 118 58
      M88 68 C89 69, 90 70, 92 69 M108 68 C109 69, 110 70, 112 69
      M95 78 C97 80, 100 81, 103 80 C104 79, 105 78, 104 77 C103 76, 100 77, 97 76
      M100 102 L98 108 L95 115 L90 122 L85 130 C82 135, 79 142, 78 150 L78 165 L78 180 C78 186, 82 191, 87 192 L113 192 C118 191, 122 186, 122 180 L122 165 L122 150 C121 142, 118 135, 115 130 L110 122 L105 115 L102 108 Z
      M78 150 C68 150, 58 155, 52 165 L50 175 L48 185 C48 190, 52 195, 57 195 L143 195 C148 195, 152 190, 152 185 L150 175 L148 165 C142 155, 132 150, 122 150
      M52 175 L58 172 L65 170 L72 172 L78 175 M122 175 L128 172 L135 170 L142 172 L148 175
      M75 110 C70 115, 65 125, 68 135 L72 140 L78 142 M125 110 C130 115, 135 125, 132 135 L128 140 L122 142
      M87 105 C85 108, 83 112, 85 115 M113 105 C115 108, 117 112, 115 115
      M62 25 C58 30, 55 38, 60 45 L68 50 M138 25 C142 30, 145 38, 140 45 L132 50
      M85 15 C82 18, 80 22, 83 25 M115 15 C118 18, 120 22, 117 25
    `,
    thumbnail: '👸',
    description: 'A beautiful princess in a flowing gown with intricate details',
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
      M90 30 L92 15 L94 12 L96 10 L98 12 L100 15 L102 30
      M96 10 L97 8 L98 6 L99 8 L98 10 L97 12 L96 10
      M25 95 C30 85, 40 78, 52 75 L65 72 C75 70, 85 72, 92 78 L98 84 C102 88, 104 93, 104 98 L102 105 C100 110, 96 114, 90 116 L75 120 L60 118 C45 115, 32 108, 25 95 Z
      M52 88 C54 86, 56 86, 58 88 C58 90, 56 92, 54 92 C52 92, 50 90, 52 88 Z
      M45 100 C47 102, 50 103, 53 102 C54 101, 55 100, 54 99 C53 98, 50 99, 47 98 C46 98, 45 99, 45 100 Z
      M25 95 C22 100, 20 106, 22 112 C25 118, 30 122, 36 124 L45 126 C50 127, 55 127, 60 126 L75 125 C80 124, 85 122, 88 118 L90 116 L88 125 L85 135 L83 145 L81 155 L79 165 L77 175 L75 185 L73 195 L71 200 L69 195 L71 185 L73 175 L75 165 L77 155 L79 145 L81 135 L83 125
      M88 118 L95 125 L102 135 L107 145 L110 155 L112 165 L113 175 L114 185 L115 195 L116 200 L118 195 L117 185 L116 175 L115 165 L114 155 L112 145 L109 135 L105 125 L100 118
      M36 124 L30 132 L26 142 L24 152 L23 162 L22 172 L21 182 L20 192 L19 200 L17 195 L18 185 L19 175 L20 165 L21 155 L22 145 L24 135 L27 127 L32 125
      M100 118 L108 126 L116 135 L122 145 L126 155 L128 165 L129 175 L130 185 L131 195 L132 200 L134 195 L133 185 L132 175 L131 165 L130 155 L128 145 L125 135 L120 127 L112 120
      M75 45 C70 40, 65 38, 60 42 C58 45, 60 48, 63 50 C68 48, 72 46, 75 45 Z
      M80 35 C75 30, 70 28, 65 32 C63 35, 65 38, 68 40 C73 38, 77 36, 80 35 Z
      M85 25 C80 20, 75 18, 70 22 C68 25, 70 28, 73 30 C78 28, 82 26, 85 25 Z
      M90 18 C85 13, 80 11, 75 15 C73 18, 75 21, 78 23 C83 21, 87 19, 90 18 Z
      M95 15 C92 12, 88 11, 85 13 C84 15, 85 17, 87 18 C90 17, 92 16, 95 15 Z
      M100 20 C98 18, 95 17, 93 18 C92 19, 93 20, 94 21 C96 20, 98 20, 100 20 Z
      M68 50 C65 55, 62 62, 60 70 M78 40 C75 45, 72 52, 70 60 M88 30 C85 35, 82 42, 80 50
      M110 88 C115 85, 120 88, 122 93 C120 96, 115 98, 110 95 C108 92, 108 90, 110 88 Z
      M125 95 C130 92, 135 95, 137 100 C135 103, 130 105, 125 102 C123 99, 123 97, 125 95 Z
    `,
    thumbnail: '🦄',
    description: 'A beautiful unicorn in profile with flowing mane and spiral horn',
    viewBox: '0 0 160 210'
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