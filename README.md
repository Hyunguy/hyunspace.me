# HYUNSPACE

Kevin Hyun’s React / Three.js portfolio, with lighting-driven halftone shading, About GIFs, and 17 horizontally scrolling project stories.

## Development

Use Node 24 or later. Run `npm ci`, then `npm run dev`. For another port, use `npm run dev -- --port 5189`.

Run `npm test` for catalog and asset checks, `npm run build` to build, and `npm run preview` to inspect the production output. Tailwind is compiled at build time.

**Deploy `dist/`, not the source checkout.** The output includes the CNAME and a `404.html` app shell for static-host route refreshes. Hosts with SPA rewrites should rewrite frontend routes to `index.html`. GitHub Actions tests, builds, and deploys this output to Pages on pushes to `main`; other branches only run the checks. Pages uses the GitHub Actions publishing source.

## Content

Edit `src/data/projects.ts` for project roles, summaries, chapters, tags, images, and source links. Add artwork under `public/projects/`. Missing artwork gets a typographic cover; failed image requests also fall back to it. See `docs/project-sources.md` for provenance.

Click a card to open its story. Use horizontal scrolling, swipes, the mouse wheel, arrow keys, or next/previous buttons. Escape closes the story and restores focus to the card. Filters and collection scroll position remain intact.

`ShapeHalftone.ts` extends the existing lit material without replacing Three.js uniforms. Dots use a 4 CSS-pixel grid and change with lighting. Depth fog is preserved and idle white emission is removed. About media lives in `public/media/`.

The live GitHub index uses the public API, with the curated catalog available offline. Contact retains the existing email, social, and Discord links. The original Fuser worker and resources are retained but are not deployed by Vite. Legacy site scripts and `assets/` remain for reference. `pixelhavokk-site/` is excluded from the build and is never presented as Kevin’s work.
