import { ANSWERS } from '../data/answers.js';
import { loadPlayed, savePlayed } from './storage.js';

// Picks a random word the player hasn't seen yet. Once every word has been
// used, the history resets and the cycle starts over.
export function pickAnswer(length) {
  const pool = ANSWERS[length];
  let played = loadPlayed(length);
  let fresh = pool.filter(([w]) => !played.includes(w));
  if (!fresh.length) {
    played = [];
    fresh = pool;
  }
  const [word, clue] = fresh[Math.floor(Math.random() * fresh.length)];
  savePlayed(length, [...played, word]);
  return { word, clue };
}
