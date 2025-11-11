/**
 * Shape Sorting Game Types
 */

export type ShapeType = 'circle' | 'square' | 'triangle' | 'star';
export type FieldSize = 6 | 9 | 12 | 15 | 18 | 24;

export interface Shape {
  id: string;
  type: ShapeType;
  color: string;
}

export interface ShapeSortingSettings {
  fieldSize: FieldSize;
}

export interface ShapeSortingState {
  currentShapes: Shape[];
  targetShape: ShapeType;
  score: number;
  round: number;
  correctSorts: number;
  settings: ShapeSortingSettings;
}
