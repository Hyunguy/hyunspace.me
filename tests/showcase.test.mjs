import test from 'node:test';
import assert from 'node:assert/strict';
import { isShowcasePath, sectionPath, sectionFromPath, showcaseProjects } from '../src/showcase.ts';
import { projects } from '../src/data/projects.ts';

test('showcase navigation keeps its prefix, including refreshes and return home', () => {
  for (const section of ['home', 'about', 'projects', 'contact']) {
    const path = sectionPath(section, true);
    assert.ok(isShowcasePath(path));
    assert.equal(sectionFromPath(path) || 'home', section);
    assert.equal(sectionFromPath(sectionPath(section, false)) || 'home', section);
  }
  assert.equal(isShowcasePath('/lemony-fresh-showcase-other'), false);
});
test('showcase omits only Lemony Fresh without changing the main catalog', () => {
  assert.ok(projects.some(project => project.id === 'lemony-fresh'));
  const filtered = showcaseProjects(projects, true);
  assert.equal(filtered.length, projects.length - 1);
  assert.ok(filtered.every(project => project.id !== 'lemony-fresh'));
  assert.equal(showcaseProjects(projects, false), projects);
});
