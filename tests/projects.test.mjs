import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { projects } from '../src/data/projects.ts';

test('every authored project can open a nonempty story with a unique stable ID', () => {
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length);
  for (const project of projects) {
    assert.match(project.id, /^[a-z0-9-]+$/);
    assert.ok(project.title && project.summary && project.role);
    assert.ok(['Games', 'Engineering', 'Software'].includes(project.category));
    assert.ok(project.chapters.length > 0);
    assert.ok(project.chapters.every(chapter => chapter.title && chapter.body));
    if (project.link) assert.match(project.link, /^https:\/\/github\.com\//);
  }
});

test('all linked project and About media exist in the production public directory', async () => {
  for (const project of projects.filter(project => project.cover)) {
    assert.ok(project.coverAlt);
    assert.match(project.cover, /^\/projects\/[^/]+$/);
    await access(new URL(`../public${project.cover}`, import.meta.url));
  }
  for (const name of ['va11-heads.gif', 'va11-city.gif', 'takopi.gif']) {
    const media = await readFile(new URL(`../public/media/${name}`, import.meta.url));
    assert.equal(media.subarray(0, 6).toString(), 'GIF89a');
    assert.ok(media.includes(Buffer.from('NETSCAPE2.0')), 'GIF must include animation loop metadata');
  }
  await access(new URL('../public/media/colorstack-eboard.jpg', import.meta.url));
});

test('known mismatched artwork is not reassigned to a game', () => {
  assert.equal(projects.find(project => project.id === 'smart-planter').cover, '/projects/111.png');
  assert.equal(projects.find(project => project.id === 'lemony-fresh').cover, undefined);
  assert.equal(projects.find(project => project.id === 'takedown-protocol').cover, '/projects/arcadiaprotocol.png');
  assert.ok(projects.every(project => !project.cover?.includes('pixelhavokk')));
});
