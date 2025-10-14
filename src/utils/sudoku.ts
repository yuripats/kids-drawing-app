import { Cell } from '../types/sudoku';

export function createEmptyBoard(): Cell[] {
  return Array.from({ length: 81 }, () => ({ value: null, given: false, notes: new Set<number>(), conflict: { row: false, col: false, box: false } }));
}

export function fromPuzzleString(puzzle: string): Cell[] {
  if (puzzle.length !== 81) throw new Error('Invalid puzzle length');
  return puzzle.split('').map((ch) => {
    const v = parseInt(ch, 10);
    if (Number.isNaN(v) || v === 0) return { value: null, given: false, notes: new Set<number>(), conflict: { row: false, col: false, box: false } };
    return { value: v, given: true, notes: new Set<number>(), conflict: { row: false, col: false, box: false } };
  });
}

export function peersOf(index: number): number[] {
  const r = Math.floor(index / 9);
  const c = index % 9;
  const peers = new Set<number>();
  // row
  for (let i = 0; i < 9; i++) peers.add(r * 9 + i);
  // col
  for (let i = 0; i < 9; i++) peers.add(i * 9 + c);
  // box
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let rr = br; rr < br + 3; rr++) {
    for (let cc = bc; cc < bc + 3; cc++) {
      peers.add(rr * 9 + cc);
    }
  }
  peers.delete(index);
  return Array.from(peers);
}

export function validateConflicts(board: Cell[]): Cell[] {
  const next = board.map((c) => ({ ...c, conflict: { row: false, col: false, box: false } }));
  for (let idx = 0; idx < 81; idx++) {
    const cell = next[idx];
    if (!cell.value) continue;
    const p = peersOf(idx);
    for (const peerIdx of p) {
      const peer = next[peerIdx];
      if (peer.value === cell.value) {
        const r = Math.floor(idx / 9);
        const c = idx % 9;
        const pr = Math.floor(peerIdx / 9);
        const pc = peerIdx % 9;
        if (r === pr) { cell.conflict.row = true; peer.conflict.row = true; }
        if (c === pc) { cell.conflict.col = true; peer.conflict.col = true; }
        if (Math.floor(r / 3) === Math.floor(pr / 3) && Math.floor(c / 3) === Math.floor(pc / 3)) {
          cell.conflict.box = true; peer.conflict.box = true;
        }
      }
    }
  }
  return next;
}