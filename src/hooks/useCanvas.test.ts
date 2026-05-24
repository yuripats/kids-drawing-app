/**
 * useCanvas – undo/redo history tests
 *
 * The canvas API is mocked at the prototype level so the hook's snapshot
 * capture (`toDataURL`) returns distinct, counter-based values and
 * `applySnapshot`'s Image load fires synchronously.
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { useCanvas } from './useCanvas';
import type { Stencil } from '../types/Stencil';

// ── Canvas context mock ─────────────────────────────────────────────────────

const ctxMock = {
  fillRect: vi.fn(),
  fillStyle: '#fff',
  drawImage: vi.fn(),
  clearRect: vi.fn(),
  scale: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  putImageData: vi.fn(),
  strokeStyle: '',
  lineWidth: 1,
  lineCap: 'round',
  lineJoin: 'round',
  imageSmoothingEnabled: true,
};

// Image that fires onload synchronously when src is assigned (avoids async issues)
class SyncImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 100;
  height = 100;
  set src(_: string) {
    this.onload?.();
  }
}

// ── Wrapper component ───────────────────────────────────────────────────────

type HookHandle = { current: ReturnType<typeof useCanvas> | null };

function CanvasHarness({
  handle,
  stencil = null,
}: {
  handle: HookHandle;
  stencil?: Stencil | null;
}) {
  const hook = useCanvas({ width: 100, height: 100, stencil });
  handle.current = hook;
  return React.createElement('canvas', { ref: hook.canvasRef, 'data-testid': 'test-canvas' });
}

// ── Helpers ─────────────────────────────────────────────────────────────────

let snapCounter = 0;

function makeMockEvent(x = 10, y = 10): React.MouseEvent {
  return {
    preventDefault: vi.fn(),
    clientX: x,
    clientY: y,
  } as unknown as React.MouseEvent;
}

/** Always reads functions from handle.current so we get the latest callback references. */
function simulateStroke(handle: HookHandle) {
  act(() => { handle.current!.startDrawing(makeMockEvent(10, 10)); });
  act(() => { handle.current!.draw(makeMockEvent(20, 20)); });
  act(() => { handle.current!.stopDrawing(makeMockEvent(20, 20)); });
}

// ── Suite ───────────────────────────────────────────────────────────────────

describe('useCanvas undo/redo', () => {
  beforeEach(() => {
    snapCounter = 0;
    vi.stubGlobal('Image', SyncImage);

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      ctxMock as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(
      () => `data:image/jpeg;base64,snap-${++snapCounter}`,
    );
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, right: 100, bottom: 100,
      width: 100, height: 100, x: 0, y: 0,
      toJSON: () => ({}),
    } as DOMRect);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('undo after clear', () => {
    const handle: HookHandle = { current: null };
    render(React.createElement(CanvasHarness, { handle }));

    // Draw a stroke so the canvas has content
    simulateStroke(handle);
    expect(handle.current!.canUndo).toBe(true);

    const drawImageCallsBefore = ctxMock.drawImage.mock.calls.length;

    // Clear the canvas — pre-clear state is pushed to history
    act(() => { handle.current!.clearCanvas(); });

    // Undo the clear — hook must call drawImage to restore the previous frame
    act(() => { handle.current!.undo(); });
    expect(ctxMock.drawImage.mock.calls.length).toBeGreaterThan(drawImageCallsBefore);
  });

  test('undo during stencil overlay', () => {
    const handle: HookHandle = { current: null };
    const { rerender } = render(React.createElement(CanvasHarness, { handle }));

    // No history on initial blank mount
    expect(handle.current!.canUndo).toBe(false);

    // Apply a stencil — the stencil-tracking effect must push pre-stencil state
    const stencil: Stencil = {
      id: 'test-1',
      name: 'Test',
      svgPath: 'M0,0 L10,10',
      viewBox: '0 0 100 100',
      category: 'animals',
      thumbnail: '',
      description: 'test stencil',
    };
    act(() => {
      rerender(React.createElement(CanvasHarness, { handle, stencil }));
    });

    // After applying the stencil, we should be able to undo it
    expect(handle.current!.canUndo).toBe(true);

    const drawImageCallsBefore = ctxMock.drawImage.mock.calls.length;

    // Undo restores the pre-stencil (blank) canvas
    act(() => { handle.current!.undo(); });
    expect(handle.current!.canUndo).toBe(false);
    expect(ctxMock.drawImage.mock.calls.length).toBeGreaterThan(drawImageCallsBefore);
  });

  test('redo after new stroke invalidates forward history', () => {
    const handle: HookHandle = { current: null };
    render(React.createElement(CanvasHarness, { handle }));

    // Stroke + undo creates a redo entry
    simulateStroke(handle);
    act(() => { handle.current!.undo(); });
    expect(handle.current!.canRedo).toBe(true);

    // A new stroke must invalidate all forward history
    simulateStroke(handle);
    expect(handle.current!.canRedo).toBe(false);
  });

  test('history capped at 20', () => {
    const handle: HookHandle = { current: null };
    render(React.createElement(CanvasHarness, { handle }));

    // 21 strokes — history should cap at 20 (oldest frame evicted)
    for (let i = 0; i < 21; i++) {
      simulateStroke(handle);
    }

    // Undo until exhausted
    let undoCount = 0;
    while (handle.current!.canUndo && undoCount < 25) {
      act(() => { handle.current!.undo(); });
      undoCount++;
    }

    // Exactly 20 undos possible — 21st frame was evicted
    expect(undoCount).toBe(20);
    expect(handle.current!.canUndo).toBe(false);
  });
});
