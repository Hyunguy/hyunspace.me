import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
// Static hosts can serve the same app shell for /about and /projects refreshes.
await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url));
for (const section of ['', 'about', 'projects', 'contact', 'skills', 'systems']) {
  const directory = new URL(`../dist/lemony-fresh-showcase/${section ? `${section}/` : ''}`, import.meta.url);
  await mkdir(directory, { recursive: true });
  await copyFile(new URL('../dist/index.html', import.meta.url), new URL('index.html', directory));
}

const jamHtml = (await readFile(new URL('../dist/index.html', import.meta.url), 'utf8'))
  .replace(/<title>.*?<[/]title>/, '<title>hyun — game jam teammates wanted</title>')
  .replace(/Kevin Hyun — Programmer &amp; Artist/g, 'hyun — let’s make a game together')
  .replace(/Games, graphics, and engineering[^"]+/g, 'Looking for game jam teammates. Unity, C#, graphics, and playable projects. Team up on Discord.')
  .replace(/Personal Three[^"]+/g, 'Game jam projects and collaboration. Join hyun’s team and make something playable.');
for (const section of ['', 'about', 'projects', 'contact', 'skills', 'systems']) {
  const dir = new URL('../dist/jam/' + (section ? section + '/' : ''), import.meta.url);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), jamHtml);
}
