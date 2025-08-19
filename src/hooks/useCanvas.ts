import { useRef, useCallback, useEffect } from 'react';
import { CanvasState, DrawingPoint, DrawingPath } from '../types/Drawing';

interface UseCanvasProps {
  width: number;
  height: number;
  onDrawingChange?: (dataURL: string) => void;
}

export const useCanvas = ({ width, height, onDrawingChange }: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const stateRef = useRef<CanvasState>({
    isDrawing: false,
    currentPath: [],
    paths: [],
    currentColor: '#FF6B6B', // Default red color
    currentLineWidth: 4
  });

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set up canvas for drawing
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.imageSmoothingEnabled = true;
    
    contextRef.current = context;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas with white background
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, width, height);
  }, [width, height]);

  // Get point coordinates relative to canvas
  const getPointFromEvent = useCallback((event: React.TouchEvent | React.MouseEvent): DrawingPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ('touches' in event) {
      // Touch event
      const touch = event.touches[0] || event.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  // Draw a line between two points
  const drawLine = useCallback((from: DrawingPoint, to: DrawingPoint) => {
    const context = contextRef.current;
    if (!context) return;

    const state = stateRef.current;
    context.strokeStyle = state.currentColor;
    context.lineWidth = state.currentLineWidth;
    
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }, []);

  // Redraw entire canvas from paths
  const redrawCanvas = useCallback(() => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    // Clear canvas
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw all paths
    stateRef.current.paths.forEach((path) => {
      if (path.points.length < 2) return;

      context.strokeStyle = path.color;
      context.lineWidth = path.lineWidth;
      
      context.beginPath();
      context.moveTo(path.points[0].x, path.points[0].y);
      
      for (let i = 1; i < path.points.length; i++) {
        context.lineTo(path.points[i].x, path.points[i].y);
      }
      
      context.stroke();
    });

    // Notify parent component of changes
    if (onDrawingChange) {
      onDrawingChange(canvas.toDataURL('image/png'));
    }
  }, [onDrawingChange]);

  // Start drawing
  const startDrawing = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault();
    
    const point = getPointFromEvent(event);
    stateRef.current.isDrawing = true;
    stateRef.current.currentPath = [point];
  }, [getPointFromEvent]);

  // Continue drawing
  const draw = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault();
    
    const state = stateRef.current;
    if (!state.isDrawing) return;

    const point = getPointFromEvent(event);
    const lastPoint = state.currentPath[state.currentPath.length - 1];
    
    if (lastPoint) {
      drawLine(lastPoint, point);
    }
    
    state.currentPath.push(point);
  }, [getPointFromEvent, drawLine]);

  // Stop drawing
  const stopDrawing = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault();
    
    const state = stateRef.current;
    if (!state.isDrawing) return;

    state.isDrawing = false;
    
    // Save the completed path
    if (state.currentPath.length > 0) {
      const completedPath: DrawingPath = {
        points: [...state.currentPath],
        color: state.currentColor,
        lineWidth: state.currentLineWidth,
        timestamp: Date.now()
      };
      
      state.paths.push(completedPath);
      state.currentPath = [];
      
      // Trigger drawing change callback
      const canvas = canvasRef.current;
      if (canvas && onDrawingChange) {
        onDrawingChange(canvas.toDataURL('image/png'));
      }
    }
  }, [onDrawingChange]);

  // Clear the entire canvas
  const clearCanvas = useCallback(() => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    // Clear all paths
    stateRef.current.paths = [];
    stateRef.current.currentPath = [];
    
    // Clear canvas with white background
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Notify parent component
    if (onDrawingChange) {
      onDrawingChange(canvas.toDataURL('image/png'));
    }
  }, [onDrawingChange]);

  // Change drawing color
  const setColor = useCallback((color: string) => {
    stateRef.current.currentColor = color;
  }, []);

  // Change line width
  const setLineWidth = useCallback((lineWidth: number) => {
    stateRef.current.currentLineWidth = lineWidth;
  }, []);

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    setColor,
    setLineWidth,
    redrawCanvas,
    currentColor: stateRef.current.currentColor,
    currentLineWidth: stateRef.current.currentLineWidth
  };
};