// Dictionaries are split per word length and loaded on demand,
// so players only download the list for the length they pick.
const loaders = {
  5: () => import('../data/words-5.txt?raw'),
  6: () => import('../data/words-6.txt?raw'),
  7: () => import('../data/words-7.txt?raw'),
  8: () => import('../data/words-8.txt?raw'),
};
const cache = {};

export async function loadDictionary(length) {
  if (!cache[length]) {
    const mod = await loaders[length]();
    cache[length] = new Set(mod.default.split('\n'));
  }
  return cache[length];
}
