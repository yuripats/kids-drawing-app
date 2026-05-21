import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DrawingGallery from './DrawingGallery';
import { useDrawings } from '../../hooks/useDrawings';

vi.mock('../../hooks/useDrawings', () => ({
  useDrawings: vi.fn(),
}));

const mockDrawings = [
  {
    id: 'drawing-1',
    name: 'My Cat',
    dataURL: 'data:image/png;base64,abc',
    thumbnail: 'data:image/jpeg;base64,thumb1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'drawing-2',
    name: 'A Dog',
    dataURL: 'data:image/png;base64,def',
    thumbnail: 'data:image/jpeg;base64,thumb2',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

describe('DrawingGallery', () => {
  const onNavigateHome = vi.fn();
  const onEditDrawing = vi.fn();
  const removeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders empty state when no drawings', () => {
    vi.mocked(useDrawings).mockReturnValue({
      drawings: [],
      save: vi.fn(),
      remove: removeMock,
      clear: vi.fn(),
    });

    render(
      <DrawingGallery onNavigateHome={onNavigateHome} onEditDrawing={onEditDrawing} />
    );

    expect(screen.getByText(/No drawings yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Start creating/i)).toBeInTheDocument();
    expect(screen.getByText(/0\/50 — start drawing!/i)).toBeInTheDocument();
  });

  test('renders correct number of thumbnails for non-empty state', () => {
    vi.mocked(useDrawings).mockReturnValue({
      drawings: mockDrawings,
      save: vi.fn(),
      remove: removeMock,
      clear: vi.fn(),
    });

    render(
      <DrawingGallery onNavigateHome={onNavigateHome} onEditDrawing={onEditDrawing} />
    );

    expect(screen.getByText('My Cat')).toBeInTheDocument();
    expect(screen.getByText('A Dog')).toBeInTheDocument();
    // Footer pill shows correct count
    expect(screen.getByText(/2\/50 drawings saved/i)).toBeInTheDocument();
  });

  test('long-press on a tile shows delete confirm dialog after 500ms', () => {
    vi.useFakeTimers();
    vi.mocked(useDrawings).mockReturnValue({
      drawings: mockDrawings,
      save: vi.fn(),
      remove: removeMock,
      clear: vi.fn(),
    });

    render(
      <DrawingGallery onNavigateHome={onNavigateHome} onEditDrawing={onEditDrawing} />
    );

    const tile = screen.getByRole('button', { name: /Edit drawing: My Cat/i });

    // Simulate touchstart to start the long-press timer
    fireEvent.touchStart(tile);

    // Dialog should NOT appear yet (< 500ms)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Advance fake timers to trigger the long-press callback
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByRole('dialog', { name: /delete-confirm/i })).toBeInTheDocument();
    expect(screen.getByText(/Delete this drawing/i)).toBeInTheDocument();

    vi.useRealTimers();
  });
});
