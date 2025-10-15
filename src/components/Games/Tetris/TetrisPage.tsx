import { useState } from 'react';
import TetrisBoard from './TetrisBoard';

interface Props {
  onNavigateHome: () => void;
}

export default function TetrisPage({ onNavigateHome }: Props) {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(20);
  const [appliedWidth, setAppliedWidth] = useState(10);
  const [appliedHeight, setAppliedHeight] = useState(20);

  const changed = appliedWidth !== width || appliedHeight !== height;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tetris</h1>
        <button className="kid-button" onClick={onNavigateHome}>← Home</button>
      </div>

      <div className="kid-card mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Width</label>
<input
            className="kid-input w-16 text-center"
            type="number"
            value={width}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setWidth(Number.isFinite(val) && val > 0 ? val : 10);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Height</label>
<input
            className="kid-input w-16 text-center"
            type="number"
            value={height}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setHeight(Number.isFinite(val) && val > 0 ? val : 20);
            }}
          />
        </div>
        <button
          className={`kid-button ${changed ? '' : 'opacity-50 cursor-not-allowed'}`}
          disabled={!changed}
          onClick={() => {
            setAppliedWidth(width);
            setAppliedHeight(height);
          }}
        >
          Apply Size
        </button>
      </div>

      <TetrisBoard key={`${appliedWidth}x${appliedHeight}`} config={{ width: appliedWidth, height: appliedHeight, tickMs: 800 }} />
    </div>
  );
}
