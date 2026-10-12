import { copyFile, mkdir } from 'node:fs/promises';
// Static hosts can serve the same app shell for /about and /projects refreshes.
await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url));
for (const section of ['', 'about', 'projects', 'contact', 'skills', 'systems']) {
  const directory = new URL(`../dist/lemony-fresh-showcase/${section ? `${section}/` : ''}`, import.meta.url);
  await mkdir(directory, { recursive: true });
  await copyFile(new URL('../dist/index.html', import.meta.url), new URL('index.html', directory));
}
