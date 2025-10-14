export default function SudokuKeypad({
  mode,
  canUndo,
  canRedo,
  onSetValue,
  onClear,
  onToggleNoteMode,
  onToggleNote,
  onUndo,
  onRedo,
}: {
  mode: 'value' | 'note';
  canUndo: boolean;
  canRedo: boolean;
  onSetValue: (n: number) => void;
  onClear: () => void;
  onToggleNoteMode: () => void;
  onToggleNote: (n: number) => void;
  onUndo: () => void;
  onRedo: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="grid grid-cols-5 gap-2">
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <button key={n} className="kid-button w-12" onClick={() => mode === 'value' ? onSetValue(n) : onToggleNote(n)}>
            {n}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button className={`kid-button ${mode === 'note' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`} onClick={onToggleNoteMode}>
          ✏️ Notes {mode === 'note' ? 'ON' : 'OFF'}
        </button>
        <button className="kid-button bg-red-500 hover:bg-red-600" onClick={onClear}>🧽 Clear</button>
        <button className="kid-button" onClick={onUndo} disabled={!canUndo}>↩️ Undo</button>
        <button className="kid-button" onClick={onRedo} disabled={!canRedo}>↪️ Redo</button>
      </div>
    </div>
  );
}