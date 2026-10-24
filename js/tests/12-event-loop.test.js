import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './_load.js';
import { snippets } from '../tasks/12-event-loop.js';

const { answers } = await load('12-event-loop');

async function run(snippet) {
  const out = [];
  snippet((value) => out.push(value));
  await new Promise((resolve) => setTimeout(resolve, 50));
  return out;
}

for (const name of Object.keys(snippets)) {
  test(name, async () => {
    assert.ok(answers[name]?.length, `No answer for "${name}" yet`);
    assert.deepEqual(answers[name], await run(snippets[name]));
  });
}
