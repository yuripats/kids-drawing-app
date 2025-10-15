# Tetris MVP Plan

Goal: Ship a mobile-friendly, UI-only Tetris embedded in the existing React + TS app. Configurable width/height, simple rotation (no wall-kicks), gravity, line clears, scoring, levels.

## Scope (Phase 1)
- Board W×H configurable (defaults 10×20)
- 7 tetrominoes with simple rotation
- Gravity tick, left/right/rotate/soft drop
- Lock piece on collision, clear full rows
- Scoring: 40/100/300/1200 × level for 1–4 lines
- Level increases every 10 lines; speed increases accordingly
- Mobile controls: large on-screen buttons

## Files
- src/hooks/useTetrisGame.ts — core game state + loop
- src/components/Games/Tetris/types.ts — shared types
- src/components/Games/Tetris/TetrisBoard.tsx — renderer + controls
- src/components/Games/Tetris/TetrisPage.tsx — page wrapper + W/H inputs
- src/App.tsx, src/components/HomePage.tsx — navigation

## Future (Phase 2+)
- SRS rotations with wall-kicks
- Soft/hard drop with lock delay
- Ghost piece, next queue, hold piece UI
- Sound effects and animations
- E2E tests for interactions (Playwright)

## Verification (MCP)
- Run: `npm run dev` then `npm run mcp:playwright`
- Navigate Home → Tetris
- Validate gravity, movement, rotation, line clears, scoring and level speedup
- Change width/height and confirm grid reinitializes correctly
