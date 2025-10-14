# Sudoku Feature Plan (MVP to Phase 3)

Status: In progress
Last updated: 2025-10-14

Goals
- Add a playable 9×9 Sudoku game with standard rules, frontend-only state, and localStorage persistence.
- Mobile-first UI with large touch targets and basic accessibility.
- Link from the main page for easy access.
- Verification after each phase using the Playwright MCP server (browse-first, then tests).

Phases
1) Phase 1 – MVP
- Add route/page: /games/sudoku (in-app nav in App.tsx) with lazy-loaded components where applicable.
- Components: SudokuPage, SudokuBoard, SudokuCell, SudokuKeypad, SudokuHeader.
- State: useSudokuGame hook (board, selection, mode, undo/redo, timer, persistence).
- Engine: validation and completion check, curated puzzles (JSON inline for now).
- Accessibility: ARIA-friendly buttons, focus outlines.
- Add a button on the Home page to navigate to Sudoku.
- Tests: unit tests for validation and smoke test for SudokuPage render (queued).
- Verification: run app, navigate to Sudoku, interact; then run MCP browse check.

2) Phase 2 – Web Worker + Hints
- Move heavy validation/solver (if added) to a Web Worker to keep UI responsive.
- Add simple hints (single-cell safe hint).
- Add stats (wins, best times) persisted locally.
- Expand curated puzzles into assets and precache later.
- Verification: MCP browse interactions + Playwright tests.

3) Phase 3 – Polish
- Theming and animations, improved announcements.
- PWA cache integration for puzzles and active save.
- Verification: MCP and Lighthouse mobile checks.

MCP Server Setup and Verification
We use the official Microsoft Playwright MCP server: https://github.com/microsoft/playwright-mcp

A) Install Playwright and browsers
- npm i -D playwright @playwright/test
- npx playwright install --with-deps

B) Configure MCP server (standard config from the repo)
- Command uses npx with the package @playwright/mcp:
- mcp.config.json example at repo root:
```
{
  "servers": [
    {
      "name": "playwright",
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headless=false"],
      "env": {
        "PLAYWRIGHT_BASE_URL": "http://localhost:5173"
      }
    }
  ]
}
```
- Warp (recommended): Settings -> AI -> Manage MCP Servers -> + Add
  - Name: playwright
  - Command: npx
  - Args: ["@playwright/mcp@latest", "--headless=false"]
  - Env: PLAYWRIGHT_BASE_URL=http://localhost:5173

Common flags supported (per repo):
- --headless (default headed is false in our script)
- --host, --port, --ignore-https-errors
- --grant-permissions <clipboard-read,clipboard-write,geolocation,...>
- --init-script <path>, --isolated, --image-responses <allow|omit>

C) Run and verify (browse-first, then tests)
1. Start dev server: npm run dev
2. Start MCP server in another terminal:
   - npm run mcp:playwright
3. In your MCP client (Warp recommended):
   - Connect to the 'playwright' server, open the base URL
   - Click the "🧩 Sudoku" button on the main page
   - Expect: 9×9 grid + keypad visible
   - Select a cell, press a number -> value set; conflicts highlight if any
   - Try Undo/Redo and Clear; timer ticks
4. Playwright tests:
   - npm run test:e2e

Test plan (initial)
- Unit: sudoku validation (no duplicates), completion detection.
- Component smoke: SudokuPage renders board and keypad.
- E2E: Load home, click Sudoku, ensure board present, set value, clear, undo.

Progress log
- [x] Add Sudoku route and button on Home page
- [x] Scaffold Sudoku components, types, utils, engine, and hook
- [x] Add e2e scaffolding and Playwright config
- [ ] Verify with MCP browse (waiting for MCP server package/command confirmation)
- [ ] Verify with Playwright tests
- [ ] Phase 2 worker/hints
- [ ] Phase 3 polish
