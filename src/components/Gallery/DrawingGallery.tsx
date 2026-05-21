import { useState, useRef } from 'react';
import { useDrawings, SavedDrawing } from '../../hooks/useDrawings';

const MAX_DRAWINGS = 50;
const LONG_PRESS_MS = 500;

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffSecs < 60) return rtf.format(-diffSecs, 'second');
  if (diffMins < 60) return rtf.format(-diffMins, 'minute');
  if (diffHours < 24) return rtf.format(-diffHours, 'hour');
  if (diffDays < 7) return rtf.format(-diffDays, 'day');
  if (diffWeeks < 5) return rtf.format(-diffWeeks, 'week');
  return rtf.format(-diffMonths, 'month');
}

interface Props {
  onNavigateHome: () => void;
  onEditDrawing: (drawing: SavedDrawing) => void;
}

export default function DrawingGallery({ onNavigateHome, onEditDrawing }: Props) {
  const { drawings, remove } = useDrawings();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<SavedDrawing | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = (id: string) => {
    longPressTimerRef.current = setTimeout(() => {
      setDeleteTarget(id);
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const confirmEdit = () => {
    if (editTarget) {
      onEditDrawing(editTarget);
      setEditTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-100 via-primary-50 to-secondary-50 p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <button
          className="kid-button bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 px-4 py-2 text-sm"
          onClick={onNavigateHome}
          aria-label="Go home"
        >
          ← Home
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-600">🖼️ My Gallery</h1>
        <div className="w-16" />
      </header>

      {/* Empty state */}
      {drawings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-8xl mb-4">✏️</div>
          <p className="text-xl font-bold text-gray-600 mb-2">No drawings yet!</p>
          <p className="text-gray-500 mb-6">Start creating your masterpieces!</p>
          <button
            className="kid-button text-lg"
            onClick={onNavigateHome}
          >
            🖌️ Start Drawing!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {drawings.map((drawing) => (
            <div
              key={drawing.id}
              className="kid-card p-2 cursor-pointer select-none"
              role="button"
              aria-label={`Edit drawing: ${drawing.name}`}
              onClick={() => setEditTarget(drawing)}
              onTouchStart={() => handleTouchStart(drawing.id)}
              onTouchEnd={cancelLongPress}
              onTouchCancel={cancelLongPress}
              onMouseLeave={cancelLongPress}
            >
              <img
                src={drawing.thumbnail}
                alt={drawing.name}
                className="w-full aspect-video object-cover rounded-lg mb-2 bg-white"
                draggable={false}
              />
              <p className="font-semibold text-sm text-gray-800 truncate">{drawing.name}</p>
              <p className="text-xs text-gray-500">{formatRelativeTime(drawing.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer pill */}
      <div className="mt-8 flex justify-center">
        <span className="inline-block bg-white/70 border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 font-medium">
          {drawings.length === 0
            ? `0/${MAX_DRAWINGS} — start drawing!`
            : `${drawings.length}/${MAX_DRAWINGS} drawings saved`}
        </span>
      </div>

      {/* Edit confirm dialog */}
      {editTarget && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setEditTarget(null)}
        >
          <div
            className="kid-card max-w-sm w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-3">✏️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Edit this drawing?</h2>
            <p className="text-gray-600 mb-3 text-sm">{editTarget.name}</p>
            <img
              src={editTarget.thumbnail}
              alt={editTarget.name}
              className="w-full rounded-lg mb-4 bg-white"
            />
            <div className="flex gap-3 justify-center">
              <button
                className="kid-button bg-gray-400 hover:bg-gray-500 active:bg-gray-600"
                onClick={() => setEditTarget(null)}
              >
                Cancel
              </button>
              <button
                className="kid-button"
                onClick={confirmEdit}
              >
                ✏️ Edit!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          role="dialog"
          aria-label="delete-confirm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="kid-card max-w-sm w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-3">🗑️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete this drawing?</h2>
            <p className="text-gray-500 mb-4 text-sm">This cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                className="kid-button bg-gray-400 hover:bg-gray-500 active:bg-gray-600"
                onClick={() => setDeleteTarget(null)}
              >
                Keep It
              </button>
              <button
                className="kid-button bg-red-500 hover:bg-red-600 active:bg-red-700"
                onClick={confirmDelete}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
