import { useRef, useCallback, useEffect, useState } from 'react';
import { CanvasState, DrawingPoint, DrawingPath } from '../types/Drawing';

import { Stencil } from '../types/Stencil';

interface UseCanvasProps {
  width: number;
  height: number;
  onDrawingChange?: (dataURL: string) => void;
  stencil?: Stencil | null;
}

export const useCanvas = ({ width, height, onDrawingChange, stencil }: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  // Separate canvas for stencil mask (to detect protected areas)
  const stencilMaskRef = useRef<HTMLCanvasElement | null>(null);
  const stencilMaskContextRef = useRef<CanvasRenderingContext2D | null>(null);
  // Flag to prevent multiple simultaneous stencil drawings
  const isDrawingStencilRef = useRef<boolean>(false);
  // Store the canvas state after drawing the stencil (so we can restore it)
  const stencilCanvasStateRef = useRef<ImageData | null>(null);
  
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

  // Draw stencil SVG path on canvas and mask (with duplicate prevention)
  const drawStencil = useCallback((context: CanvasRenderingContext2D, stencil: Stencil) => {
    // Prevent multiple simultaneous stencil drawings
    if (isDrawingStencilRef.current) {
      console.log('Skipping stencil draw - already in progress');
      return;
    }
    
    
    isDrawingStencilRef.current = true;
    
    try {
      const maskContext = stencilMaskContextRef.current;
      
      // Clear canvas before drawing to prevent overlaps
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, width, height);
      
      if (maskContext) {
        maskContext.clearRect(0, 0, width, height);
      }
      
      // Create SVG element from the stencil's path data
      const svgString = `
        <svg viewBox="${stencil.viewBox}" xmlns="http://www.w3.org/2000/svg">
          <path d="${stencil.svgPath}" 
                fill="none" 
                stroke="#000000" 
                stroke-width="3" 
                stroke-linecap="round" 
                stroke-linejoin="round"/>
        </svg>
      `;
      
      // Convert SVG to image and draw it
      const img = new Image();
      
      img.onload = () => {
        
        // Parse viewBox to get original dimensions
        const viewBoxParts = stencil.viewBox.split(' ').map(Number);
        const [, , viewWidth, viewHeight] = viewBoxParts;
        
        // Scale the stencil to fit the canvas while maintaining aspect ratio
        const scale = Math.min((width * 0.8) / viewWidth, (height * 0.8) / viewHeight);
        const scaledWidth = viewWidth * scale;
        const scaledHeight = viewHeight * scale;
        const x = (width - scaledWidth) / 2;
        const y = (height - scaledHeight) / 2;

        
        // Draw on visible canvas
        context.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // Draw on mask canvas if available (thicker for collision detection)
        if (maskContext) {
          // Create a thicker version for the mask
          const maskSvgString = `
            <svg viewBox="${stencil.viewBox}" xmlns="http://www.w3.org/2000/svg">
              <path d="${stencil.svgPath}" 
                    fill="none" 
                    stroke="#FF0000" 
                    stroke-width="8" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"/>
            </svg>
          `;
          
          const maskImg = new Image();
          maskImg.onload = () => {
            maskContext.drawImage(maskImg, x, y, scaledWidth, scaledHeight);
          };
          
          maskImg.onerror = (error) => {
            console.error('Mask image failed to load:', error);
          };
          
          const maskSvgDataUrl = `data:image/svg+xml;base64,${btoa(maskSvgString)}`;
          maskImg.src = maskSvgDataUrl;
        }
        
        // Save the canvas state with the stencil drawn
        const canvas = canvasRef.current;
        if (canvas) {
          stencilCanvasStateRef.current = context.getImageData(0, 0, canvas.width, canvas.height);
        }
        
        // Notify parent component of changes
        if (onDrawingChange) {
          onDrawingChange(canvasRef.current!.toDataURL('image/png'));
        }
        
        // Reset the flag when drawing is complete
        isDrawingStencilRef.current = false;
      };
      
      img.onerror = (error) => {
        console.error('Stencil image failed to load:', error);
        isDrawingStencilRef.current = false; // Reset flag on error too
      };

      // Use data URL for better compatibility
      const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
      img.src = svgDataUrl;
      
    } catch (error) {
      console.error('Error in drawStencil:', error);
      isDrawingStencilRef.current = false; // Reset flag on error
    }
  }, [width, height, onDrawingChange]);

  // Check if a point is on the stencil outline (protected area)
  const isPointOnStencil = useCallback((x: number, y: number): boolean => {
    const maskContext = stencilMaskContextRef.current;
    if (!maskContext || !stencil) return false;
    
    try {
      // Get pixel data at the point
      const imageData = maskContext.getImageData(Math.floor(x), Math.floor(y), 1, 1);
      const data = imageData.data;
      
      // Check if pixel is not transparent (alpha > 0)
      // The mask uses red color, so we check if red channel > 0
      return data[0] > 0; // Red channel
    } catch (error) {
      console.error('Error checking stencil mask:', error);
      return false;
    }
  }, [stencil]);

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
    
    // Create stencil mask canvas
    if (!stencilMaskRef.current) {
      stencilMaskRef.current = document.createElement('canvas');
    }
    const maskCanvas = stencilMaskRef.current;
    maskCanvas.width = width;
    maskCanvas.height = height;
    
    const maskContext = maskCanvas.getContext('2d');
    if (maskContext) {
      stencilMaskContextRef.current = maskContext;
      maskContext.lineCap = 'round';
      maskContext.lineJoin = 'round';
    }
    
    // Draw stencil if provided (drawStencil will handle clearing)
    if (stencil) {
      drawStencil(context, stencil);
    } else {
      // Clear main canvas with white background only if no stencil
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, width, height);
      
      // Clear mask canvas
      if (maskContext) {
        maskContext.clearRect(0, 0, width, height);
      }
    }
  }, [width, height, stencil, drawStencil]);

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

  // Draw a line between two points (with stencil collision detection)
  const drawLine = useCallback((from: DrawingPoint, to: DrawingPoint) => {
    const context = contextRef.current;
    if (!context) return;

    // If we have a stencil, check for collision along the line
    if (stencil) {
      // Sample points along the line to check for stencil collision
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(Math.floor(distance), 1);
      
      // Check multiple points along the line
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = from.x + dx * t;
        const y = from.y + dy * t;
        
        if (isPointOnStencil(x, y)) {
          return; // Don't draw if line intersects stencil
        }
      }
    }

    const state = stateRef.current;
    context.strokeStyle = state.currentColor;
    context.lineWidth = state.currentLineWidth;
    
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }, [stencil, isPointOnStencil]);

  // Redraw entire canvas from paths (restore stencil from saved state)
  const redrawCanvas = useCallback(() => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;


    // Restore the stencil state if we have it saved
    if (stencil && stencilCanvasStateRef.current) {
      context.putImageData(stencilCanvasStateRef.current, 0, 0);
    } else {
      // Clear canvas if no stencil
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Redraw all user paths on top of the restored stencil
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
  }, [onDrawingChange, stencil]);

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
      // Use fill tool - always allowed
      floodFill(point.x, point.y, stateRef.current.currentColor);
    } else {
      // Use brush tool - check stencil collision
      if (stencil && isPointOnStencil(point.x, point.y)) {
        return; // Don't start drawing on stencil
      }
      
      stateRef.current.isDrawing = true;
      stateRef.current.currentPath = [point];
    }
  }, [getPointFromEvent, currentTool, floodFill, stencil, isPointOnStencil]);

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

  // Clear the entire canvas (but preserve stencil)
  const clearCanvas = useCallback(() => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    // Clear all user paths
    stateRef.current.paths = [];
    stateRef.current.currentPath = [];
    
    // Redraw stencil if present (drawStencil will clear and redraw)
    if (stencil) {
      drawStencil(context, stencil);
    } else {
      // If no stencil, just clear canvas with white background
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Notify parent component
    if (onDrawingChange) {
      onDrawingChange(canvas.toDataURL('image/png'));
    }
  }, [onDrawingChange, stencil, drawStencil]);

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