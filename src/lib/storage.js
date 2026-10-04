// Everything lives in localStorage. All access is wrapped so private-mode
// browsers (where storage can throw) still play fine, just without saving.
const P = 'wordwise:v1:';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(P + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(P + key, JSON.stringify(value));
  } catch {
    /* storage unavailable: ignore */
  }
}

export const maxGuessesFor = (length) => (length >= 7 ? 7 : 6);

export const loadSettings = () => ({ length: 5, colorblind: false, ...read('settings', {}) });
export const saveSettings = (s) => write('settings', s);

export function loadGame(length) {
  const g = read(`game:${length}`, null);
  const valid =
    g &&
    typeof g.answer === 'string' &&
    g.answer.length === length &&
    Array.isArray(g.guesses) &&
    g.hints;
  return valid ? g : null;
}
export const saveGame = (game) => write(`game:${game.length}`, game);

export const loadPlayed = (length) => read(`played:${length}`, []);
export const savePlayed = (length, list) => write(`played:${length}`, list);

const emptyStats = (length) => ({
  played: 0,
  wins: 0,
  streak: 0,
  maxStreak: 0,
  dist: Array(maxGuessesFor(length)).fill(0),
  last: null, // number of guesses in the most recent win, or 0 for a loss
});

export function loadStats(length) {
  return { ...emptyStats(length), ...read(`stats:${length}`, {}) };
}

export function recordResult(length, won, guessCount) {
  const s = loadStats(length);
  s.played += 1;
  if (won) {
    s.wins += 1;
    s.streak += 1;
    s.maxStreak = Math.max(s.maxStreak, s.streak);
    s.dist[guessCount - 1] = (s.dist[guessCount - 1] || 0) + 1;
    s.last = guessCount;
  } else {
    s.streak = 0;
    s.last = 0;
  }
  write(`stats:${length}`, s);
  return s;
}
