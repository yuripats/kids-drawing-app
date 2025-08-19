import { useRef, useCallback, useEffect, useState } from 'react';
import { CanvasState, DrawingPoint, DrawingPath } from '../types/Drawing';

interface UseCanvasProps {
  width: number;
  height: number;
  onDrawingChange?: (dataURL: string) => void;
}

export const useCanvas = ({ width, height, onDrawingChange }: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Reactive state for UI components
  const [currentColor, setCurrentColorState] = useState('#FF6B6B');
  const [currentLineWidth, setCurrentLineWidthState] = useState(4);
  const [currentTool, setCurrentToolState] = useState<'brush' | 'fill'>('brush');
  
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

  // Flood fill algorithm (bucket fill)
  const floodFill = useCallback((startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Get image data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Convert fill color to RGB
    const fillRgb = hexToRgb(fillColor);
    if (!fillRgb) return;

    // Get the color at the starting position
    const startPos = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];
    const startA = pixels[startPos + 3];

    // If start color is the same as fill color, no need to fill
    if (startR === fillRgb.r && startG === fillRgb.g && startB === fillRgb.b) {
      return;
    }

    // Flood fill using stack-based approach (more efficient than recursion)
    const stack: Array<[number, number]> = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      
      // Skip if out of bounds
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      // Skip if already visited
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const pos = (y * canvas.width + x) * 4;
      const r = pixels[pos];
      const g = pixels[pos + 1];
      const b = pixels[pos + 2];
      const a = pixels[pos + 3];

      // Skip if color doesn't match the start color
      if (r !== startR || g !== startG || b !== startB || a !== startA) continue;

      // Fill the pixel
      pixels[pos] = fillRgb.r;
      pixels[pos + 1] = fillRgb.g;
      pixels[pos + 2] = fillRgb.b;
      pixels[pos + 3] = 255; // Full opacity

      // Add neighboring pixels to stack
      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }

    // Put the modified image data back to canvas
    context.putImageData(imageData, 0, 0);

    // Notify parent component of changes
    if (onDrawingChange) {
      onDrawingChange(canvas.toDataURL('image/png'));
    }
  }, [onDrawingChange]);

  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Start drawing
  const startDrawing = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault();
    
    const point = getPointFromEvent(event);
    
    if (currentTool === 'fill') {
      // Use fill tool
      floodFill(point.x, point.y, stateRef.current.currentColor);
    } else {
      // Use brush tool
      stateRef.current.isDrawing = true;
      stateRef.current.currentPath = [point];
    }
  }, [getPointFromEvent, currentTool, floodFill]);

  // Continue drawing
  const draw = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault();
    
    // Only handle drawing for brush tool
    if (currentTool !== 'brush') return;
    
    const state = stateRef.current;
    if (!state.isDrawing) return;

    const point = getPointFromEvent(event);
    const lastPoint = state.currentPath[state.currentPath.length - 1];
    
    if (lastPoint) {
      drawLine(lastPoint, point);
    }
    
    state.currentPath.push(point);
  }, [getPointFromEvent, drawLine, currentTool]);

  // Stop drawing
  const stopDrawing = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault();
    
    // Only handle stop drawing for brush tool
    if (currentTool !== 'brush') return;
    
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
  }, [onDrawingChange, currentTool]);

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
    setCurrentColorState(color);
  }, []);

  // Change line width
  const setLineWidth = useCallback((lineWidth: number) => {
    stateRef.current.currentLineWidth = lineWidth;
    setCurrentLineWidthState(lineWidth);
  }, []);

  // Change current tool
  const setTool = useCallback((tool: 'brush' | 'fill') => {
    setCurrentToolState(tool);
  }, []);

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    setColor,
    setLineWidth,
    setTool,
    redrawCanvas,
    currentColor,
    currentLineWidth,
    currentTool
  };
};