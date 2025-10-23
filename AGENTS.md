# Repository Guidelines

## Project Structure & Module Organization
- Pages: `index.html`, `about.html`, `collections.html`, `product.html`.
- Scripts: `script.js` (site), `product-script.js` (product page), `medusa-service.js` (Medusa Store API), `server.js` (simple local server).
- Styles: `style.css`; assets (e.g., `video (1).mp4`) in project root.
- Config: `package.json` (Vite). Optional helpers: `local-server.js`, setup scripts.

## Build, Dev, and Preview
- `npm install` — install dependencies (Node 18+ recommended; 20+ preferred).
- `npm run dev` — Vite dev server (typically http://localhost:5173).
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the build locally.
- `node server.js` — alternative static server on port 3000.

## Coding Style & Naming
- Indentation 2 spaces; UTF-8; keep files small and focused.
- Filenames: kebab-case (`product-detail.html`); JS: camelCase; constants: UPPER_SNAKE.
- CSS: BEM-like classes (`.block__elem--mod`); avoid inline styles.
- JS: keep API calls in `medusa-service.js`; avoid global leaks.
- Formatting/Linting: not configured; if adding, prefer Prettier + ESLint (recommended rules).

## Environment & Secrets
- Use Vite env var for Medusa: `VITE_MEDUSA_BACKEND_URL` (default `http://localhost:9000`).
- Create `.env.local` (gitignored) and reference via `import.meta.env`.
- Do not commit real secrets. `.gitignore` excludes `.env*`.

## Testing Guidelines
- No tests included. For new tests use `vitest` (unit) and `playwright` (E2E).
  - Names: `*.test.js` colocated or under `tests/`.
  - Add `"test": "vitest"` to `package.json` and document run steps in PR.

## Commit, Branch, and PR
- Conventional Commits: e.g., `feat: add product grid`, `fix: handle empty Shopify response`.
- Branch names: `feat/…`, `fix/…`, `chore/…`.
- PR checklist: clear description, linked issue, screenshots/GIFs for UI, test plan (URLs/commands), note env vars touched.

## Architecture Overview
- Static site powered by Medusa Store API.
- Data access isolated in `medusa-service.js`; pages render with JS using fetched data.
