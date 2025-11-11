/**
 * Shape Sorting Game Types
 */

export type ShapeType = 'circle' | 'square' | 'triangle' | 'star';

export interface Shape {
  id: string;
  type: ShapeType;
  color: string;
}

export interface ShapeSortingState {
  currentShapes: Shape[];
  targetShape: ShapeType;
  score: number;
  round: number;
  correctSorts: number;
}
