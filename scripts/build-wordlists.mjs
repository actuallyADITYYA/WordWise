// Builds the "is this a real word?" dictionaries used to validate guesses.
// Run with: npm run wordlists   (output is already committed, so this is optional)
import fs from 'node:fs';
import wordListPath from 'word-list';

const all = fs.readFileSync(wordListPath, 'utf8').split('\n');
for (const n of [5, 6, 7, 8]) {
  const list = all.filter((w) => w.length === n && /^[a-z]+$/.test(w));
  fs.writeFileSync(new URL(`../src/data/words-${n}.txt`, import.meta.url), list.join('\n'));
  console.log(`${n} letters: ${list.length} words`);
}
