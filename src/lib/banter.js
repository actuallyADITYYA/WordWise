import { evaluate } from './evaluate.js';

let prev;
// Random line, never the same one twice in a row.
const pick = (a) => {
  const b = a.filter((x) => x !== prev);
  return (prev = b[Math.floor(Math.random() * b.length)]);
};

const LINES = {
  strongStart: ['Whoa, strong start!', 'Nice opening!', 'Sharp eyes!', 'Okay, someone came prepared.', 'Look at you, off to a flyer!', 'Great first move!', 'Now we are cooking.', 'Dictionary in your pocket?'],
  zeroFirst: ['Not a single hit. Bold opening!', 'Zero letters. Ouch.', 'Wow. The word and you are strangers.', 'A perfect miss. Almost an art.', 'Bold strategy: avoid every letter.', 'Even random would have hit something.', 'Clean sweep of wrong. Respect.', 'Well, now you know what it is not.'],
  zeroThree: ['Three tries, nothing. Are you doing this on purpose?', 'Still zero? The word is laughing.', 'Impressive, in a way.', 'Three misses. The word is not even nervous.', 'Are you guessing with your eyes closed?', 'At this point it is a talent.', 'The word has left the building.', 'Zero for three. Take a hint, champ.'],
  close: ['So close!', 'One letter away!', 'Almost there!', 'You can taste it!', 'Just one tile left to fix!', 'Do not stop now!', 'The finish line is right there.', 'So near, yet so yellow.'],
  struggling: ['Tough one, huh?', 'Try a hint, no shame.', 'This word is being difficult.', 'Deep breath. You have got this.', 'The hint button is lonely, you know.', 'Plot twist: it is a real word.', 'Maybe think of a totally different word?', 'Brain buffering...'],
};

const WIN = [
  ['Genius!', 'First try?! Are you a wizard?', 'Unreal. Psychic much?'],
  ['Magnificent!', 'Two tries. Show-off.', 'Brilliant!'],
  ['Excellent!', 'Superb!', 'Very nicely done!'],
  ['Excellent!', 'Great job!', 'Smooth work!'],
  ['Great!', 'Nicely done!', 'Solid win!'],
  ['Phew!', 'That was a nail-biter!', 'Close one!'],
  ['Just in time!', 'Last-second hero!', 'Clutch!'],
];

export const winLine = (n) => pick(WIN[Math.min(n - 1, WIN.length - 1)]);

// Reaction after a non-winning guess, or null to stay quiet.
export function banter(guesses, answer) {
  const n = guesses.length;
  const last = evaluate(guesses[n - 1], answer);
  const greens = last.filter((s) => s === 'correct').length;
  const hit = (g) => evaluate(g, answer).some((s) => s !== 'absent');
  const anyHit = guesses.some(hit);

  if (n === 1 && greens >= 2) return pick(LINES.strongStart);
  if (n === 1 && !hit(guesses[0])) return pick(LINES.zeroFirst);
  if (n >= 3 && !anyHit) return pick(LINES.zeroThree);
  if (greens === answer.length - 1) return pick(LINES.close);
  if (n >= 4 && greens === 0) return pick(LINES.struggling);
  return null;
}
