import { copyFile } from 'node:fs/promises';
// Static hosts can serve the same app shell for /about and /projects refreshes.
await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url));
