import { Stencil } from './Stencil';

export interface DrawingPoint {
  x: number;
  y: number;
  pressure?: number;
}

export interface DrawingPath {
  points: DrawingPoint[];
  color: string;
  lineWidth: number;
  timestamp: number;
}

export interface CanvasState {
  isDrawing: boolean;
  currentPath: DrawingPoint[];
  paths: DrawingPath[];
  currentColor: string;
  currentLineWidth: number;
}

export interface CanvasProps {
  width?: number;
  height?: number;
  className?: string;
  onDrawingChange?: (dataURL: string) => void;
  stencil?: Stencil | null;
}