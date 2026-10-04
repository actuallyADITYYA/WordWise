import { ALPHABET } from './constants.js';

export const MAX_REVEALS = 2;
export const MAX_CROSSOUTS = 2;
export const CROSSOUT_SIZE = 3;

// Picks a position the player hasn't already pinned down and shows its letter.
export function pickReveal(game) {
  const known = new Set(game.hints.revealed.map((r) => r.index));
  for (const g of game.guesses) {
    for (let i = 0; i < g.length; i++) if (g[i] === game.answer[i]) known.add(i);
  }
  const options = [];
  for (let i = 0; i < game.answer.length; i++) if (!known.has(i)) options.push(i);
  if (!options.length) return null;
  const index = options[Math.floor(Math.random() * options.length)];
  return { index, letter: game.answer[index] };
}

// Picks up to three letters that are definitely NOT in the word.
export function pickCrossouts(game) {
  const guessed = new Set(game.guesses.join('').split(''));
  const gone = new Set(game.hints.eliminated);
  const options = ALPHABET.filter(
    (l) => !game.answer.includes(l) && !guessed.has(l) && !gone.has(l),
  );
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options.slice(0, CROSSOUT_SIZE);
}

export const crossoutUses = (game) => game.hints.crossouts || 0;

export function hintCount(game) {
  return (game.hints.clue ? 1 : 0) + game.hints.revealed.length + crossoutUses(game);
}
