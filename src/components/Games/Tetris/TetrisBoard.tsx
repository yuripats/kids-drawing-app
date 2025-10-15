import React, { useEffect, useMemo } from 'react';
import { useTetrisGame } from '../../../hooks/useTetrisGame';
import type { TetrisConfig, Cell } from './types';

interface Props {
  config: TetrisConfig;
}

const typeColor: Record<string, string> = {
  I: 'bg-cyan-400',
  O: 'bg-yellow-400',
  T: 'bg-purple-400',
  S: 'bg-green-400',
  Z: 'bg-red-400',
  J: 'bg-blue-400',
  L: 'bg-orange-400',
};

function CellView({ cell }: { cell: Cell }) {
  if (!cell) return <div className="border border-white/20 bg-white/5" style={{ aspectRatio: '1 / 1' }} />;
  const color = typeColor[cell.type] ?? 'bg-gray-400';
  const glow = cell.locked ? 'shadow-inner' : 'shadow-lg';
  return (
    <div
      className={`${color} ${glow} rounded-sm border border-black/10`}
      style={{ aspectRatio: '1 / 1' }}
    />
  );
}

export default function TetrisBoard({ config }: Props) {
  const { state, board, controls } = useTetrisGame(config);

  const width = useMemo(() => board[0]?.length ?? config.width, [board, config.width]);

  useEffect(() => {
    const isTextInput = (el: Element | null): boolean => {
      if (!el) return false;
      const tag = (el as HTMLElement).tagName;
      const editable = (el as HTMLElement).getAttribute?.('contenteditable');
      return tag === 'INPUT' || tag === 'TEXTAREA' || editable === 'true';
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTextInput(document.activeElement)) return;
      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          controls.moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          controls.moveRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          controls.softDrop();
          break;
        case 'Space':
          e.preventDefault();
          controls.rotate();
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [controls]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm">
          <div>Score: <span className="font-bold">{state.score}</span></div>
          <div>Level: <span className="font-bold">{state.level}</span></div>
          <div>Lines: <span className="font-bold">{state.lines}</span></div>
        </div>
        <div className="flex gap-2">
          <button className="kid-button px-3 py-1" onClick={() => controls.pause()}>Pause</button>
          <button className="kid-button px-3 py-1" onClick={() => controls.resume()}>Resume</button>
          <button className="kid-button px-3 py-1" onClick={() => controls.reset()}>Reset</button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-2 border-4 border-slate-700">
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, rIdx) => (
            <React.Fragment key={rIdx}>
              {row.map((c, cIdx) => (
                <CellView key={`${rIdx}-${cIdx}`} cell={c} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {state.gameOver && (
        <div className="mt-3 text-center text-red-600 font-bold">Game Over</div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3 select-none">
        <button className="kid-button text-xl py-3" onClick={controls.moveLeft}>◀️</button>
        <button className="kid-button text-xl py-3" onClick={controls.rotate}>🔄</button>
        <button className="kid-button text-xl py-3" onClick={controls.moveRight}>▶️</button>
        <div className="col-span-3">
          <button className="kid-button w-full text-xl py-3" onClick={controls.softDrop}>⬇️</button>
        </div>
      </div>

      <div className="mt-4 text-xs text-center text-gray-500">
        Tip: Use buttons for touch. Width/Height configurable in Tetris page.
      </div>
    </div>
  );
}