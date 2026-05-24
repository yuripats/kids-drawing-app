import { useState, useRef, useCallback } from 'react';
import * as storage from '../utils/storage';

export interface SavedDrawing {
  id: string;
  name: string;
  dataURL: string;
  createdAt: string;
  thumbnail: string;
}

const STORAGE_KEY = 'drawings:v1';
const MAX_DRAWINGS = 50;
const EVICT_TO = 30;

function isQuotaError(e: unknown): boolean {
  return e instanceof DOMException && e.name === 'QuotaExceededError';
}

/**
 * Generate a 200×150 JPEG thumbnail from a drawing dataURL.
 * Synchronous: relies on the fact that data URLs are decoded immediately in
 * real browsers. Falls back to the original dataURL in jsdom / headless env.
 */
function makeThumbnail(dataURL: string): string {
  try {
    const img = new Image();
    img.src = dataURL;
    if (!img.complete) return dataURL;
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataURL;
    ctx.drawImage(img, 0, 0, 200, 150);
    return canvas.toDataURL('image/jpeg', 0.7);
  } catch {
    return dataURL;
  }
}

/**
 * Re-encode a dataURL as JPEG@0.7 to reduce its size before a quota-retry.
 */
function recompressAsJpeg(dataURL: string): string {
  try {
    const img = new Image();
    img.src = dataURL;
    if (!img.complete) return dataURL;
    const canvas = document.createElement('canvas');
    canvas.width = img.width || 800;
    canvas.height = img.height || 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataURL;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.7);
  } catch {
    return dataURL;
  }
}

/**
 * Sort a drawings array oldest-first and keep only the last `keep` entries.
 */
function evictOldest(list: SavedDrawing[], keep: number): SavedDrawing[] {
  if (list.length <= keep) return list;
  return [...list]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(-keep);
}

export function useDrawings() {
  const [drawings, setDrawings] = useState<SavedDrawing[]>(() =>
    storage.get<SavedDrawing[]>(STORAGE_KEY, [])
  );

  // Ref mirrors state so save() can read the current list synchronously
  // without stale-closure issues.
  const drawingsRef = useRef<SavedDrawing[]>(drawings);

  const save = useCallback((dataURL: string, name?: string): SavedDrawing => {
    const thumbnail = makeThumbnail(dataURL);
    const newDrawing: SavedDrawing = {
      id: `drawing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name ?? `Drawing ${new Date().toLocaleDateString()}`,
      dataURL,
      createdAt: new Date().toISOString(),
      thumbnail,
    };

    let next = evictOldest([...drawingsRef.current, newDrawing], MAX_DRAWINGS);

    try {
      storage.set(STORAGE_KEY, next);
    } catch (err) {
      if (!isQuotaError(err)) throw err;

      // Quota exceeded: re-encode as JPEG and evict aggressively, then retry.
      const compressed = { ...newDrawing, dataURL: recompressAsJpeg(dataURL) };
      next = evictOldest(
        [...drawingsRef.current, compressed],
        EVICT_TO
      );
      try {
        storage.set(STORAGE_KEY, next);
      } catch {
        // Still failing after retry — propagate so caller can show "Memory full".
        throw err;
      }
    }

    drawingsRef.current = next;
    setDrawings(next);
    return newDrawing;
  }, []);

  const remove = useCallback((id: string) => {
    const next = drawingsRef.current.filter(d => d.id !== id);
    drawingsRef.current = next;
    setDrawings(next);
    storage.set(STORAGE_KEY, next);
  }, []);

  const clear = useCallback(() => {
    drawingsRef.current = [];
    setDrawings([]);
    storage.remove(STORAGE_KEY);
  }, []);

  return { drawings, save, remove, clear };
}
